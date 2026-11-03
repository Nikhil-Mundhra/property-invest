import { Building, Calendar, CheckCircle2, DollarSign, Home, MapPin, Sparkles, TrendingUp } from 'lucide-react';
import { Link } from 'react-router';
import type { PropertyItem } from '@wealth-advisor/contracts';
import {
  calculateMonthlyEmi,
  calculatePropertyReturns,
  calculateTotalMonthlyCostOfOwnership,
  checkGoldenVisaEligibility,
} from '@wealth-advisor/rules';
import { Card } from '../../../components/ui/card.tsx';
import { formatMoney } from '../../../lib/format-money.ts';

interface PropertyCardProps {
  property: PropertyItem;
  portfolioTotalAed: number;
}

export function PropertyCard({ property, portfolioTotalAed }: PropertyCardProps) {
  const sharePct = portfolioTotalAed > 0
    ? Math.round((property.priceAed / portfolioTotalAed) * 100)
    : 0;

  // Card sizing tiers based on relative portfolio share
  const isSmall = sharePct < 25;
  const isLarge = sharePct >= 55;

  const isMortgage = property.financingType === 'mortgage';
  const loanAmount = isMortgage
    ? (property.mortgageLoanAmountAed ?? Math.round(property.priceAed * 0.8))
    : 0;

  const monthlyEmi = isMortgage
    ? calculateMonthlyEmi({
        principalAed: loanAmount,
        annualInterestRatePct: property.mortgageInterestRatePct ?? 4.5,
        tenureYears: property.mortgageTenureYears ?? 25,
      })
    : 0;

  const serviceChargeAnnual = (property.annualServiceChargePerSqft ?? 16) * property.sqft;

  const returns = calculatePropertyReturns({
    purchasePriceAed: property.priceAed,
    expectedAnnualRentAed: property.expectedAnnualRentAed ?? 0,
    annualServiceChargeAed: serviceChargeAnnual,
    annualMortgageEmiAed: monthlyEmi * 12,
  });

  const ownershipCost = calculateTotalMonthlyCostOfOwnership({
    monthlyMortgageEmiAed: monthlyEmi,
    annualServiceChargeAed: serviceChargeAnnual,
  });

  const goldenVisa = checkGoldenVisaEligibility(property.priceAed);

  return (
    <Link
      to={`/investments/${property.id}`}
      className={`group block transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none ${
        isLarge ? 'col-span-1 md:col-span-2' : 'col-span-1'
      }`}
    >
      <Card className="h-full overflow-hidden border border-line bg-surface transition-colors group-hover:border-brand-600/50 group-hover:shadow-md">
        {/* Card Header Media */}
        <div className={`relative overflow-hidden bg-surface-subtle ${isSmall ? 'h-32' : 'h-44'}`}>
          {property.imageUrl ? (
            <img
              src={property.imageUrl}
              alt={property.title}
              className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-subtle">
              <Building className="size-8 opacity-40" />
            </div>
          )}

          {/* Top Pill Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
            <span className="rounded-full bg-black/60 backdrop-blur-xs px-2.5 py-0.5 text-[11px] font-medium text-white">
              {property.developer}
            </span>
            {property.isOffPlan && (
              <span className="flex items-center gap-1 rounded-full bg-brand-600/90 backdrop-blur-xs px-2 py-0.5 text-[10px] font-semibold text-white">
                <Calendar className="size-3" />
                Handover {property.completionYear ?? 'Off-Plan'}
              </span>
            )}
          </div>

          <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
            <span className="rounded-full bg-surface/90 backdrop-blur-xs px-2 py-0.5 text-[11px] font-bold text-ink border border-line shadow-xs">
              {sharePct}% of Portfolio
            </span>
          </div>

          {/* Bottom tag on image */}
          <div className="absolute bottom-2 left-2.5 flex items-center gap-1 text-[11px] font-medium text-white drop-shadow-md">
            <MapPin className="size-3 shrink-0" />
            <span className="truncate max-w-[240px]">{property.location}</span>
          </div>
        </div>

        {/* Card Content Body */}
        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-display font-semibold text-ink group-hover:text-brand-600 transition-colors line-clamp-1">
                {property.title}
              </h3>
              <p className="text-xs text-subtle capitalize mt-0.5">
                {property.bedrooms === 0 ? 'Studio' : `${property.bedrooms} Bed`} · {property.bathrooms} Bath · {property.sqft.toLocaleString()} sqft
              </p>
            </div>

            <div className="text-right shrink-0">
              <span className="block font-semibold text-sm text-ink">
                {formatMoney(property.priceAed, 'AED')}
              </span>
              <span className="block text-[10px] text-subtle">
                AED {Math.round(property.priceAed / property.sqft).toLocaleString()} / sqft
              </span>
            </div>
          </div>

          {/* Badges Bar */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
            {goldenVisa.isEligible && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 font-medium text-emerald-600 dark:text-emerald-400">
                <Sparkles className="size-3" />
                Golden Visa (10-Yr)
              </span>
            )}
            <span className="inline-flex items-center gap-1 rounded-full bg-surface-subtle px-2 py-0.5 text-subtle border border-line capitalize">
              {property.intent === 'personal_home' ? (
                <>
                  <Home className="size-3" />
                  Primary Home
                </>
              ) : (
                <>
                  <TrendingUp className="size-3" />
                  {property.intent === 'hybrid' ? 'Holiday Let' : 'Investment'}
                </>
              )}
            </span>
            <span className="inline-flex items-center rounded-full bg-surface-subtle px-2 py-0.5 text-[10px] text-subtle border border-line uppercase">
              {property.financingType}
            </span>
          </div>

          {/* Key Financial Metrics Grid */}
          <div className="border-t border-line pt-2.5">
            {property.intent === 'personal_home' ? (
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="block text-[10px] text-subtle">Monthly Ownership Cost</span>
                  <span className="font-semibold text-ink">
                    {formatMoney(ownershipCost.totalMonthlyCostOfOwnershipAed, 'AED')} / mo
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] text-subtle">Est. Service Charge</span>
                  <span className="font-medium text-ink">
                    {formatMoney(ownershipCost.monthlyServiceChargeAed, 'AED')} / mo
                  </span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="block text-[10px] text-subtle">Gross Yield</span>
                  <span className="font-semibold text-ink">
                    {returns.grossRentalYieldPct.toFixed(1)}%
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] text-subtle">Net Yield</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {returns.netRentalYieldPct.toFixed(1)}%
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] text-subtle">Net Cashflow</span>
                  <span className="font-semibold text-ink">
                    {formatMoney(returns.netAnnualCashflowAed, 'AED')} / yr
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
