# Implementation Plan: ATAD MVP Codebase Documentation & Backenable

**Branch**: `001-extract-codebase-specs` | **Date**: 2026-05-13 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-extract-codebase-specs/spec.md`

## Summary

Document the existing ATAD MVP (React + Vite mobile and admin frontends) as a formal specification and plan the transition from mock data + localStorage to a real backend API with persisted storage, enabling the platform to serve real users with real data.

## Technical Context

**Language/Version**: Frontend: React 18 (Vite 6), JavaScript (JSX). Backend: NEEDS CLARIFICATION — REST API language/framework not yet selected.  
**Primary Dependencies**: Frontend: Tailwind CSS v4, React Router v6, Lucide React icons. Backend: NEEDS CLARIFICATION.  
**Storage**: Currently localStorage (mobile) and mock data JS modules. Production target: relational database with REST API.  
**Testing**: Frontend: none currently. Constitution mandates Test-First (NON-NEGOTIABLE) for all future work. Backend: NEEDS CLARIFICATION — test framework TBD.  
**Target Platform**: Mobile: web browser (RTL Arabic, mobile-first responsive). Admin: web browser. Backend: Linux server.  
**Project Type**: Multi-app: mobile web app + admin web dashboard + REST API backend.  
**Performance Goals**: NEEDS CLARIFICATION — no targets defined for production.  
**Constraints**: RTL-first Arabic UI, Saudi market (+966, SAR), offline-capable (needs clarification if required).  
**Scale/Scope**: MVP stage — estimated < 1k users initially, 100-500 assets, all within Saudi Arabia.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Notes |
|------|--------|-------|
| I. MVP-First Discipline | ✅ PASS | Existing spec is MVP; documented scope boundaries match constitution's MVP definition |
| II. API Contract-First | ⚠️ NEEDS REVIEW | Existing frontends consume mock data; real API contracts must be defined before backend implementation |
| III. RTL-First Design | ✅ PASS | All existing UI is RTL Arabic-first |
| IV. Test-First (NON-NEGOTIABLE) | ⚠️ NEEDS REVIEW | No tests exist in current codebase. Future implementation MUST follow TDD |
| V. State & Quality Discipline | ✅ PASS | Booking state machine is explicit; all transitions logged in BookingContext |

**Violations**: No tests exist (Constitution IV). This is acceptable for the documentation phase since no new code is being written. Future implementation phases MUST include tests.

## Project Structure

### Documentation (this feature)

```text
specs/001-extract-codebase-specs/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── api.md
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
prototypes/
├── mobile/              # Existing React mobile app
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       └── data/
├── admin/               # Existing React admin dashboard
│   └── src/
│       ├── components/
│       ├── pages/
│       └── data/
└── api/                 # Planned backend (not yet created)
    ├── src/
    │   ├── routes/
    │   ├── models/
    │   ├── middleware/
    │   └── services/
    └── tests/
```

**Structure Decision**: Multi-app monorepo with existing `prototypes/mobile/` and `prototypes/admin/` as frontend apps, plus a new `prototypes/api/` directory for the REST backend. Frontends will continue to use the same project structure with data sources refactored to call API endpoints instead of importing mock modules.

## Complexity Tracking

> Constitution Check has a non-negotiable violation (IV. Test-First) that applies only to future code. No complexity violations to justify currently.

---

## Phase 0: Research
See [research.md](./research.md)

## Phase 1: Design & Contracts
See [data-model.md](./data-model.md), [contracts/api.md](./contracts/api.md), [quickstart.md](./quickstart.md)
