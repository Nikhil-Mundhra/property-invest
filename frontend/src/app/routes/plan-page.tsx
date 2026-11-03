import { useState } from 'react';
import {
  ArrowRight,
  Bot,
  Building2,
  CalendarCheck,
  CheckCircle2,
  Coins,
  Compass,
  FileText,
  HelpCircle,
  MessageSquare,
  Send,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { Button } from '../../components/ui/button.tsx';
import { Card } from '../../components/ui/card.tsx';
import { PageTitle } from '../../components/ui/page-title.tsx';
import {
  calculateAcquisitionFees,
  calculateMonthlyEmi,
  checkGoldenVisaEligibility,
} from '@wealth-advisor/rules';
import { formatMoney } from '../../lib/format-money.ts';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

const PRESET_QUESTIONS = [
  'What are the mandatory upfront fees when buying in Dubai?',
  'How do I qualify for the 10-year Golden Visa through property?',
  'What is the difference between off-plan Oqood and ready Title Deed?',
  'What is a healthy net rental yield target in Dubai?',
];

const KNOWLEDGE_RESPONSES: Record<string, string> = {
  fees: `When acquiring property in Dubai, budget approximately 6.5% to 7% above the purchase price for upfront fees:
- Dubai Land Department (DLD) Transfer Fee: 4% of the property value (+ AED 580 administrative fee).
- Registration Trustee Fee: AED 4,000 + 5% VAT (for properties >= AED 500,000) or AED 2,000 + VAT (for properties < AED 500,000).
- Broker Commission: Standard 2% + 5% VAT.
- Mortgage Registration Fee (if financed): 0.25% of the loan amount + AED 290.`,

  golden_visa: `To qualify for the 10-year UAE Golden Visa via real estate:
- The total purchase price or valuation must be at least AED 2,000,000.
- You can combine multiple properties (e.g. two AED 1M apartments).
- Mortgaged properties qualify as long as the property value is >= AED 2M (the previous AED 1M cash equity down payment rule was officially abolished in 2024).
- Both ready properties and off-plan projects from approved master developers qualify.`,

  oqood: `Oqood is the interim registration certificate issued by the Dubai Land Department for off-plan properties during the construction phase.
- It protects your ownership rights as an investor before the project is completed.
- Once construction is finished and the building handover occurs, your Oqood is automatically converted into a permanent Title Deed (Mulkiya).`,

  yield: `In Dubai, healthy rental yield benchmarks typically fall into these brackets:
- Gross Yield: 7% to 9% is standard for apartments in emerging and high-density communities (JVC, Arjan, Dubai South). Prime waterfront (Downtown, Dubai Marina) averages 5.5% to 7%.
- Net Yield: Real net yield (after deducting annual service charges of AED 14-25/sqft and maintenance reserves) typically sits between 5.5% and 7.5%.
- Short-Term Holiday Lets: Can yield 8% to 11% in tourist hubs (Downtown, Palm Jumeirah) but require active DTCM management fees (typically 15% to 20% of revenue).`,
};

export function PlanPage() {
  // Layman affordability calculator state
  const [targetEquityAed, setTargetEquityAed] = useState(600_000);
  const [isMortgage, setIsMortgage] = useState(true);

  // Estimating purchasing power
  // Down payment is ~20% + 7% fees = ~27% of property price needed upfront
  const estimatedPurchasingPower = isMortgage
    ? Math.round(targetEquityAed / 0.27)
    : Math.round(targetEquityAed / 1.07);

  const estimatedLoan = isMortgage ? Math.round(estimatedPurchasingPower * 0.8) : 0;
  const estimatedEmi = isMortgage
    ? calculateMonthlyEmi({
        principalAed: estimatedLoan,
        annualInterestRatePct: 4.5,
        tenureYears: 25,
      })
    : 0;

  const feesBreakdown = calculateAcquisitionFees({
    purchasePriceAed: estimatedPurchasingPower,
    isMortgage,
    loanAmountAed: estimatedLoan,
  });

  const goldenVisa = checkGoldenVisaEligibility(estimatedPurchasingPower);

  // AI Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Hello. I am your Syntropy Real Estate Copilot. Ask me anything about Dubai property acquisitions, DLD regulations, Golden Visa rules, mortgage stress testing, or community comparisons.',
      timestamp: 'Just now',
    },
  ]);
  const [inputQuestion, setInputQuestion] = useState('');

  const handleSendMessage = (queryText?: string) => {
    const q = (queryText ?? inputQuestion).trim();
    if (!q) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: 'Just now',
    };

    let reply = `Here is what you need to know about that in the Dubai market:\n\nFor custom deals, remember that the Central Bank restricts debt burden to 50% of monthly income, and DLD transfer fees are fixed at 4%.`;

    const lower = q.toLowerCase();
    if (lower.includes('fee') || lower.includes('cost') || lower.includes('dld')) {
      reply = KNOWLEDGE_RESPONSES.fees!;
    } else if (lower.includes('golden visa') || lower.includes('visa') || lower.includes('residency')) {
      reply = KNOWLEDGE_RESPONSES.golden_visa!;
    } else if (lower.includes('oqood') || lower.includes('off-plan') || lower.includes('title deed')) {
      reply = KNOWLEDGE_RESPONSES.oqood!;
    } else if (lower.includes('yield') || lower.includes('return') || lower.includes('rent')) {
      reply = KNOWLEDGE_RESPONSES.yield!;
    }

    const assistantMsg: ChatMessage = {
      id: `ai-${Date.now() + 1}`,
      sender: 'assistant',
      text: reply,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInputQuestion('');
  };

  return (
    <div className="space-y-8 pb-12">
      <PageTitle>Acquisition Plan & AI Copilot</PageTitle>
      <p className="text-xs text-subtle -mt-6">
        Layman roadmap, capital purchasing power calculator, and real estate advisory chat.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Common-Layman Roadmap & Calculator (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Layman Roadmap */}
          <Card className="p-6 border border-line bg-surface">
            <div className="flex items-center gap-2 mb-4">
              <Compass className="size-5 text-brand-600" />
              <h2 className="font-display text-base font-bold text-ink">
                Your 5-Step Acquisition Roadmap
              </h2>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white font-semibold text-[11px]">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-ink">Establish Cash Reserves & Budget</h3>
                  <p className="text-subtle mt-0.5">
                    Plan for down payment (20% for residents, 35-40% for non-residents) plus 7% for DLD, broker, and registration fees.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-600/20 text-brand-600 font-semibold text-[11px]">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-ink">Mortgage Pre-Approval (if financing)</h3>
                  <p className="text-subtle mt-0.5">
                    Secure an In-Principle Approval (IPA) from a UAE lender. Valid for 60-90 days, ensuring your Central Bank DBR stays under 50%.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-600/20 text-brand-600 font-semibold text-[11px]">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-ink">Property Shortlisting & Intent Matching</h3>
                  <p className="text-subtle mt-0.5">
                    Compare prime developers (Emaar, Sobha, Damac) vs high-yield suburban hubs (JVC, Dubai South) based on net yield and service charges.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-600/20 text-brand-600 font-semibold text-[11px]">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-ink">Sign Form F (MOU) & Trustee Transfer</h3>
                  <p className="text-subtle mt-0.5">
                    Sign standard DLD Contract F with 10% deposit. Complete title deed transfer at an authorized Registration Trustee office.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-600/20 text-brand-600 font-semibold text-[11px]">
                  5
                </div>
                <div>
                  <h3 className="font-semibold text-ink">Handover, Ejari Leasing & Golden Visa</h3>
                  <p className="text-subtle mt-0.5">
                    Register tenant lease on DLD Ejari system. If property value is AED 2,000,000 or greater, apply for the 10-Year Golden Visa.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* 2. Interactive Purchasing Power Calculator */}
          <Card className="p-6 border border-line bg-surface space-y-4">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div className="flex items-center gap-2">
                <Coins className="size-5 text-emerald-600" />
                <h2 className="font-display text-base font-bold text-ink">
                  Purchasing Power Estimator
                </h2>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setIsMortgage(true)}
                  className={`rounded-field px-2.5 py-1 font-medium transition cursor-pointer ${
                    isMortgage
                      ? 'bg-brand-600 text-white font-semibold'
                      : 'bg-surface-subtle text-subtle border border-line'
                  }`}
                >
                  Mortgage
                </button>
                <button
                  type="button"
                  onClick={() => setIsMortgage(false)}
                  className={`rounded-field px-2.5 py-1 font-medium transition cursor-pointer ${
                    !isMortgage
                      ? 'bg-brand-600 text-white font-semibold'
                      : 'bg-surface-subtle text-subtle border border-line'
                  }`}
                >
                  All Cash
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label htmlFor="equity-slider" className="font-medium text-subtle">
                  Available Liquid Equity (Down Payment + Fees)
                </label>
                <span className="font-display font-bold text-sm text-ink">
                  {formatMoney(targetEquityAed, 'AED')}
                </span>
              </div>
              <input
                id="equity-slider"
                type="range"
                min="200000"
                max="5000000"
                step="50000"
                value={targetEquityAed}
                onChange={(e) => setTargetEquityAed(Number(e.target.value))}
                className="w-full accent-brand-600 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 rounded-field bg-surface-subtle p-3.5 border border-line text-xs">
              <div>
                <span className="text-[10px] text-subtle block">Max Property Price</span>
                <span className="font-display font-bold text-sm text-brand-600">
                  {formatMoney(estimatedPurchasingPower, 'AED')}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-subtle block">
                  {isMortgage ? 'Est. Monthly EMI' : 'Financing Structure'}
                </span>
                <span className="font-display font-semibold text-sm text-ink">
                  {isMortgage ? `${formatMoney(estimatedEmi, 'AED')} / mo` : '100% Cash'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-subtle block">Golden Visa</span>
                <span className="font-display font-semibold text-xs text-ink flex items-center gap-1 mt-0.5">
                  {goldenVisa.isEligible ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                      <CheckCircle2 className="size-3.5" /> Qualified
                    </span>
                  ) : (
                    <span className="text-amber-600">Under AED 2.0M</span>
                  )}
                </span>
              </div>
            </div>

            <div className="text-[11px] text-subtle space-y-1 pt-1">
              <div className="flex justify-between">
                <span>Estimated DLD 4% & Trustee Fees:</span>
                <span className="font-medium text-ink">{formatMoney(feesBreakdown.totalAcquisitionFeesAed, 'AED')}</span>
              </div>
              {isMortgage && (
                <div className="flex justify-between">
                  <span>Mortgage Loan (80% LTV at 4.5% / 25 yrs):</span>
                  <span className="font-medium text-ink">{formatMoney(estimatedLoan, 'AED')}</span>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column: AI Real Estate Copilot Chat (5 cols) */}
        <div className="lg:col-span-5">
          <Card className="flex flex-col h-[650px] border border-line bg-surface overflow-hidden">
            {/* Chat Header */}
            <div className="flex items-center gap-2.5 border-b border-line p-4 bg-surface-subtle/50">
              <div className="flex size-8 items-center justify-center rounded-full bg-brand-600 text-white">
                <Bot className="size-4" />
              </div>
              <div>
                <h3 className="font-display text-sm font-bold text-ink">Real Estate AI Copilot</h3>
                <p className="text-[10px] text-subtle">
                  Domain specialist in Dubai real estate rules and metrics.
                </p>
              </div>
            </div>

            {/* Chat Thread Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-card p-3 whitespace-pre-line leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-brand-600 text-white'
                        : 'bg-surface-subtle text-ink border border-line'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Prompt Pills */}
            <div className="px-4 py-2 border-t border-line/60 bg-surface flex flex-wrap gap-1.5">
              {PRESET_QUESTIONS.slice(0, 2).map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => handleSendMessage(q)}
                  className="rounded-full bg-surface-subtle hover:bg-line/60 border border-line px-2.5 py-1 text-[10px] text-subtle transition cursor-pointer text-left truncate max-w-full"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-line bg-surface">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputQuestion}
                  onChange={(e) => setInputQuestion(e.target.value)}
                  placeholder="Ask about DLD fees, yields, Golden Visa..."
                  className="flex-1 rounded-field border border-line bg-surface px-3 py-2 text-xs text-ink focus:border-brand-600 focus:outline-none"
                />
                <Button type="submit" variant="primary" className="h-9 px-3">
                  <Send className="size-3.5" />
                </Button>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
