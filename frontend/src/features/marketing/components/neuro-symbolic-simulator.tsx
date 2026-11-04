import { useState } from 'react';
import { AlertCircle, AlertTriangle, ArrowRight, Bot, Building2, CheckCircle2, ChevronRight, Cpu, HelpCircle, Layers, RefreshCcw, Scale, ShieldCheck, Sparkles, TrendingUp, XCircle } from 'lucide-react';

interface Scenario {
  id: string;
  title: string;
  category: string;
  userPrompt: string;
  rawLLM: {
    title: string;
    description: string;
    flaw: string;
    metric: string;
  };
  neuroSymbolic: {
    title: string;
    description: string;
    middleware: string;
    quantSolver: string;
    metric: string;
  };
}

const SCENARIOS: Scenario[] = [
  {
    id: 'golden-visa',
    title: 'Scenario 1: 2026 Golden Visa Eligibility',
    category: 'DLD Golden Visa',
    userPrompt: '"I am purchasing a 2-bedroom in Sobha Hartland for AED 2,200,000 with an AED 1,000,000 bank mortgage. Do I qualify for the 10-year UAE Golden Visa?"',
    rawLLM: {
      title: 'Erroneous Rejection (Outdated Heuristic)',
      description:
        'Hallucinates that the investor must pay AED 2,000,000 in liquid unencumbered cash upfront, rejecting mortgaged properties or demanding 50% paid equity.',
      flaw: 'Relies on pre-2024 regulations. Misses the 20 February 2026 DLD circular abolishing the minimum paid-up equity requirement on mortgaged purchases.',
      metric: 'False Negative · Lost AED 2.2M Transaction',
    },
    neuroSymbolic: {
      title: 'Qualified under 2026 DLD Circular',
      description:
        'Direct qualification verified. Title Deed / Oqood certified purchase value of AED 2,200,000 satisfies the AED 2,000,000 threshold. Bank NOC verified with standard down payment. DLD Cube fee: AED 9,884.75.',
      middleware: 'Extracted property valuation, mortgage structure, and certified Title Deed priors.',
      quantSolver: 'uae-golden-visa.rule.ts statutory engine.',
      metric: '100% Statutory Match · 10-Year Visa Secured',
    },
  },
  {
    id: 'off-plan-mortgage',
    title: 'Scenario 2: CBUAE Off-Plan Mortgage Borrowing',
    category: 'CBUAE Circular 31/2013',
    userPrompt: '"Can I obtain an 80% bank mortgage for a luxury villa in Palm Jebel Ali under construction?"',
    rawLLM: {
      title: 'Over-Leveraged Borrowing Advice',
      description:
        'Advises that UAE resident expats can borrow up to 80% LTV for properties under AED 5,000,000, completely ignoring off-plan statutory lending restrictions.',
      flaw: 'Critical regulatory breach. Violates Central Bank Circular No. 31/2013 Article 3, which caps off-plan residential mortgage lending at 50% flat LTV.',
      metric: 'AED 1,500,000 Cash Shortfall at Registration',
    },
    neuroSymbolic: {
      title: 'Strict 50% Off-Plan Statutory Cap Enforced',
      description:
        'Caps mortgage borrowing at 50% flat LTV (AED 2,500,000 maximum on AED 5,000,000 valuation). Computes exact liquid cash needed: 50% down payment + 4% DLD fee + AED 1,000 Oqood registration.',
      middleware: 'Injected property development status (Off-Plan) and borrower residency.',
      quantSolver: 'uae-mortgage.rule.ts statutory engine.',
      metric: 'Zero Default Risk · Fiduciary Down Payment Plan',
    },
  },
  {
    id: 'developer-friction',
    title: 'Scenario 3: Direct Developer vs Resale Cash Friction',
    category: 'DLD Acquisition Fees',
    userPrompt: '"What are my exact closing costs for buying directly from Emaar in Dubai Hills vs buying a ready resale unit?"',
    rawLLM: {
      title: 'Vague 5% to 7% Heuristic Rule-of-Thumb',
      description:
        'Quotes an approximate 6% closing cost estimate, adding a phantom 2% buyer broker commission on a direct developer purchase and misquoting trustee administrative charges.',
      flaw: 'Generic closing cost estimates fail to account for 0% buyer commission on developer off-plan, trustee fee exemptions, or exact DLD administrative fees.',
      metric: 'AED 54,000 Miscalculation on AED 2.7M Purchase',
    },
    neuroSymbolic: {
      title: 'Itemized Statutory Cost Schedules',
      description:
        'Developer direct: 4% DLD (AED 108,000) + AED 580 admin, 0% buyer broker fee, AED 1,000 Oqood registration (AED 109,580 total). Secondary resale: 4% DLD + 2% broker + 5% VAT + AED 4,200 trustee (AED 168,880 total).',
      middleware: 'Categorized transaction type (Direct Developer vs Secondary Resale).',
      quantSolver: 'uae-property-fees.rule.ts statutory engine.',
      metric: 'Exact Dirham Accuracy · Clear AED 59,300 Savings',
    },
  },
];

export function NeuroSymbolicSimulator() {
  const [selectedScenarioId, setSelectedScenarioId] = useState(SCENARIOS[0].id);
  const scenario = SCENARIOS.find((s) => s.id === selectedScenarioId) ?? SCENARIOS[0];

  return (
    <section id="simulator" className="py-20 sm:py-28 bg-surface border-b border-line">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-control border border-brand-600/20 bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-700 dark:bg-brand-950 dark:text-brand-600">
            <Cpu className="size-3.5" />
            <span>Interactive Simulator</span>
          </div>

          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl lg:text-5xl">
            Experience the Deterministic Underwriting Difference
          </h2>

          <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
            Compare side-by-side how unconstrained conversational LLMs produce costly hallucinations, while
            Syntropy's deterministic statutory engines deliver mathematical precision grounded in official UAE law.
          </p>
        </div>

        {/* Scenario Selection Tabs */}
        <div className="mt-10 flex flex-wrap gap-2 border-b border-line pb-4">
          {SCENARIOS.map((s) => {
            const isSelected = s.id === scenario.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelectedScenarioId(s.id)}
                className={`inline-flex items-center gap-2 rounded-field px-4 py-2 text-xs font-semibold transition cursor-pointer ${
                  isSelected
                    ? 'bg-brand-600 text-white shadow-xs dark:text-brand-950'
                    : 'bg-surface-subtle text-muted hover:text-ink hover:bg-surface border border-line'
                }`}
              >
                <span>{s.title}</span>
                <span className={`rounded-full px-1.5 py-0.2 text-[10px] ${isSelected ? 'bg-white/20 text-white dark:text-brand-950' : 'bg-line text-subtle'}`}>
                  {s.category}
                </span>
              </button>
            );
          })}
        </div>

        {/* User Prompt Box */}
        <div className="mt-6 rounded-card border border-line bg-surface-subtle p-5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-subtle">
            <Bot className="size-4 text-brand-600" />
            <span>Simulated Investor Inquiry</span>
          </div>
          <p className="mt-2 font-mono text-sm text-ink italic sm:text-base">
            {scenario.userPrompt}
          </p>
        </div>

        {/* Side-by-Side Comparison Grid */}
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {/* Card A: Raw LLM Output */}
          <div className="flex flex-col justify-between rounded-card border border-red-200 dark:border-red-950/60 bg-red-50/20 dark:bg-red-950/10 p-6 sm:p-8">
            <div>
              <div className="flex items-center justify-between gap-2 border-b border-red-200/60 dark:border-red-900/40 pb-4">
                <div className="flex items-center gap-2">
                  <div className="flex size-7 items-center justify-center rounded-control bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400">
                    <XCircle className="size-4" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-red-700 dark:text-red-400">
                    Standard Conversational LLM
                  </span>
                </div>
                <span className="rounded-control bg-red-100 dark:bg-red-950 px-2 py-0.5 text-[11px] font-semibold text-red-700 dark:text-red-400">
                  Hallucination Failure
                </span>
              </div>

              <h3 className="mt-5 text-base font-semibold text-ink sm:text-lg">
                {scenario.rawLLM.title}
              </h3>

              <p className="mt-3 text-xs leading-relaxed text-muted sm:text-sm">
                {scenario.rawLLM.description}
              </p>

              <div className="mt-6 rounded-control border border-red-200 dark:border-red-900/50 bg-surface p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="size-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-semibold text-red-700 dark:text-red-400">Regulatory & Financial Impact:</span>
                    <p className="mt-0.5 text-xs text-subtle leading-relaxed">{scenario.rawLLM.flaw}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-red-200/60 dark:border-red-900/40">
              <span className="text-xs font-mono font-bold text-red-700 dark:text-red-400">
                {scenario.rawLLM.metric}
              </span>
            </div>
          </div>

          {/* Card B: Syntropy Neuro-Symbolic Engine */}
          <div className="flex flex-col justify-between rounded-card border border-brand-600/30 bg-brand-50/10 dark:bg-brand-950/20 p-6 sm:p-8 relative overflow-hidden shadow-xs">
            <div>
              <div className="flex items-center justify-between gap-2 border-b border-brand-600/20 pb-4">
                <div className="flex items-center gap-2">
                  <div className="flex size-7 items-center justify-center rounded-control bg-brand-600 text-white dark:text-brand-950">
                    <ShieldCheck className="size-4" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-600">
                    Syntropy Statutory Engine
                  </span>
                </div>
                <span className="rounded-control bg-brand-50 dark:bg-brand-950 px-2 py-0.5 text-[11px] font-semibold text-brand-700 dark:text-brand-600 border border-brand-600/20">
                  Fiduciary Underwriting
                </span>
              </div>

              <h3 className="mt-5 text-base font-semibold text-ink sm:text-lg">
                {scenario.neuroSymbolic.title}
              </h3>

              <p className="mt-3 text-xs leading-relaxed text-muted sm:text-sm">
                {scenario.neuroSymbolic.description}
              </p>

              <div className="mt-6 space-y-3">
                <div className="rounded-control border border-line bg-surface p-3 text-xs">
                  <span className="font-semibold text-ink">Calculation Shield: </span>
                  <span className="text-muted">{scenario.neuroSymbolic.middleware}</span>
                </div>
                <div className="rounded-control border border-line bg-surface p-3 text-xs">
                  <span className="font-semibold text-ink">Statutory Solver: </span>
                  <span className="font-mono text-brand-700 dark:text-brand-600">{scenario.neuroSymbolic.quantSolver}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-brand-600/20">
              <span className="text-xs font-mono font-bold text-brand-700 dark:text-brand-600">
                {scenario.neuroSymbolic.metric}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
