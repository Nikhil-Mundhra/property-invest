import { ArrowRight, Bot, Building2, Calculator, CheckCircle2, ChevronRight, FileCheck, Layers, Scale, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';

interface TriadOverviewSectionProps {
  onLearnMoreWorkflow?: () => void;
  onLearnMoreKnowledgeGraph?: () => void;
  onLearnMoreMITSloan?: () => void;
}

export function TriadOverviewSection({
  onLearnMoreWorkflow,
  onLearnMoreKnowledgeGraph,
  onLearnMoreMITSloan,
}: TriadOverviewSectionProps) {
  return (
    <section id="triad" className="py-20 sm:py-28 bg-surface-subtle/30 border-b border-line">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-600">
            The Three Foundational Pillars
          </span>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl lg:text-5xl">
            The Triad Architecture Required for Fiduciary Real Estate Execution
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
            Generic conversational bots hallucinate transaction fees, misquote Golden Visa eligibility,
            and ignore statutory banking constraints. Production-ready property intelligence requires three
            interdependent layers executing official UAE regulatory frameworks.
          </p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          {/* Pillar 1: Statutory Engine Kernel */}
          <div className="flex flex-col justify-between rounded-2xl border border-line bg-surface p-8 shadow-sm transition hover:shadow-md hover:border-brand-600/40">
            <div>
              <div className="flex size-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-600">
                <Scale className="size-6" />
              </div>

              <div className="mt-6 flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-600">
                  Pillar 1 · Statutory Kernel
                </span>
                <span className="rounded-control bg-brand-50 px-2 py-0.5 text-[11px] font-medium text-brand-700 dark:bg-brand-950 dark:text-brand-600">
                  Regulatory Precision
                </span>
              </div>

              <h3 className="mt-2 font-display text-xl font-semibold text-ink">
                Deterministic Statutory Rule Engines
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-muted">
                Encodes the February 2026 DLD Golden Visa circular, Central Bank of the UAE Circular No. 31/2013,
                and official Land Department fee tables into pure TypeScript functions. Computes exact liquid cash
                outlays, statutory down payments, and debt burden ratios with mathematical certainty.
              </p>

              <div className="mt-6 space-y-2 border-t border-line pt-4 text-xs text-subtle">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-brand-600 mt-0.5 shrink-0" />
                  <span>DLD 4% transfer fee, AED 580 admin, and tiered trustee fee schedules</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-brand-600 mt-0.5 shrink-0" />
                  <span>CBUAE 50% flat off-plan mortgage cap & 50% DBR debt burden ceiling</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-brand-600 mt-0.5 shrink-0" />
                  <span>2026 Golden Visa: AED 2M threshold with 0% minimum paid-up equity requirement</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-line">
              <button
                type="button"
                onClick={onLearnMoreWorkflow}
                className="inline-flex items-center gap-2 text-xs font-semibold text-brand-700 dark:text-brand-600 hover:underline cursor-pointer"
              >
                <span>Inspect DLD Fee Schedules</span>
                <ChevronRight className="size-3.5" />
              </button>
            </div>
          </div>

          {/* Pillar 2: Interactive Deal Room & Portfolio */}
          <div className="flex flex-col justify-between rounded-2xl border border-line bg-surface p-8 shadow-sm transition hover:shadow-md hover:border-brand-600/40">
            <div>
              <div className="flex size-12 items-center justify-center rounded-xl bg-gold-subtle text-gold">
                <Building2 className="size-6" />
              </div>

              <div className="mt-6 flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gold">
                  Pillar 2 · Deal Room & Portfolio
                </span>
                <span className="rounded-control bg-gold-subtle px-2 py-0.5 text-[11px] font-medium text-gold">
                  Asset Modeling
                </span>
              </div>

              <h3 className="mt-2 font-display text-xl font-semibold text-ink">
                Proportional Card Scaling & Stress Testing
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-muted">
                Clear dual-section organization separating owned holdings from planned acquisitions.
                Property cards scale dynamically (small to medium) relative to each asset's equity contribution.
                Interactive Deal Room features +100bps / +200bps interest rate stress tests and off-plan milestones.
              </p>

              <div className="mt-6 space-y-2 border-t border-line pt-4 text-xs text-subtle">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-gold mt-0.5 shrink-0" />
                  <span>Owned vs planned portfolio breakdown with equity-proportional visual weight</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-gold mt-0.5 shrink-0" />
                  <span>+100bps & +200bps mortgage interest rate shock sensitivity curves</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-gold mt-0.5 shrink-0" />
                  <span>Net yield underwriting factoring service charges & 2-month void rental haircut</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-line">
              <button
                type="button"
                onClick={onLearnMoreKnowledgeGraph}
                className="inline-flex items-center gap-2 text-xs font-semibold text-gold hover:underline cursor-pointer"
              >
                <span>Explore Deal Room Architecture</span>
                <ChevronRight className="size-3.5" />
              </button>
            </div>
          </div>

          {/* Pillar 3: Grounded AI Real Estate Copilot */}
          <div className="flex flex-col justify-between rounded-2xl border border-line bg-surface p-8 shadow-sm transition hover:shadow-md hover:border-brand-600/40">
            <div>
              <div className="flex size-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-600">
                <ShieldCheck className="size-6" />
              </div>

              <div className="mt-6 flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-600">
                  Pillar 3 · Calculation Shield
                </span>
                <span className="rounded-control bg-brand-50 px-2 py-0.5 text-[11px] font-medium text-brand-700 dark:bg-brand-950 dark:text-brand-600">
                  Grounded AI
                </span>
              </div>

              <h3 className="mt-2 font-display text-xl font-semibold text-ink">
                AI Copilot with Calculation Shield
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-muted">
                Combines high-touch conversational AI with an uncompromising neuro-symbolic calculation shield.
                Any response figures that deviate from pure deterministic statutory formulas are automatically
                intercepted and clamped to ground truth before reaching the investor.
              </p>

              <div className="mt-6 space-y-2 border-t border-line pt-4 text-xs text-subtle">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-brand-600 mt-0.5 shrink-0" />
                  <span>Deterministic calculation shield guarantees 100% numerical verification</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-brand-600 mt-0.5 shrink-0" />
                  <span>Personal housing total monthly cost of ownership (Mortgage + HOA + Utilities)</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-brand-600 mt-0.5 shrink-0" />
                  <span>Prime district benchmarking across Sobha Hartland, Dubai Hills & Palm Jebel Ali</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-line">
              <button
                type="button"
                onClick={onLearnMoreMITSloan}
                className="inline-flex items-center gap-2 text-xs font-semibold text-brand-700 dark:text-brand-600 hover:underline cursor-pointer"
              >
                <span>Read Statutory Methodology</span>
                <ChevronRight className="size-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
