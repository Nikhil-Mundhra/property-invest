import { Activity, BellRing, Building2, CheckCircle2, Database, FileSpreadsheet, GitBranch, HeartHandshake, Layers, MapPin, Network, Sparkles, TrendingUp, Zap } from 'lucide-react';

export function KnowledgeGraphSection() {
  const districts = [
    { name: 'Sobha Hartland', type: 'Waterfront & Greenery', yield: '6.8% Net', highlight: 'Prime location, MBR City lagoon' },
    { name: 'Dubai Hills Estate', type: 'Master-Planned Community', yield: '6.2% Net', highlight: 'Championship golf course & parks' },
    { name: 'Palm Jebel Ali', type: 'Ultra-Luxury Coastal', yield: '5.5% Net', highlight: 'Off-plan megaproject, private beaches' },
    { name: 'Creek Harbour', type: 'Urban Waterfront', yield: '6.9% Net', highlight: 'Skyline views, high capital upside' },
    { name: 'Jumeirah Village Circle', type: 'High Cashflow Yield', yield: '8.4% Net', highlight: 'Mass-affluent tenant demand' },
    { name: 'Downtown Dubai', type: 'Iconic Prime Asset', yield: '5.8% Net', highlight: 'Burj Khalifa & Dubai Mall adjacency' },
  ];

  return (
    <div className="bg-surface rounded-card border border-line p-6 sm:p-8">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
        {/* Left Column: Narrative & 5-Step Roadmap */}
        <div className="lg:col-span-6">
          <div className="inline-flex items-center gap-2 rounded-control border border-gold/30 bg-gold-subtle px-3 py-1 text-xs font-bold uppercase tracking-wider text-gold">
            <Building2 className="size-3.5" />
            <span>Market Intelligence & Execution</span>
          </div>

          <h3 className="mt-4 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Prime Dubai District Intelligence & 5-Step Acquisition Plan
          </h3>

          <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">
            Navigating Dubai's real estate ecosystem requires deep micro-market intelligence.
            Our platform couples hyper-localized district yields with a transparent 5-step roadmap.
          </p>

          <div className="mt-6 space-y-3">
            <div className="flex gap-3 rounded-control border border-line bg-surface-subtle p-3.5">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white dark:text-brand-950">1</span>
              <div>
                <h4 className="text-xs font-semibold text-ink">Purchasing Power & Liquid Budgeting</h4>
                <p className="mt-0.5 text-xs text-muted">Determine max borrowing capacity under 50% DBR limits and total liquid closing friction.</p>
              </div>
            </div>

            <div className="flex gap-3 rounded-control border border-line bg-surface-subtle p-3.5">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white dark:text-brand-950">2</span>
              <div>
                <h4 className="text-xs font-semibold text-ink">Statutory Readiness & Golden Visa Review</h4>
                <p className="mt-0.5 text-xs text-muted">Structure the purchase value to cross the AED 2M threshold under the 2026 DLD circular.</p>
              </div>
            </div>

            <div className="flex gap-3 rounded-control border border-line bg-surface-subtle p-3.5">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white dark:text-brand-950">3</span>
              <div>
                <h4 className="text-xs font-semibold text-ink">District & Asset Class Selection</h4>
                <p className="mt-0.5 text-xs text-muted">Benchmark off-plan payment plans against secondary ready inventory across prime Dubai corridors.</p>
              </div>
            </div>

            <div className="flex gap-3 rounded-control border border-line bg-surface-subtle p-3.5">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white dark:text-brand-950">4</span>
              <div>
                <h4 className="text-xs font-semibold text-ink">Financing, Oqood & Trustee Closing</h4>
                <p className="mt-0.5 text-xs text-muted">Secure bank pre-approval, register initial contracts, and complete DLD trustee signoff.</p>
              </div>
            </div>

            <div className="flex gap-3 rounded-control border border-line bg-surface-subtle p-3.5">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white dark:text-brand-950">5</span>
              <div>
                <h4 className="text-xs font-semibold text-ink">Handover, Ejari & Yield Optimization</h4>
                <p className="mt-0.5 text-xs text-muted">Execute unit snagging, Title Deed issuance, and lease placement with 2-month void allowances.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Dubai District Matrix */}
        <div className="lg:col-span-6 rounded-card border border-line bg-surface-subtle p-6">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-ink">Prime District Benchmarks</span>
            <span className="text-[11px] text-brand-700 dark:text-brand-600 font-semibold">Underwritten Net Yield</span>
          </div>

          <div className="mt-4 space-y-3">
            {districts.map((d) => (
              <div key={d.name} className="rounded-control border border-line bg-surface p-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <MapPin className="size-3.5 text-brand-600" />
                    <span className="text-xs font-semibold text-ink">{d.name}</span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-subtle">{d.type} · {d.highlight}</p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs font-bold text-brand-700 dark:text-brand-600">{d.yield}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
