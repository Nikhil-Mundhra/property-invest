import { useState } from 'react';
import {
  Building2,
  Clock,
  Coins,
  FileCheck2,
  Plus,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { Button } from '../../components/ui/button.tsx';
import { Card } from '../../components/ui/card.tsx';
import { PageTitle } from '../../components/ui/page-title.tsx';
import { AddPropertyModal } from '../../features/investments/components/add-property-modal.tsx';
import { PropertyCard } from '../../features/investments/components/property-card.tsx';
import {
  calculatePortfolioSummary,
  useProperties,
} from '../../features/investments/store/properties-store.ts';
import { formatMoney } from '../../lib/format-money.ts';

export function InvestmentsPage() {
  const properties = useProperties();
  const [modalOpen, setModalOpen] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState<'owned' | 'planned'>('planned');

  const ownedProperties = properties.filter((p) => p.status === 'owned');
  const plannedProperties = properties.filter((p) => p.status === 'planned');

  const summary = calculatePortfolioSummary(properties);
  const ownedTotalValue = summary.totalPortfolioValueAed;
  const plannedTotalValue = plannedProperties.reduce((sum, p) => sum + p.priceAed, 0);

  const handleOpenAdd = (status: 'owned' | 'planned') => {
    setDefaultStatus(status);
    setModalOpen(true);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-line pb-5">
        <div>
          <PageTitle>Real Estate Portfolio</PageTitle>
          <p className="text-xs text-subtle mt-1">
            Curated UAE holdings, rental yield performance, and planned acquisition pipeline.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="primary"
            onClick={() => handleOpenAdd('planned')}
            className="flex items-center gap-1.5"
          >
            <Plus className="size-4" />
            <span>Add Property</span>
          </Button>
        </div>
      </div>

      {/* Top Executive Metrics Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 border border-line bg-surface">
          <div className="flex items-center gap-2 text-subtle text-xs mb-1">
            <Coins className="size-4 text-brand-600" />
            <span>Total Portfolio Value</span>
          </div>
          <p className="font-display text-xl font-bold text-ink">
            {formatMoney(summary.totalPortfolioValueAed, 'AED')}
          </p>
          <span className="text-[11px] text-subtle mt-0.5 block">
            {summary.ownedPropertiesCount} active properties
          </span>
        </Card>

        <Card className="p-4 border border-line bg-surface">
          <div className="flex items-center gap-2 text-subtle text-xs mb-1">
            <TrendingUp className="size-4 text-emerald-600" />
            <span>Weighted Net Yield</span>
          </div>
          <p className="font-display text-xl font-bold text-emerald-600 dark:text-emerald-400">
            {summary.weightedNetYieldPct.toFixed(1)}%
          </p>
          <span className="text-[11px] text-subtle mt-0.5 block">
            Gross yield {summary.weightedGrossYieldPct.toFixed(1)}%
          </span>
        </Card>

        <Card className="p-4 border border-line bg-surface">
          <div className="flex items-center gap-2 text-subtle text-xs mb-1">
            <Clock className="size-4 text-brand-600" />
            <span>Net Annual Cashflow</span>
          </div>
          <p className="font-display text-xl font-bold text-ink">
            {formatMoney(summary.totalAnnualNetCashflowAed, 'AED')}
          </p>
          <span className="text-[11px] text-subtle mt-0.5 block">
            {formatMoney(summary.totalMonthlyNetCashflowAed, 'AED')} / month
          </span>
        </Card>

        <Card className="p-4 border border-line bg-surface">
          <div className="flex items-center gap-2 text-subtle text-xs mb-1">
            <Sparkles className="size-4 text-gold" />
            <span>Golden Visa Status</span>
          </div>
          {summary.goldenVisaEligible ? (
            <div>
              <p className="font-display text-base font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="size-4" />
                Qualified (10-Yr)
              </p>
              <span className="text-[11px] text-subtle mt-0.5 block">
                Equity exceeds AED 2.0M threshold
              </span>
            </div>
          ) : (
            <div>
              <p className="font-display text-base font-bold text-amber-600">
                Shortfall AED {summary.goldenVisaShortfallAed.toLocaleString()}
              </p>
              <span className="text-[11px] text-subtle mt-0.5 block">
                Target AED 2.0M for 10-Yr Visa
              </span>
            </div>
          )}
        </Card>
      </div>

      {/* SECTION 1: Current Portfolio */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-line pb-3">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-field bg-brand-600/10 text-brand-600">
              <Building2 className="size-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-lg font-bold text-ink">Current Portfolio</h2>
                <span className="rounded-full bg-brand-600/15 px-2 py-0.5 text-xs font-semibold text-brand-600">
                  {ownedProperties.length} {ownedProperties.length === 1 ? 'Asset' : 'Assets'}
                </span>
              </div>
              <p className="text-xs text-subtle">
                Currently owned properties, active tenancies, and primary residences.
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            onClick={() => handleOpenAdd('owned')}
            className="text-xs h-9 px-3"
          >
            <Plus className="size-3.5 mr-1" />
            Add Owned Property
          </Button>
        </div>

        {ownedProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {ownedProperties.map((prop) => (
              <PropertyCard
                key={prop.id}
                property={prop}
                portfolioTotalAed={ownedTotalValue}
              />
            ))}
          </div>
        ) : (
          <Card className="flex flex-col items-center justify-center p-8 text-center border-dashed border-line bg-surface-subtle/50">
            <Building2 className="size-8 text-subtle mb-2 opacity-50" />
            <h3 className="font-semibold text-sm text-ink">No properties in current portfolio</h3>
            <p className="text-xs text-subtle max-w-sm mt-1">
              Add the properties you already own in Dubai to calculate your consolidated net yield and equity.
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenAdd('owned')}
              className="mt-4 text-xs h-9 px-3"
            >
              <Plus className="size-3.5 mr-1.5" />
              Add First Property
            </Button>
          </Card>
        )}
      </section>

      {/* SECTION 2: Planned Acquisitions */}
      <section className="space-y-4 pt-4">
        <div className="flex items-center justify-between border-b border-line pb-3">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-field bg-emerald-500/10 text-emerald-600">
              <FileCheck2 className="size-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-lg font-bold text-ink">Planned Acquisitions</h2>
                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold text-emerald-600">
                  {plannedProperties.length} {plannedProperties.length === 1 ? 'Target' : 'Targets'}
                </span>
              </div>
              <p className="text-xs text-subtle">
                Shortlisted off-plan projects, secondary deals under review, and investment simulations.
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            onClick={() => handleOpenAdd('planned')}
            className="text-xs h-9 px-3"
          >
            <Plus className="size-3.5 mr-1" />
            Add Planned Deal
          </Button>
        </div>

        {plannedProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {plannedProperties.map((prop) => (
              <PropertyCard
                key={prop.id}
                property={prop}
                portfolioTotalAed={plannedTotalValue}
              />
            ))}
          </div>
        ) : (
          <Card className="flex flex-col items-center justify-center p-8 text-center border-dashed border-line bg-surface-subtle/50">
            <FileCheck2 className="size-8 text-subtle mb-2 opacity-50" />
            <h3 className="font-semibold text-sm text-ink">No planned acquisitions yet</h3>
            <p className="text-xs text-subtle max-w-sm mt-1">
              Add off-plan or secondary units you are considering to stress-test their payment milestones and projected returns.
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenAdd('planned')}
              className="mt-4 text-xs h-9 px-3"
            >
              <Plus className="size-3.5 mr-1.5" />
              Add Target Deal
            </Button>
          </Card>
        )}
      </section>

      {/* Add Property Modal */}
      <AddPropertyModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultStatus={defaultStatus}
      />
    </div>
  );
}
