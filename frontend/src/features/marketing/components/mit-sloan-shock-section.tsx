import { AlertOctagon, ArrowUpRight, BarChart3, Calculator, Check, ShieldAlert, TrendingDown, Users, X } from 'lucide-react';
import marketShockImg from '../../../assets/market-shock.jpg';

export function MITSloanShockSection() {
  return (
    <div className="bg-surface rounded-card border border-line p-6 sm:p-8">
      {/* Header */}
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-control border border-brand-600/20 bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-700 dark:bg-brand-950 dark:text-brand-600">
          <Calculator className="size-3.5" />
          <span>CBUAE Circular No. 31/2013 & Rate Sensitivity</span>
        </div>

        <h3 className="mt-4 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Central Bank Mortgage Regulations & Interest Rate Stress Tests
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">
          Mortgage affordability is guarded by statutory central bank rules. We underwrite loan-to-value (LTV) limits,
          50% Debt Burden Ratio (DBR) caps, and simulate +100bps and +200bps EIBOR rate shock sensitivity curves.
        </p>
      </div>

      {/* 16:9 Image Showcase */}
      <div className="mt-6 overflow-hidden rounded-card border border-line bg-surface shadow-xs">
        <img
          src={marketShockImg}
          alt="Late-night trading desk showing a plummeting stock chart, calculator, coffee, and financial statements during a market shock"
          loading="lazy"
          className="aspect-[16/9] w-full object-cover max-h-[380px]"
        />
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line bg-surface-subtle px-4 py-2.5 sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="size-2 rounded-full bg-brand-600" />
            <p className="text-xs text-ink">
              <span className="font-semibold">Stress Test: Mortgage Rate Shock</span> · +100bps and +200bps EIBOR sensitivity modeling
            </p>
          </div>
          <span className="text-[11px] font-medium text-subtle">
            CBUAE Circular No. 31/2013 Regulatory Standard
          </span>
        </div>
      </div>

      {/* 3 Core Regulatory Cards */}
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {/* Card 1: Statutory LTV Tiers */}
        <div className="flex flex-col justify-between rounded-card border border-line bg-surface-subtle p-6">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700 dark:text-brand-600">
              Statutory LTV Limits
            </span>
            <h4 className="mt-2 text-base font-semibold text-ink">Resident vs. Non-Resident</h4>
            <p className="mt-2 text-xs leading-relaxed text-muted">
              Resident expats qualify for up to 80% LTV for properties under AED 5,000,000 (70% above AED 5M). Second homes are capped at 60% LTV.
              Non-residents are capped at 50% to 60% LTV across all asset classes.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-line text-xs font-mono font-bold text-brand-700 dark:text-brand-600">
            80% / 70% First Home · 60% Second
          </div>
        </div>

        {/* Card 2: Off-Plan Flat Cap */}
        <div className="flex flex-col justify-between rounded-card border border-line bg-surface-subtle p-6">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-gold">
              Article 3 Restriction
            </span>
            <h4 className="mt-2 text-base font-semibold text-ink">50% Off-Plan Flat Cap</h4>
            <p className="mt-2 text-xs leading-relaxed text-muted">
              Central Bank regulations strictly restrict maximum bank financing on under-construction off-plan properties to a flat 50% LTV ceiling,
              regardless of borrower residency, income magnitude, or transaction size.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-line text-xs font-mono font-bold text-gold">
            50% Maximum LTV Flat Ceiling
          </div>
        </div>

        {/* Card 3: Debt Burden Ratio & Rate Shock */}
        <div className="flex flex-col justify-between rounded-card border border-line bg-surface-subtle p-6">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700 dark:text-brand-600">
              Stress Underwriting
            </span>
            <h4 className="mt-2 text-base font-semibold text-ink">50% DBR & +200bps Stress</h4>
            <p className="mt-2 text-xs leading-relaxed text-muted">
              Total monthly debt payments cannot exceed 50% of verified monthly income (including 5% of credit card limits).
              We simulate +100bps and +200bps interest rate shocks to verify that payments remain sustainable under tighter monetary cycles.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-line text-xs font-mono font-bold text-brand-700 dark:text-brand-600">
            50% Max DBR · +200bps Resilient
          </div>
        </div>
      </div>
    </div>
  );
}
