# API Contracts: ATAD Equipment Rental Platform

**Base URL**: `/api/v1`
**Format**: JSON
**Auth**: Bearer JWT token in `Authorization` header (except auth endpoints)

---

## Authentication

### POST /api/v1/auth/send-otp

Send OTP verification code to phone number.

**Request**:
```json
{
  "phone": "+966555123456",
  "role": "tenant"
}
```

**Response (200)**:
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "expires_in": 300
}
```

**Errors**:
| Code | Condition |
|------|-----------|
| 400 | Invalid phone format |
| 429 | Too many requests (rate limit) |

---

### POST /api/v1/auth/verify-otp

Verify OTP code and return JWT token.

**Request**:
```json
{
  "phone": "+966555123456",
  "otp": "123456",
  "name": "أحمد الحربي"
}
```

**Response (200)**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "name": "أحمد الحربي",
    "phone": "+966555123456",
    "role": "tenant",
    "created_at": "2026-05-14T10:00:00Z"
  }
}
```

**Notes**: `name` is only required for first-time registration. If user already exists, `name` is ignored and existing user is logged in.

**Errors**:
| Code | Condition |
|------|-----------|
| 400 | Invalid or expired OTP |
| 401 | Phone not found and no name provided |

---

## Assets

### GET /api/v1/assets

List assets with optional filters.

**Query Parameters**:
| Param | Type | Description |
|-------|------|-------------|
| `category` | string | Filter by category name |
| `city` | string | Filter by city |
| `search` | string | Search in title and description |
| `status` | string | Filter by status (default: available) |
| `sort_by` | string | `price_asc`, `price_desc`, `rating` |
| `page` | integer | Page number (default: 1) |
| `limit` | integer | Items per page (default: 20, max: 50) |
| `owner_id` | uuid | Filter by lessor (for lessor dashboard) |

**Response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "حفار صغير",
      "description": "حفار صغير مناسب للأعمال...",
      "category": "معدات ثقيلة",
      "price_per_day": 150.00,
      "city": "الرياض",
      "image_url": "https://images.unsplash.com/...",
      "rating": 4.5,
      "status": "available",
      "owner": {
        "id": "uuid",
        "name": "سارة القحطاني"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 42,
    "pages": 3
  }
}
```

---

### GET /api/v1/assets/:id

Get single asset detail.

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "حفار صغير",
    "description": "حفار صغير مناسب للأعمال...",
    "category": "معدات ثقيلة",
    "price_per_day": 150.00,
    "city": "الرياض",
    "image_url": "https://images.unsplash.com/...",
    "rating": 4.5,
    "status": "available",
    "owner": {
      "id": "uuid",
      "name": "سارة القحطاني",
      "phone": "+966555123456"
    },
    "created_at": "2026-01-15T08:00:00Z"
  }
}
```

**Errors**: 404 if asset not found.

---

### POST /api/v1/assets

Create a new asset listing (lessor only).

**Headers**: `Authorization: Bearer <token>`

**Request**:
```json
{
  "title": "حفار صغير",
  "description": "حفار صغير مناسب للأعمال...",
  "category": "معدات ثقيلة",
  "price_per_day": 150.00,
  "city": "الرياض",
  "image_url": "https://images.unsplash.com/..."
}
```

**Response (201)**:
```json
{
  "success": true,
  "data": { "id": "uuid", "title": "حفار صغير", "status": "available", ... }
}
```

---

### PUT /api/v1/assets/:id

Update an asset (owner only).

**Request**: Same shape as POST, all fields optional.

**Response (200)**: Updated asset object.

**Errors**: 403 if not owner, 404 if not found.

---

### PATCH /api/v1/assets/:id/status

Toggle asset availability status (owner only).

**Request**:
```json
{
  "status": "maintenance"
}
```

**Response (200)**: Updated asset with new status.

---

## Bookings

### GET /api/v1/bookings

List bookings for current user.

**Query Parameters**:
| Param | Type | Description |
|-------|------|-------------|
| `status` | string | Filter by status |
| `role` | string | `tenant` shows own bookings, `lessor` shows bookings on own assets |
| `page` | integer | Page number |
| `limit` | integer | Items per page |

**Response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "asset": { "id": "uuid", "title": "حفار صغير", "image_url": "..." },
      "tenant": { "id": "uuid", "name": "أحمد الحربي" },
      "start_date": "2026-05-20",
      "end_date": "2026-05-25",
      "total_price": 750.00,
      "status": "pending",
      "payment_status": null,
      "created_at": "2026-05-14T10:00:00Z"
    }
  ]
}
```

---

### POST /api/v1/bookings

Create a new booking request (tenant only).

**Request**:
```json
{
  "asset_id": "uuid",
  "start_date": "2026-05-20",
  "end_date": "2026-05-25"
}
```

**Response (201)**: Created booking with status `pending`.

**Validation**:
| Rule | Error |
|------|-------|
| Asset exists and is `available` | 400 — Asset not available |
| start_date >= today | 400 — Start date must be today or later |
| end_date > start_date | 400 — End date must be after start date |
| No overlapping bookings for asset | 409 — Asset already booked for this period |

---

### GET /api/v1/bookings/:id

Get single booking detail.

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "asset": { "id": "uuid", "title": "...", "image_url": "...", "description": "..." },
    "tenant": { "id": "uuid", "name": "أحمد الحربي" },
    "start_date": "2026-05-20",
    "end_date": "2026-05-25",
    "total_price": 750.00,
    "status": "pending",
    "payment_status": null,
    "status_history": [
      { "from": null, "to": "pending", "by": "tenant_id", "at": "2026-05-14T10:00:00Z" }
    ],
    "created_at": "2026-05-14T10:00:00Z"
  }
}
```

---

### PATCH /api/v1/bookings/:id/status

Transition booking status (role-based).

**Request**:
```json
{
  "status": "approved"
}
```

**Allowed transitions by actor**:
| Actor | Allowed transitions |
|-------|---------------------|
| Lessor (owner) | `pending` → `approved`, `pending` → `rejected`, `active` → `completed` |
| Tenant | `pending` → `rejected` (cancel), `approved` → `rejected` (cancel) |
| Admin | All transitions |

**Response (200)**: Updated booking with status history.

**Errors**:
| Code | Condition |
|------|-----------|
| 400 | Invalid transition for actor/current status |
| 403 | Not authorized to transition this booking |

---

## Payments

### POST /api/v1/payments

Create and process payment for a booking (tenant only, booking must be `approved`).

**Request**:
```json
{
  "booking_id": "uuid",
  "method": "mock"
}
```

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "booking_id": "uuid",
    "amount": 750.00,
    "method": "mock",
    "status": "paid",
    "reference": "TXN-20260514-001",
    "paid_at": "2026-05-14T10:00:00Z"
  },
  "booking_status": "active"
}
```

**Notes**: `method: "mock"` instantly succeeds. `method: "bank_transfer"` creates a pending payment with status `pending` (requires admin verification).

---

## Ratings

### POST /api/v1/ratings

Rate a completed booking (tenant only).

**Request**:
```json
{
  "booking_id": "uuid",
  "score": 5,
  "comment": "معدات ممتازة وسريعة في العمل"
}
```

**Response (201)**: Created rating. Updates asset average rating.

**Errors**:
| Code | Condition |
|------|-----------|
| 400 | Booking not completed |
| 409 | Booking already rated |

---

## Notifications

### GET /api/v1/notifications

List notifications for current user.

**Query Parameters**: `unread_only` (boolean), `page`, `limit`

### PATCH /api/v1/notifications/:id/read

Mark single notification as read.

### PATCH /api/v1/notifications/read-all

Mark all notifications as read.

---

## Admin Endpoints

### GET /api/v1/admin/stats

Dashboard statistics.

**Response (200)**:
```json
{
  "total_users": 42,
  "total_assets": 86,
  "total_bookings": 156,
  "active_rentals": 12,
  "revenue": 2490.00,
  "pending_bookings": 3
}
```

### GET /api/v1/admin/users

List all users. Query: `search`, `role`, `page`, `limit`.

### GET /api/v1/admin/users/:id

User detail with their bookings and assets.

### GET /api/v1/admin/assets

List all assets. Query: `search`, `status`, `page`, `limit`.

### GET /api/v1/admin/assets/:id

Asset detail with its bookings.

### GET /api/v1/admin/bookings

List all bookings. Query: `status`, `search`, `page`, `limit`.

### GET /api/v1/admin/bookings/:id

Booking detail with full status history.

### GET /api/v1/admin/revenue

Monthly revenue breakdown.

**Response (200)**:
```json
{
  "total_revenue": 12490.00,
  "total_bookings": 156,
  "growth_rate": 12.5,
  "average_booking_value": 80.06,
  "monthly": [
    { "month": "يناير", "bookings": 10, "revenue": 800.00 },
    { "month": "فبراير", "bookings": 15, "revenue": 1200.00 },
    { "month": "مارس", "bookings": 22, "revenue": 1950.00 },
    { "month": "أبريل", "bookings": 28, "revenue": 2500.00 },
    { "month": "مايو", "bookings": 35, "revenue": 3240.00 },
    { "month": "يونيو", "bookings": 46, "revenue": 2800.00 }
  ]
}
```

---

## Error Response Format

All errors follow this structure:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "يرجى التحقق من البيانات المدخلة",
    "details": [
      { "field": "start_date", "message": "تاريخ البداية مطلوب" }
    ]
  }
}
```

| Error Code | HTTP Status | Meaning |
|-----------|-------------|---------|
| `VALIDATION_ERROR` | 400 | Input validation failed |
| `UNAUTHORIZED` | 401 | Missing or invalid token |
| `FORBIDDEN` | 403 | Valid token but insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource conflict (e.g., double booking) |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

---

## Authentication Flow

```
Client                    Server
  |                         |
  |-- POST /auth/send-otp ->|  Generates OTP, sends via SMS
  |                         |
  |-- POST /auth/verify-otp ->|  Validates OTP, returns JWT
  |<- { token, user } -----|
  |                         |
  |-- GET /assets (Bearer) ->|  Authenticated request
  |<- { data } ------------|
```

JWT expires in 7 days. Refresh by re-authenticating.
