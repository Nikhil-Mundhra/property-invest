import { Briefcase, Building2, Check, Scale, Shield, Sparkles, User, Users } from 'lucide-react';
import { useState } from 'react';

export function PositioningMatrixSection() {
  const [selectedWedge, setSelectedWedge] = useState<'b2b2c' | 'b2c'>('b2b2c');

  return (
    <div className="bg-surface rounded-card border border-line p-6 sm:p-8">
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-control border border-gold/30 bg-gold-subtle px-3 py-1 text-xs font-bold uppercase tracking-wider text-gold">
          <Scale className="size-3.5" />
          <span>Strategic Positioning</span>
        </div>

        <h3 className="mt-4 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Choose Your Wedge: B2B2C Co-Pilot vs. Direct B2C Platform
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">
          Our architecture supports both institutional brokerage enablement and self-directed investor platforms
          with identical underlying statutory underwriting kernels.
        </p>
      </div>

      {/* Wedge Comparison Cards */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* B2B2C Card */}
        <div
          className={`rounded-card border p-6 sm:p-8 transition-colors ${
            selectedWedge === 'b2b2c'
              ? 'border-brand-600 bg-surface shadow-xs'
              : 'border-line bg-surface-subtle'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-control bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-600">
                <Building2 className="size-5" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-ink">B2B2C Advisor Co-Pilot</h3>
                <p className="text-xs text-subtle">Real Estate Brokerage & Wealth Practice Deal Room</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSelectedWedge('b2b2c')}
              className={`rounded-control px-3 py-1 text-xs font-semibold cursor-pointer ${
                selectedWedge === 'b2b2c'
                  ? 'bg-brand-600 text-white dark:text-brand-950'
                  : 'bg-surface border border-line text-subtle hover:text-ink'
              }`}
            >
              {selectedWedge === 'b2b2c' ? 'Selected' : 'Select'}
            </button>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-subtle">Core Value Proposition</p>
              <p className="mt-1 text-sm font-semibold text-ink">
                Empowers brokers and advisors to underwrite multi-million dirham acquisitions with instant DLD friction and CBUAE statutory compliance.
              </p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-subtle">Primary Moats</p>
              <p className="mt-1 text-sm text-muted">
                Interactive Deal Room, live mortgage amortization tables, +200bps rate shock testing, and deterministic Golden Visa eligibility verification.
              </p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-subtle">Fiduciary & Regulatory Safety</p>
              <div className="mt-1 flex items-center gap-2 text-sm font-medium text-ink">
                <Shield className="size-4 shrink-0 text-brand-600" />
                <span>Supervised execution: human advisor or broker guides the deal while the calculation shield verifies statutory figures.</span>
              </div>
            </div>

            <div className="border-t border-line pt-4 text-xs text-subtle space-y-2">
              <div className="flex items-center gap-2">
                <Check className="size-4 text-brand-600 shrink-0" />
                <span>Zero AI hallucination on DLD fees or Golden Visa thresholds</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="size-4 text-brand-600 shrink-0" />
                <span>Automated off-plan milestone payment tracking & Oqood certification</span>
              </div>
            </div>
          </div>
        </div>

        {/* B2C Card */}
        <div
          className={`rounded-card border p-6 sm:p-8 transition-colors ${
            selectedWedge === 'b2c'
              ? 'border-brand-600 bg-surface shadow-xs'
              : 'border-line bg-surface-subtle'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-gold-subtle text-gold">
                <User className="size-5" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-ink">B2C Direct Wealth Advisor</h3>
                <p className="text-xs text-subtle">Self-Directed Real Estate Investor & Home Buyer Platform</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSelectedWedge('b2c')}
              className={`rounded-control px-3 py-1 text-xs font-semibold cursor-pointer ${
                selectedWedge === 'b2c'
                  ? 'bg-brand-600 text-white dark:text-brand-950'
                  : 'bg-surface border border-line text-subtle hover:text-ink'
              }`}
            >
              {selectedWedge === 'b2c' ? 'Selected' : 'Select'}
            </button>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-subtle">Core Value Proposition</p>
              <p className="mt-1 text-sm font-semibold text-ink">
                Gives everyday buyers institutional-grade underwriting tools: 5-step layman acquisition roadmap, purchasing power calculator, and AI copilot.
              </p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-subtle">Primary Moats</p>
              <p className="mt-1 text-sm text-muted">
                Direct developer off-plan 0% commission savings, personal housing total cost of ownership models, and neighborhood lifestyle matching.
              </p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-subtle">Fiduciary & Regulatory Safety</p>
              <div className="mt-1 flex items-center gap-2 text-sm font-medium text-amber-600 dark:text-amber-400">
                <Shield className="size-4 shrink-0" />
                <span>Deterministic rules engine prevents over-leveraging and protects buyers against unforeseen closing cash requirements.</span>
              </div>
            </div>

            <div className="border-t border-line pt-4 text-xs text-subtle space-y-2">
              <div className="flex items-center gap-2">
                <Check className="size-4 text-brand-600 shrink-0" />
                <span>Direct self-service property management & net rental yield tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="size-4 text-brand-600 shrink-0" />
                <span>Proportional portfolio visualizer across prime Dubai districts</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
