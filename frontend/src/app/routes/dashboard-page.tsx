import { useMemo, useState } from 'react';
import {
  ArrowUpRight,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Coins,
  Compass,
  Home,
  Layers,
  MapPin,
  Percent,
  PieChart,
  Plus,
  ShieldCheck,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { Link } from 'react-router';
import {
  GOLDEN_VISA_MINIMUM_PROPERTY_VALUE_AED,
} from '@wealth-advisor/rules';
import { Button } from '../../components/ui/button.tsx';
import { Card } from '../../components/ui/card.tsx';
import { PageTitle } from '../../components/ui/page-title.tsx';
import { MeGate } from '../../features/auth/components/me-gate.tsx';
import { AddPropertyModal } from '../../features/investments/components/add-property-modal.tsx';
import {
  calculatePortfolioSummary,
  useProperties,
} from '../../features/investments/store/properties-store.ts';
import { formatMoney } from '../../lib/format-money.ts';

export function DashboardPage() {
  return (
    <MeGate>
      <RealEstateDashboardView />
    </MeGate>
  );
}

function RealEstateDashboardView() {
  const properties = useProperties();
  const summary = useMemo(() => calculatePortfolioSummary(properties), [properties]);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const ownedProperties = useMemo(
    () => properties.filter((p) => p.status === 'owned'),
    [properties]
  );
  const plannedProperties = useMemo(
    () => properties.filter((p) => p.status === 'planned'),
    [properties]
  );

  // Geographic District Breakdown
  const districtAllocation = useMemo(() => {
    const totalVal = summary.totalPortfolioValueAed || 1;
    const districtMap = new Map<string, { count: number; totalAed: number }>();

    for (const p of properties) {
      const current = districtMap.get(p.location) ?? { count: 0, totalAed: 0 };
      districtMap.set(p.location, {
        count: current.count + 1,
        totalAed: current.totalAed + p.priceAed,
      });
    }

    return Array.from(districtMap.entries())
      .map(([location, data]) => ({
        location,
        count: data.count,
        totalAed: data.totalAed,
        sharePct: Math.round((data.totalAed / totalVal) * 100),
      }))
      .sort((a, b) => b.totalAed - a.totalAed);
  }, [properties, summary.totalPortfolioValueAed]);

  // Strategy Mix: Ready vs Off-Plan
  const strategyMix = useMemo(() => {
    const totalVal = summary.totalPortfolioValueAed || 1;
    const readyUnits = properties.filter((p) => !p.isOffPlan);
    const offPlanUnits = properties.filter((p) => p.isOffPlan);

    const readyAed = readyUnits.reduce((acc, p) => acc + p.priceAed, 0);
    const offPlanAed = offPlanUnits.reduce((acc, p) => acc + p.priceAed, 0);

    return {
      readyCount: readyUnits.length,
      readyAed,
      readyPct: Math.round((readyAed / totalVal) * 100),
      offPlanCount: offPlanUnits.length,
      offPlanAed,
      offPlanPct: Math.round((offPlanAed / totalVal) * 100),
    };
  }, [properties, summary.totalPortfolioValueAed]);

  // Asset Class Type Distribution (Apartment, Villa, etc.)
  const typeDistribution = useMemo(() => {
    const types: Record<string, { count: number; totalAed: number }> = {};
    for (const p of properties) {
      const entry = types[p.propertyType] ?? { count: 0, totalAed: 0 };
      types[p.propertyType] = {
        count: entry.count + 1,
        totalAed: entry.totalAed + p.priceAed,
      };
    }
    return Object.entries(types).map(([type, data]) => ({
      type,
      count: data.count,
      totalAed: data.totalAed,
    }));
  }, [properties]);

  const portfolioLtvPct =
    summary.totalPortfolioValueAed > 0
      ? Math.round((summary.totalMortgageBalanceAed / summary.totalPortfolioValueAed) * 100)
      : 0;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* Header and Quick CTAs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-line pb-4">
        <div>
          <PageTitle>Real Estate Portfolio Dashboard</PageTitle>
          <p className="text-xs text-subtle mt-1">
            Hyper-personalized Dubai property acquisitions, rental cashflows, and Golden Visa tracking.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link to="/plan">
            <Button variant="outline" className="h-9 px-3 text-xs">
              <Compass className="size-3.5 mr-1.5 text-brand-600" />
              Strategic Plan
            </Button>
          </Link>
          <Button
            variant="primary"
            onClick={() => setAddModalOpen(true)}
            className="h-9 px-3 text-xs"
          >
            <Plus className="size-3.5 mr-1.5" />
            Add Property
          </Button>
        </div>
      </div>

      {/* Top 4 Executive Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Real Estate Assets */}
        <Card className="p-4 border-line bg-surface space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-subtle">Total Asset Valuation</span>
            <div className="flex size-7 items-center justify-center rounded-field bg-brand-600/10 text-brand-600">
              <Building2 className="size-4" />
            </div>
          </div>
          <div>
            <span className="font-display text-xl sm:text-2xl font-bold text-ink block">
              {formatMoney(summary.totalPortfolioValueAed, 'AED')}
            </span>
            <span className="text-[11px] text-subtle mt-0.5 block">
              {summary.ownedPropertiesCount} owned · {summary.plannedPropertiesCount} planned
            </span>
          </div>
        </Card>

        {/* Metric 2: Net Equity & Mortgage Balance */}
        <Card className="p-4 border-line bg-surface space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-subtle">Net Invested Equity</span>
            <div className="flex size-7 items-center justify-center rounded-field bg-emerald-500/10 text-emerald-600">
              <Wallet className="size-4" />
            </div>
          </div>
          <div>
            <span className="font-display text-xl sm:text-2xl font-bold text-ink block">
              {formatMoney(summary.totalEquityInvestedAed, 'AED')}
            </span>
            <span className="text-[11px] text-subtle mt-0.5 block">
              Mortgage debt: {formatMoney(summary.totalMortgageBalanceAed, 'AED')} ({portfolioLtvPct}% LTV)
            </span>
          </div>
        </Card>

        {/* Metric 3: Net Cashflow & Yield */}
        <Card className="p-4 border-line bg-surface space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-subtle">Monthly Net Cashflow</span>
            <div className="flex size-7 items-center justify-center rounded-field bg-cyan-500/10 text-cyan-600">
              <TrendingUp className="size-4" />
            </div>
          </div>
          <div>
            <span className="font-display text-xl sm:text-2xl font-bold text-ink block">
              {formatMoney(summary.totalMonthlyNetCashflowAed, 'AED')}
              <span className="text-xs font-normal text-subtle"> / mo</span>
            </span>
            <span className="text-[11px] text-subtle mt-0.5 block">
              Net yield: {summary.weightedNetYieldPct}% · Gross: {summary.weightedGrossYieldPct}%
            </span>
          </div>
        </Card>

        {/* Metric 4: UAE Golden Visa Tracker */}
        <Card className="p-4 border-line bg-surface space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-subtle">UAE Golden Visa (10-Yr)</span>
            <div className="flex size-7 items-center justify-center rounded-field bg-purple-500/10 text-purple-600">
              <ShieldCheck className="size-4" />
            </div>
          </div>
          <div>
            <span className="font-display text-xl sm:text-2xl font-bold text-ink block">
              {summary.goldenVisaEligible ? 'Qualified' : 'Pending'}
            </span>
            <span className="text-[11px] text-subtle mt-0.5 block">
              {summary.goldenVisaEligible
                ? 'Certified valuation >= AED 2M threshold'
                : `Shortfall: ${formatMoney(summary.goldenVisaShortfallAed, 'AED')}`}
            </span>
          </div>
        </Card>
      </div>

      {/* Visual Analytics Grid: District Exposure & Strategy Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* District & Location Exposure */}
        <Card className="p-5 border-line bg-surface space-y-4">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-brand-600" />
              <h3 className="font-display text-sm font-semibold text-ink">
                Geographic District Exposure
              </h3>
            </div>
            <span className="text-[11px] text-subtle">
              {districtAllocation.length} Dubai Sub-Markets
            </span>
          </div>

          <div className="space-y-3">
            {districtAllocation.map((item) => (
              <div key={item.location} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-ink">{item.location}</span>
                  <span className="text-subtle font-mono">
                    {formatMoney(item.totalAed, 'AED')} ({item.sharePct}%)
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-surface-subtle border border-line">
                  <div
                    className="h-full rounded-full bg-brand-600 transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(5, item.sharePct))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-line text-[11px] text-subtle flex items-center justify-between">
            <span>Primary Focus</span>
            <span className="font-medium text-ink">Prime Residential & High-Yield Freehold Corridors</span>
          </div>
        </Card>

        {/* Strategy Breakdown: Ready vs Off-Plan & Asset Classes */}
        <Card className="p-5 border-line bg-surface space-y-4">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <div className="flex items-center gap-2">
              <Layers className="size-4 text-brand-600" />
              <h3 className="font-display text-sm font-semibold text-ink">
                Acquisition Strategy & Asset Mix
              </h3>
            </div>
            <span className="text-[11px] text-subtle">Capital Allocation</span>
          </div>

          {/* Ready vs Off-Plan split */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-field bg-surface-subtle p-3 border border-line space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-ink">Ready Resale</span>
                <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                  {strategyMix.readyPct}%
                </span>
              </div>
              <span className="block font-display text-base font-bold text-ink">
                {formatMoney(strategyMix.readyAed, 'AED')}
              </span>
              <span className="block text-[10px] text-subtle">
                {strategyMix.readyCount} Units · Immediate Rental Income
              </span>
            </div>

            <div className="rounded-field bg-surface-subtle p-3 border border-line space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-ink">Off-Plan Growth</span>
                <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] text-amber-700 dark:text-amber-400 font-medium">
                  {strategyMix.offPlanPct}%
                </span>
              </div>
              <span className="block font-display text-base font-bold text-ink">
                {formatMoney(strategyMix.offPlanAed, 'AED')}
              </span>
              <span className="block text-[10px] text-subtle">
                {strategyMix.offPlanCount} Units · Milestone Handover
              </span>
            </div>
          </div>

          {/* Property Types List */}
          <div className="space-y-2 pt-1 border-t border-line">
            <span className="text-xs font-medium text-subtle block">Asset Classes</span>
            <div className="flex flex-wrap gap-2">
              {typeDistribution.map((item) => (
                <div
                  key={item.type}
                  className="rounded-field bg-surface-subtle px-3 py-1.5 border border-line text-xs flex items-center gap-2"
                >
                  <span className="font-semibold text-ink capitalize">{item.type}</span>
                  <span className="text-[10px] text-subtle">({item.count} units)</span>
                  <span className="font-mono text-ink text-[11px]">{formatMoney(item.totalAed, 'AED')}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-line text-[11px] text-subtle flex items-center justify-between">
            <span>Financing Structure</span>
            <span className="font-medium text-ink">
              {summary.totalMortgageBalanceAed > 0 ? 'Leveraged (Bank Mortgages)' : '100% Cash'}
            </span>
          </div>
        </Card>
      </div>

      {/* Monthly Cash Dynamics & Personal Cost of Ownership */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-5 border-line bg-surface space-y-4">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <div className="flex items-center gap-2">
              <Coins className="size-4 text-brand-600" />
              <h3 className="font-display text-sm font-semibold text-ink">
                Monthly Rental Cash Inflow vs Operating Costs
              </h3>
            </div>
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              Net: +{formatMoney(summary.totalMonthlyNetCashflowAed, 'AED')} / mo
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            <div className="rounded-field bg-surface-subtle p-3 border border-line">
              <span className="text-[11px] text-subtle block">Gross Annual Rent</span>
              <span className="font-display text-base font-bold text-ink">
                {formatMoney(Math.round(summary.totalPortfolioValueAed * (summary.weightedGrossYieldPct / 100)), 'AED')}
              </span>
            </div>
            <div className="rounded-field bg-surface-subtle p-3 border border-line">
              <span className="text-[11px] text-subtle block">Annual Net Operating Income</span>
              <span className="font-display text-base font-bold text-ink">
                {formatMoney(summary.totalAnnualNetCashflowAed, 'AED')}
              </span>
            </div>
            <div className="rounded-field bg-brand-600/10 p-3 border border-brand-600/30">
              <span className="text-[11px] text-brand-700 dark:text-brand-300 font-medium block">
                Cashflow After Debt Service
              </span>
              <span className="font-display text-base font-bold text-brand-600">
                {formatMoney(summary.totalMonthlyNetCashflowAed, 'AED')} / mo
              </span>
            </div>
          </div>

          <p className="text-[11px] text-subtle leading-relaxed">
            Rental yields incorporate RERA index guidance and CBUAE underwritten stress allowances (2-month void reserves). 
            Mortgage payments reflect monthly EMIs across active loan tenures.
          </p>
        </Card>

        {/* Golden Visa Policy Highlight Card */}
        <Card className="p-5 border-line bg-surface flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-brand-600" />
              <h3 className="font-display text-sm font-semibold text-ink">
                2026 Golden Visa Status
              </h3>
            </div>
            <p className="text-xs text-subtle leading-relaxed">
              Under the 20 February 2026 DLD circular, Golden Visa eligibility is based strictly on the gross certified property purchase price or DLD valuation on Title Deed / Oqood.
            </p>
            <div className="rounded-field bg-surface-subtle p-2.5 border border-line text-[11px] text-subtle space-y-1">
              <div className="flex justify-between">
                <span>Minimum Requirement</span>
                <span className="font-medium text-ink">{formatMoney(GOLDEN_VISA_MINIMUM_PROPERTY_VALUE_AED, 'AED')}</span>
              </div>
              <div className="flex justify-between">
                <span>Your Certified Base</span>
                <span className="font-semibold text-ink">{formatMoney(summary.totalPortfolioValueAed, 'AED')}</span>
              </div>
            </div>
          </div>

          <Link
            to="/plan"
            className="inline-flex items-center justify-between text-xs font-medium text-brand-600 hover:text-brand-700 transition pt-2 border-t border-line"
          >
            <span>Review acquisition roadmap</span>
            <ChevronRight className="size-3.5" />
          </Link>
        </Card>
      </div>

      {/* Active Properties Quick List */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-base font-semibold text-ink">
              Portfolio Holdings & Acquisitions
            </h3>
            <p className="text-xs text-subtle">
              Manage your owned properties and planned purchase deals.
            </p>
          </div>
          <Link
            to="/investments"
            className="text-xs font-medium text-brand-600 hover:underline inline-flex items-center gap-1"
          >
            <span>View All in Investments</span>
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {properties.slice(0, 6).map((property) => (
            <Link
              key={property.id}
              to={`/investments/${property.id}`}
              className="group block rounded-card border border-line bg-surface p-4 hover:border-brand-600 transition shadow-xs"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-600 block">
                    {property.developer}
                  </span>
                  <h4 className="font-display text-sm font-bold text-ink group-hover:text-brand-600 transition line-clamp-1">
                    {property.title}
                  </h4>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-medium border ${
                    property.status === 'owned'
                      ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                      : 'border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-400'
                  }`}
                >
                  {property.status === 'owned' ? 'Owned' : 'Planned'}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-subtle mb-3">
                <MapPin className="size-3 shrink-0" />
                <span className="line-clamp-1">{property.location}</span>
              </div>

              <div className="flex items-center justify-between border-t border-line/60 pt-2 text-xs">
                <span className="font-display text-sm font-bold text-ink">
                  {formatMoney(property.priceAed, 'AED')}
                </span>
                <span className="text-[11px] text-subtle">
                  {property.isOffPlan ? `Handover ${property.completionYear ?? 2027}` : `${property.bedrooms} Bed · ${property.sqft} sqft`}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <AddPropertyModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        defaultStatus="planned"
      />
    </div>
  );
}
