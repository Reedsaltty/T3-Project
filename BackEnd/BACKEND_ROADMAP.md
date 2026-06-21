# 🚀 Hoop Backend: Functional Requirements & Architecture Roadmap

This document outlines all the features, middleware, endpoints, and validation requirements needed to transform the current Hoop codebase into a fully functional production-ready backend.

---

## 📁 1. Core Project Infrastructure

To ensure stability, security, and maintainability, the following backend components must be configured:

### A. Environment Configuration (`.env`)
The following environment variables must be defined in your `.env` files and securely loaded:
* **Database Connections:**
  * `DATABASE_URL`: Transaction-mode connection string for Prisma runtime queries.
  * `DIRECT_URL`: Session-mode connection string for running migrations.
* **Authentication Secrets:**
  * `ACCESS_SECRET_TOKEN` & `REFRESH_SECRET_TOKEN`: Strong cryptographic keys for signing JWT tokens.
  * `ACCESS_OPTION` (e.g. `15m`) & `REFRESH_OPTION` (e.g. `7d`): Token expiration limits.
* **Logging System:**
  * `LOGTAIL_SOURCE_TOKEN`: API key for exporting logs to BetterStack Logtail.
  * `PINO_LOG_LEVEL` (e.g. `info` or `error`).

### B. Global Middleware Setup (`src/app.js`)
* **Security & CORS:**
  * Configure `cors` to allow requests **only** from the React frontend origin (`http://localhost:5173`) with credentials enabled.
  * Integrate safety headers using `helmet` to protect against common cross-site scripting vulnerabilities.
* **Global Error Handler:**
  * Define an Express error-handling middleware (`(err, req, res, next) => {}`) at the end of `app.js` to catch async errors, send a clean `500 Internal Server Error` response to the client, and log the detailed stack trace to BetterStack.

---

## 🔐 2. Authentication & Authorization

Securing endpoints and ensuring that users can only manage their own events.

### A. JWT Token Lifecycles
* **Login & Registration:**
  * Passwords must be hashed using `bcrypt` (10 salt rounds) before storing them.
  * On successful login, generate an **AccessToken** (short-lived) and a **RefreshToken** (long-lived).
  * Store tokens in secure, HTTP-only, SameSite cookies to protect against XSS and CSRF.
* **Token Refresh Endpoint:**
  * `POST /api/auth/refresh` - Reads the refresh token, verifies it against the database, and issues a new access token.

### B. Authorization Middleware (`src/middlewares/authMiddleware.js`)
* Extract the JWT from incoming request headers or cookies.
* Verify the token and attach the authenticated user’s ID to the request object (`req.user = { userId: ... }`).
* Block unauthenticated requests with a `401 Unauthorized` status.

---

## 🗄️ 3. Database Schema Alignment (Prisma Client)

Keep the database schema in [schema.prisma](file:///Users/leaphourleu/Storage/Y2SE/T3/T3%20Project%20/T3-Project/BackEnd/src/prisma/schema.prisma) synced with your PostgreSQL server:
* Run `npx prisma migrate dev` to generate database migration logs whenever the schema changes.
* Run `npx prisma generate` to rebuild the custom client inside `node_modules/.prisma/client`.
* Ensure `src/config/prisma.config.js` acts as a **singleton** to avoid open connection leaks.

---

## 🌐 4. Endpoint Specification & Controllers

Below are the controllers and routing rules required to fulfill all client-side dashboard actions.

### 📅 A. Events Controller (`src/controllers/event.controller.js`)
* **`POST /api/events` (Create Event):**
  * **Input:** `eventTitle`, `eventTypeId`, `eventDate`, `eventTime`, `budget`.
  * **Action:** Create record in the `events` table linked to the logged-in user.
* **`GET /api/events` (Get All Events):**
  * **Action:** Return list of events organized by the active user.
* **`GET /api/events/:id` (Get Specific Event):**
  * **Action:** Retrieve full details of a single event, including types and metadata.
* **`PUT /api/events/:id` (Update Event):**
  * **Input:** Updated title, type, date, time, or total budget limit.
* **`DELETE /api/events/:id` (Delete Event):**
  * **Action:** Delete the event and cascade-delete all associated venues, tasks, and expenses.

### 📍 B. Venues & Bookings Controller (`src/controllers/venues.controller.js`)
* **`GET /api/venues` (Get Venue Catalog):**
  * **Action:** Retrieve a list of all available venues from the shared catalog. Can filter by `capacity` or `location`.
* **`POST /api/venues/bookings` (Request Venue Booking):**
  * **Input:** `venueId`, `eventId`, `notes`.
  * **Action:** Create a pending booking request (`VenueBooking` with status `pending`) for the event.
* **`GET /api/venues/bookings/:bookingId` (Get Booking Details):**
  * **Action:** Retrieve status and information of a specific booking.
* **`PATCH /api/venues/bookings/:bookingId` (Update Booking Status):**
  * **Input:** `status` (`pending`, `approved`, `rejected`, `cancelled`), `notes`.
  * **Action:** Update status of the booking request. If approved, notifications or emails can be triggered to the organizer.
* **`DELETE /api/venues/bookings/:bookingId` (Cancel/Delete Booking Request):**
  * **Action:** Remove/cancel the booking request.

### 👥 C. Guests/Attendees Controller (`src/controllers/guests.controller.js`)
* **`POST /api/guests` (Add/Invite Attendee):**
  * **Input:** `eventId`, `name`, `email`.
  * **Action:** Create a guest record with initial status `pending`.
* **`GET /api/guests?eventId=X` (Get Guest List):**
  * **Action:** Fetch all attendees for a given event to render RSVP dashboards (Attending, Declined, Unverified).
* **`PUT /api/guests/:attendeeId` (Update RSVP Status):**
  * **Input:** `status` (`accepted`, `declined`, `maybe`, `pending`).
  * **Action:** Updates guest details and registers their response.
* **`DELETE /api/guests/:attendeeId` (Remove Guest):**
  * **Action:** Remove a guest from the guest list.

### 💰 D. Budget & Expenses Controller (`src/controllers/budget.controller.js`)
* **`POST /api/budget` (Add Expense):**
  * **Input:** `eventId`, `name`, `category`, `estimatedCost`, `actualCost`.
  * **Action:** Add item to `expenses` table.
* **`GET /api/budget?eventId=X` (Get Budget Details):**
  * **Action:** Return all expenses along with overall totals (sum of estimated vs. actual expenses) mapped against the event's overall budget.
* **`PUT /api/budget/:expenseId` (Update Expense):**
  * **Input:** Modified actual cost or estimation of an item.
* **`DELETE /api/budget/:expenseId` (Remove Expense):**
  * **Action:** Remove the expense record.

### 📋 E. Tasks Controller (`src/controllers/tasks.controller.js`)
* **`POST /api/tasks` (Add Task to Timeline):**
  * **Input:** `eventId`, `description`, `deadline`, `assignedTo`.
* **`GET /api/tasks?eventId=X` (Get Tasks):**
  * **Action:** Retrieve all checklists and schedule items.
* **`PUT /api/tasks/:taskId` (Update Task State):**
  * **Input:** `status` (`pending`, `in_progress`, `done`) or assigned member.
* **`DELETE /api/tasks/:taskId` (Remove Task):**
  * **Action:** Delete a checklist task.

---

## 🧪 5. Validation & Testing Checklist

1. **Request Body Schema Validation:**
   * Use a library like `Joi` or `Zod` inside your middlewares to validate inputs (e.g. verify email format, enforce numeric fields for budgets, correct dates) *before* hitting Prisma.
2. **CORS Validation:**
   * Ensure frontend fetches are allowed and headers/cookies are correctly forwarded.
3. **Database Integrity Protection:**
   * Validate that resource IDs exist in the database (e.g., ensure `eventTypeId` corresponds to a valid event type in the `event_types` lookup table) before attempting updates.
