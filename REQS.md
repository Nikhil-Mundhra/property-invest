# Requirements: Syntropy Real Estate

Working specification and backlog for Syntropy: a hyper-personalized real estate investment and home acquisition platform focused on the UAE (Dubai) market across all asset classes.

Status tags: `todo` scoped for implementation · `in-progress` active work · `parked` intentionally deferred · `done` implemented and tested.

---

## 1. Executive Summary & Core Pivot

Syntropy transitions from a liquid wealth advisory platform to an intelligent real estate copilot and acquisition operating system.

- **Primary Market:** UAE / Dubai (off-plan and secondary market).
- **Asset Classes:** Apartments, villas, townhouses, holiday homes (short-term rentals), and commercial units.
- **Operating Modes:**
  - **B2C Mode (Investor / Buyer Direct):** Individual investors or homebuyers seeking personalized recommendations, cashflow modeling, and ad-hoc deal evaluation.
  - **B2B2C Mode (Broker / Advisor Copilot):** Real estate brokers, wealth managers, and family offices managing multiple buyer profiles, generating customized client deal decks, and running portfolio scenario analyses.
- **Dual Intent Architecture:**
  - **Investment Engine:** Focuses on Net Rental Yield, Capital Appreciation, 5-to-10 year IRR, Cash-on-Cash Return, Golden Visa qualification, and short-term vs long-term rental arbitrations.
  - **Personal Housing Engine:** Focuses on end-user lifestyle, family requirements, school and metro proximity, community infrastructure, annual service charges, and total cost of ownership.

---

## 2. Target Personas & Profiles

### 2.1 Investor Personas (B2C & B2B2C Clients)
- **The Yield Maximizer:** High net-yield focus (e.g. JVC, Dubai South, studio/1BR off-plan or short-term holiday lets, cash-flow heavy).
- **The Capital Growth / Off-Plan Speculator:** Focus on Tier-1 master developers (Emaar, Sobha, Meraas) in developing master communities (Dubai Creek Harbour, Dubai Hills Estate, Palm Jebel Ali), leveraging staged construction payment plans.
- **The Golden Visa Aspirant:** Purchases qualifying properties at or above AED 2,000,000 equity threshold to secure UAE 10-year residency for family.
- **The End-User Family Buyer:** Searching for primary residency (e.g. Arabian Ranches, Dubai Hills, Tilal Al Ghaf); priority on green spaces, school catchment areas, layout efficiency, and reasonable service charges.
- **The Luxury Trophy Asset Buyer:** Prime waterfront and ultra-luxury (Palm Jumeirah, Downtown Dubai, Jumeirah Bay Island); focused on exclusivity, capital preservation, and liquidity.

### 2.2 Broker / Advisor Persona (B2B2C Operator)
- Licensed agent or private client advisor curating deals, tailoring unit comparisons, tracking client communication history, and generating branded advisory reports.

---

## 3. Product Features & Modules

### 3.1 Investor & Buyer Profiling Questionnaire (`todo`)
Dynamic intake flow categorizing client parameters:
- **Acquisition Intent:** Pure Investment vs Primary Residence vs Hybrid (vacation home + seasonal lease).
- **Budget & Capital Structure:**
  - Cash purchase vs Mortgage.
  - Total equity available (AED, USD, EUR, GBP).
  - UAE Resident vs Non-Resident expat status (affects Central Bank LTV regulations: 80% resident vs 60-70% non-resident).
- **Target Horizons & Return Expectations:**
  - Target net yield percentage (e.g. 6% to 9%+).
  - Target holding period (off-plan flip on completion vs 5-year hold vs generational asset).
- **Lifestyle & Space Requirements (for End-Users):**
  - Unit type, bedroom count, maid's room, private pool, proximity to schools or business hubs (DIFC, Business Bay).

### 3.2 Property Catalog & Seed Dataset (`todo`)
Curated, high-fidelity Dubai dataset covering major districts and developers:
- **Off-Plan Developments:** Emaar (Dubai Hills, Creek Harbour), Sobha (Sobha Hartland), Damac (Damac Lagoons, Riverside), Ellington, Nakheel. Includes milestone payment plans (e.g. 60/40, 70/30, 80/20 on handover).
- **Secondary / Ready Properties:** Downtown Dubai, Dubai Marina, Business Bay, JVC, Jumeirah Golf Estates.
- **Data Attributes per Property:**
  - Location coordinates, sub-community, developer, completion date.
  - Unit mix, sqft, price per sqft, total price in AED.
  - Projected gross rental yield, historical district appreciation rate.
  - Estimated Dubai Land Department (DLD) fees (4%), registration trustee fees, and service charges per sqft.
  - High-resolution architectural photography and masterplan tags.

### 3.3 Ad-Hoc Deal Analyzer (`todo`)
Allows users to evaluate any prospective property outside the catalog:
- **Input Methods:**
  - Enter custom metrics manually (Purchase price, unit type, location, expected rent, service charge).
  - URL ingestion (Paste listing link from major portals to extract key metrics).
- **Instant Output:**
  - Total Acquisition Cost Breakdown (Price + 4% DLD fee + 2% Agency fee + Trustee/Admin fees + NOC charges).
  - Mortgage Calculation (Down payment, interest rate, term, monthly EMI vs expected rent).
  - Net Yield and Cash-on-Cash Return.
  - Golden Visa eligibility indicator.
  - Risk and sensitivity report (vacancy rates, interest rate hikes, service fee escalations).

### 3.4 Deterministic Real Estate Rules Engine (`todo`)
Codified mathematical rules residing in `rules/`:
- **Acquisition Fees Rule:** 4% DLD fee, AED 4,000 + 5% VAT trustee registration fee, 2% broker commission + VAT, mortgage registration fee (0.25% of loan amount + AED 290).
- **UAE Central Bank Mortgage Cap Rule:** LTV ceilings based on property value and residency status (Resident: up to 80% for first property below AED 5M, 70% above AED 5M; Non-resident: 60-70%).
- **Golden Visa Qualification Rule:** Minimum AED 2,000,000 property value (or accumulated value across properties; mortgage permitted if down payment meets equity requirement).
- **Yield & Cashflow Rules:**
  - Gross Yield = `(Annual Rent / Purchase Price) * 100`
  - Net Yield = `((Annual Rent - Annual Service Charge - Maintenance Reserve - Management Fee) / Total Acquisition Cost) * 100`
  - Cash-on-Cash Return = `(Net Annual Cashflow / Actual Cash Invested) * 100`
  - 10-Year Discounted Cash Flow (DCF) & Internal Rate of Return (IRR).

### 3.5 Side-by-Side Deal Comparison Deck (`todo`)
- Compare up to 3 units simultaneously across capital required, payment schedule, projected net rent, capital growth forecast, and end-user amenity scores.
- Exportable client summary deck (PDF or shareable link) for advisors presenting to buyers.

### 3.6 Hyper-Personalized AI Copilot (`todo`)
- AI conversational agent backed by the deterministic rules engine.
- Capabilities:
  - Answering granular client queries (e.g. "What is my cash outlay before handover for an Emaar 2BR in Creek Harbour with an 80/20 plan?").
  - Stress testing deals against interest rate shocks and vacancy scenarios.
  - Evaluating trade-offs between short-term holiday home rentals (DTCM licensed) vs traditional 1-year Ejari contracts.
  - Personal home guidance (e.g. "Which sub-community in Dubai Hills has the shortest commute to Downtown and is under AED 3,500,000?").

---

## 4. Architectural Boundaries

- **`rules/`:** Zero external dependencies. Pure TypeScript functions and validation rules for UAE property laws, fee schedules, yield calculations, and residency thresholds.
- **`contracts/`:** Zod schemas and TypeScript types defining property models, investor profiles, mortgage parameters, and deal evaluations.
- **`backend/`:** Express/Node API providing property catalog queries, ad-hoc listing parsing, personalized recommendation algorithms, and AI agent endpoints.
- **`frontend/`:** React 19, Tailwind CSS, Lucide SVG icons, responsive glassmorphic cards, deal calculators, comparison grids, and interactive Dubai map/neighborhood views.

---

## 5. Implementation Roadmap

### Phase 1: Foundation & Real Estate Domain Cleanups
- Remove legacy wealth/stock/bond calculation rules and replace with UAE real estate rules.
- Define property and deal contracts in `contracts/`.
- Build the core curated Dubai seed catalog (top developers and communities).
- Implement the ad-hoc deal evaluation calculator.

### Phase 2: User Onboarding & Personalized Matching Engine
- Build the dual-intent onboarding flow (Investment vs Personal Home).
- Implement algorithmic scoring matching user budget, residency, and yield goals against properties.
- Dual-role dashboard (toggle between Investor direct view and Broker client-management view).

### Phase 3: AI Copilot & Deal Comparisons
- Connect AI chat agent to real estate domain rules and catalog context.
- Implement side-by-side multi-property comparison matrix.
- Exportable deal sheets and sharing links.
