# Research: ATAD Backend Architecture Decisions

## Unresolved Technical Context Items

### 1. Backend Language & Framework

**Decision**: Node.js + Express.js

**Rationale**: The existing frontends are React/Vite (JavaScript), keeping a homogeneous JavaScript stack reduces context-switching, enables code sharing (types, validators), and simplifies the build pipeline. Express.js is mature, well-documented, and has excellent Arabic/RTL community support.

**Alternatives considered**:
- Python + FastAPI: Strong typing, good ORM support, but adds language overhead
- Ruby + Rails: Convention-over-configuration fits the rental domain, but team may not know Ruby
- Go + Gin: Excellent performance, but steeper learning curve and no code sharing with frontend

### 2. Database

**Decision**: SQLite

**Rationale**: Zero-configuration, file-based database eliminates the need for a separate database server during development and deployment. SQLite provides sufficient performance for MVP-scale workloads (< 100 concurrent users, < 1k assets). All necessary features (transactions, foreign keys, CHECK constraints, indexes) are supported. Reduces deployment complexity significantly — no PostgreSQL server to manage. Easy to migrate to PostgreSQL later if scaling requires it.

**Alternatives considered**:
- PostgreSQL: Full-featured but requires server setup and maintenance; overkill for MVP stage
- MySQL: Similar overhead to PostgreSQL without significant benefits for this use case

### 3. API Style

**Decision**: RESTful JSON with OpenAPI 3.0 documentation (contract-first)

**Rationale**: Constitution mandates API Contract-First and RESTful JSON. OpenAPI provides a standard contract format that can generate client code and documentation.

**Alternatives considered**:
- GraphQL: More flexible queries but adds complexity for a relatively simple data model
- tRPC: Type-safe but tightly couples frontend to backend, contradicts contract-first principle

### 4. Authentication

**Decision**: Phone + OTP with JWT tokens

**Rationale**: Matches existing frontend auth flow. OTP via SMS (third-party service like Twilio or local equivalent), JWT for stateless session management. The current mock OTP flow becomes real SMS verification.

**Alternatives considered**:
- Firebase Auth: Fast to implement but vendor lock-in and potential compliance issues for Saudi market
- Session-based auth: Works but requires server-side session storage, more complex to scale

### 5. Testing Framework

**Decision**: 
- Backend: Vitest (unit + integration) + Supertest (API contract tests)
- Frontend: Vitest + React Testing Library

**Rationale**: Vitest is Vite-native (already used for building), fast, compatible with Jest API. Single test framework across frontend and backend.

**Alternatives considered**:
- Jest: Compatible but slower startup with Vite projects
- Mocha/Chai: More flexible but requires more setup
- Playwright: Better for E2E, would complement Vitest, not replace it

### 6. Performance Targets

**Decision**: 
- API p95 response time < 500ms for standard queries (asset list, booking CRUD)
- Page load (TTI) < 2s on 4G connections
- Support 100 concurrent API users initially

**Rationale**: MVP-scale targets appropriate for < 1k users. These are achievable with a well-optimized Express + PostgreSQL stack without requiring caching layers.

### 7. File Storage

**Decision**: Local filesystem for development; cloud object storage (AWS S3 / Saudi equivalent) for production

**Rationale**: Asset images need persistent storage. Cloud storage scales automatically and can serve images directly via CDN.

**Alternatives considered**:
- Database BLOBs: Works but increases DB size and backup complexity

### 8. Deployment

**Decision**: Docker containerization with docker-compose for local dev and production

**Rationale**: Ensures consistent environments across dev/staging/production. Simple to deploy and scale.

### Key Risk

The constitution specifies "Mobile: Cross-platform framework (Flutter/Dart)" but the existing MVP uses React + Vite for mobile. This is a known deviation made for faster MVP iteration. Future mobile-native development may require a rewrite if Flutter becomes mandatory. For the immediate backend API phase, the existing React frontends can be refactored to consume the API without requiring a framework change.

### SMS OTP Service

**Decision**: Twilio Verify API for production SMS OTP; console.log mock for development

**Rationale**: Twilio has Saudi Arabia phone number support and is the industry standard for phone verification. Mock mode allows development without SMS costs.

**Alternatives considered**:
- Local SMS gateway (e.g., SMS gateway via Saudi providers): More complex to integrate
- Firebase Authentication: Vendor lock-in, potential data residency concerns
