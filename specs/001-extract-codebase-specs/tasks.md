# Tasks: ATAD Backend API Implementation

**Input**: Design documents from `specs/001-extract-codebase-specs/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api.md, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to
- Include exact file paths in descriptions

## Path Conventions

- API backend: `prototypes/api/src/` (Node.js/Express)
- Tests: `prototypes/api/tests/`
- Frontend integration: `prototypes/mobile/src/` and `prototypes/admin/src/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, dependencies, and basic tooling

- [X] T001 Create `prototypes/api/` directory with `package.json` and project metadata
- [X] T002 [P] Install Express, cors, helmet, morgan, jsonwebtoken, bcrypt, dotenv, pg, uuid
- [X] T003 [P] Install dev dependencies: nodemon, vitest, supertest, eslint, prettier
- [X] T004 Create `prototypes/api/.env.example` with DATABASE_URL, JWT_SECRET, TWILIO_*, PORT vars
- [X] T005 Create `prototypes/api/.env` with local development defaults
- [X] T006 Create `prototypes/api/src/index.js` with Express app entry point
- [X] T007 [P] Create `prototypes/api/.eslintrc.json` with linting config
- [X] T008 [P] Create `prototypes/api/.prettierrc` with formatting config
- [X] T009 Add `dev`, `start`, `test`, `lint` scripts to `package.json`

**Checkpoint**: Project skeleton ready — `npm run dev` starts the server

---

## Phase 2: Foundational (Blocking Prerequisites)

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T010 Create `prototypes/api/src/config/database.js` with PostgreSQL pool connection
- [X] T011 Create `prototypes/api/src/middleware/errorHandler.js` with global error handling
- [X] T012 Create `prototypes/api/src/middleware/validate.js` with request validation helper
- [X] T013 Create `prototypes/api/src/middleware/auth.js` with JWT verification middleware
- [X] T014 Create `prototypes/api/src/middleware/logger.js` with request logging (morgan + custom)
- [X] T015 Create `prototypes/api/migrations/001_initial.sql` with all table schemas (users, assets, bookings, payments, ratings, notifications, transactions)
- [X] T016 Create `prototypes/api/migrations/run.js` with migration runner script
- [X] T017 Create `prototypes/api/seeds/001_demo_data.sql` with seed data matching existing mock data
- [X] T018 Create `prototypes/api/seeds/run.js` with seed runner script

**Checkpoint**: Foundation ready — database schema created, auth works, requests validated

---

## Phase 3: User Story 1 — Browse & Discover Equipment (Priority: P1) 🎯 MVP

**Goal**: Tenants can list, search, filter, sort, and view equipment assets

**Independent Test**: Can be verified by starting the server, calling `GET /api/v1/assets` with various query params, and confirming correct filtered/sorted results

### Implementation for User Story 1

- [X] T019 [P] [US1] Create Asset model queries in `prototypes/api/src/models/Asset.js`
- [X] T020 [P] [US1] Create Category enum/constants in `prototypes/api/src/models/Category.js`
- [X] T021 [US1] Implement AssetService with list, search, filter, sort, getById in `prototypes/api/src/services/asset.js`
- [X] T022 [US1] Implement GET /api/v1/assets endpoint in `prototypes/api/src/routes/assets.js`
- [X] T023 [US1] Implement GET /api/v1/assets/:id endpoint in `prototypes/api/src/routes/assets.js`
- [X] T024 [US1] Register asset routes with auth middleware in `prototypes/api/src/index.js`

**Checkpoint**: At this point, User Story 1 should be fully functional — assets can be listed, searched, filtered, sorted, and viewed individually

---

## Phase 4: User Story 2 — Phone Auth & Registration (Priority: P1) 🎯 MVP

**Goal**: Users can register via phone number, receive OTP, and authenticate

**Independent Test**: Can be verified by calling `POST /api/v1/auth/send-otp` with a phone number, then `POST /api/v1/auth/verify-otp` with the returned code, and receiving a valid JWT

### Implementation for User Story 2

- [X] T025 [US2] Implement OTP generation/verification service in `prototypes/api/src/services/auth.js`
- [X] T026 [P] [US2] Create User model queries in `prototypes/api/src/models/User.js`
- [X] T027 [US2] Implement POST /api/v1/auth/send-otp in `prototypes/api/src/routes/auth.js`
- [X] T028 [US2] Implement POST /api/v1/auth/verify-otp in `prototypes/api/src/routes/auth.js`
- [X] T029 [US2] Register auth routes in `prototypes/api/src/index.js`

**Checkpoint**: At this point, user authentication works — register, login, and JWT-based session management

---

## Phase 5: User Story 3 — Create & Manage Bookings (Priority: P1) 🎯 MVP

**Goal**: Tenants can create booking requests, view their bookings, cancel pending/approved bookings. Lessors can view bookings on their assets.

**Independent Test**: Can be fully tested by creating a booking as a tenant, listing bookings, and cancelling it. All CRUD operations work via API

### Implementation for User Story 3

- [X] T030 [P] [US3] Create Booking model queries in `prototypes/api/src/models/Booking.js`
- [X] T031 [US3] Implement BookingService with create, list, getById, cancel in `prototypes/api/src/services/booking.js`
- [X] T032 [US3] Implement POST /api/v1/bookings in `prototypes/api/src/routes/bookings.js`
- [X] T033 [US3] Implement GET /api/v1/bookings in `prototypes/api/src/routes/bookings.js`
- [X] T034 [US3] Implement GET /api/v1/bookings/:id in `prototypes/api/src/routes/bookings.js`
- [X] T035 [US3] Implement booking overlap validation in `prototypes/api/src/services/booking.js` (prevent double-booking)
- [X] T036 [US3] Register booking routes in `prototypes/api/src/index.js`

**Checkpoint**: Booking CRUD works — create, list, view, cancel with proper validation

---

## Phase 6: User Story 4 — Lessor Manage Rentals (Priority: P1) 🎯 MVP

**Goal**: Lessors can accept/reject pending bookings, manage asset availability, confirm completion of active rentals, view earnings

**Independent Test**: Can be tested by accepting a pending booking as a lessor, confirming completion as a lessor, and toggling asset status

### Implementation for User Story 4

- [X] T037 [P] [US4] Implement PATCH /api/v1/bookings/:id/status (approve/reject) in `prototypes/api/src/routes/bookings.js`
- [X] T038 [US4] Add state machine enforcement in `prototypes/api/src/services/booking.js` (valid transitions per role)
- [X] T039 [US4] Implement PATCH /api/v1/assets/:id/status in `prototypes/api/src/routes/assets.js` (lessor toggle)
- [X] T040 [US4] Implement GET /api/v1/assets with owner_id filter in `prototypes/api/src/routes/assets.js` (lessor dashboard)
- [X] T041 [P] [US4] Create Transaction model queries in `prototypes/api/src/models/Transaction.js`
- [X] T042 [US4] Implement transaction generation on payment in `prototypes/api/src/services/transaction.js`

**Checkpoint**: Lessor operations work — accept, reject, complete, toggle asset status, view earnings

---

## Phase 7: User Story 5 — Make Payments (Priority: P2)

**Goal**: Tenants can make mock payments or submit bank transfer receipts. Payment transitions booking to active status

**Independent Test**: Can be tested by approving a booking as lessor, then as tenant calling POST /api/v1/payments with method=mock, confirming booking becomes active

### Implementation for User Story 5

- [X] T043 [P] [US5] Create Payment model queries in `prototypes/api/src/models/Payment.js`
- [X] T044 [US5] Implement PaymentService with processPayment (mock + bank) in `prototypes/api/src/services/payment.js`
- [X] T045 [US5] Implement POST /api/v1/payments in `prototypes/api/src/routes/payments.js`
- [X] T046 [US5] Register payment routes in `prototypes/api/src/index.js`
- [X] T047 [US5] Integrate payment → booking status transition (approved → active) in `prototypes/api/src/services/payment.js`

**Checkpoint**: Payment flow works — mock payment instantly activates booking, bank transfer records pending payment

---

## Phase 8: User Story 6 — Rate Completed Rentals (Priority: P3)

**Goal**: Tenants can rate completed bookings with 1-5 stars. Ratings update asset average rating

**Independent Test**: Can be tested by completing a booking, then calling POST /api/v1/ratings, confirming rating is saved and asset rating updates

### Implementation for User Story 6

- [X] T048 [P] [US6] Create Rating model queries in `prototypes/api/src/models/Rating.js`
- [X] T049 [US6] Implement RatingService with createRating in `prototypes/api/src/services/rating.js`
- [X] T050 [US6] Implement POST /api/v1/ratings in `prototypes/api/src/routes/ratings.js`
- [X] T051 [US6] Register rating routes in `prototypes/api/src/index.js`
- [X] T052 [US6] Update Asset model to compute average rating from ratings table

**Checkpoint**: Rating system works — tenants can rate completed bookings, asset rating updates

---

## Phase 9: User Story 7 — Admin Dashboard Endpoints (Priority: P2)

**Goal**: Admin can access system-wide stats, manage users/assets/bookings, view revenue reports

**Independent Test**: Can be tested by calling admin-gated endpoints with an admin JWT and verifying stats, user lists, booking management, and revenue data

### Implementation for User Story 7

- [X] T053 [US7] Create Notification model queries in `prototypes/api/src/models/Notification.js`
- [X] T054 [P] [US7] Implement GET /api/v1/admin/stats in `prototypes/api/src/routes/admin.js`
- [X] T055 [P] [US7] Implement GET /api/v1/admin/users and GET /api/v1/admin/users/:id in `prototypes/api/src/routes/admin.js`
- [X] T056 [P] [US7] Implement GET /api/v1/admin/assets and GET /api/v1/admin/assets/:id in `prototypes/api/src/routes/admin.js`
- [X] T057 [US7] Implement GET /api/v1/admin/bookings and GET /api/v1/admin/bookings/:id in `prototypes/api/src/routes/admin.js`
- [X] T058 [US7] Implement GET /api/v1/admin/revenue in `prototypes/api/src/routes/admin.js`
- [X] T059 [US7] Implement GET /api/v1/admin/notifications and PATCH mark-read in `prototypes/api/src/routes/admin.js`
- [X] T060 [US7] Register admin routes with admin-only middleware in `prototypes/api/src/index.js`

**Checkpoint**: Admin panel endpoints serve all statistics, user/asset/booking management, and revenue reporting

---

## Phase 10: Frontend Integration — Refactor Mock Data to API Calls

**Purpose**: Replace localStorage and mock data imports with real API calls in the existing frontends

**Independent Test**: Each refactored page can be tested by running the mobile app connected to the local API and verifying data loads from the database

### Mobile App Integration

- [ ] T061 [P] Create API client wrapper in `prototypes/mobile/src/services/apiClient.js`
- [ ] T062 Replace AuthContext mock auth with real API calls in `prototypes/mobile/src/context/AuthContext.jsx`
- [ ] T063 Replace BookingContext mock CRUD with API calls in `prototypes/mobile/src/context/BookingContext.jsx`
- [ ] T064 [P] Refactor AssetList page data source in `prototypes/mobile/src/pages/AssetList.jsx`
- [ ] T065 [P] Refactor AssetDetail page data source in `prototypes/mobile/src/pages/AssetDetail.jsx`
- [ ] T066 [P] Refactor Home page data source in `prototypes/mobile/src/pages/Home.jsx`
- [ ] T067 [P] Refactor BookingForm to create bookings via API in `prototypes/mobile/src/pages/BookingForm.jsx`
- [ ] T068 [P] Refactor BookingDetail to use API in `prototypes/mobile/src/pages/BookingDetail.jsx`
- [ ] T069 [P] Refactor Payment page to use API in `prototypes/mobile/src/pages/Payment.jsx`
- [ ] T070 [P] Refactor LessorDashboard to use API in `prototypes/mobile/src/pages/LessorDashboard.jsx`
- [ ] T071 [P] Refactor Admin pages to use API in `prototypes/admin/src/pages/` (all 6 pages)

**Checkpoint**: Both frontends load live data from the backend API instead of mock data

---

## Phase 11: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T072 Create `prototypes/api/README.md` with setup and usage instructions
- [X] T073 [P] Add comprehensive error messages in Arabic where user-facing
- [X] T074 Add rate limiting middleware in `prototypes/api/src/middleware/rateLimiter.js`
- [X] T075 Add CORS configuration for mobile and admin origins
- [X] T076 Add health check endpoint GET /api/v1/health
- [X] T077 Run full contract validation against all endpoints
- [X] T078 Update `AGENTS.md` to reflect backend API architecture

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories
- **US1 — Browse Assets (Phase 3)**: Depends on Foundational — no story dependencies
- **US2 — Auth (Phase 4)**: Depends on Foundational — no story dependencies
- **US3 — Bookings (Phase 5)**: Depends on Foundational + US1 (needs assets) + US2 (needs auth)
- **US4 — Lessor (Phase 6)**: Depends on Foundational + US3 (needs booking state machine)
- **US5 — Payments (Phase 7)**: Depends on Foundational + US3 (needs bookings) + US4 (needs approve)
- **US6 — Ratings (Phase 8)**: Depends on Foundational + US3 (needs completed bookings)
- **US7 — Admin (Phase 9)**: Depends on Foundational + US1..US5 (needs all data)
- **Frontend Integration (Phase 10)**: Depends on Phases 3-9 completion
- **Polish (Phase 11)**: Depends on all other phases

### Parallel Opportunities

- Phase 1 tasks T002, T003, T007, T008 marked [P] can run in parallel
- Phase 2 tasks T010..T018 are sequential (one after another due to DB setup)
- US1 (Phase 3) and US2 (Phase 4) can run in parallel since they have no cross-dependency
- T019, T020 in US1 marked [P] can run in parallel
- T026 in US2 marked [P] can run independently
- All frontend integration tasks T062..T071 marked [P] can run in parallel
- All Polish phase tasks marked [P] can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch both models for US1 together:
Task: "Create Asset model queries in prototypes/api/src/models/Asset.js"
Task: "Create Category enum/constants in prototypes/api/src/models/Category.js"

# Then run the dependent tasks:
Task: "Implement AssetService in prototypes/api/src/services/asset.js"
Task: "Implement GET /api/v1/assets endpoint in prototypes/api/src/routes/assets.js"
```

## Parallel Example: User Stories 1 & 2 (Independent)

```bash
# US1 (Team A):
Task: "Asset model + AssetService + routes/assets.js"

# US2 (Team B):
Task: "User model + AuthService + routes/auth.js"
```

## Parallel Example: Frontend Integration

```bash
# All page refactors are independent:
Task: "Refactor AssetList page"
Task: "Refactor Home page"
Task: "Refactor LessorDashboard page"
# ... all [P] tasks can be launched concurrently
```

---

## Implementation Strategy

### MVP First (User Stories 1-4 — P1 only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks everything)
3. Complete Phase 3: User Story 1 (Browse Assets)
4. Complete Phase 4: User Story 2 (Auth)
5. Complete Phase 5: User Story 3 (Booking CRUD)
6. Complete Phase 6: User Story 4 (Lessor Operations)
7. **STOP and VALIDATE**: Full rental flow works via API (browse → auth → book → approve/reject)
8. Deploy/demo if ready

### Incremental Delivery (Full Scope)

1. Setup + Foundational → Foundation ready
2. US1 (Browse) + US2 (Auth) → Users can discover and log in
3. US3 (Booking CRUD) → Users can create and manage bookings
4. US4 (Lessor Ops) → Lessors can manage their rental business
5. US5 (Payments) → Payment flow completes the transaction
6. US6 (Ratings) → Post-rental feedback
7. US7 (Admin) → Admin oversight
8. Frontend Integration → Full-stack live data

### Parallel Team Strategy

With multiple developers:
1. Complete Setup + Foundational together
2. Developer A: US1 (Browse) + US3 (Bookings)
3. Developer B: US2 (Auth) + US4 (Lessor) + US5 (Payments)
4. Both: Frontend integration in parallel
5. Developer C: US6 (Ratings) + US7 (Admin) + Polish

---

## Task Summary

| Phase | Tasks | Count | Parallelizable |
|-------|-------|-------|---------------|
| Phase 1: Setup | T001-T009 | 9 | 4 [P] |
| Phase 2: Foundational | T010-T018 | 9 | 0 |
| Phase 3: US1 Browse | T019-T024 | 6 | 2 [P] |
| Phase 4: US2 Auth | T025-T029 | 5 | 1 [P] |
| Phase 5: US3 Bookings | T030-T036 | 7 | 1 [P] |
| Phase 6: US4 Lessor | T037-T042 | 6 | 2 [P] |
| Phase 7: US5 Payments | T043-T047 | 5 | 1 [P] |
| Phase 8: US6 Ratings | T048-T052 | 5 | 1 [P] |
| Phase 9: US7 Admin | T053-T060 | 8 | 3 [P] |
| Phase 10: Frontend | T061-T071 | 11 | 10 [P] |
| Phase 11: Polish | T072-T078 | 7 | 2 [P] |
| **Total** | **T001-T078** | **78** | **27 [P]** |

**Independent test criteria per story:**
- US1: `GET /api/v1/assets` returns filtered/sorted assets
- US2: `POST /api/v1/auth/verify-otp` returns valid JWT
- US3: `POST /api/v1/bookings` creates booking, `GET /api/v1/bookings` lists it
- US4: `PATCH /api/v1/bookings/:id/status` rejects approves/rejects correctly
- US5: `POST /api/v1/payments` transitions booking to active
- US6: `POST /api/v1/ratings` saves rating and updates asset score
- US7: `GET /api/v1/admin/stats` returns system-wide statistics
