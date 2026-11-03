import { useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  Bath,
  Bed,
  Building2,
  Calendar,
  CheckCircle2,
  Coins,
  FileText,
  Home,
  Info,
  Landmark,
  Layers,
  MapPin,
  Maximize2,
  Percent,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { Link, useParams } from 'react-router';
import {
  calculateAcquisitionFees,
  calculateMonthlyEmi,
  calculatePropertyReturns,
  calculateTotalMonthlyCostOfOwnership,
  checkGoldenVisaEligibility,
  GOLDEN_VISA_DLD_CUBE_PRIMARY_GOVT_FEE_AED,
  GOLDEN_VISA_MINIMUM_PROPERTY_VALUE_AED,
} from '@wealth-advisor/rules';
import { Button } from '../../components/ui/button.tsx';
import { Card } from '../../components/ui/card.tsx';
import { useProperty } from '../../features/investments/store/properties-store.ts';
import { formatMoney } from '../../lib/format-money.ts';

export function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const property = useProperty(id ?? '');
  const [stressTestRateDelta, setStressTestRateDelta] = useState<number>(0); // 0, +1.0%, +2.0%

  if (!property) {
    return (
      <div className="space-y-6">
        <Link
          to="/investments"
          className="inline-flex items-center gap-1.5 text-xs text-subtle hover:text-ink transition"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Investments</span>
        </Link>
        <Card className="p-8 text-center border-dashed border-line">
          <Building2 className="mx-auto size-8 text-subtle opacity-50 mb-2" />
          <h2 className="font-display text-base font-semibold text-ink">Property Not Found</h2>
          <p className="text-xs text-subtle mt-1">
            The property reference could not be located in your portfolio.
          </p>
          <Link to="/investments" className="mt-4 inline-block">
            <Button variant="outline" className="h-9 px-3 text-xs">
              Return to Portfolio
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const isMortgage = property.financingType === 'mortgage';
  const effectiveInterestRate = (property.mortgageInterestRatePct ?? 4.5) + stressTestRateDelta;
  const loanPrincipal = isMortgage
    ? (property.mortgageLoanAmountAed ?? (property.isOffPlan ? Math.round(property.priceAed * 0.5) : Math.round(property.priceAed * 0.8)))
    : 0;
  const downPayment = isMortgage
    ? (property.downPaymentAed ?? (property.priceAed - loanPrincipal))
    : property.priceAed;

  const fees = calculateAcquisitionFees({
    purchasePriceAed: property.priceAed,
    isMortgage,
    loanAmountAed: loanPrincipal,
    downPaymentAed: downPayment,
    isOffPlan: property.isOffPlan,
    isDirectDeveloperPurchase: property.isDirectDeveloperPurchase ?? property.isOffPlan,
  });

  const monthlyEmi = isMortgage
    ? calculateMonthlyEmi({
        principalAed: loanPrincipal,
        annualInterestRatePct: effectiveInterestRate,
        tenureYears: property.mortgageTenureYears ?? 25,
      })
    : 0;

  const annualServiceCharge = (property.annualServiceChargePerSqft ?? 15) * property.sqft;
  const rent = property.expectedAnnualRentAed ?? 0;

  const returns = calculatePropertyReturns({
    purchasePriceAed: property.priceAed,
    expectedAnnualRentAed: rent,
    annualServiceChargeAed: annualServiceCharge,
    totalAcquisitionCostAed: property.priceAed + fees.totalAcquisitionFeesAed,
    actualCashInvestedAed: fees.totalCashRequiredForPurchaseAed,
    annualMortgageEmiAed: monthlyEmi * 12,
  });

  const homeOwnership = calculateTotalMonthlyCostOfOwnership({
    monthlyMortgageEmiAed: monthlyEmi,
    annualServiceChargeAed: annualServiceCharge,
  });

  const gv = checkGoldenVisaEligibility(property.priceAed);
  const pricePerSqft = Math.round(property.priceAed / property.sqft);
  const ltvPct = isMortgage ? Math.round((loanPrincipal / property.priceAed) * 100) : 0;

  return (
    <div className="space-y-6 pb-14 animate-in fade-in">
      {/* Navigation and Title Header */}
      <div className="flex flex-col gap-3">
        <Link
          to="/investments"
          className="inline-flex items-center gap-1.5 text-xs text-subtle hover:text-ink transition self-start"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Investments</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b border-line pb-5">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-brand-600/15 px-2.5 py-0.5 text-xs font-semibold text-brand-600">
                {property.developer}
              </span>
              <span className="rounded-full bg-surface-subtle px-2.5 py-0.5 text-xs text-subtle border border-line capitalize">
                {property.status === 'owned' ? 'Current Portfolio' : 'Planned Acquisition'}
              </span>
              <span className="rounded-full bg-surface-subtle px-2.5 py-0.5 text-xs text-subtle border border-line uppercase">
                {property.propertyType}
              </span>
              {property.isOffPlan && (
                <span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400 border border-amber-500/20">
                  Off-Plan ({property.completionYear ?? 'Under Construction'})
                </span>
              )}
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink">
              {property.title}
            </h1>
            <div className="flex items-center gap-1.5 text-xs text-subtle">
              <MapPin className="size-3.5 shrink-0" />
              <span>{property.location}</span>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="block font-display text-2xl sm:text-3xl font-bold text-ink">
              {formatMoney(property.priceAed, 'AED')}
            </span>
            <span className="block text-xs text-subtle mt-0.5">
              AED {pricePerSqft.toLocaleString()} / sqft
            </span>
          </div>
        </div>
      </div>

      {/* Hero Media Banner & Unit Quick Specs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 overflow-hidden rounded-card border border-line bg-surface-subtle h-64 sm:h-80 relative">
          {property.imageUrl ? (
            <img
              src={property.imageUrl}
              alt={property.title}
              className="size-full object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center">
              <Building2 className="size-12 text-subtle opacity-40" />
            </div>
          )}
          <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-black/70 backdrop-blur-xs px-3 py-1 text-xs text-white">
              <Bed className="size-3.5" />
              {property.bedrooms === 0 ? 'Studio' : `${property.bedrooms} Beds`}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-black/70 backdrop-blur-xs px-3 py-1 text-xs text-white">
              <Bath className="size-3.5" />
              {property.bathrooms} Baths
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-black/70 backdrop-blur-xs px-3 py-1 text-xs text-white">
              <Maximize2 className="size-3.5" />
              {property.sqft.toLocaleString()} sqft
            </span>
          </div>
        </div>

        {/* Golden Visa Card (2026 DLD Statutory Rules) */}
        <Card className="p-5 flex flex-col justify-between border-line bg-surface">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-5 text-brand-600" />
                <h3 className="font-display text-sm font-semibold text-ink">
                  UAE Golden Visa 10-Year
                </h3>
              </div>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${
                  gv.isEligible
                    ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                    : 'border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400'
                }`}
              >
                {gv.isEligible ? 'Eligible Asset' : 'Below Threshold'}
              </span>
            </div>

            <div className="mt-4 space-y-2.5 text-xs">
              <div className="flex justify-between border-b border-line/50 pb-1.5">
                <span className="text-subtle">Certified Valuation</span>
                <span className="font-semibold text-ink">{formatMoney(property.priceAed, 'AED')}</span>
              </div>
              <div className="flex justify-between border-b border-line/50 pb-1.5">
                <span className="text-subtle">Statutory Threshold</span>
                <span className="text-subtle">{formatMoney(GOLDEN_VISA_MINIMUM_PROPERTY_VALUE_AED, 'AED')}</span>
              </div>
              <div className="flex justify-between border-b border-line/50 pb-1.5">
                <span className="text-subtle">DLD Cube Fee</span>
                <span className="text-subtle">{formatMoney(GOLDEN_VISA_DLD_CUBE_PRIMARY_GOVT_FEE_AED, 'AED')}</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-subtle">Mortgage Equity Rule</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                  0% Min Equity (Abolished)
                </span>
              </div>
            </div>

            <div className="mt-4 rounded-field bg-surface-subtle p-2.5 border border-line text-[11px] text-subtle space-y-1">
              <div className="flex items-start gap-1.5 text-ink font-medium">
                <CheckCircle2 className="size-3.5 text-brand-600 shrink-0 mt-0.5" />
                <span>20 February 2026 DLD Circular</span>
              </div>
              <p>
                Qualifies on gross certified valuation on Title Deed or Oqood. Mortgaged properties require only a standard Bank NOC regardless of outstanding balance.
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-line text-[11px] text-subtle flex items-center justify-between">
            <span>Primary Residency Status</span>
            <span className="font-medium text-ink capitalize">{property.intent.replace('_', ' ')}</span>
          </div>
        </Card>
      </div>

      {/* Financial Engineering & Liquid Capital Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Acquisition Capital Outlay (Feb 2025 CBUAE Mandate) */}
        <Card className="p-5 border-line bg-surface space-y-4">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <div className="flex items-center gap-2">
              <Coins className="size-5 text-brand-600" />
              <div>
                <h3 className="font-display text-base font-semibold text-ink">
                  Acquisition Cash Outlay
                </h3>
                <p className="text-[11px] text-subtle">
                  Full statutory closing fee schedule and upfront cash commitment.
                </p>
              </div>
            </div>
            <span className="rounded-full bg-brand-600/10 px-2.5 py-0.5 text-xs font-semibold text-brand-600">
              {isMortgage ? `Mortgage (${ltvPct}% LTV)` : 'Cash Deal'}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-line/40">
              <span className="text-subtle">Purchase Down Payment</span>
              <span className="font-semibold text-ink">{formatMoney(fees.downPaymentAed, 'AED')}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-line/40">
              <span className="text-subtle">DLD 4% Transfer + Admin (AED 580)</span>
              <span className="text-ink">{formatMoney(fees.totalDldCostAed, 'AED')}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-line/40">
              <span className="text-subtle">
                {property.isOffPlan && (property.isDirectDeveloperPurchase ?? true)
                  ? 'Oqood Developer Registration Portal'
                  : 'DLD Registration Trustee Office Fee (+5% VAT)'}
              </span>
              <span className="text-ink">{formatMoney(fees.totalTrusteeFeeAed, 'AED')}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-line/40">
              <span className="text-subtle">
                Agency Broker Commission
                {property.isOffPlan && (property.isDirectDeveloperPurchase ?? true) && (
                  <span className="ml-1 text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                    (0% - Developer Pays)
                  </span>
                )}
              </span>
              <span className="text-ink">{formatMoney(fees.totalBrokerFeeAed, 'AED')}</span>
            </div>
            {isMortgage && (
              <div className="flex justify-between py-1 border-b border-line/40">
                <span className="text-subtle">Mortgage Friction (DLD Reg 0.25%, Bank 0.75%, Valuation)</span>
                <span className="text-ink">{formatMoney(fees.totalMortgageFrictionAed, 'AED')}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 text-sm font-bold text-ink">
              <span>Total Upfront Cash Required</span>
              <span className="text-brand-600 font-display">
                {formatMoney(fees.totalCashRequiredForPurchaseAed, 'AED')}
              </span>
            </div>
          </div>

          <div className="rounded-field bg-amber-500/10 border border-amber-500/20 p-3 text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-2">
            <Info className="size-4 shrink-0 mt-0.5 text-amber-700 dark:text-amber-400" />
            <p>
              <strong>February 2025 CBUAE Mandate:</strong> Banks are prohibited from rolling transaction fees (DLD transfer fee, broker commissions, and trustee charges) into mortgage loans. 100% of the AED {fees.totalAcquisitionFeesAed.toLocaleString()} closing costs must be paid upfront in liquid cash.
            </p>
          </div>
        </Card>

        {/* Operating Performance & Yield Engine */}
        <Card className="p-5 border-line bg-surface space-y-4">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="size-5 text-brand-600" />
              <div>
                <h3 className="font-display text-base font-semibold text-ink">
                  Returns & Cash Flow Engine
                </h3>
                <p className="text-[11px] text-subtle">
                  Operating net income, service charges, and cashflow distribution.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 rounded-field bg-surface-subtle p-1 border border-line text-[11px]">
              <button
                type="button"
                onClick={() => setStressTestRateDelta(0)}
                className={`px-2 py-0.5 rounded cursor-pointer ${
                  stressTestRateDelta === 0 ? 'bg-surface font-semibold text-ink shadow-xs' : 'text-subtle'
                }`}
              >
                Base ({property.mortgageInterestRatePct ?? 4.5}%)
              </button>
              <button
                type="button"
                onClick={() => setStressTestRateDelta(1.0)}
                className={`px-2 py-0.5 rounded cursor-pointer ${
                  stressTestRateDelta === 1.0 ? 'bg-surface font-semibold text-ink shadow-xs' : 'text-subtle'
                }`}
              >
                +1% Stress
              </button>
              <button
                type="button"
                onClick={() => setStressTestRateDelta(2.0)}
                className={`px-2 py-0.5 rounded cursor-pointer ${
                  stressTestRateDelta === 2.0 ? 'bg-surface font-semibold text-ink shadow-xs' : 'text-subtle'
                }`}
              >
                +2% Stress
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-field bg-surface-subtle p-2.5 border border-line">
              <span className="block text-[10px] text-subtle uppercase tracking-wider">Gross Yield</span>
              <span className="font-display text-base font-bold text-ink">
                {returns.grossRentalYieldPct}%
              </span>
            </div>
            <div className="rounded-field bg-surface-subtle p-2.5 border border-line">
              <span className="block text-[10px] text-subtle uppercase tracking-wider">Net Yield</span>
              <span className="font-display text-base font-bold text-brand-600">
                {returns.netRentalYieldPct}%
              </span>
            </div>
            <div className="rounded-field bg-surface-subtle p-2.5 border border-line">
              <span className="block text-[10px] text-subtle uppercase tracking-wider">Cash-on-Cash</span>
              <span className="font-display text-base font-bold text-ink">
                {returns.cashOnCashReturnPct}%
              </span>
            </div>
          </div>

          <div className="space-y-2 text-xs pt-1">
            <div className="flex justify-between py-1 border-b border-line/40">
              <span className="text-subtle">Expected Annual Ejari Rent</span>
              <span className="font-semibold text-ink">{formatMoney(rent, 'AED')}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-line/40">
              <span className="text-subtle">
                Annual Service Charge (AED {property.annualServiceChargePerSqft ?? 15}/sqft)
              </span>
              <span className="text-ink">{formatMoney(annualServiceCharge, 'AED')}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-line/40">
              <span className="text-subtle">Net Operating Income (NOI)</span>
              <span className="font-semibold text-ink">{formatMoney(returns.netOperatingIncomeAed, 'AED')}</span>
            </div>
            {isMortgage && (
              <div className="flex justify-between py-1 border-b border-line/40">
                <span className="text-subtle">
                  Annual Mortgage Debt Service ({effectiveInterestRate.toFixed(2)}%)
                </span>
                <span className="text-ink">{formatMoney(monthlyEmi * 12, 'AED')}</span>
              </div>
            )}
            <div className="flex justify-between pt-1 font-semibold text-ink">
              <span>Annual Net Cashflow</span>
              <span className={returns.netAnnualCashflowAed >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-danger'}>
                {formatMoney(returns.netAnnualCashflowAed, 'AED')}
              </span>
            </div>
            <div className="flex justify-between text-xs text-subtle">
              <span>Monthly Net Cashflow</span>
              <span className="font-medium text-ink">
                {formatMoney(Math.round(returns.netAnnualCashflowAed / 12), 'AED')} / mo
              </span>
            </div>
          </div>

          {/* Underwriting note on CBUAE 2-month void rule */}
          <div className="rounded-field bg-surface-subtle p-2.5 border border-line text-[11px] text-subtle flex items-start gap-1.5">
            <AlertCircle className="size-3.5 text-subtle shrink-0 mt-0.5" />
            <span>
              <strong>CBUAE Underwritten Rent:</strong> AED {returns.cbuaeUnderwrittenRentAed.toLocaleString()} (deducts statutory 2-month void period for mortgage stress-testing).
            </span>
          </div>
        </Card>
      </div>

      {/* Personal Housing Cost of Ownership (if primary home or hybrid) */}
      {property.intent !== 'investment' && (
        <Card className="p-5 border-line bg-surface space-y-4">
          <div className="flex items-center gap-2 border-b border-line pb-3">
            <Home className="size-5 text-brand-600" />
            <div>
              <h3 className="font-display text-base font-semibold text-ink">
                Personal Housing: Total Cost of Ownership
              </h3>
              <p className="text-[11px] text-subtle">
                Monthly living overhead including mortgage EMI, service charges, and utility reserves.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
            <div className="rounded-field bg-surface-subtle p-3 border border-line">
              <span className="block text-[11px] text-subtle">Mortgage EMI</span>
              <span className="font-display text-base font-bold text-ink">
                {formatMoney(homeOwnership.monthlyMortgageEmiAed, 'AED')}
              </span>
            </div>
            <div className="rounded-field bg-surface-subtle p-3 border border-line">
              <span className="block text-[11px] text-subtle">Service Charge Reserve</span>
              <span className="font-display text-base font-bold text-ink">
                {formatMoney(homeOwnership.monthlyServiceChargeAed, 'AED')}
              </span>
            </div>
            <div className="rounded-field bg-surface-subtle p-3 border border-line">
              <span className="block text-[11px] text-subtle">Estimated Utilities (DEWA)</span>
              <span className="font-display text-base font-bold text-ink">
                {formatMoney(homeOwnership.monthlyUtilitiesAed, 'AED')}
              </span>
            </div>
            <div className="rounded-field bg-brand-600/10 p-3 border border-brand-600/30">
              <span className="block text-[11px] text-brand-700 dark:text-brand-300 font-semibold">
                Total Monthly Outlay
              </span>
              <span className="font-display text-lg font-bold text-brand-600">
                {formatMoney(homeOwnership.totalMonthlyCostOfOwnershipAed, 'AED')}
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* Off-Plan Payment Milestones & Construction Schedule */}
      {property.isOffPlan && property.paymentPlan && property.paymentPlan.length > 0 && (
        <Card className="p-5 border-line bg-surface space-y-4">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <div className="flex items-center gap-2">
              <Layers className="size-5 text-brand-600" />
              <div>
                <h3 className="font-display text-base font-semibold text-ink">
                  Off-Plan Milestone Payment Schedule
                </h3>
                <p className="text-[11px] text-subtle">
                  Construction-linked installments secured in RERA developer project escrow account.
                </p>
              </div>
            </div>
            <span className="rounded-full bg-surface-subtle border border-line px-2.5 py-0.5 text-xs text-subtle">
              Completion: {property.completionYear ?? 2027}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-line text-subtle">
                  <th className="py-2.5 font-medium">Milestone Stage</th>
                  <th className="py-2.5 font-medium">Due Schedule</th>
                  <th className="py-2.5 font-medium text-right">Payment %</th>
                  <th className="py-2.5 font-medium text-right">Amount (AED)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/40">
                {property.paymentPlan.map((stage, idx) => {
                  const amount = Math.round(property.priceAed * (stage.percentage / 100));
                  return (
                    <tr key={idx} className="hover:bg-surface-subtle/50 transition">
                      <td className="py-2.5 font-semibold text-ink">{stage.milestone}</td>
                      <td className="py-2.5 text-subtle">{stage.dueLabel}</td>
                      <td className="py-2.5 text-right font-medium text-ink">{stage.percentage}%</td>
                      <td className="py-2.5 text-right font-display font-semibold text-ink">
                        {formatMoney(amount, 'AED')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="rounded-field bg-surface-subtle p-2.5 border border-line text-[11px] text-subtle flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5">
              <FileText className="size-3.5 text-brand-600" />
              <span>Oqood Pre-Title Deed Registration Confirmed</span>
            </span>
            <span className="font-medium text-ink">RERA Escrow Law No. 8 of 2007 Protected</span>
          </div>
        </Card>
      )}

      {/* Property Notes and Strategic Commentary */}
      {property.notes && (
        <Card className="p-5 border-line bg-surface space-y-2">
          <h3 className="font-display text-sm font-semibold text-ink flex items-center gap-2">
            <FileText className="size-4 text-brand-600" />
            Strategic Commentary & Investment Thesis
          </h3>
          <p className="text-xs text-subtle leading-relaxed bg-surface-subtle p-3 rounded-field border border-line">
            {property.notes}
          </p>
        </Card>
      )}
    </div>
  );
}
