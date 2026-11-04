<p align="center">
  <a href="https://github.com/Nikhil-Mundhra/property-invest">
    <img alt="Syntropy AI" src="docs/assets/logo-small.png" width="120">
  </a>
</p>

<h1 align="center">Syntropy</h1>

<p align="center">
  <b>Hyper-personalized UAE and Dubai real estate investment and home acquisition platform. Models narrate. Statutory engines compute.</b>
</p>

<p align="center">
  <img alt="Node 22" src="https://img.shields.io/badge/node-22-339933?style=flat-square&logo=node.js&logoColor=white">
  <img alt="React 19" src="https://img.shields.io/badge/react-19-61DAFB?style=flat-square&logo=react&logoColor=black">
  <img alt="TypeScript 5.9" src="https://img.shields.io/badge/typescript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white">
  <img alt="PostgreSQL 16" src="https://img.shields.io/badge/postgresql-16-4169E1?style=flat-square&logo=postgresql&logoColor=white">
  <img alt="Tailwind 4" src="https://img.shields.io/badge/tailwind-4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white">
</p>

<p align="center">
  <a href="#quick-start">Quick Start</a> ·
  <a href="#executive-summary">Executive Summary</a> ·
  <a href="#statutory-rule-engines">Statutory Rule Engines</a> ·
  <a href="#core-features">Core Features</a> ·
  <a href="#architecture">Architecture</a> ·
  <a href="#replit-deployment">Replit Deployment</a>
</p>

<table>
<tr>
<td width="50%" valign="top"><img src="docs/assets/ss0-small.jpg" alt="Syntropy real estate dashboard overview" width="100%"><p align="center"><sub>Real estate portfolio dashboard: valuations, net rental yields, Golden Visa eligibility, and district exposure.</sub></p></td>
<td width="50%" valign="top"><img src="docs/assets/ss1-small.jpg" alt="Deal room and property acquisition analytics" width="100%"><p align="center"><sub>Interactive Deal Room: statutory acquisition friction, stress-tested cashflows, and off-plan milestones.</sub></p></td>
</tr>
</table>

## Quick Start

Requirements: Node 22 or later and npm 10 or later.

```bash
# 1. Install workspace packages
make install

# 2. Start backend on :3000 and web on :5173
make dev
```

Open [http://localhost:5173](http://localhost:5173). The app initializes with benchmark Dubai properties and full portfolio analytics.

Production build:

```bash
make build
make prod
```

## Tests

```bash
# All workspace tests (frontend + backend)
make test

# Frontend unit & component tests
npm test -w frontend

# Backend unit & integration tests
node --test backend/test/unit/rules/*.ts backend/test/unit/core/db/*.test.ts backend/test/unit/properties/*.test.ts

# Linter and integrity verification
make typecheck
make deps-lint
make docs-lint
```

## Contents

- [Executive Summary](#executive-summary)
- [Statutory Rule Engines](#statutory-rule-engines)
- [Core Features](#core-features)
- [Architecture](#architecture)
- [Replit Deployment](#replit-deployment)
- [Strict Design Policies](#strict-design-policies)
- [Disclaimer](#disclaimer)

## Executive Summary

Dubai's real estate market represents one of the world's most dynamic capital destinations. However, individual buyers, cross-border investors, and residents face severe regulatory and financial fragmentation:
- Complex Dubai Land Department (DLD) transfer and trustee fee schedules.
- Shifting statutory requirements for the 10-year UAE Golden Visa.
- Strict Central Bank of the UAE (CBUAE) mortgage loan-to-value (LTV) and debt-burden ratio (DBR) ceilings.
- Opaque developer off-plan milestone payment plans.

Generic consumer LLMs frequently hallucinate statutory calculations: misquoting required liquid down payments, ignoring mandatory DLD administrative charges, or failing Central Bank borrowing constraints.

**Syntropy** solves this through a **Neuro-Symbolic Real Estate Operating System**:
- **Statutory engines compute:** Pure deterministic TypeScript functions enforce official regulatory directives from the Dubai Land Department, CBUAE Circular No. 31/2013, and the February 2026 DLD Golden Visa circular.
- **Models narrate:** AI Copilots formulate conversational, personalized explanations guided by an active calculation shield that strips any unverified numbers.

## Statutory Rule Engines

The platform implements deterministic underwriting modules:

| Regulatory Directive | Statutory Module | Governing Rules & Calculation Standard |
|---|---|---|
| **2026 UAE Golden Visa Circular** | [`uae-golden-visa.rule.ts`](rules/src/uae-golden-visa.rule.ts) | Enforces the 20 February 2026 DLD circular standards: AED 2,000,000 minimum certified purchase value or valuation on Title Deed or Oqood; **0% minimum paid-up equity** requirement beyond standard bank down payment; Bank NOC verification; spouse combined ownership; and AED 9,884.75 DLD Cube primary fee. |
| **CBUAE Circular No. 31/2013** | [`uae-mortgage.rule.ts`](rules/src/uae-mortgage.rule.ts) | Enforces Central Bank mortgage caps: Resident Expat first home capped at 80% (<= AED 5M) / 70% (> AED 5M); second home capped at 60%; Non-Resident Expat capped at 50% to 60%; **Off-Plan capped at 50% flat LTV** (Article 3); 25-year maximum tenure; 50% maximum Debt Burden Ratio (DBR) including 5% credit card limits; and 2-month void rental haircut. |
| **DLD & Resale Fee Schedules** | [`uae-property-fees.rule.ts`](rules/src/uae-property-fees.rule.ts) | 4% DLD registration fee + AED 580 admin; Ready trustee fees (AED 4,200 for >= 500k, AED 2,100 for < 500k); Direct developer off-plan: **0% buyer broker commission** and resale trustee fee exemption (AED 1,000 Oqood developer fee); Secondary broker fee (2% + 5% VAT); Financing friction (0.25% loan + AED 290, 0.75% bank processing, AED 3,000 valuation, AED 1,050 ready / AED 5,250 off-plan mortgage trustee fee); and February 2025 CBUAE liquid cash upfront mandate. |
| **Property Yields & Cashflow** | [`property-yield.rule.ts`](rules/src/property-yield.rule.ts) | Computes gross rental yield, Net Operating Income (NOI), net rental yield, annual and monthly net cashflow, cash-on-cash return, and underwritten rent incorporating a mandatory 2-month void period. |
| **Personal Housing Ownership** | [`personal-housing.rule.ts`](rules/src/personal-housing.rule.ts) | Calculates total monthly cost of ownership (Mortgage EMI + Monthly service charge + Utilities) and composite lifestyle suitability scoring across location, layout, amenities, and family suitability. |

## Core Features

### 1. Executive Dashboard
- **Portfolio Metrics:** Real-time tracking of aggregate property valuation, total equity invested, total mortgage balance, weighted gross/net yields, and net monthly cashflow.
- **Golden Visa Tracker:** Automatic qualification badge and exact equity shortfall calculation toward the AED 2,000,000 threshold.
- **Geographic & Strategy Exposure:** District allocation across prime Dubai corridors (Sobha Hartland, Dubai Hills Estate, JVC, Creek Harbour, Palm Jebel Ali, and Downtown Dubai) alongside investment vs. personal home breakdown.

### 2. Investments & Deal Room
- **Dual Section Organization:** Clear separation between **Owned Portfolio** and **Planned Acquisitions**.
- **Proportional Card Sizing:** Cards dynamically adjust their visual weight (small to medium) relative to the property's equity contribution to the overall portfolio.
- **Interactive Deal Room (`/investments/:id`):** Deep dive into individual properties featuring acquisition cash outlay, mortgage amortization schedules, +100bps / +200bps interest rate stress tests, and off-plan milestone payment timelines.
- **Add Property Modal:** Comprehensive intake supporting cash vs. mortgage financing, off-plan developer direct purchases, service charges per sqft, and payment milestone plans.

### 3. Layman Acquisition Planner & AI Copilot
- **5-Step Roadmap:** Layman acquisition guide (Budgeting -> Statutory Readiness -> Unit Selection -> Financing & Oqood -> Handover & Ejari).
- **Purchasing Power Calculator:** Interactive tool estimating maximum property affordability from monthly income, liquid capital, and residency status.
- **Real Estate Copilot:** Context-aware chat with calculation shield verification, providing grounded advice on yields, mortgages, and DLD regulations.

## Architecture

Syntropy is structured as an orchestrated multi-workspace monorepo:

```
rules (pure kernel, zero deps)
  ^
  |
contracts (Zod schemas, request/response DTOs)
  ^                    ^
  |                    |
backend (Hono/Node 22) frontend (React 19, Vite, Tailwind 4)
```

- **`rules`**: Pure domain functions, validation patterns, error codes, and statutory formulas.
- **`contracts`**: Strict Zod contracts shared across backend and frontend.
- **`backend`**: Modular architecture built on Hono. Features REST endpoints (`/api/properties`, `/api/auth`, `/api/advisory`, `/api/health`).
- **`frontend`**: React 19 single-page application using Tailwind CSS v4, Lucide vector icons, and an external store with optimistic mutations and background synchronization.

## Replit Deployment

Syntropy is designed for seamless deployment on Replit using native PostgreSQL:
- **Environment Configuration:** Configured via [.replit](.replit) running Node 22, Web, and PostgreSQL 16 on port 3000.
- **PostgreSQL Document Store:** [`postgres-client.ts`](backend/src/core/db/connection/postgres-client.ts) manages a connection pool with `sslmode=disable` support and automatically initializes the `syntropy_documents` JSONB store.
- **Database Connection String:**
  ```bash
  DATABASE_URL=postgresql://postgres:password@helium/heliumdb?sslmode=disable
  ```
- **Deployment Command:**
  ```bash
  npm run build && npm start
  ```

## Strict Design Policies

- **Strict No-Emoji Policy:** Prohibited across all UI components, copy, code, commit messages, and documentation. All visual indicators, badges, and status symbols use vector SVG icons (Lucide React).
- **Client Boundary:** Zero broker/advisor CTAs or persona switchers in client views.
- **Typography:** Strict avoidance of em-dashes across all code and documentation; standard hyphens, colons, or commas are used exclusively.

## Disclaimer

Sandbox mode. Financial calculations and statutory evaluations reflect regulatory guidelines as of early 2026. This platform is an analytical tool and does not constitute formal financial, legal, or real estate brokerage advice.
