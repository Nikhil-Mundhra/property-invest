import { CheckCircle2, ChevronRight, FileCheck, Layers, Scale, ShieldCheck, Sparkles, UserCheck } from 'lucide-react';

export function ExecutionBlueprintSection() {
  const criteria = [
    {
      number: '01',
      title: 'AED 2,000,000 Certified Valuation',
      status: 'Statutory Standard',
      description:
        'The property value must equal or exceed AED 2,000,000 as stated on the official Title Deed or off-plan initial contract (Oqood), certified by the Dubai Land Department.',
      deliverables: ['AED 2M Minimum Value', 'Title Deed Verification', 'Oqood Certificate on Off-Plan'],
    },
    {
      number: '02',
      title: '0% Paid-Up Equity Requirement',
      status: '2026 DLD Circular Reform',
      description:
        'The 20 February 2026 DLD circular confirmed the complete abolition of the previous AED 1M minimum paid-up equity requirement. Mortgaged properties qualify immediately with standard bank down payments.',
      deliverables: ['0% Minimum Equity Mandate', 'Bank NOC for Financed Purchases', 'Immediate Golden Visa Eligibility'],
    },
    {
      number: '03',
      title: 'Spousal Combined Property Ownership',
      status: 'Statutory Policy',
      description:
        'Husband and wife may combine property ownership shares to achieve the aggregate AED 2,000,000 threshold, verified via an attested legal marriage certificate.',
      deliverables: ['Joint Ownership Pooling', 'Attested Marriage Contract', 'Family Nomination Rights'],
    },
    {
      number: '04',
      title: 'DLD Cube Processing & Direct Issuance',
      status: 'Official Schedule',
      description:
        'Applications are submitted through DLD Cube with an official primary processing fee of AED 9,884.75, granting a 10-year renewable residency visa with no continuous stay restrictions.',
      deliverables: ['AED 9,884.75 DLD Cube Fee', '10-Year Renewable Residency', 'No 6-Month Exit Restriction'],
    },
  ];

  return (
    <div className="bg-surface rounded-card border border-line p-6 sm:p-8">
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-control border border-brand-600/20 bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-700 dark:bg-brand-950 dark:text-brand-600">
          <ShieldCheck className="size-3.5" />
          <span>2026 UAE Golden Visa Framework</span>
        </div>

        <h3 className="mt-4 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Dubai Land Department 10-Year Golden Visa Standards
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">
          Our rule engine (`uae-golden-visa.rule.ts`) encodes the latest 20 February 2026 DLD circular.
          Investors receive instant verification of qualification status, shortfall analysis, and certified fee structures.
        </p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {criteria.map((item) => (
          <div
            key={item.number}
            className="flex flex-col justify-between rounded-card border border-line bg-surface-subtle p-6 transition hover:border-brand-600/40"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-2xl font-bold text-brand-700 dark:text-brand-600">
                  {item.number}
                </span>
                <span className="rounded-control border border-brand-600/20 bg-brand-50 px-2 py-0.5 text-[11px] font-semibold text-brand-700 dark:bg-brand-950 dark:text-brand-600">
                  {item.status}
                </span>
              </div>

              <h4 className="mt-4 text-base font-semibold text-ink">{item.title}</h4>
              <p className="mt-2 text-xs leading-relaxed text-muted">{item.description}</p>
            </div>

            <div className="mt-6 border-t border-line pt-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-subtle">
                Key Requirements:
              </span>
              <ul className="mt-2 space-y-1.5 text-xs text-ink">
                {item.deliverables.map((d) => (
                  <li key={d} className="flex items-center gap-2">
                    <CheckCircle2 className="size-3.5 text-brand-600 shrink-0" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
