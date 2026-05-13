# Data Model: ATAD Equipment Rental Platform

## Entity-Relationship Overview

```
User (1) ----< Asset (many)       — owner/lessor relationship
User (1) ----< Booking (many)     — tenant relationship
Asset (1) ----< Booking (many)    — asset being booked
Booking (1) ----< Payment (0..1)  — payment for booking
Booking (1) ----< Rating (0..1)   — rating for completed booking
User (1) ----< Notification (many) — notifications for user
```

---

## Entities

### User

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, auto-generated | Unique user identifier |
| `name` | VARCHAR(100) | NOT NULL | Full name in Arabic |
| `phone` | VARCHAR(15) | UNIQUE, NOT NULL | Saudi phone number (+966xxxxxxxxx) |
| `role` | ENUM | NOT NULL | `tenant` \| `lessor` \| `admin` |
| `otp_code` | VARCHAR(6) | nullable, TTL 5min | Current OTP verification code |
| `otp_expires_at` | TIMESTAMP | nullable | OTP code expiration |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Account creation timestamp |
| `updated_at` | TIMESTAMP | NOT NULL, ON UPDATE NOW() | Last update timestamp |

**Uniqueness**: Phone is unique across all users.

---

### Asset

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, auto-generated | Unique asset identifier |
| `owner_id` | UUID | FK → User.id, NOT NULL | Lessor who owns this asset |
| `title` | VARCHAR(200) | NOT NULL | Asset name in Arabic |
| `description` | TEXT | NOT NULL | Detailed asset description |
| `category` | ENUM | NOT NULL | One of: `معدات ثقيلة`, `مركبات`, `معدات كهربائية`, `معدات بناء`, `معدات صناعية`, `أدوات يدوية` |
| `price_per_day` | DECIMAL(10,2) | NOT NULL, > 0 | Rental price in SAR |
| `city` | VARCHAR(100) | NOT NULL | Saudi city (الرياض, جدة, مكة, etc.) |
| `image_url` | VARCHAR(500) | NOT NULL | Cloud storage URL for asset photo |
| `status` | ENUM | NOT NULL, DEFAULT `available` | `available` \| `rented` \| `maintenance` |
| `rating` | DECIMAL(2,1) | DEFAULT 0.0 | Computed average rating (0.0–5.0) |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Listing creation timestamp |
| `updated_at` | TIMESTAMP | NOT NULL, ON UPDATE NOW() | Last update timestamp |

**Indexes**: `owner_id`, `category`, `city`, `status`

---

### Booking

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, auto-generated | Unique booking identifier |
| `asset_id` | UUID | FK → Asset.id, NOT NULL | Asset being rented |
| `tenant_id` | UUID | FK → User.id, NOT NULL | Renter |
| `start_date` | DATE | NOT NULL | Rental start date |
| `end_date` | DATE | NOT NULL | Rental end date (must be > start_date) |
| `total_price` | DECIMAL(10,2) | NOT NULL, > 0 | Computed: days × price_per_day |
| `status` | ENUM | NOT NULL, DEFAULT `pending` | Booking lifecycle state (see state machine) |
| `payment_status` | ENUM | nullable | `null` \| `pending` \| `paid` |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Booking creation timestamp |
| `updated_at` | TIMESTAMP | NOT NULL, ON UPDATE NOW() | Last status change timestamp |

**Indexes**: `asset_id`, `tenant_id`, `status`

**Validation**: `end_date` MUST be after `start_date`. Total price = (end_date - start_date) × asset price_per_day.

---

### Payment

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, auto-generated | Unique payment identifier |
| `booking_id` | UUID | FK → Booking.id, UNIQUE, NOT NULL | One payment per booking |
| `amount` | DECIMAL(10,2) | NOT NULL, > 0 | Payment amount in SAR |
| `method` | ENUM | NOT NULL | `mock` \| `bank_transfer` |
| `status` | ENUM | NOT NULL, DEFAULT `pending` | `pending` \| `paid` \| `failed` |
| `reference` | VARCHAR(50) | nullable | Transaction reference (e.g., TXN-20260514-001) |
| `receipt_url` | VARCHAR(500) | nullable | Uploaded bank transfer receipt |
| `paid_at` | TIMESTAMP | nullable | Payment completion timestamp |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Payment record creation |

---

### Rating

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, auto-generated | Unique rating identifier |
| `booking_id` | UUID | FK → Booking.id, UNIQUE, NOT NULL | One rating per completed booking |
| `asset_id` | UUID | FK → Asset.id, NOT NULL | Asset being rated |
| `tenant_id` | UUID | FK → User.id, NOT NULL | Tenant who gave the rating |
| `score` | TINYINT | NOT NULL, 1–5 | Star rating |
| `comment` | TEXT | nullable | Optional review text |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Rating timestamp |

**Uniqueness**: One rating per booking (composite unique on booking_id).

---

### Notification

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, auto-generated | Unique notification identifier |
| `user_id` | UUID | FK → User.id, NOT NULL | Notification recipient |
| `type` | ENUM | NOT NULL | `booking_status` \| `payment` \| `system` |
| `title` | VARCHAR(200) | NOT NULL | Notification title in Arabic |
| `message` | TEXT | NOT NULL | Notification body in Arabic |
| `booking_id` | UUID | FK → Booking.id, nullable | Related booking (if applicable) |
| `read` | BOOLEAN | NOT NULL, DEFAULT FALSE | Read/unread status |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Notification timestamp |

**Indexes**: `user_id`, `read`, `created_at`

---

### Transaction (Lessor Earnings)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, auto-generated | Unique transaction identifier |
| `booking_id` | UUID | FK → Booking.id, NOT NULL | Related booking |
| `lessor_id` | UUID | FK → User.id, NOT NULL | Receiving lessor |
| `asset_title` | VARCHAR(200) | NOT NULL | Denormalized asset title (for display) |
| `tenant_name` | VARCHAR(100) | NOT NULL | Denormalized tenant name |
| `amount` | DECIMAL(10,2) | NOT NULL, > 0 | Transaction amount in SAR |
| `status` | ENUM | NOT NULL | `completed` \| `pending` |
| `days` | SMALLINT | NOT NULL | Rental duration in days |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Transaction timestamp |

---

## Booking State Machine

```
                    +---> rejected
                    |
  pending ----> approved ----> active ----> completed
                    |
                    +---> rejected (via tenant cancel)
```

| Current Status | Trigger | Target Status | Actor | Condition |
|---------------|---------|---------------|-------|-----------|
| `pending` | approve | `approved` | Lessor/Admin | — |
| `pending` | reject | `rejected` | Lessor/Admin | — |
| `pending` | cancel | `rejected` | Tenant | — |
| `approved` | pay | `active` | System | payment_status = `paid` |
| `approved` | cancel | `rejected` | Tenant | — |
| `active` | complete | `completed` | Lessor/Admin | — |

**Audit Logging**: Every state transition MUST record:
- Previous status
- New status
- Acting user ID
- Timestamp
- Reason (if rejection/cancellation)

---

## Validation Rules

| Entity | Field | Rule |
|--------|-------|------|
| User | phone | Must be exactly 9 digits (without +966 prefix), Saudi format |
| User | role | Must be one of: tenant, lessor, admin |
| Asset | price_per_day | Must be > 0 |
| Asset | status | Must be one of: available, rented, maintenance |
| Booking | start_date | Must be today or in the future |
| Booking | end_date | Must be after start_date |
| Booking | status | MUST follow explicit state machine transitions |
| Rating | score | Integer between 1 and 5 inclusive |
| Payment | amount | Must equal booking.total_price |
