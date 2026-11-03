import { useState } from 'react';
import { ArrowRight, Check, CheckCircle2, DollarSign, Globe, Shield, User } from 'lucide-react';
import type {
  IncomeBracket,
  InvestmentMotivation,
  InvestorProfile,
  ResidencyStatus,
} from '@wealth-advisor/contracts';
import { Button } from '../../../components/ui/button.tsx';
import { saveProfile } from '../profile-store.ts';

interface RealEstateOnboardingFormProps {
  onComplete: () => void;
  email?: string | null;
}

export function RealEstateOnboardingForm({ onComplete, email }: RealEstateOnboardingFormProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState<number>(32);
  const [residencyStatus, setResidencyStatus] = useState<ResidencyStatus>('uae_resident');
  const [incomeBracket, setIncomeBracket] = useState<IncomeBracket>('30k_to_75k');
  const [motivation, setMotivation] = useState<InvestmentMotivation>('wealth_generation');
  const [currency, setCurrency] = useState<'AED' | 'USD' | 'EUR' | 'GBP'>('AED');
  const [error, setError] = useState<string | null>(null);

  const handleNext = () => {
    setError(null);
    if (step === 1) {
      if (!fullName.trim()) {
        setError('Please enter your full legal name');
        return;
      }
      if (age < 18 || age > 100) {
        setError('Age must be between 18 and 100');
        return;
      }
      setStep(2);
      return;
    }

    if (step === 2) {
      setStep(3);
      return;
    }

    // Step 3: Complete Onboarding
    const profileData: InvestorProfile = {
      fullName: fullName.trim(),
      residencyStatus,
      age: Number(age),
      monthlyIncomeBracket: incomeBracket,
      primaryMotivation: motivation,
      preferredCurrency: currency,
      completedAt: new Date().toISOString(),
    };

    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('syntropy_investor_profile', JSON.stringify(profileData));
    }

    // Also mark legacy profile store completed so route guards pass cleanly
    saveProfile(
      {
        psychology: ['STEADY_GROWTH'],
        countries: {
          residence: residencyStatus === 'non_resident' ? 'GB' : 'AE',
          incomeSources: ['AE'],
          remittanceDestinations: [],
        },
        instruments: ['GLOBAL_EQUITIES'],
        holdings: {
          cashSavings: { amount: 100000, currency: 'AED' },
          brokerageStocks: { amount: 0, currency: 'AED' },
          retirementPension: { amount: 0, currency: 'AED' },
          otherAssets: { amount: 0, currency: 'AED' },
        },
        age: Number(age),
        goals: { tags: ['FAMILY_SUPPORT'], notes: motivation },
        stressResponse: 'STAY_INVESTED',
      },
      email
    );

    onComplete();
  };

  return (
    <div className="space-y-6 text-xs text-ink">
      {/* Steps progress indicator */}
      <div className="flex items-center justify-between border-b border-line pb-4">
        <div className="flex items-center gap-2">
          <span className={`flex size-6 items-center justify-center rounded-full text-[11px] font-bold ${
            step === 1 ? 'bg-brand-600 text-white' : 'bg-emerald-500 text-white'
          }`}>
            {step > 1 ? <Check className="size-3.5" /> : '1'}
          </span>
          <span className="font-medium text-subtle">Identity</span>
        </div>
        <div className="h-px w-8 bg-line" />
        <div className="flex items-center gap-2">
          <span className={`flex size-6 items-center justify-center rounded-full text-[11px] font-bold ${
            step === 2 ? 'bg-brand-600 text-white' : step > 2 ? 'bg-emerald-500 text-white' : 'bg-surface-subtle border border-line text-subtle'
          }`}>
            {step > 2 ? <Check className="size-3.5" /> : '2'}
          </span>
          <span className="font-medium text-subtle">Residency</span>
        </div>
        <div className="h-px w-8 bg-line" />
        <div className="flex items-center gap-2">
          <span className={`flex size-6 items-center justify-center rounded-full text-[11px] font-bold ${
            step === 3 ? 'bg-brand-600 text-white' : 'bg-surface-subtle border border-line text-subtle'
          }`}>
            3
          </span>
          <span className="font-medium text-subtle">Capital & Goals</span>
        </div>
      </div>

      {error && (
        <div className="rounded-field bg-danger/10 border border-danger/20 p-2.5 text-xs text-danger">
          {error}
        </div>
      )}

      {/* Step 1: Investor Identity */}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label htmlFor="onb-fullname" className="block font-medium text-subtle mb-1.5">
              Full Legal Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 size-4 text-subtle" />
              <input
                id="onb-fullname"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Elena Vance"
                className="w-full rounded-field border border-line bg-surface pl-9 pr-3 py-2 text-xs text-ink focus:border-brand-600 focus:outline-none"
              />
            </div>
            <p className="text-[11px] text-subtle mt-1">
              Used for official DLD title deeds, tenancy agreements, and investor profiles.
            </p>
          </div>

          <div>
            <label htmlFor="onb-age" className="block font-medium text-subtle mb-1.5">
              Age
            </label>
            <input
              id="onb-age"
              type="number"
              min="18"
              max="100"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full rounded-field border border-line bg-surface px-3 py-2 text-xs text-ink focus:border-brand-600 focus:outline-none"
            />
            <p className="text-[11px] text-subtle mt-1">
              Required for UAE Central Bank mortgage eligibility and maximum loan tenure caps (up to age 65-70).
            </p>
          </div>
        </div>
      )}

      {/* Step 2: Residency Status */}
      {step === 2 && (
        <div className="space-y-4">
          <label className="block font-medium text-subtle">
            What is your current UAE Residency status?
          </label>
          <div className="grid grid-cols-1 gap-2.5">
            <button
              type="button"
              onClick={() => setResidencyStatus('uae_resident')}
              className={`flex items-start gap-3 rounded-card border p-3.5 text-left transition cursor-pointer ${
                residencyStatus === 'uae_resident'
                  ? 'border-brand-600 bg-brand-600/10 font-medium'
                  : 'border-line bg-surface hover:bg-surface-subtle'
              }`}
            >
              <Shield className="size-5 text-brand-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-ink text-sm block">UAE Resident Expatriate</span>
                <span className="text-[11px] text-subtle">
                  Valid Emirates ID holder. Eligible for up to 80% Central Bank mortgage LTV on properties under AED 5M.
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setResidencyStatus('non_resident')}
              className={`flex items-start gap-3 rounded-card border p-3.5 text-left transition cursor-pointer ${
                residencyStatus === 'non_resident'
                  ? 'border-brand-600 bg-brand-600/10 font-medium'
                  : 'border-line bg-surface hover:bg-surface-subtle'
              }`}
            >
              <Globe className="size-5 text-brand-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-ink text-sm block">Non-Resident / International Investor</span>
                <span className="text-[11px] text-subtle">
                  Investing from abroad. Eligible for 60% to 70% mortgage financing or 100% cash purchases with remote DLD transfer.
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setResidencyStatus('uae_national')}
              className={`flex items-start gap-3 rounded-card border p-3.5 text-left transition cursor-pointer ${
                residencyStatus === 'uae_national'
                  ? 'border-brand-600 bg-brand-600/10 font-medium'
                  : 'border-line bg-surface hover:bg-surface-subtle'
              }`}
            >
              <CheckCircle2 className="size-5 text-brand-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-ink text-sm block">UAE National</span>
                <span className="text-[11px] text-subtle">
                  Emirati citizen. Eligible for up to 85% Central Bank mortgage LTV and national housing support programs.
                </span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Capital & Primary Motivation */}
      {step === 3 && (
        <div className="space-y-4">
          <div>
            <label className="block font-medium text-subtle mb-1.5">
              Monthly Household Income Bracket
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIncomeBracket('under_30k')}
                className={`rounded-field border p-2 text-center text-xs transition cursor-pointer ${
                  incomeBracket === 'under_30k'
                    ? 'border-brand-600 bg-brand-600/10 font-semibold text-brand-600'
                    : 'border-line bg-surface hover:bg-surface-subtle text-subtle'
                }`}
              >
                &lt; AED 30,000 / mo
              </button>
              <button
                type="button"
                onClick={() => setIncomeBracket('30k_to_75k')}
                className={`rounded-field border p-2 text-center text-xs transition cursor-pointer ${
                  incomeBracket === '30k_to_75k'
                    ? 'border-brand-600 bg-brand-600/10 font-semibold text-brand-600'
                    : 'border-line bg-surface hover:bg-surface-subtle text-subtle'
                }`}
              >
                AED 30k - 75k / mo
              </button>
              <button
                type="button"
                onClick={() => setIncomeBracket('75k_to_150k')}
                className={`rounded-field border p-2 text-center text-xs transition cursor-pointer ${
                  incomeBracket === '75k_to_150k'
                    ? 'border-brand-600 bg-brand-600/10 font-semibold text-brand-600'
                    : 'border-line bg-surface hover:bg-surface-subtle text-subtle'
                }`}
              >
                AED 75k - 150k / mo
              </button>
              <button
                type="button"
                onClick={() => setIncomeBracket('above_150k')}
                className={`rounded-field border p-2 text-center text-xs transition cursor-pointer ${
                  incomeBracket === 'above_150k'
                    ? 'border-brand-600 bg-brand-600/10 font-semibold text-brand-600'
                    : 'border-line bg-surface hover:bg-surface-subtle text-subtle'
                }`}
              >
                &gt; AED 150,000 / mo
              </button>
            </div>
          </div>

          <div>
            <label className="block font-medium text-subtle mb-1.5">
              Primary Objective
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMotivation('wealth_generation')}
                className={`rounded-field border p-2.5 text-left text-xs transition cursor-pointer ${
                  motivation === 'wealth_generation'
                    ? 'border-brand-600 bg-brand-600/10 font-semibold text-brand-600'
                    : 'border-line bg-surface hover:bg-surface-subtle text-subtle'
                }`}
              >
                <span className="block font-medium text-ink">Rental Yield & Growth</span>
                <span className="text-[10px] text-subtle">High net cashflow & off-plan appreciation</span>
              </button>

              <button
                type="button"
                onClick={() => setMotivation('primary_home')}
                className={`rounded-field border p-2.5 text-left text-xs transition cursor-pointer ${
                  motivation === 'primary_home'
                    ? 'border-brand-600 bg-brand-600/10 font-semibold text-brand-600'
                    : 'border-line bg-surface hover:bg-surface-subtle text-subtle'
                }`}
              >
                <span className="block font-medium text-ink">Personal Home</span>
                <span className="text-[10px] text-subtle">Family living, parks & school commute</span>
              </button>

              <button
                type="button"
                onClick={() => setMotivation('golden_visa')}
                className={`rounded-field border p-2.5 text-left text-xs transition cursor-pointer ${
                  motivation === 'golden_visa'
                    ? 'border-brand-600 bg-brand-600/10 font-semibold text-brand-600'
                    : 'border-line bg-surface hover:bg-surface-subtle text-subtle'
                }`}
              >
                <span className="block font-medium text-ink">Golden Visa (10-Yr)</span>
                <span className="text-[10px] text-subtle">AED 2M+ qualifying equity threshold</span>
              </button>

              <button
                type="button"
                onClick={() => setMotivation('portfolio_diversification')}
                className={`rounded-field border p-2.5 text-left text-xs transition cursor-pointer ${
                  motivation === 'portfolio_diversification'
                    ? 'border-brand-600 bg-brand-600/10 font-semibold text-brand-600'
                    : 'border-line bg-surface hover:bg-surface-subtle text-subtle'
                }`}
              >
                <span className="block font-medium text-ink">Diversification</span>
                <span className="text-[10px] text-subtle">USD-pegged real estate wealth preserve</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block font-medium text-subtle mb-1">
              Preferred Currency
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['AED', 'USD', 'EUR', 'GBP'] as const).map((curr) => (
                <button
                  key={curr}
                  type="button"
                  onClick={() => setCurrency(curr)}
                  className={`rounded-field border py-1.5 text-center text-xs font-medium transition cursor-pointer ${
                    currency === curr
                      ? 'border-brand-600 bg-brand-600 text-white'
                      : 'border-line bg-surface hover:bg-surface-subtle text-subtle'
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Actions */}
      <div className="flex items-center justify-between border-t border-line pt-4">
        {step > 1 ? (
          <Button
            type="button"
            variant="ghost"
            onClick={() => setStep((s) => (s - 1) as 1 | 2)}
          >
            Back
          </Button>
        ) : (
          <div />
        )}

        <Button type="button" variant="primary" onClick={handleNext}>
          {step === 3 ? (
            'Complete Setup'
          ) : (
            <>
              <span>Continue</span>
              <ArrowRight className="size-3.5 ml-1.5" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
