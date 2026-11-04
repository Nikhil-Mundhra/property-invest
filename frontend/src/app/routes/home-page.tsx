import { lazy, Suspense, useState } from 'react';
import { ArrowRight, Building2, CheckCircle2, ChevronRight, FileCheck, Layers, MapPin, Percent, Scale, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';
import { Link } from 'react-router';
import { DocumentationSection, type DocSubtab } from '../../features/marketing/components/documentation-section.tsx';
import { HomepageFooter } from '../../features/marketing/components/homepage-footer.tsx';
import { HomepageHero } from '../../features/marketing/components/homepage-hero.tsx';
import { HomepageNav } from '../../features/marketing/components/homepage-nav.tsx';
import { NeuroSymbolicSimulator } from '../../features/marketing/components/neuro-symbolic-simulator.tsx';
import { TriadOverviewSection } from '../../features/marketing/components/triad-overview-section.tsx';

const ParticlesBackground = lazy(() =>
  import('../../features/marketing/components/particles-background.tsx').then((m) => ({
    default: m.ParticlesBackground,
  }))
);

export function HomePage() {
  const [activeDocSubtab, setActiveDocSubtab] = useState<DocSubtab>('lifecycle');

  const handleNavigate = (id: string, subtab?: string) => {
    const docSubtabs: DocSubtab[] = ['lifecycle', 'blueprint', 'mit-sloan', 'compliance', 'positioning', 'knowledge-graph'];
    let targetId = id;
    let targetSubtab = subtab;

    if (docSubtabs.includes(id as DocSubtab)) {
      targetId = 'documentation';
      targetSubtab = id as DocSubtab;
    }

    if (targetSubtab) {
      setActiveDocSubtab(targetSubtab as DocSubtab);
    }
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView?.({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-dvh bg-surface text-ink antialiased selection:bg-brand-600 selection:text-white">
      {/* Streamlined Sticky Header Navigation with Documentation tab */}
      <HomepageNav onNavigateSection={handleNavigate} />

      {/* Main Page Flow */}
      <main className="relative">
        {/* Lazy-loaded browser-side compute particle network */}
        <Suspense fallback={null}>
          <ParticlesBackground />
        </Suspense>

        {/* Hero Section */}
        <HomepageHero onScrollTo={handleNavigate} />

        {/* The 3 Core Pillars */}
        <TriadOverviewSection
          onLearnMoreWorkflow={() => handleNavigate('documentation', 'lifecycle')}
          onLearnMoreKnowledgeGraph={() => handleNavigate('documentation', 'knowledge-graph')}
          onLearnMoreMITSloan={() => handleNavigate('documentation', 'mit-sloan')}
        />

        {/* Deal Room & Portfolio Showcase Section */}
        <section id="deal-room" className="py-20 sm:py-28 bg-surface border-b border-line">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-control border border-brand-600/20 bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-700 dark:bg-brand-950 dark:text-brand-600">
                <Building2 className="size-3.5" />
                <span>Portfolio Management & Underwriting</span>
              </div>

              <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl lg:text-5xl">
                Proportional Portfolio Modeling & Interactive Deal Room
              </h2>

              <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
                Organize owned properties and planned acquisitions with clear dual-section visual separation.
                Cards dynamically scale (small to medium) relative to each asset's equity contribution, with deep-dive
                Deal Room analytics for interest rate stress tests and off-plan milestone tracking.
              </p>
            </div>

            {/* Deal Room Showcase Grid */}
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Asset 1: Sobha Hartland */}
              <div className="rounded-card border border-line bg-surface-subtle p-6 transition hover:border-brand-600/40 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-control bg-brand-50 dark:bg-brand-950 border border-brand-600/20 px-2 py-0.5 text-[11px] font-semibold text-brand-700 dark:text-brand-600">
                      Owned Portfolio
                    </span>
                    <span className="text-xs font-mono font-bold text-ink">AED 2,200,000</span>
                  </div>

                  <h3 className="mt-4 text-base font-semibold text-ink">Sobha Hartland Greens</h3>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-subtle">
                    <MapPin className="size-3.5 text-brand-600" />
                    <span>Sobha Hartland · 2-Bed Luxury Apartment</span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2 border-y border-line py-3 text-xs">
                    <div>
                      <span className="text-subtle">Net Yield:</span>
                      <p className="font-semibold text-brand-700 dark:text-brand-600 font-mono">6.8% Net</p>
                    </div>
                    <div>
                      <span className="text-subtle">Golden Visa:</span>
                      <p className="font-semibold text-ink flex items-center gap-1">
                        <CheckCircle2 className="size-3.5 text-brand-600" />
                        Qualified
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-[11px] text-muted">
                  Equity Share: 52% of portfolio · Mortgaged (CBUAE compliant)
                </div>
              </div>

              {/* Asset 2: Dubai Hills Estate */}
              <div className="rounded-card border border-line bg-surface-subtle p-6 transition hover:border-brand-600/40 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-control bg-brand-50 dark:bg-brand-950 border border-brand-600/20 px-2 py-0.5 text-[11px] font-semibold text-brand-700 dark:text-brand-600">
                      Owned Portfolio
                    </span>
                    <span className="text-xs font-mono font-bold text-ink">AED 1,450,000</span>
                  </div>

                  <h3 className="mt-4 text-base font-semibold text-ink">Dubai Hills Park Ridge</h3>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-subtle">
                    <MapPin className="size-3.5 text-brand-600" />
                    <span>Dubai Hills Estate · 1-Bed Golf Community</span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2 border-y border-line py-3 text-xs">
                    <div>
                      <span className="text-subtle">Net Yield:</span>
                      <p className="font-semibold text-brand-700 dark:text-brand-600 font-mono">6.2% Net</p>
                    </div>
                    <div>
                      <span className="text-subtle">Service Charge:</span>
                      <p className="font-semibold text-ink font-mono">AED 16 / sqft</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-[11px] text-muted">
                  Equity Share: 34% of portfolio · 2-month void haircut underwritten
                </div>
              </div>

              {/* Asset 3: Palm Jebel Ali */}
              <div className="rounded-card border border-line bg-surface-subtle p-6 transition hover:border-brand-600/40 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-control bg-gold-subtle border border-gold/30 px-2 py-0.5 text-[11px] font-semibold text-gold">
                      Planned Acquisition
                    </span>
                    <span className="text-xs font-mono font-bold text-ink">AED 18,500,000</span>
                  </div>

                  <h3 className="mt-4 text-base font-semibold text-ink">Palm Jebel Ali Beach Villa</h3>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-subtle">
                    <MapPin className="size-3.5 text-gold" />
                    <span>Palm Jebel Ali · 5-Bed Ultra-Luxury Off-Plan</span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2 border-y border-line py-3 text-xs">
                    <div>
                      <span className="text-subtle">Financing:</span>
                      <p className="font-semibold text-ink">50% Off-Plan Cap</p>
                    </div>
                    <div>
                      <span className="text-subtle">Broker Fee:</span>
                      <p className="font-semibold text-brand-700 dark:text-brand-600">0% Direct Dev</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-[11px] text-muted">
                  80/20 Construction milestone plan · Oqood registration certified
                </div>
              </div>
            </div>

            <div className="mt-10 text-center">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-field bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 dark:text-brand-950"
              >
                <span>Launch Deal Room & Underwrite Assets</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Interactive Neuro-Symbolic Simulator Playground */}
        <NeuroSymbolicSimulator />

        {/* Dedicated Documentation Hub with Interactive Subtabs */}
        <DocumentationSection
          activeSubtab={activeDocSubtab}
          onSubtabChange={setActiveDocSubtab}
        />

        {/* Institutional Call to Action */}
        <section className="border-t border-line bg-surface-subtle py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <span className="inline-flex items-center gap-1.5 rounded-control border border-line bg-surface px-3 py-1 text-xs font-medium text-ink">
              <Building2 className="size-3.5 text-brand-600" />
              <span>Dubai Real Estate Intelligence Prototype</span>
            </span>

            <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Underwrite Your Dubai Real Estate Portfolio with Statutory Precision.
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted">
              Eliminate guesswork and hallucination. Calculate exact DLD acquisition costs, verify 2026 Golden Visa qualification,
              and model CBUAE mortgage cashflows with pure deterministic rules.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-field bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 dark:text-brand-950"
              >
                <span>Launch Interactive Deal Room</span>
                <ArrowRight className="size-4" />
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-field border border-line bg-surface px-5 py-2.5 text-sm font-medium text-ink transition hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
              >
                <span>Sign In to Platform</span>
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-subtle">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-brand-600" />
                Deterministic Calculation Shield
              </span>
              <span className="flex items-center gap-1.5">
                <Scale className="size-4 text-brand-600" />
                DLD 2026 Statutory Compliance
              </span>
              <span className="flex items-center gap-1.5">
                <Building2 className="size-4 text-brand-600" />
                CBUAE Circular No. 31/2013 Verified
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <HomepageFooter />
    </div>
  );
}
