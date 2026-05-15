<!-- SPECKIT START -->
ATAD (عتاد) — Equipment Rental Platform MVP

Current plan: specs/001-extract-codebase-specs/plan.md
Spec: specs/001-extract-codebase-specs/spec.md

 Architecture:
- prototypes/mobile/ — React + Vite + Tailwind, mobile-first RTL web app (port 5173)
- prototypes/admin/ — React + Vite + Tailwind, admin dashboard (port 5174)
- prototypes/api/ — Node.js/Express + SQLite backend (port 3001)

Key behaviors:
- AuthContext + BookingContext + ToastContext (React Context API)
- localStorage persistence for auth and bookings (MVP)
- Role-based routing: LessorRoute/TenantRoute/AuthRoute guards
- Booking state machine: pending → approved → active → completed
- Saudi market: Arabic RTL, +966, SAR, Saudi cities
- All API calls via `api.js` utility with automatic `tenant` header injection
- Trial accounts: lessor1-5 (lessor), tenant1-5 (tenant); static OTP code: 0000

Pages (22 total):
- Auth: OTP signup/login + trial quick-login + role selection
- Splash, Home (role-based dashboard)
- Tenant: AssetList (search), AssetDetail, BookingForm, BookingDetail, MyBookings, Payment, RentalHistory, RateAsset, Profile, EditProfile, Notifications
- Lessor: LessorDashboard (requests), LessorAssets, LessorEarnings, AddAsset, EditAsset, OnboardingLessor, OnboardingTenant
- Shared: Terms

Shell commands:
- Dev: npm run dev (at root runs all 3 concurrently)
- Build: npm run build (at root runs both frontend builds)
- Preview: npm run preview (at root runs all 3 on prod ports)
- Individual: cd prototypes/mobile (or /admin), npm run dev/build/preview
<!-- SPECKIT END -->
