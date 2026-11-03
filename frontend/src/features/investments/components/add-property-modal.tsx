import { useState } from 'react';
import { Building2, Home, Landmark, Plus, X } from 'lucide-react';
import type {
  AcquisitionIntent,
  CreatePropertyInput,
  FinancingType,
  PropertyStatus,
  PropertyType,
} from '@wealth-advisor/contracts';
import { Button } from '../../../components/ui/button.tsx';
import { addProperty } from '../store/properties-store.ts';

interface AddPropertyModalProps {
  open: boolean;
  onClose: () => void;
  defaultStatus?: PropertyStatus;
}

const POPULAR_LOCATIONS = [
  'Dubai Hills Estate',
  'Dubai Creek Harbour',
  'Downtown Dubai',
  'Jumeirah Village Circle (JVC)',
  'Dubai Marina',
  'Palm Jumeirah',
  'Business Bay',
  'Sobha Hartland, MBR City',
  'Dubai South',
  'Damac Lagoons',
  'Arjan',
];

const POPULAR_DEVELOPERS = [
  'Emaar Properties',
  'Sobha Realty',
  'DAMAC Properties',
  'Nakheel',
  'Ellington Properties',
  'Meraas',
  'Binghatti',
  'Aldar',
  'Other / Private',
];

export function AddPropertyModal({ open, onClose, defaultStatus = 'planned' }: AddPropertyModalProps) {
  const [status, setStatus] = useState<PropertyStatus>(defaultStatus);
  const [intent, setIntent] = useState<AcquisitionIntent>('investment');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState(POPULAR_LOCATIONS[0] ?? 'Dubai Hills Estate');
  const [developer, setDeveloper] = useState(POPULAR_DEVELOPERS[0] ?? 'Emaar Properties');
  const [propertyType, setPropertyType] = useState<PropertyType>('apartment');
  const [bedrooms, setBedrooms] = useState(2);
  const [bathrooms, setBathrooms] = useState(2);
  const [sqft, setSqft] = useState(1150);
  const [priceAed, setPriceAed] = useState(2_200_000);
  const [financingType, setFinancingType] = useState<FinancingType>('mortgage');
  const [downPaymentAed, setDownPaymentAed] = useState(440_000);
  const [mortgageRatePct, setMortgageRatePct] = useState(4.5);
  const [mortgageTenureYears, setMortgageTenureYears] = useState(25);
  const [expectedRentAed, setExpectedRentAed] = useState(165_000);
  const [serviceChargePerSqft, setServiceChargePerSqft] = useState(18);
  const [isOffPlan, setIsOffPlan] = useState(false);
  const [isDirectDeveloperPurchase, setIsDirectDeveloperPurchase] = useState(false);
  const [buyerResidency, setBuyerResidency] = useState<'resident_expat' | 'uae_national' | 'non_resident'>('resident_expat');
  const [completionYear, setCompletionYear] = useState(2027);
  const [notes, setNotes] = useState('');

  if (!open) return null;

  const getMinDownPaymentPct = (offPlan: boolean, residency: 'resident_expat' | 'uae_national' | 'non_resident', price: number, currentIntent: AcquisitionIntent) => {
    if (offPlan) return 50; // CBUAE Circular 31/2013 flat 50% cap on off-plan mortgages
    if (residency === 'non_resident') return 40; // UAE banks require 40% to 50% down payment
    if (residency === 'uae_national') {
      if (currentIntent === 'investment') return 35;
      return price <= 5_000_000 ? 15 : 25;
    }
    // Resident Expat
    if (currentIntent === 'investment') return 40; // Second home / investment property max 60% LTV
    return price <= 5_000_000 ? 20 : 30; // First home max 80% / 70% LTV
  };

  const handlePriceChange = (newPrice: number) => {
    setPriceAed(newPrice);
    if (financingType === 'mortgage') {
      const minPct = getMinDownPaymentPct(isOffPlan, buyerResidency, newPrice, intent);
      setDownPaymentAed(Math.round(newPrice * (minPct / 100)));
    }
  };

  const handleOffPlanToggle = (checked: boolean) => {
    setIsOffPlan(checked);
    if (checked) {
      setIsDirectDeveloperPurchase(true);
      if (financingType === 'mortgage') {
        const minDown = Math.round(priceAed * 0.50);
        if (downPaymentAed < minDown) {
          setDownPaymentAed(minDown);
        }
      }
    } else {
      setIsDirectDeveloperPurchase(false);
      if (financingType === 'mortgage') {
        const minPct = getMinDownPaymentPct(false, buyerResidency, priceAed, intent);
        setDownPaymentAed(Math.round(priceAed * (minPct / 100)));
      }
    }
  };

  const minDownPct = getMinDownPaymentPct(isOffPlan, buyerResidency, priceAed, intent);
  const minDownPaymentAed = Math.round(priceAed * (minDownPct / 100));
  const isDownPaymentBelowCBUAE = financingType === 'mortgage' && downPaymentAed < minDownPaymentAed;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || priceAed <= 0) return;

    const loanAmount = financingType === 'mortgage' ? Math.max(0, priceAed - downPaymentAed) : 0;

    const input: CreatePropertyInput = {
      title: title.trim(),
      location,
      developer,
      propertyType,
      status,
      intent,
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      sqft: Number(sqft),
      priceAed: Number(priceAed),
      financingType,
      downPaymentAed: financingType === 'mortgage' ? Number(downPaymentAed) : priceAed,
      mortgageLoanAmountAed: loanAmount,
      mortgageInterestRatePct: financingType === 'mortgage' ? Number(mortgageRatePct) : undefined,
      mortgageTenureYears: financingType === 'mortgage' ? Number(mortgageTenureYears) : undefined,
      expectedAnnualRentAed: intent !== 'personal_home' ? Number(expectedRentAed) : undefined,
      annualServiceChargePerSqft: Number(serviceChargePerSqft),
      isOffPlan,
      isDirectDeveloperPurchase: isOffPlan ? isDirectDeveloperPurchase : false,
      completionYear: isOffPlan ? Number(completionYear) : undefined,
      notes: notes.trim() || undefined,
      imageUrl: propertyType === 'villa'
        ? 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80'
        : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    };

    addProperty(input);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-property-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
    >
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-card border border-line bg-surface p-6 shadow-2xl text-ink">
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-field bg-brand-600/10 text-brand-600">
              <Building2 className="size-5" />
            </div>
            <div>
              <h2 id="add-property-title" className="font-display text-lg font-bold">
                Add Property
              </h2>
              <p className="text-xs text-subtle">
                Record an existing asset or evaluate a planned acquisition.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-control p-1.5 text-subtle hover:bg-surface-subtle hover:text-ink transition cursor-pointer"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-5 text-xs">
          {/* Section: Status & Intent */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-subtle mb-1.5">Portfolio Status</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setStatus('owned')}
                  className={`rounded-field border px-3 py-2 text-center font-medium transition cursor-pointer ${
                    status === 'owned'
                      ? 'border-brand-600 bg-brand-600/10 text-brand-600 font-semibold'
                      : 'border-line bg-surface hover:bg-surface-subtle text-subtle'
                  }`}
                >
                  Current Portfolio
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('planned')}
                  className={`rounded-field border px-3 py-2 text-center font-medium transition cursor-pointer ${
                    status === 'planned'
                      ? 'border-brand-600 bg-brand-600/10 text-brand-600 font-semibold'
                      : 'border-line bg-surface hover:bg-surface-subtle text-subtle'
                  }`}
                >
                  Planned Acquisition
                </button>
              </div>
            </div>

            <div>
              <label className="block font-medium text-subtle mb-1.5">Acquisition Intent</label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => setIntent('investment')}
                  className={`rounded-field border px-2 py-2 text-center font-medium text-[11px] transition cursor-pointer ${
                    intent === 'investment'
                      ? 'border-brand-600 bg-brand-600/10 text-brand-600 font-semibold'
                      : 'border-line bg-surface hover:bg-surface-subtle text-subtle'
                  }`}
                >
                  Investment
                </button>
                <button
                  type="button"
                  onClick={() => setIntent('personal_home')}
                  className={`rounded-field border px-2 py-2 text-center font-medium text-[11px] transition cursor-pointer ${
                    intent === 'personal_home'
                      ? 'border-brand-600 bg-brand-600/10 text-brand-600 font-semibold'
                      : 'border-line bg-surface hover:bg-surface-subtle text-subtle'
                  }`}
                >
                  Home
                </button>
                <button
                  type="button"
                  onClick={() => setIntent('hybrid')}
                  className={`rounded-field border px-2 py-2 text-center font-medium text-[11px] transition cursor-pointer ${
                    intent === 'hybrid'
                      ? 'border-brand-600 bg-brand-600/10 text-brand-600 font-semibold'
                      : 'border-line bg-surface hover:bg-surface-subtle text-subtle'
                  }`}
                >
                  Holiday / Let
                </button>
              </div>
            </div>
          </div>

          {/* Section: Title & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="prop-title" className="block font-medium text-subtle mb-1">
                Property Name / Unit Label *
              </label>
              <input
                id="prop-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Waves Grande 2BR Canal View"
                className="w-full rounded-field border border-line bg-surface px-3 py-2 text-xs text-ink focus:border-brand-600 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="prop-location" className="block font-medium text-subtle mb-1">
                Location / District
              </label>
              <select
                id="prop-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-field border border-line bg-surface px-3 py-2 text-xs text-ink focus:border-brand-600 focus:outline-none"
              >
                {POPULAR_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Developer & Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="prop-developer" className="block font-medium text-subtle mb-1">
                Master Developer
              </label>
              <select
                id="prop-developer"
                value={developer}
                onChange={(e) => setDeveloper(e.target.value)}
                className="w-full rounded-field border border-line bg-surface px-3 py-2 text-xs text-ink focus:border-brand-600 focus:outline-none"
              >
                {POPULAR_DEVELOPERS.map((dev) => (
                  <option key={dev} value={dev}>
                    {dev}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="prop-type" className="block font-medium text-subtle mb-1">
                Property Type
              </label>
              <select
                id="prop-type"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                className="w-full rounded-field border border-line bg-surface px-3 py-2 text-xs text-ink focus:border-brand-600 focus:outline-none"
              >
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="townhouse">Townhouse</option>
                <option value="penthouse">Penthouse</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>
          </div>

          {/* Unit Specifications */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label htmlFor="prop-beds" className="block font-medium text-subtle mb-1">
                Bedrooms
              </label>
              <input
                id="prop-beds"
                type="number"
                min="0"
                max="10"
                value={bedrooms}
                onChange={(e) => setBedrooms(Number(e.target.value))}
                className="w-full rounded-field border border-line bg-surface px-3 py-2 text-xs text-ink focus:border-brand-600 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="prop-baths" className="block font-medium text-subtle mb-1">
                Bathrooms
              </label>
              <input
                id="prop-baths"
                type="number"
                min="1"
                max="10"
                value={bathrooms}
                onChange={(e) => setBathrooms(Number(e.target.value))}
                className="w-full rounded-field border border-line bg-surface px-3 py-2 text-xs text-ink focus:border-brand-600 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="prop-sqft" className="block font-medium text-subtle mb-1">
                Area (Sq Ft)
              </label>
              <input
                id="prop-sqft"
                type="number"
                min="200"
                value={sqft}
                onChange={(e) => setSqft(Number(e.target.value))}
                className="w-full rounded-field border border-line bg-surface px-3 py-2 text-xs text-ink focus:border-brand-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Valuation & Financing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-line pt-4">
            <div>
              <label htmlFor="prop-price" className="block font-medium text-subtle mb-1">
                Purchase Price / Valuation (AED) *
              </label>
              <input
                id="prop-price"
                type="number"
                min="100000"
                step="50000"
                required
                value={priceAed}
                onChange={(e) => handlePriceChange(Number(e.target.value))}
                className="w-full rounded-field border border-line bg-surface px-3 py-2 text-xs text-ink font-semibold focus:border-brand-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-subtle mb-1">Financing Structure</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFinancingType('cash')}
                  className={`rounded-field border px-3 py-2 text-center font-medium transition cursor-pointer ${
                    financingType === 'cash'
                      ? 'border-brand-600 bg-brand-600/10 text-brand-600 font-semibold'
                      : 'border-line bg-surface hover:bg-surface-subtle text-subtle'
                  }`}
                >
                  Cash Purchase
                </button>
                <button
                  type="button"
                  onClick={() => setFinancingType('mortgage')}
                  className={`rounded-field border px-3 py-2 text-center font-medium transition cursor-pointer ${
                    financingType === 'mortgage'
                      ? 'border-brand-600 bg-brand-600/10 text-brand-600 font-semibold'
                      : 'border-line bg-surface hover:bg-surface-subtle text-subtle'
                  }`}
                >
                  Mortgage Financed
                </button>
              </div>
            </div>
          </div>

          {financingType === 'mortgage' && (
            <div className="space-y-3 rounded-field bg-surface-subtle p-3.5 border border-line">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label htmlFor="prop-residency" className="block font-medium text-subtle mb-1">
                    Borrower Residency
                  </label>
                  <select
                    id="prop-residency"
                    value={buyerResidency}
                    onChange={(e) => {
                      const res = e.target.value as 'resident_expat' | 'uae_national' | 'non_resident';
                      setBuyerResidency(res);
                      const minPct = getMinDownPaymentPct(isOffPlan, res, priceAed, intent);
                      setDownPaymentAed(Math.round(priceAed * (minPct / 100)));
                    }}
                    className="w-full rounded-field border border-line bg-surface px-2.5 py-1.5 text-xs text-ink focus:border-brand-600 focus:outline-none"
                  >
                    <option value="resident_expat">Resident Expat</option>
                    <option value="uae_national">UAE National</option>
                    <option value="non_resident">Non-Resident (Overseas)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="prop-downpay" className="block font-medium text-subtle mb-1">
                    Down Payment (AED)
                  </label>
                  <input
                    id="prop-downpay"
                    type="number"
                    min="0"
                    value={downPaymentAed}
                    onChange={(e) => setDownPaymentAed(Number(e.target.value))}
                    className={`w-full rounded-field border bg-surface px-2.5 py-1.5 text-xs text-ink focus:outline-none ${
                      isDownPaymentBelowCBUAE ? 'border-danger focus:border-danger' : 'border-line focus:border-brand-600'
                    }`}
                  />
                </div>

                <div>
                  <label htmlFor="prop-mortrate" className="block font-medium text-subtle mb-1">
                    Interest Rate (%)
                  </label>
                  <input
                    id="prop-mortrate"
                    type="number"
                    step="0.05"
                    min="1"
                    max="15"
                    value={mortgageRatePct}
                    onChange={(e) => setMortgageRatePct(Number(e.target.value))}
                    className="w-full rounded-field border border-line bg-surface px-2.5 py-1.5 text-xs text-ink focus:border-brand-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="prop-tenure" className="block font-medium text-subtle mb-1">
                    Tenure (Years)
                  </label>
                  <input
                    id="prop-tenure"
                    type="number"
                    min="5"
                    max="30"
                    value={mortgageTenureYears}
                    onChange={(e) => setMortgageTenureYears(Number(e.target.value))}
                    className="w-full rounded-field border border-line bg-surface px-2.5 py-1.5 text-xs text-ink focus:border-brand-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Regulatory statutory guidance */}
              <div className="flex flex-col gap-1 border-t border-line/60 pt-2 text-[11px] text-subtle">
                <div className="flex items-center justify-between">
                  <span>
                    {isOffPlan
                      ? 'CBUAE Circular 31/2013: Off-plan mortgages strictly capped at 50% LTV.'
                      : buyerResidency === 'non_resident'
                        ? 'UAE bank underwriting: Non-resident mortgages typically capped at 50% to 60% LTV.'
                        : `CBUAE statutory limit: Min down payment ${minDownPct}% (AED ${minDownPaymentAed.toLocaleString()}).`}
                  </span>
                  <span className="font-medium text-ink">
                    Loan: AED {Math.max(0, priceAed - downPaymentAed).toLocaleString()}
                  </span>
                </div>
                {isDownPaymentBelowCBUAE && (
                  <p className="text-danger font-medium">
                    Warning: Down payment is below the CBUAE required statutory threshold of AED {minDownPaymentAed.toLocaleString()} ({minDownPct}%).
                  </p>
                )}
                <p className="text-subtle text-[10px]">
                  CBUAE Mandate: 100% of transaction closing costs (DLD 4%, trustee fees) must be settled upfront in liquid cash and cannot be rolled into the loan.
                </p>
              </div>
            </div>
          )}

          {/* Rental and Service Charges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {intent !== 'personal_home' && (
              <div>
                <label htmlFor="prop-rent" className="block font-medium text-subtle mb-1">
                  Expected Annual Rent (AED)
                </label>
                <input
                  id="prop-rent"
                  type="number"
                  min="0"
                  step="5000"
                  value={expectedRentAed}
                  onChange={(e) => setExpectedRentAed(Number(e.target.value))}
                  className="w-full rounded-field border border-line bg-surface px-3 py-2 text-xs text-ink focus:border-brand-600 focus:outline-none"
                />
              </div>
            )}

            <div>
              <label htmlFor="prop-service" className="block font-medium text-subtle mb-1">
                Annual Service Charge (AED / Sq Ft)
              </label>
              <input
                id="prop-service"
                type="number"
                min="0"
                step="1"
                value={serviceChargePerSqft}
                onChange={(e) => setServiceChargePerSqft(Number(e.target.value))}
                className="w-full rounded-field border border-line bg-surface px-3 py-2 text-xs text-ink focus:border-brand-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Off-plan status toggle & Developer Direct options */}
          <div className="space-y-3 rounded-field border border-line p-3.5 bg-surface">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium text-ink">Off-Plan Project</span>
                <p className="text-[11px] text-subtle">
                  Under development with milestone payments and Oqood pre-registration.
                </p>
              </div>
              <div className="flex items-center gap-3">
                {isOffPlan && (
                  <input
                    type="number"
                    min="2024"
                    max="2035"
                    value={completionYear}
                    onChange={(e) => setCompletionYear(Number(e.target.value))}
                    className="w-28 rounded-field border border-line bg-surface px-2 py-1 text-xs text-center"
                    placeholder="Handover Year"
                  />
                )}
                <input
                  type="checkbox"
                  checked={isOffPlan}
                  onChange={(e) => handleOffPlanToggle(e.target.checked)}
                  className="size-4 rounded accent-brand-600 cursor-pointer"
                />
              </div>
            </div>

            {isOffPlan && (
              <div className="border-t border-line/60 pt-3 flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="direct-dev"
                  checked={isDirectDeveloperPurchase}
                  onChange={(e) => setIsDirectDeveloperPurchase(e.target.checked)}
                  className="mt-0.5 size-4 rounded accent-brand-600 cursor-pointer"
                />
                <label htmlFor="direct-dev" className="text-[11px] cursor-pointer">
                  <span className="font-semibold text-ink">Direct Developer Purchase</span>
                  <span className="block text-subtle">
                    0% buyer agency commission (developer pays) and standard resale trustee office fee is replaced by AED 1,000 developer Oqood registration fee.
                  </span>
                </label>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-line pt-4">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              <Plus className="size-4 mr-1.5" />
              Save Property
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
