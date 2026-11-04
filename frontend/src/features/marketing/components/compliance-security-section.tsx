import { Calculator, CheckCircle2, DollarSign, HelpCircle, Percent, ShieldCheck, TrendingUp } from 'lucide-react';

export function ComplianceSecuritySection() {
  return (
    <div className="bg-surface rounded-card border border-line p-6 sm:p-8">
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-control border border-brand-600/20 bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-700 dark:bg-brand-950 dark:text-brand-600">
          <Calculator className="size-3.5" />
          <span>Fiduciary Cashflow Underwriting</span>
        </div>

        <h3 className="mt-4 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Net Rental Yields & Prudent Void Haircut Modeling
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">
          Promotional broker listings advertise inflated gross yields of 8% to 10% that ignore operating expenses.
          Syntropy underwrites net yield factoring official community service charges and a mandatory 2-month void period.
        </p>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Card 1: Gross vs Net Yield */}
        <div className="rounded-card border border-line bg-surface-subtle p-6 flex flex-col justify-between">
          <div>
            <div className="flex size-10 items-center justify-center rounded-control bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-600">
              <Percent className="size-5" />
            </div>
            <h4 className="mt-4 text-base font-semibold text-ink">Gross vs. Net Yield</h4>
            <p className="mt-2 text-xs leading-relaxed text-muted">
              Gross yield only divides headline annual rent by purchase price. Net yield deducts mandatory community service charges,
              maintenance reserves, and statutory property insurance to derive true Net Operating Income (NOI).
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-line text-xs font-mono font-bold text-brand-700 dark:text-brand-600">
            NOI / Total Cost = True Net Yield
          </div>
        </div>

        {/* Card 2: Community Service Charges */}
        <div className="rounded-card border border-line bg-surface-subtle p-6 flex flex-col justify-between">
          <div>
            <div className="flex size-10 items-center justify-center rounded-control bg-gold-subtle text-gold">
              <DollarSign className="size-5" />
            </div>
            <h4 className="mt-4 text-base font-semibold text-ink">Community Service Charges</h4>
            <p className="mt-2 text-xs leading-relaxed text-muted">
              Service charges vary significantly by district and building grade, from AED 12/sqft in Jumeirah Village Circle
              to AED 22 to 30/sqft in Downtown Dubai and Dubai Marina. Our engine models exact square-footage maintenance costs.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-line text-xs font-mono font-bold text-gold">
            AED 12 to AED 30 / sqft / Year
          </div>
        </div>

        {/* Card 3: 2-Month Void Haircut */}
        <div className="rounded-card border border-line bg-surface-subtle p-6 flex flex-col justify-between">
          <div>
            <div className="flex size-10 items-center justify-center rounded-control bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-600">
              <ShieldCheck className="size-5" />
            </div>
            <h4 className="mt-4 text-base font-semibold text-ink">2-Month Void Haircut</h4>
            <p className="mt-2 text-xs leading-relaxed text-muted">
              Conservative institutional underwriting applies a mandatory 2-month vacancy haircut (16.7% annual rent deduction)
              to absorb tenant transitions, lease negotiations, and Ejari registration gaps without cashflow stress.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-line text-xs font-mono font-bold text-brand-700 dark:text-brand-600">
            Prudent Stress-Tested Cashflow
          </div>
        </div>
      </div>
    </div>
  );
}
