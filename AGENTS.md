<!-- SPECKIT START -->
ATAD (عتاد) — Equipment Rental Platform MVP

Current plan: specs/001-extract-codebase-specs/plan.md
Spec: specs/001-extract-codebase-specs/spec.md

Architecture:
- prototypes/mobile/ — React + Vite + Tailwind, mobile-first RTL web app (port 5173)
- prototypes/admin/ — React + Vite + Tailwind, admin dashboard (port 5174)
- prototypes/api/ — planned Node.js/Express + PostgreSQL backend

Key behaviors:
- AuthContext + BookingContext + ToastContext (React Context API)
- localStorage persistence for auth and bookings (MVP)
- Role-based routing: LessorRoute/TenantRoute/AuthRoute guards
- Booking state machine: pending → approved → active → completed
- Saudi market: Arabic RTL, +966, SAR, Saudi cities

Shell commands:
- Prototypes: cd prototypes/mobile (or /admin), npm run dev
- Build: npm run build (in each prototype dir)
- No backend yet — planned for next phase

Brand identity:
- Colors: #E14A11 (primary), #9F1211 (dark red), #F69C0A (accent), #555A5E (gray)
- Fonts: Nunito Sans (headings), Poppins (body)
- Layout: RTL Arabic first, warm organic design system
<!-- SPECKIT END -->
