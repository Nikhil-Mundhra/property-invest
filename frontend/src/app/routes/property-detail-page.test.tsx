import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PropertyDetailPage } from './property-detail-page.tsx';

let client: QueryClient;

function renderDetailPage(propertyId: string) {
  render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[`/investments/${propertyId}`]}>
        <Routes>
          <Route path="/investments/:id" element={<PropertyDetailPage />} />
          <Route path="/investments" element={<p>Investments Page</p>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('PropertyDetailPage', () => {
  beforeEach(() => {
    client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders property not found state when invalid id is supplied', async () => {
    renderDetailPage('invalid-id-999');

    expect(screen.getByText('Property Not Found')).toBeVisible();
    expect(screen.getByText(/The property reference could not be located/)).toBeVisible();
    expect(screen.getByRole('link', { name: 'Return to Portfolio' })).toBeVisible();
  });

  it('renders complete deal room for owned ready resale property', async () => {
    renderDetailPage('prop-sobha-hartland-2br');

    expect(await screen.findByText('Waves Grande 2BR Waterfront')).toBeVisible();
    expect(screen.getByText('Sobha Realty')).toBeVisible();
    expect(screen.getByText('Sobha Hartland, MBR City')).toBeVisible();

    // Golden Visa Section (Qualifies with AED 2,450,000 valuation)
    expect(screen.getByText('UAE Golden Visa 10-Year')).toBeVisible();
    expect(screen.getByText('Eligible Asset')).toBeVisible();
    expect(screen.getByText(/20 February 2026 DLD Circular/)).toBeVisible();

    // Acquisition Cash Outlay & CBUAE 2025 Mandate
    expect(screen.getByText('Acquisition Cash Outlay')).toBeVisible();
    expect(screen.getByText(/February 2025 CBUAE Mandate/)).toBeVisible();

    // Performance & Cashflow Engine
    expect(screen.getByText('Returns & Cash Flow Engine')).toBeVisible();
    expect(screen.getByText('Net Operating Income (NOI)')).toBeVisible();
  });

  it('renders off-plan milestone payment schedule for off-plan acquisitions', async () => {
    renderDetailPage('prop-creek-waters-3br');

    expect(await screen.findByText('Creek Waters 3BR Island District')).toBeVisible();
    expect(screen.getByText('Off-Plan (2027)')).toBeVisible();

    // Milestone schedule
    expect(screen.getByText('Off-Plan Milestone Payment Schedule')).toBeVisible();
    expect(screen.getByText('Booking')).toBeVisible();
    expect(screen.getByText('7 Installments')).toBeVisible();
    expect(screen.getByText('Q4 2027')).toBeVisible();
    expect(screen.getByText(/Oqood Pre-Title Deed Registration Confirmed/)).toBeVisible();
  });

  it('supports stress testing interest rates', async () => {
    renderDetailPage('prop-sobha-hartland-2br');

    expect(await screen.findByText('Base (4.45%)')).toBeVisible();
    const stressOneBtn = screen.getByRole('button', { name: '+1% Stress' });
    await userEvent.click(stressOneBtn);

    expect(screen.getByText(/Annual Mortgage Debt Service \(5.45%\)/)).toBeVisible();
  });
});
