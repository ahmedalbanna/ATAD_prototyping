<!--
  Sync Impact Report
  ==================
  Version change: 0.0.0 (template) → 1.0.0 (initial constitution)
  Modified principles (all new):
    - [PRINCIPLE_1_NAME] → I. MVP-First Discipline
    - [PRINCIPLE_2_NAME] → II. API Contract-First
    - [PRINCIPLE_3_NAME] → III. RTL-First Design
    - [PRINCIPLE_4_NAME] → IV. Test-First (NON-NEGOTIABLE)
    - [PRINCIPLE_5_NAME] → V. State & Quality Discipline
  Added sections:
    - Technical Constraints (was [SECTION_2_NAME])
    - Development Workflow (was [SECTION_3_NAME])
    - Governance rules filled in
  Removed sections: None
  Templates requiring updates: None — all ✅ compatible
  Deferred TODOs: None
-->

# ATAD (عتاد) Constitution

## Core Principles

### I. MVP-First Discipline
The project MUST deliver a Minimum Viable Product covering the core rental
flow before adding advanced features. Scope MUST be limited to: browse assets,
request rental, approve/reject requests, and basic payment (mock or transfer).
Features explicitly deferred for post-MVP include identity verification,
e-contracts, ratings, in-app chat, dispute management, advanced notifications,
integrated payments, deposits/insurance, and advanced analytics. Any proposed
feature MUST be justified against the YAGNI principle — if it is not essential
to validating the core rental hypothesis, it MUST be deferred.

### II. API Contract-First
All functionality MUST be exposed through documented REST APIs consumed by
both mobile and web clients. API contracts (endpoints, request/response shapes,
error codes) MUST be defined and reviewed before any implementation begins.
Mobile and web MUST consume identical APIs — no backend divergence per client.
Breaking changes MUST follow the versioning policy in Governance.

### III. RTL-First Design
Arabic (RTL) is the primary application language. All UI layouts MUST be
designed with RTL as the default direction; LTR support is secondary. String
externalization is MANDATORY — no hardcoded display text in code. Text
direction MUST be handled at the layout/component level, not patched as an
afterthought.

### IV. Test-First (NON-NEGOTIABLE)
Test-Driven Development is MANDATORY. For every feature:
1. Tests MUST be written before implementation code
2. Tests MUST be reviewed and approved
3. Tests MUST fail when run against the unimplemented codebase
4. Implementation proceeds only after failing tests are confirmed
5. Red-Green-Refactor cycle MUST be strictly enforced

Every API endpoint MUST have at minimum a contract test and an integration
test. No code MAY merge without corresponding passing tests.

### V. State & Quality Discipline
All bookings MUST follow an explicit state machine:
- Pending → Approved/Rejected → Active → Completed/Expired

State transitions MUST be explicit in code and auditable. Every state change
MUST be logged with a timestamp and the acting user identity. Code quality
gates (linting, type checking, test coverage) MUST pass before any merge.

## Technical Constraints

- **Mobile**: Cross-platform framework (Flutter/Dart) targeting Android and iOS
- **Backend**: REST API server with relational database
- **Auth**: Phone number + OTP verification
- **Storage**: Cloud-based image storage for asset photos
- **Dashboard**: Responsive web admin panel
- **Internationalization**: Arabic (RTL) primary; string externalization required
- **API Style**: RESTful JSON; documented contracts before implementation
- **State Management**: Explicit state machine for all booking lifecycle states

## Development Workflow

1. **Spec** — Define feature scope and user stories with acceptance criteria
2. **Plan** — Research, design data model, define contracts
3. **Tasks** — Break into independently implementable/testable units
4. **Implement** — Code following Test-First principle
5. **Verify** — Run all tests, code review, integration validation

Code reviews are MANDATORY for all production code. Database schema changes
MUST include migration scripts. Commits MUST be atomic and reference the
feature/task ID.

## Governance

This Constitution supersedes all informal development practices. Amendments
require:
1. A documented proposal describing the change and its rationale
2. Team review and approval
3. A migration plan for any in-flight work affected

Versioning follows Semantic Versioning (SemVer):
- **MAJOR** — Backward-incompatible governance changes, principle removals or
  redefinitions
- **MINOR** — New principles or materially expanded guidance
- **PATCH** — Clarifications, wording fixes, non-semantic refinements

Compliance with this Constitution MUST be verified before each release cycle.

**Version**: 1.0.0 | **Ratified**: 2026-05-13 | **Last Amended**: 2026-05-13
