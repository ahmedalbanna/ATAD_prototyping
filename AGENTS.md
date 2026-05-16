<!-- SPECKIT START -->
ATAD (عتاد) — Equipment Rental Platform MVP

Architecture:
- prototypes/mobile/ — React 19 + Vite 6 + Tailwind 4, mobile-first RTL (port 5173)
- prototypes/admin/ — same stack, admin dashboard (port 5174)
- prototypes/api/ — Express + SQLite (better-sqlite3) ESM backend (port 3001)

Setup & commands:
- Root `npm run dev` starts all 3 concurrently; API needs `.env` first
- API setup: `npm run migrate && npm run seed && npm run dev` (from prototypes/api/)
- `npm run reset` reruns migrations + seeds (drops & recreates data/atad.db)
- Frontend env: `VITE_API_URL` for API base URL (defaults to hardcoded IP in services/apiClient.js)
- API: `npm test` (Vitest), `npm run lint` (ESLint), `npm run format` (Prettier)
- API has no build step (nodemon runs src/ directly)
- `.env` requirements: `JWT_SECRET` (required), `CORS_ORIGIN`, `DATABASE_PATH`

Key behaviors:
- Auth: phone OTP + JWT; localStorage keys: `atad_user` (mobile), `atad_admin_token` (admin)
- Context providers: AuthContext, BookingContext, ToastContext (React Context API)
- Routing guards: `LessorRoute` (lessor-only), `AuthRoute` (wraps /auth)
- API calls via `services/apiClient.js`; mobile uses bearer token in `Authorization` header
- Booking state machine: pending → approved → active → completed (rejectable from pending/approved)
- Saudi market: Arabic RTL, +966 phone, SAR

Trial accounts: 4 quick-login users on mobile Auth page (trialUsers array); static OTP `000000`

Speckit workflow commands: .opencode/command/speckit.*.md
<!-- SPECKIT END -->
