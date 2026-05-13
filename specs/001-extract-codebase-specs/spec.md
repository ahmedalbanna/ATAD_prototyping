# Feature Specification: ATAD MVP — Equipment Rental Platform

**Feature Branch**: `001-extract-codebase-specs`  
**Created**: 2026-05-13  
**Status**: Draft  
**Input**: User description: "read current codebase than extract spec and requirements"

## User Scenarios & Testing

### User Story 1 — Browse & Discover Equipment (Priority: P1)

A prospective renter (tenant) opens the app, browses available equipment by category, searches by name or city, views asset details including images, descriptions, pricing, and rental terms.

**Why this priority**: Asset discovery is the entry point for all tenant activity — without it, no rentals can occur.

**Independent Test**: Can be fully tested by opening the app, viewing the home page with featured assets, scrolling categories, searching for assets, and viewing an asset detail page.

**Acceptance Scenarios**:
1. **Given** the app is loaded, **When** the home page renders, **Then** featured assets, category filters, and an asset grid are displayed
2. **Given** a user taps a category filter, **When** the filter is applied, **Then** only assets in that category are shown
3. **Given** a user types in the search bar, **When** the query matches a title or city, **Then** matching assets are shown; **When** no match, **Then** an empty state is displayed
4. **Given** a user taps an asset card, **When** the detail page loads, **Then** the image, description, price, terms, and a "Request Rental" button are displayed

---

### User Story 2 — Create & Manage Bookings (Priority: P1)

A tenant selects an asset, chooses rental dates, agrees to terms, and submits a booking request. The tenant can then view their bookings, cancel pending or approved requests, and make payments.

**Why this priority**: The booking lifecycle is the core transaction of the platform — without it, no value is delivered.

**Independent Test**: Can be fully tested by selecting an asset, filling the booking form, submitting, viewing the booking in "My Bookings", and cancelling it.

**Acceptance Scenarios**:
1. **Given** a tenant is on an asset detail page, **When** they tap "Request Rental", **Then** the booking form opens with asset summary and date picker
2. **Given** a tenant fills in valid dates and agrees to terms, **When** they submit, **Then** a booking is created with status "pending" and a success toast appears
3. **Given** a tenant views their bookings, **When** they filter by status, **Then** only bookings matching that status are shown
4. **Given** a tenant has a pending or approved booking, **When** they cancel, **Then** the booking status changes to "rejected"

---

### User Story 3 — Lessor Manage Rentals (Priority: P1)

An equipment owner (lessor) logs in, views their dashboard with asset and booking stats, accepts or rejects incoming booking requests, manages asset availability, and tracks earnings.

**Why this priority**: Lessor participation is essential for supply — without lessors managing their assets, there are no rentals.

**Independent Test**: Can be fully tested by logging in as a lessor, viewing the dashboard, accepting a pending booking, and confirming completion of an active rental.

**Acceptance Scenarios**:
1. **Given** a lessor lands on their dashboard, **When** the page loads, **Then** asset counts, pending requests, and earnings summary are displayed
2. **Given** a lessor has a pending booking, **When** they tap "Accept", **Then** the booking status changes to "approved"; **When** they tap "Reject", **Then** status changes to "rejected"
3. **Given** a lessor has an active booking, **When** they confirm completion, **Then** the booking status changes to "completed"
4. **Given** a lessor views their assets, **When** they toggle status between available and maintenance, **Then** the asset status updates immediately

---

### User Story 4 — Make Payments (Priority: P2)

After a lessor approves a booking, the tenant can complete payment via mock payment (instant success) or by viewing bank transfer details. Payment transitions the booking to active status.

**Why this priority**: Payment completes the transaction loop, but mock payments reduce implementation complexity for MVP.

**Independent Test**: Can be fully tested by approving a booking as lessor, then as tenant opening the payment page and selecting mock payment.

**Acceptance Scenarios**:
1. **Given** a booking is in "approved" status, **When** the tenant opens the payment page, **Then** a booking summary and two payment methods are displayed
2. **Given** a tenant selects "Mock Payment", **When** they confirm, **Then** payment status becomes "paid" and booking status becomes "active"
3. **Given** a tenant selects "Bank Transfer", **When** they view the page, **Then** bank details and a receipt upload area are displayed

---

### User Story 5 — Rate Completed Rentals (Priority: P3)

After a rental is completed, the tenant can rate the asset with a 1-5 star rating and optional comment. Ratings appear in rental history.

**Why this priority**: Ratings build trust and quality signals for future renters, but are post-transaction and not critical for MVP launch.

**Independent Test**: Can be fully tested by completing a booking as lessor, then as tenant navigating to rental history and rating the completed booking.

**Acceptance Scenarios**:
1. **Given** a booking is completed, **When** the tenant views rental history, **Then** an unrated booking shows a "Rate this asset" prompt
2. **Given** a tenant taps "Rate this asset", **When** they select a star rating and submit, **Then** a success toast appears and they are redirected to rental history
3. **Given** a booking has been rated, **When** viewed in rental history, **Then** the star rating and comment are displayed

---

### User Story 6 — Admin Dashboard Management (Priority: P2)

An administrator logs into the admin panel, views system-wide stats, manages users, assets, bookings, and monitors revenue through a dashboard with charts and tables.

**Why this priority**: Admin oversight is important for platform operations but is separate from the core tenant/lessor experience.

**Independent Test**: Can be fully tested by opening the admin panel, viewing dashboard stats, browsing users table, viewing bookings with filters, and checking revenue charts.

**Acceptance Scenarios**:
1. **Given** an admin opens the dashboard, **When** the page loads, **Then** stat cards, recent bookings, and summary panels are displayed
2. **Given** an admin views the users table, **When** they search or filter by role, **Then** matching users are shown; clicking a user shows their details and related bookings/assets
3. **Given** an admin views the bookings table, **When** they filter by status, **Then** only bookings of that status are shown; clicking a booking shows full details with action buttons
4. **Given** an admin opens the revenue page, **When** the page loads, **Then** stat cards, a monthly bar chart, and a revenue breakdown table are displayed

---

### Edge Cases

- What happens when a booking form has invalid dates (end before start)? Validation message shown, form not submitted.
- What happens when required fields in AddAsset/EditAsset are empty? Validation messages appear on each empty field.
- How does the system handle cancelled bookings? Cancelled bookings get status "rejected" and appear in rental history.
- What happens when no assets match a search? An empty state with guidance message is displayed.
- What happens when a user tries to access a non-existent booking/asset? A 404-style "not found" page is shown.
- How does the app handle unread notifications? A pulsing dot badge on the bell icon and individual notification cards are highlighted.
- What happens when a user switches roles via profile? The app immediately reflects the new role's navigation and permissions.

## Requirements

### Functional Requirements

- **FR-001**: System MUST allow users to register and authenticate using phone number + OTP, with role selection (tenant or lessor)
- **FR-002**: System MUST persist user session across page refreshes via local storage
- **FR-003**: System MUST support user switching between mock accounts for demo purposes
- **FR-004**: System MUST display a home page with category filters, featured assets, and an asset grid
- **FR-005**: System MUST allow users to search assets by title or city
- **FR-006**: System MUST allow filtering assets by category and sorting by price or rating
- **FR-007**: System MUST display asset detail pages with image, description, pricing, terms, and a rental request button
- **FR-008**: System MUST allow tenants to create booking requests with start/end dates, cost calculation, and terms agreement
- **FR-009**: System MUST validate booking form inputs (dates required, end after start, agreement checked)
- **FR-010**: System MUST allow lessors to view pending booking requests on their dashboard
- **FR-011**: System MUST allow lessors to accept or reject pending booking requests
- **FR-012**: System MUST allow tenants to make payments via mock payment or bank transfer information
- **FR-013**: System MUST transition booking status from approved to active upon successful payment
- **FR-014**: System MUST allow lessors to confirm completion of active rentals
- **FR-015**: System MUST allow tenants to cancel pending or approved bookings
- **FR-016**: System MUST display a booking list with status filters (all, pending, approved, active, completed)
- **FR-017**: System MUST display rental history for completed, rejected, and expired bookings
- **FR-018**: System MUST allow tenants to rate completed rentals with 1-5 stars and optional comments
- **FR-019**: System MUST provide lessors with asset management (add, edit, toggle availability)
- **FR-020**: System MUST display lessor earnings with a timeline of transactions
- **FR-021**: System MUST show notifications with unread count and read/unread state
- **FR-022**: System MUST provide an admin dashboard with system-wide stats, user/asset/booking management, and revenue tracking
- **FR-023**: System MUST display an admin revenue page with bar chart and monthly breakdown table
- **FR-024**: System MUST allow admin to view and manage all bookings (accept, reject, complete)
- **FR-025**: System MUST show splash screen with brand logo and auto-redirect to authentication
- **FR-026**: System MUST apply role-based navigation: tenant sees tenant pages, lessor sees lessor pages, bottom nav adapts accordingly
- **FR-027**: System MUST protect lessor-only routes (add/edit asset, dashboard, earnings) from tenant access
- **FR-028**: System MUST display toast notifications for success actions (booking created, payment made, profile saved, rating submitted)
- **FR-029**: System MUST persist booking state across page refreshes via local storage
- **FR-030**: System MUST validate form inputs on AddAsset/EditAsset/EditProfile with inline error messages
- **FR-031**: System MUST provide image upload preview in asset creation and editing forms
- **FR-032**: Admin panel MUST provide user detail view showing user's bookings and assets

### Key Entities

- **User**: A platform participant with role (tenant, lessor, admin), name, phone number, and authentication credentials
- **Asset**: An equipment/item listed for rent, owned by a lessor, with title, description, category, price per day, city, image, rating, and availability status (available, rented, maintenance)
- **Booking**: A rental transaction linking a tenant to an asset for a specific date range, with computed total price, lifecycle status (pending, approved, rejected, active, completed), and payment status
- **Payment**: A financial transaction for a booking, recording amount, method (mock or bank transfer), and payment timestamp
- **Rating**: A tenant's evaluation of a completed rental, with a 1-5 score and optional comment
- **Notification**: A system-generated message informing a user of booking status changes, payment events, or system updates
- **Transaction**: A financial record for lessor earnings, tracking incoming payments per booking with status
- **Monthly Revenue**: Aggregated platform revenue data by month, used in admin revenue reporting

## Success Criteria

### Measurable Outcomes

- **SC-001**: Users can complete the full rental flow (browse → book → approve → pay → complete → rate) without external assistance
- **SC-002**: Booking lifecycle transitions correctly through all states: pending → approved → active → completed
- **SC-003**: Role-based navigation correctly filters pages per role (tenant sees only tenant pages, lessor sees only lessor pages)
- **SC-004**: Admin panel displays all bookings, users, and assets with search/filter capabilities
- **SC-005**: Admin revenue tracking shows monthly breakdown with 6 months of historical data
- **SC-006**: Form validation catches all invalid inputs (empty required fields, invalid dates) with clear error messages
- **SC-007**: User session persists across page refreshes without data loss
- **SC-008**: Mock payment flow completes in under 2 seconds, immediately activating the booking
- **SC-009**: Mobile app loads all pages without errors (0 build errors, 0 runtime console errors)
- **SC-010**: All interactive elements provide visual feedback (hover states, press states, transitions)

## Assumptions

- Users have stable internet connectivity and a modern mobile browser
- Authentication uses SMS OTP in production; MVP simulates OTP entry (any 6+ digit code accepted)
- Payments are simulated for MVP; production would integrate with a payment gateway
- Images are sourced from Unsplash and will be replaced with actual asset photos in production
- The platform serves the Saudi Arabian market (+966 phone codes, SAR currency, Saudi cities)
- The admin panel is a separate web application, not a mobile app feature
- All data is mock data and localStorage-based for MVP; production would use a backend API with a database
- Users are expected to be familiar with basic mobile app navigation patterns
- The system does not support dark mode in the current version
- No real-time updates or push notifications are implemented in the MVP
