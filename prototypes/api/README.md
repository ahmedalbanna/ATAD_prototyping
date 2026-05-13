# ATAD API — Equipment Rental Platform Backend

REST API server for the ATAD equipment rental marketplace, serving both the mobile app and admin dashboard.

## Quick Start

```bash
npm install
npm run migrate
npm run seed
npm run dev
```

Server starts at `http://localhost:3001/api/v1`

## Tech Stack

- **Runtime**: Node.js (ESM modules)
- **Framework**: Express.js
- **Database**: SQLite (via better-sqlite3) — zero config, file-based
- **Auth**: Phone OTP with JWT tokens
- **Testing**: Vitest + Supertest

## Project Structure

```
src/
├── index.js              # Express app entry
├── config/
│   └── database.js       # SQLite connection
├── middleware/
│   ├── auth.js           # JWT authenticate + requireRole
│   ├── errorHandler.js   # Global error handling
│   ├── logger.js         # Request logging
│   ├── rateLimiter.js    # Rate limiting
│   └── validate.js       # Request validation
├── models/
│   ├── Asset.js
│   ├── Booking.js
│   ├── Notification.js
│   ├── Transaction.js
│   └── User.js
├── services/
│   ├── asset.js
│   ├── auth.js
│   ├── booking.js
│   ├── payment.js
│   └── rating.js
└── routes/
    ├── admin.js
    ├── assets.js
    ├── auth.js
    ├── bookings.js
    ├── payments.js
    └── ratings.js
migrations/
├── 001_initial.sql
└── run.js
seeds/
├── 001_demo_data.sql
└── run.js
```

## API Endpoints

See [contracts/api.md](contracts/api.md) for full documentation.

### Auth
- `POST /api/v1/auth/send-otp` — Send OTP verification code
- `POST /api/v1/auth/verify-otp` — Verify OTP and receive JWT

### Assets
- `GET /api/v1/assets` — List assets (search, filter, sort, paginate)
- `GET /api/v1/assets/:id` — Get asset details
- `POST /api/v1/assets` — Create asset (lessor only)
- `PUT /api/v1/assets/:id` — Update asset
- `PATCH /api/v1/assets/:id/status` — Toggle availability

### Bookings
- `POST /api/v1/bookings` — Create booking (tenant only)
- `GET /api/v1/bookings` — List bookings
- `GET /api/v1/bookings/:id` — Get booking details
- `PATCH /api/v1/bookings/:id/status` — Transition status
- `POST /api/v1/bookings/:id/cancel` — Cancel booking (tenant)

### Payments
- `POST /api/v1/payments` — Process payment

### Ratings
- `POST /api/v1/ratings` — Rate a completed booking

### Admin
- `GET /api/v1/admin/stats` — Dashboard statistics
- `GET /api/v1/admin/users` — List users
- `GET /api/v1/admin/users/:id` — User detail with bookings/assets
- `GET /api/v1/admin/assets` — List all assets
- `GET /api/v1/admin/assets/:id` — Asset detail with bookings
- `GET /api/v1/admin/bookings` — List all bookings
- `GET /api/v1/admin/bookings/:id` — Booking detail with history
- `PATCH /api/v1/admin/bookings/:id/status` — Admin status transition
- `GET /api/v1/admin/revenue` — Monthly revenue breakdown
- `GET /api/v1/admin/notifications` — List notifications
- `PATCH /api/v1/admin/notifications/:id/read` — Mark notification read

### Health
- `GET /api/v1/health` — Health check

## Booking State Machine

```
pending → approved → active → completed
   ↓          ↓
 rejected   rejected
```

## Environment

Copy `.env.example` to `.env` and configure:

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3001 | Server port |
| `DATABASE_PATH` | ./data/atad.db | SQLite database file |
| `JWT_SECRET` | (required) | Secret for JWT signing |
| `JWT_EXPIRES_IN` | 7d | Token expiration |
| `CORS_ORIGIN` | http://localhost:5173,http://localhost:5174 | Allowed origins |
