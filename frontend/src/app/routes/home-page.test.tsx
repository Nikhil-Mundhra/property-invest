import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it } from 'vitest';
import { HomePage } from './home-page.tsx';

let client: QueryClient;

describe('HomePage', () => {
  beforeEach(() => {
    client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  });

  it('renders the core hero, badge, and the triad foundations', () => {
    render(
      <QueryClientProvider client={client}>
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // Hero title & badge
    expect(screen.getByRole('heading', { level: 1, name: /Hyper-personalized Dubai real estate investment and acquisition/i })).toBeVisible();
    expect(screen.getAllByText(/Dubai Real Estate Intelligence/i).length).toBeGreaterThanOrEqual(1);

    // Triad pillars
    expect(screen.getByRole('heading', { name: /The Triad Architecture Required for Fiduciary Real Estate Execution/i })).toBeVisible();
    expect(screen.getByText(/Pillar 1 · Statutory Kernel/i)).toBeVisible();
    expect(screen.getByText(/Pillar 2 · Deal Room & Portfolio/i)).toBeVisible();
    expect(screen.getByText(/Pillar 3 · Calculation Shield/i)).toBeVisible();
  });

  it('interactively toggles scenarios in the neuro-symbolic simulator', async () => {
    render(
      <QueryClientProvider client={client}>
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // Default scenario: Golden Visa
    expect(screen.getByText(/Scenario 1: 2026 Golden Visa Eligibility/i)).toBeVisible();
    expect(screen.getByText(/Erroneous Rejection \(Outdated Heuristic\)/i)).toBeVisible();
    expect(screen.getByText(/Qualified under 2026 DLD Circular/i)).toBeVisible();

    // Switch to Scenario 2: Off-Plan mortgage cap
    const scenario2Btn = screen.getByRole('button', { name: /Scenario 2: CBUAE Off-Plan Mortgage Borrowing/i });
    await userEvent.click(scenario2Btn);

    expect(screen.getByText(/Over-Leveraged Borrowing Advice/i)).toBeVisible();
    expect(screen.getByText(/Strict 50% Off-Plan Statutory Cap Enforced/i)).toBeVisible();

    // Switch to Scenario 3: Direct developer friction
    const scenario3Btn = screen.getByRole('button', { name: /Scenario 3: Direct Developer vs Resale Cash Friction/i });
    await userEvent.click(scenario3Btn);

    expect(screen.getByText(/Vague 5% to 7% Heuristic Rule-of-Thumb/i)).toBeVisible();
    expect(screen.getByText(/Itemized Statutory Cost Schedules/i)).toBeVisible();
  });

  it('navigates documentation subtabs and renders the respective images and content', async () => {
    render(
      <QueryClientProvider client={client}>
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // Default documentation subtab is DLD Fee Schedules
    const advisorImg = screen.getByAltText(/Advisor and client conducting an institutional wealth review/i);
    expect(advisorImg).toBeVisible();

    // Switch to CBUAE Mortgage Caps subtab
    const mortgageTab = screen.getByRole('tab', { name: /CBUAE Mortgage Caps/i });
    await userEvent.click(mortgageTab);

    // Image 2: Market shock should now be rendered
    const shockImg = screen.getByAltText(/Late-night trading desk showing a plummeting stock chart/i);
    expect(shockImg).toBeVisible();

    // Switch to Developer vs Resale subtab
    const wedgeTab = screen.getByRole('tab', { name: /Developer vs. Resale/i });
    await userEvent.click(wedgeTab);

    expect(screen.getByRole('heading', { name: /B2B2C Advisor Co-Pilot/i })).toBeVisible();
    expect(screen.getByRole('heading', { name: /B2C Direct Wealth Advisor/i })).toBeVisible();
  });

  it('provides a clean Documentation dropdown in the navbar', async () => {
    render(
      <QueryClientProvider client={client}>
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const docNavBtn = screen.getByRole('button', { name: /Statutory Guide/i });
    expect(docNavBtn).toBeVisible();

    // Click to open dropdown
    await userEvent.click(docNavBtn);
    expect(screen.getByText(/UAE & Dubai Standards/i)).toBeVisible();
    expect(screen.getByRole('button', { name: /Statutory DLD Fee Schedules/i })).toBeVisible();
  });

  it('navigates to statutory rules when clicking "View Statutory Rules" in hero', async () => {
    render(
      <QueryClientProvider client={client}>
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const viewRulesBtn = screen.getByRole('button', { name: /View Statutory Rules/i });
    expect(viewRulesBtn).toBeVisible();

    await userEvent.click(viewRulesBtn);

    // DLD Fee Schedules subtab should now be selected and its content rendered
    expect(screen.getByRole('tab', { name: /DLD Fee Schedules/i })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('heading', { name: /Official Dubai Land Department Fee Schedules/i })).toBeVisible();
  });

  it('renders the interactive deal room showcase with proportional cards', () => {
    render(
      <QueryClientProvider client={client}>
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByRole('heading', { name: /Proportional Portfolio Modeling & Interactive Deal Room/i })).toBeVisible();
    expect(screen.getByText(/Sobha Hartland Greens/i)).toBeVisible();
    expect(screen.getByText(/Dubai Hills Park Ridge/i)).toBeVisible();
    expect(screen.getByText(/Palm Jebel Ali Beach Villa/i)).toBeVisible();
  });
});
