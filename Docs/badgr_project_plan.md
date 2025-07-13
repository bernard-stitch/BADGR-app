# BADGR Project Plan

## Objective
Build and deploy a Shopify app (BADGR) that enables merchants to insert payment method logos and BNPL promotional widgets on their product pages without editing code. MVP will focus on Shopify theme app extensions, a Supabase-backed backend, and an embedded admin UI.

---

## High-Level Phases
1. **Scaffolding & Environment Setup**
2. **Backend (Supabase) Setup & Integration**
3. **Theme App Extension (Frontend Widget)**
4. **Admin UI (Configuration Panel)**
5. **Data Wiring & Integration**
6. **Testing Across Themes**
7. **QA, Polish & Dev Store Deployment**

---

## Dependencies
- Shopify Partner Account and CLI set up
- Supabase project with appropriate tables and access roles
- Basic branding assets (app name, placeholder logo)
- Dev stores for testing
- Vercel (or equivalent) account for hosting backend

---

## Phase 1: Environment Setup
**Goal:** Establish all foundational tooling and access to development resources.

### Tasks:
- [ ] Create Shopify Partner account and dev store
- [ ] Install Shopify CLI and test connectivity
- [ ] Scaffold app using `shopify app dev` (React, Theme Extension, DevMCP)
- [ ] Set up version control in GitHub/Source control
- [ ] Set up Supabase project and invite contributors
- [ ] Establish test theme list and clone into dev stores

### Output:
- Local dev environment functional
- Initial commit in Git
- DevMCP scaffold ready

---

## Phase 2: Backend Setup (Supabase)
**Goal:** Set up Supabase for storing merchant config data.

### Tasks:
- [ ] Define schema: merchant_id, widget_type, logo_list, placement, active_state
- [ ] Configure Supabase Row Level Security (RLS) for multi-tenant isolation
- [ ] Generate Supabase service role key for server interaction
- [ ] Write basic Supabase client module in Node.js for CRUD ops

### Output:
- Supabase ready and tested
- Minimal CRUD operations defined and deployable

---

## Phase 3: Theme App Extension (Widget Block)
**Goal:** Build the Liquid-based App Block to be inserted into product page templates.

### Tasks:
- [ ] Define block settings schema (position, logos, widget toggle)
- [ ] Render selected logos and/or widget script in Liquid
- [ ] Implement layout logic: placement above price vs below add-to-cart
- [ ] Configure default rendering logic (e.g., fallback display if config not loaded)

### Output:
- Working theme extension that renders based on local dev config
- Previewable via Shopify Theme editor

---

## Phase 4: Admin UI
**Goal:** Provide an embedded settings page in Shopify Admin for merchants to configure their widget.

### Tasks:
- [ ] Scaffold embedded React admin page with App Bridge and Polaris
- [ ] Create UI components: logo selector (checkbox grid), placement dropdown, widget toggle
- [ ] Connect to Supabase via secure API routes or client SDK with service role auth
- [ ] Save/retrieve merchant config on interaction

### Output:
- Functional admin UI embedded in Shopify Admin
- Working write/read integration with Supabase

---

## Phase 5: Data Wiring & Integration
**Goal:** Connect frontend widget logic with backend config

### Tasks:
- [ ] Pass merchant store identifier into the storefront extension
- [ ] Fetch widget config (logo list, placement, widget on/off) from Supabase
- [ ] Render logos or widget script dynamically based on config
- [ ] Fallback to default if config not available

### Output:
- Dynamic configuration applied to theme widget
- Logos/scripts appear based on real merchant settings

---

## Phase 6: Testing & QA
**Goal:** Validate correctness and visual consistency across themes

### Tasks:
- [ ] Deploy to 3–5 dev stores with different themes (Dawn, Debut, Craft, Refresh, Sense)
- [ ] Verify rendering on desktop and mobile views
- [ ] Test admin UI workflows (save → refresh → display)
- [ ] Run Jest-based unit tests (React + config logic)
- [ ] Manually test Supabase failures, fallbacks, and edge cases

### Output:
- Known compatibility list of themes
- QA-validated test script

---

## Phase 7: Polish & Deployment
**Goal:** Prepare app for ongoing dev usage and potential App Store listing

### Tasks:
- [ ] Add README for local development
- [ ] Add privacy policy and support contact (hello@paymentsync.co.za)
- [ ] Polish admin UI styling (Polaris compliance)
- [ ] Final test and deploy backend to Vercel
- [ ] Document Supabase schema for future devs

### Output:
- App deployed to dev stores
- Ready for internal use and future enhancements

---

## Timeline Estimate (MVP)
| Phase | Duration (est) |
|-------|----------------|
| Phase 1: Setup | 0.5 day |
| Phase 2: Backend | 1–2 days |
| Phase 3: Theme Widget | 2 days |
| Phase 4: Admin UI | 2–3 days |
| Phase 5: Wiring | 1 day |
| Phase 6: Testing | 1–2 days |
| Phase 7: Polish | 1 day |
| **Total** | **~1.5 weeks** of focused effort |

---

## Notes
- All phases will follow a TDD-first principle
- Work will be tracked in Cursor and structured to allow tight iteration cycles
- MVP intentionally avoids scope creep (e.g. cart page, image uploads, billing)
- Structure is designed to allow future extensibility without major refactors

