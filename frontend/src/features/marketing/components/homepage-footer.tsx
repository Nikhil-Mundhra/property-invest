import { ArrowRight, Building2, Lock, Scale, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router';
import logoImg from '../../../assets/logo.png';
import logoDarkImg from '../../../assets/logo-dark.png';

export function HomepageFooter() {
  return (
    <footer className="border-t border-line bg-surface pt-16 pb-12 text-muted">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand & Mission Statement */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/home" className="flex items-center gap-3 text-ink">
              <div className="relative flex size-10 shrink-0 items-center justify-center">
                <img
                  src={logoImg}
                  alt="Syntropy Logo"
                  className="size-10 object-contain dark:hidden"
                />
                <img
                  src={logoDarkImg}
                  alt="Syntropy Logo"
                  className="hidden size-10 object-contain dark:block"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-xl font-bold tracking-tight text-ink leading-tight">Syntropy</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-600">Dubai Real Estate Intelligence</span>
              </div>
            </Link>

            <p className="max-w-md text-xs leading-relaxed text-subtle">
              The premier real estate investment platform bridging raw LLMs with deterministic UAE and Dubai
              statutory underwriting. Unifying the DLD 2026 Golden Visa circular, CBUAE Circular No. 31/2013,
              and interactive Deal Room modeling.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
              <span className="inline-flex items-center gap-1.5 rounded-control border border-line bg-surface-subtle px-2.5 py-1 text-ink font-medium">
                <ShieldCheck className="size-3.5 text-brand-600" />
                Calculation Shield
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-control border border-line bg-surface-subtle px-2.5 py-1 text-ink font-medium">
                <Scale className="size-3.5 text-gold" />
                DLD 2026 Compliant
              </span>
            </div>
          </div>

          {/* Column 1: Core Architecture */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-ink">Statutory Standards</p>
            <ul className="mt-4 space-y-2.5 text-xs text-subtle">
              <li>
                <a href="#triad" className="hover:text-ink transition">Statutory Engines</a>
              </li>
              <li>
                <a href="#deal-room" className="hover:text-ink transition">Interactive Deal Room</a>
              </li>
              <li>
                <a href="#simulator" className="hover:text-ink transition">Statutory Simulator</a>
              </li>
              <li>
                <a href="#documentation" className="hover:text-ink transition">2026 Golden Visa Rules</a>
              </li>
              <li>
                <a href="#documentation" className="hover:text-ink transition">CBUAE Mortgage Caps</a>
              </li>
            </ul>
          </div>

          {/* Column 2: Platform & App */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-ink">Platform Surfaces</p>
            <ul className="mt-4 space-y-2.5 text-xs text-subtle">
              <li>
                <Link to="/investments" className="hover:text-ink transition">Property Deal Room</Link>
              </li>
              <li>
                <Link to="/plan" className="hover:text-ink transition">5-Step Layman Planner</Link>
              </li>
              <li>
                <Link to="/" className="hover:text-ink transition">Executive Dashboard</Link>
              </li>
              <li>
                <Link to="/advisory" className="hover:text-ink transition">Real Estate AI Copilot</Link>
              </li>
              <li>
                <Link to="/onboarding" className="hover:text-ink transition">Investor Profiling</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Security & Access */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-ink">Access & Security</p>
            <ul className="mt-4 space-y-2.5 text-xs text-subtle">
              <li>
                <Link to="/login" className="hover:text-ink transition">Sign In</Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-ink transition">Create Account</Link>
              </li>
              <li>
                <Link to="/settings/security" className="hover:text-ink transition">Biometric Passkeys</Link>
              </li>
              <li>
                <Link to="/settings/ledger" className="hover:text-ink transition">Transaction History</Link>
              </li>
              <li>
                <a href="#documentation" className="hover:text-ink transition">Regulatory Guide</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Regulatory & Statutory Disclaimers */}
        <div className="mt-12 border-t border-line pt-8 text-[11px] leading-relaxed text-subtle space-y-3">
          <p>
            <strong>Regulatory Disclosure:</strong> Syntropy provides deterministic mathematical modeling and
            statutory underwriting intelligence based on official directives from the Dubai Land Department (Law No. 7 of 2006,
            Executive Council Resolution No. 30 of 2013, and the February 2026 Golden Visa circular) and Central Bank of the UAE
            (Circular No. 31/2013). All figures, fee schedules, and mortgage constraints are computed by pure deterministic
            algorithms with neuro-symbolic verification.
          </p>
          <p>
            <strong>Statutory Underwriting Guarantee:</strong> Outputs generated by the platform do not replace official title deeds,
            valuations certified by licensed RERA appraisers, or binding commercial offers from licensed UAE financial institutions.
            Mortgage terms remain subject to individual credit assessment and lender underwriting approval.
          </p>
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-4 text-xs text-subtle">
            <p>© 2026 Syntropy. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <span>Deterministic Calculation Shield</span>
              <span>DLD Statutory Compliance</span>
              <span>Zero Calculation Hallucination</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
