import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { clearSession, setAccessToken } from '../../features/auth/session/session-store.ts';
import { setLocale } from '../../lib/locale-store.ts';
import { DashboardPage } from './dashboard-page.tsx';

let client: QueryClient;

function stubMe(status = 200, roles: string[] = ['USER'], email = 'testing@example.com') {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => new Response(JSON.stringify({ id: 'u-1', email, displayName: null, roles, emailVerified: true, createdAt: '2026-01-01T00:00:00.000Z' }), { status, headers: { 'content-type': 'application/json' } })),
  );
}

function renderDashboard() {
  render(
    <QueryClientProvider client={client}>
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('DashboardPage', () => {
  beforeEach(() => {
    client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    setLocale('en');
    stubMe();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    clearSession();
  });

  it('renders executive real estate metrics and portfolio allocations', async () => {
    renderDashboard();

    expect(await screen.findByRole('heading', { name: 'Real Estate Portfolio Dashboard' })).toBeVisible();
    expect(screen.getByText('Total Asset Valuation')).toBeVisible();
    expect(screen.getByText('Net Invested Equity')).toBeVisible();
    expect(screen.getByText('Monthly Net Cashflow')).toBeVisible();
    expect(screen.getByText('UAE Golden Visa (10-Yr)')).toBeVisible();

    // Geographic exposure and Strategy sections
    expect(screen.getByText('Geographic District Exposure')).toBeVisible();
    expect(screen.getByText('Acquisition Strategy & Asset Mix')).toBeVisible();
    expect(screen.getByText('Ready Resale')).toBeVisible();
    expect(screen.getByText('Off-Plan Growth')).toBeVisible();

    // Action buttons
    expect(screen.getByRole('link', { name: /Strategic Plan/ })).toBeVisible();
    expect(screen.getByRole('button', { name: /Add Property/ })).toBeVisible();
  });

  it('opens add property modal when clicking Add Property', async () => {
    renderDashboard();

    expect(await screen.findByRole('heading', { name: 'Real Estate Portfolio Dashboard' })).toBeVisible();
    const addBtn = screen.getByRole('button', { name: /Add Property/ });
    await userEvent.click(addBtn);

    expect(await screen.findByRole('dialog')).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Add Property' })).toBeVisible();
  });

  it('shows a loading frame without demo fixtures while roles resolve', async () => {
    vi.unstubAllGlobals();
    vi.stubGlobal('fetch', vi.fn(() => new Promise<Response>(() => {})));
    renderDashboard();

    expect(await screen.findByText('Loading')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Real Estate Portfolio Dashboard' })).toBeNull();
  });

  it('sends a failed session to login without demo fixtures', async () => {
    vi.unstubAllGlobals();
    stubMe(401);
    render(
      <QueryClientProvider client={client}>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/login" element={<p>Client Login</p>} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(await screen.findByText('Client Login')).toBeVisible();
    expect(screen.queryByRole('heading', { name: 'Real Estate Portfolio Dashboard' })).toBeNull();
  });

  it('shows the retry state instead of bouncing to login when the token exists', async () => {
    vi.unstubAllGlobals();
    setAccessToken('token');
    stubMe(401);
    renderDashboard();

    expect(await screen.findByText('Session lookup failed')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Retry' })).toBeVisible();
    expect(screen.queryByRole('heading', { name: 'Real Estate Portfolio Dashboard' })).toBeNull();
  });
});
