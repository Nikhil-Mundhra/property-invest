import { useState } from 'react';
import { Building2, Calculator, CheckCircle2, Clock, FileCheck, FileSpreadsheet, FileText, Scale, ShieldCheck, Sparkles, UserCheck } from 'lucide-react';
import advisorMeetingImg from '../../../assets/advisor-meeting.jpg';

export function AdvisorLifecycleSection() {
  const [activeStage, setActiveStage] = useState<'transfer' | 'trustee' | 'financing'>('transfer');

  return (
    <div className="bg-surface rounded-card border border-line p-6 sm:p-8">
      {/* Header */}
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-control border border-brand-600/20 bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-700 dark:bg-brand-950 dark:text-brand-600">
          <Scale className="size-3.5" />
          <span>Statutory Acquisition Friction</span>
        </div>

        <h3 className="mt-4 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Official Dubai Land Department Fee Schedules
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">
          Every dirham in the transaction is deterministically computed. Pure TypeScript formulas calculate
          mandatory DLD transfer charges, administrative fees, tiered trustee costs, and mortgage registration friction.
        </p>
      </div>

      {/* 16:9 Showcase Image */}
      <div className="mt-6 overflow-hidden rounded-card border border-line bg-surface shadow-xs">
        <img
          src={advisorMeetingImg}
          alt="Advisor and client conducting an institutional wealth review in a panoramic modern office"
          loading="lazy"
          className="aspect-[16/9] w-full object-cover max-h-[380px]"
        />
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line bg-surface-subtle px-4 py-2.5 sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="size-2 rounded-full bg-brand-600" />
            <p className="text-xs text-ink">
              <span className="font-semibold">Statutory Calculator Kernel</span> · Deterministic DLD & CBUAE underwriting
            </p>
          </div>
          <span className="text-[11px] font-medium text-subtle">
            Verified under Law No. 7 of 2006
          </span>
        </div>
      </div>

      {/* 3-Stage Interactive Selector */}
      <div className="mt-8 grid gap-6 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-8">
          <div className="flex rounded-control border border-line bg-surface-subtle p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveStage('transfer')}
              className={`flex-1 rounded-control py-2.5 transition-all cursor-pointer ${
                activeStage === 'transfer'
                  ? 'bg-surface text-ink shadow-xs border border-line'
                  : 'text-muted hover:text-ink'
              }`}
            >
              1. DLD 4% Transfer & Admin
            </button>
            <button
              type="button"
              onClick={() => setActiveStage('trustee')}
              className={`flex-1 rounded-control py-2.5 transition-all cursor-pointer ${
                activeStage === 'trustee'
                  ? 'bg-surface text-ink shadow-xs border border-line'
                  : 'text-muted hover:text-ink'
              }`}
            >
              2. Registration Trustee Fees
            </button>
            <button
              type="button"
              onClick={() => setActiveStage('financing')}
              className={`flex-1 rounded-control py-2.5 transition-all cursor-pointer ${
                activeStage === 'financing'
                  ? 'bg-surface text-ink shadow-xs border border-line'
                  : 'text-muted hover:text-ink'
              }`}
            >
              3. Mortgage Registration Friction
            </button>
          </div>

          <div className="mt-6 rounded-card border border-line bg-surface-subtle p-6">
            {activeStage === 'transfer' && (
              <div>
                <h4 className="text-base font-semibold text-ink">Dubai Land Department Transfer Fee</h4>
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  Law No. 7 of 2006 mandates a 4% transfer fee calculated against the contract purchase price or official DLD valuation.
                  An additional administrative fee of AED 580 is levied for Title Deed issuance on ready properties or AED 40 for off-plan Oqood.
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-control border border-line bg-surface p-3 text-xs">
                    <span className="font-semibold text-ink">4.0% Transfer Fee: </span>
                    <span className="text-muted">Standard DLD transfer tax split or paid by buyer per contract</span>
                  </div>
                  <div className="rounded-control border border-line bg-surface p-3 text-xs">
                    <span className="font-semibold text-ink">AED 580 Admin Fee: </span>
                    <span className="text-muted">Knowledge & innovation dirhams fee on Title Deed transfer</span>
                  </div>
                </div>
              </div>
            )}

            {activeStage === 'trustee' && (
              <div>
                <h4 className="text-base font-semibold text-ink">DLD Registration Trustee Office Fees</h4>
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  Resale transactions processed through authorized DLD Registration Trustee centers incur standardized statutory fees
                  tiered by property price bracket plus 5% UAE VAT. Direct developer off-plan purchases are exempt.
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-control border border-line bg-surface p-3 text-xs">
                    <span className="font-semibold text-ink">AED 4,000 + 5% VAT (AED 4,200): </span>
                    <span className="text-muted">Applicable for property transactions equal to or exceeding AED 500,000</span>
                  </div>
                  <div className="rounded-control border border-line bg-surface p-3 text-xs">
                    <span className="font-semibold text-ink">AED 2,000 + 5% VAT (AED 2,100): </span>
                    <span className="text-muted">Applicable for property transactions below AED 500,000</span>
                  </div>
                </div>
              </div>
            )}

            {activeStage === 'financing' && (
              <div>
                <h4 className="text-base font-semibold text-ink">Mortgage Financing Registration & Friction</h4>
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  Financed acquisitions require mortgage registration with the Land Department. The statutory rate is 0.25% of the loan
                  balance plus AED 290 administrative fee, alongside standard bank valuation and processing fees.
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-control border border-line bg-surface p-3 text-xs">
                    <span className="font-semibold text-ink">0.25% + AED 290: </span>
                    <span className="text-muted">DLD statutory mortgage registration on loan principal</span>
                  </div>
                  <div className="rounded-control border border-line bg-surface p-3 text-xs">
                    <span className="font-semibold text-ink">AED 3,000 + 0.75%: </span>
                    <span className="text-muted">Standard bank property valuation & processing fees</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Key Summary */}
        <div className="lg:col-span-4 rounded-card border border-line bg-surface-subtle p-6">
          <h4 className="text-sm font-semibold text-ink uppercase tracking-wider">Acquisition Takeaways</h4>
          <ul className="mt-4 space-y-3 text-xs text-muted">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="size-4 text-brand-600 mt-0.5 shrink-0" />
              <span>Direct developer off-plan purchases incur <strong>0% buyer broker fee</strong>.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="size-4 text-brand-600 mt-0.5 shrink-0" />
              <span>February 2025 CBUAE mandate enforces liquid cash payment of all upfront closing fees.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="size-4 text-brand-600 mt-0.5 shrink-0" />
              <span>All statutory costs are modeled in `uae-property-fees.rule.ts` with zero hallucination.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
