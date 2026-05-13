# Quickstart: ATAD Backend API Development

## Prerequisites

- Node.js 18+ (or 20+)
- Node.js 18+ (SQLite included, no separate database server needed)
- npm or yarn
- Docker (optional, for local PostgreSQL)

## Setup

### 1. Clone and navigate

```bash
cd prototypes/api
```

### 2. Install dependencies

```bash
npm init -y
npm install express cors helmet morgan jsonwebtoken bcrypt dotenv
npm install -D nodemon vitest supertest
```

### 3. Environment variables

Copy `.env.example` to `.env` (already exists for development):

```env
PORT=3001
NODE_ENV=development

# Database (SQLite file path — created automatically)
DATABASE_PATH=./data/atad.db

# Auth
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# SMS (Twilio)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
```

### 4. Database setup (SQLite — no server needed)

```bash
npm run migrate
npm run seed
```

### 5. Start development

```bash
npm run dev
```

Server starts at `http://localhost:3001/api/v1`.

## Project Structure

```
prototypes/api/
├── src/
│   ├── index.js              # Entry point
│   ├── config/
│   │   └── database.js       # DB connection config
│   ├── middleware/
│   │   ├── auth.js           # JWT verification
│   │   ├── validate.js       # Request validation
│   │   └── errorHandler.js   # Global error handler
│   ├── routes/
│   │   ├── auth.js
│   │   ├── assets.js
│   │   ├── bookings.js
│   │   ├── payments.js
│   │   ├── ratings.js
│   │   ├── notifications.js
│   │   └── admin.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Asset.js
│   │   ├── Booking.js
│   │   ├── Payment.js
│   │   ├── Rating.js
│   │   └── Notification.js
│   └── services/
│       ├── auth.js           # OTP generation/verification
│       ├── sms.js            # SMS provider abstraction
│       └── booking.js        # State machine logic
├── tests/
│   ├── contract/             # API contract tests (Supertest)
│   ├── integration/          # Integration tests
│   └── unit/                 # Unit tests
├── migrations/               # Database migration files
├── seeds/                    # Seed data
├── .env.example
├── package.json
└── README.md
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with nodemon |
| `npm start` | Start production server |
| `npm test` | Run all tests |
| `npm run test:contract` | Run API contract tests only |
| `npm run migrate` | Run database migrations |
| `npm run seed` | Seed initial data |
| `npm run lint` | Run linter |

## API Documentation

Full API contracts are documented in [contracts/api.md](./contracts/api.md).

## Frontend Integration

The existing mobile and admin frontends need these changes to consume the API:

1. **Replace `data/mock.js`** imports with API calls to `/api/v1/...`
2. **Replace `AuthContext`** localStorage logic with `/auth/send-otp` and `/auth/verify-otp` endpoints
3. **Replace `BookingContext`** localStorage logic with `/bookings` CRUD endpoints
4. **Add `apiClient.js`** wrapper for HTTP requests with JWT token management

### API Client Example

```javascript
// prototypes/mobile/src/services/apiClient.js
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

let token = localStorage.getItem('atad_token');

async function request(endpoint, options = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
  const json = await res.json();

  if (!json.success) throw json.error;
  return json.data;
}

export const api = {
  get: (url) => request(url),
  post: (url, body) => request(url, { method: 'POST', body: JSON.stringify(body) }),
  put: (url, body) => request(url, { method: 'PUT', body: JSON.stringify(body) }),
  patch: (url, body) => request(url, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (url) => request(url, { method: 'DELETE' }),

  setToken: (t) => { token = t; localStorage.setItem('atad_token', t); },
  clearToken: () => { token = null; localStorage.removeItem('atad_token'); },
};
```

## Seed Data

Initial seed data includes the same mock users, assets, bookings, and transactions from the existing frontend mock files, migrated to the database. This ensures the API works immediately with the same demo data.
