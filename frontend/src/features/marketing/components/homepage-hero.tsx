import { ArrowRight, Building2, CheckCircle2, ChevronRight, Cpu, Layers, Lock, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router';

interface HomepageHeroProps {
  onScrollTo: (id: string, subtab?: string) => void;
}

export function HomepageHero({ onScrollTo }: HomepageHeroProps) {
  return (
    <section className="relative pt-12 pb-16 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-28 border-b border-line">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 rounded-control border border-line bg-surface-subtle px-3 py-1 text-xs font-medium text-ink">
            <Building2 className="size-3.5 text-brand-600" />
            <span>Dubai Real Estate Intelligence</span>
            <span className="text-subtle">·</span>
            <span className="text-subtle">DLD Certified · CBUAE Circular 31/2013 · 2026 Golden Visa</span>
          </div>

          {/* Main Title */}
          <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight text-ink sm:text-6xl sm:leading-[1.15] lg:text-7xl">
            Hyper-personalized Dubai real estate investment and acquisition.
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            Models narrate. Statutory engines compute. Underwrite off-plan and ready properties with
            deterministic DLD transfer friction, Central Bank mortgage caps, and official 2026 Golden Visa
            qualification.
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 rounded-field bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 dark:text-brand-950"
            >
              <span>Launch Deal Room</span>
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>

            <button
              type="button"
              onClick={() => onScrollTo('simulator')}
              className="inline-flex items-center gap-2 rounded-field border border-line bg-surface px-5 py-2.5 text-sm font-medium text-ink transition hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 cursor-pointer"
            >
              <Cpu className="size-4 text-brand-600" aria-hidden="true" />
              <span>Test Statutory Simulator</span>
            </button>

            <button
              type="button"
              onClick={() => onScrollTo('documentation', 'lifecycle')}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium text-subtle transition hover:text-ink cursor-pointer"
            >
              <span>View Statutory Rules</span>
              <ChevronRight className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Live Architecture Flow Banner */}
        <div className="mt-14 sm:mt-16">
          <div className="mx-auto max-w-5xl rounded-card border border-line bg-surface p-6 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-control bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-600">
                  <Layers className="size-5" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-ink">Neuro-Symbolic Underwriting Architecture</h2>
                  <p className="text-xs text-subtle">Conversational intake → Active calculation shield → Deterministic statutory kernel</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-control border border-line bg-surface-subtle px-2.5 py-0.5 text-xs font-medium text-ink">
                  <ShieldCheck className="size-3.5 text-brand-600" />
                  DLD Certified Formulas
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-control border border-line bg-surface-subtle px-2.5 py-0.5 text-xs font-medium text-ink">
                  <Lock className="size-3.5 text-gold" />
                  Zero AI Hallucination
                </span>
              </div>
            </div>

            {/* 3-Step Pipeline Card Grid */}
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {/* Step 1 */}
              <div className="rounded-control border border-line bg-surface-subtle p-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700 dark:text-brand-600">
                  Layer 1 · Statutory Kernel
                </span>
                <h3 className="mt-2 text-sm font-semibold text-ink">Deterministic Rules</h3>
                <p className="mt-1 text-xs text-subtle">
                  Official DLD 4% transfer fee, AED 580 admin, trustee fees, and CBUAE Circular 31/2013 LTV/DBR ceilings.
                </p>
                <div className="mt-3 text-xs font-medium text-muted">
                  Pure TypeScript · 100% verified
                </div>
              </div>

              {/* Step 2 */}
              <div className="rounded-control border border-line bg-surface-subtle p-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gold">
                  Layer 2 · Deal Room & Portfolio
                </span>
                <h3 className="mt-2 text-sm font-semibold text-ink">Proportional Asset Modeling</h3>
                <p className="mt-1 text-xs text-subtle">
                  Proportional card sizing by client equity, +100bps/+200bps mortgage stress tests, and milestone tracking.
                </p>
                <div className="mt-3 text-xs font-medium text-muted">
                  Owned vs. planned acquisitions
                </div>
              </div>

              {/* Step 3 */}
              <div className="rounded-control border border-line bg-surface-subtle p-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700 dark:text-brand-600">
                  Layer 3 · Grounded AI Copilot
                </span>
                <h3 className="mt-2 text-sm font-semibold text-ink">Calculation Shield</h3>
                <p className="mt-1 text-xs text-subtle">
                  Active numerical shield strips any unverified numbers. LLMs narrate personalized strategy without hallucination.
                </p>
                <div className="mt-3 text-xs font-medium text-muted">
                  Strict fiduciary safety guardrails
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Statutory Metrics Strip */}
        <div className="mt-14 border-y border-line py-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 text-center">
            <div className="p-2">
              <p className="font-display text-3xl font-bold tracking-tight text-ink tabular-nums sm:text-4xl">AED 2M</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-subtle">2026 Golden Visa</p>
              <p className="mt-0.5 text-xs text-muted">0% minimum paid-up equity requirement</p>
            </div>
            <div className="p-2">
              <p className="font-display text-3xl font-bold tracking-tight text-brand-700 dark:text-brand-600 tabular-nums sm:text-4xl">50%</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-subtle">Off-Plan LTV Cap</p>
              <p className="mt-0.5 text-xs text-muted">CBUAE Circular No. 31/2013 Article 3</p>
            </div>
            <div className="p-2">
              <p className="font-display text-3xl font-bold tracking-tight text-ink tabular-nums sm:text-4xl">4% + 580</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-subtle">DLD Statutory Friction</p>
              <p className="mt-0.5 text-xs text-muted">Registration, admin, and trustee fees</p>
            </div>
            <div className="p-2">
              <p className="font-display text-3xl font-bold tracking-tight text-ink tabular-nums sm:text-4xl">100%</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-subtle">Calculation Shielded</p>
              <p className="mt-0.5 text-xs text-muted">Zero LLM calculation hallucination</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
