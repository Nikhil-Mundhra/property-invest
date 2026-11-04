import { useState } from 'react';
import { BookOpen, Building2, Calculator, ChevronRight, Cpu, Layers, Network, Scale, ShieldCheck, Workflow } from 'lucide-react';
import { AdvisorLifecycleSection } from './advisor-lifecycle-section.tsx';
import { MITSloanShockSection } from './mit-sloan-shock-section.tsx';
import { KnowledgeGraphSection } from './knowledge-graph-section.tsx';
import { PositioningMatrixSection } from './positioning-matrix-section.tsx';
import { ComplianceSecuritySection } from './compliance-security-section.tsx';
import { ExecutionBlueprintSection } from './execution-blueprint-section.tsx';

export type DocSubtab = 'lifecycle' | 'blueprint' | 'mit-sloan' | 'compliance' | 'positioning' | 'knowledge-graph';

interface DocumentationSectionProps {
  activeSubtab?: DocSubtab;
  onSubtabChange?: (subtab: DocSubtab) => void;
}

const SUBTABS: { id: DocSubtab; label: string; icon: typeof Workflow; description: string }[] = [
  {
    id: 'lifecycle',
    label: 'DLD Fee Schedules',
    icon: Scale,
    description: 'Official DLD 4% transfer, AED 580 admin, trustee charges, and developer direct commission exemptions.',
  },
  {
    id: 'blueprint',
    label: '2026 Golden Visa',
    icon: ShieldCheck,
    description: 'February 2026 DLD circular: AED 2M certified value, 0% paid-up equity requirement, and Bank NOC rules.',
  },
  {
    id: 'mit-sloan',
    label: 'CBUAE Mortgage Caps',
    icon: Cpu,
    description: 'Central Bank Circular No. 31/2013 LTV limits, 50% off-plan flat cap, and +200bps rate shock sensitivity.',
  },
  {
    id: 'compliance',
    label: 'Net Yields & Void Haircut',
    icon: Calculator,
    description: 'Gross vs Net yield formulas, community service charges per sqft, and mandatory 2-month void rental haircut.',
  },
  {
    id: 'positioning',
    label: 'Developer vs. Resale',
    icon: Layers,
    description: 'Direct off-plan purchases vs secondary market transaction friction and broker commission structures.',
  },
  {
    id: 'knowledge-graph',
    label: 'District Intelligence',
    icon: Building2,
    description: 'Sobha Hartland, Dubai Hills Estate, Palm Jebel Ali, Creek Harbour, and 5-step acquisition roadmap.',
  },
];

export function DocumentationSection({ activeSubtab: controlledSubtab, onSubtabChange }: DocumentationSectionProps) {
  const [internalSubtab, setInternalSubtab] = useState<DocSubtab>('lifecycle');
  const currentSubtab = controlledSubtab ?? internalSubtab;

  const handleSelect = (id: DocSubtab) => {
    if (onSubtabChange) {
      onSubtabChange(id);
    } else {
      setInternalSubtab(id);
    }
  };

  return (
    <section id="documentation" className="py-16 sm:py-24 bg-surface border-y border-line">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-control border border-brand-600/20 bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-700 dark:bg-brand-950 dark:text-brand-600">
            <BookOpen className="size-3.5" />
            <span>Statutory Documentation & Methodology</span>
          </div>

          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl lg:text-5xl">
            UAE & Dubai Real Estate Statutory Framework
          </h2>

          <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
            Comprehensive specifications of our deterministic underwriting formulas, Central Bank mortgage
            constraints, 2026 Golden Visa circular rules, and prime district benchmarks. Select a topic below.
          </p>
        </div>

        {/* Subtabs Bar */}
        <div className="mt-10">
          <div
            role="tablist"
            aria-label="Documentation Subtabs"
            className="flex gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-line"
          >
            {SUBTABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentSubtab === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleSelect(tab.id)}
                  className={`inline-flex items-center gap-2 rounded-field px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-xs dark:text-brand-950'
                      : 'bg-surface-subtle text-muted hover:text-ink hover:bg-surface border border-line'
                  }`}
                >
                  <Icon className="size-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Subtab Description Banner */}
          <div className="mt-4 rounded-control bg-surface-subtle border border-line px-4 py-2 text-xs text-subtle">
            {SUBTABS.find((t) => t.id === currentSubtab)?.description}
          </div>
        </div>

        {/* Active Subtab Content Container */}
        <div className="mt-10">
          {currentSubtab === 'lifecycle' && <AdvisorLifecycleSection />}
          {currentSubtab === 'blueprint' && <ExecutionBlueprintSection />}
          {currentSubtab === 'mit-sloan' && <MITSloanShockSection />}
          {currentSubtab === 'compliance' && <ComplianceSecuritySection />}
          {currentSubtab === 'positioning' && <PositioningMatrixSection />}
          {currentSubtab === 'knowledge-graph' && <KnowledgeGraphSection />}
        </div>
      </div>
    </section>
  );
}
