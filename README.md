# HelpDesk — Full-Stack Ticket Management System

A full-stack support ticket management system demonstrating RESTful API design,
validation, standardized responses, global exception handling, structured
logging, and correlation-ID-based request tracing — built with **Spring Boot**,
**MongoDB**, and **React**.

Covers:
- **Experiment 2.1.1** — RESTful API Design using Spring Boot
- **Experiment 2.1.2** — Global Exception Handling and Structured Logging

---

## 1. Project Structure

```text
helpdesk-system/
│
├── frontend/                  React app (Vite)
│   ├── src/
│   │   ├── components/        Navbar, badges, error banner, modal
│   │   ├── pages/              Dashboard, Tickets, CreateTicket, TicketDetails
│   │   ├── services/           ticketService.js (Axios API layer)
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── backend/                   Spring Boot app (Java 17, Maven)
│   ├── src/main/java/com/helpdesk/
│   │   ├── controller/         TicketController.java
│   │   ├── service/             TicketService, TicketServiceImpl
│   │   ├── repository/          TicketRepository.java
│   │   ├── model/                Ticket, TicketStatus, TicketPriority, TicketCategory
│   │   ├── dto/                   TicketRequest, ApiResponse
│   │   ├── exception/             GlobalExceptionHandler, TicketNotFoundException
│   │   ├── filter/                 CorrelationIdFilter.java
│   │   ├── config/                 CorsConfig.java
│   │   └── HelpdeskApplication.java
│   └── src/main/resources/
│       ├── application.properties
│       └── logback-spring.xml
│
├── docker-compose.yml          Optional local MongoDB
├── .gitignore
└── README.md
```

---

## 2. Prerequisites

- Java 17+
- Maven (or use the included `mvnw` if you generate one via `mvn -N wrapper:wrapper`)
- Node.js 18+
- MongoDB (local install, Docker, or MongoDB Atlas)

---

## 3. Backend Setup

```bash
cd backend
cp .env.example .env      # then edit MONGODB_URI if needed
```

**Option A — MongoDB via Docker** (from the project root):

```bash
docker compose up -d
```

**Option B — local MongoDB** already running on `mongodb://localhost:27017`.

Run the backend:

```bash
cd backend
export MONGODB_URI=mongodb://localhost:27017/helpdesk
mvn spring-boot:run
```

The API starts on **http://localhost:8080**.

---

## 4. Frontend Setup

```bash
cd frontend
cp .env.example .env      # VITE_API_BASE_URL=http://localhost:8080/api
npm install
npm run dev
```

The app starts on **http://localhost:5173** (Vite default).

> The backend's CORS config (`CorsConfig.java`) already allows
> `http://localhost:5173` and `http://localhost:3000`. If you use a
> different frontend port, add it there.

---

## 5. REST API Reference

Base URL: `http://localhost:8080/api`

| Method | Endpoint            | Description          | Success Status |
|--------|----------------------|-----------------------|-----------------|
| POST   | `/tickets`           | Create a ticket       | 201 Created     |
| GET    | `/tickets`           | List tickets (supports `status`, `priority`, `category`, `search` query params) | 200 OK |
| GET    | `/tickets/stats`     | Ticket statistics for dashboard | 200 OK |
| GET    | `/tickets/{id}`      | Get a ticket by ID    | 200 OK / 404    |
| PUT    | `/tickets/{id}`      | Update a ticket       | 200 OK / 404    |
| DELETE | `/tickets/{id}`      | Delete a ticket       | 200 OK / 404    |

### Sample request — Create Ticket

```http
POST /api/tickets
Content-Type: application/json

{
  "title": "WiFi not working",
  "description": "I cannot connect to the campus WiFi.",
  "category": "NETWORK",
  "priority": "HIGH"
}
```

### Sample success response

```json
{
  "success": true,
  "message": "Ticket created successfully",
  "data": {
    "id": "665abc123",
    "title": "WiFi not working",
    "description": "I cannot connect to the campus WiFi.",
    "category": "NETWORK",
    "priority": "HIGH",
    "status": "OPEN",
    "createdAt": "2026-09-09T10:30:00",
    "updatedAt": "2026-09-09T10:30:00"
  },
  "timestamp": "2026-09-09T10:30:00"
}
```

### Sample error response (validation)

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "title": "Title cannot be blank",
    "description": "Description must contain between 10 and 500 characters"
  },
  "timestamp": "2026-09-09T10:35:00",
  "correlationId": "a72f9c31"
}
```

### Sample error response (not found)

```json
{
  "success": false,
  "message": "Ticket not found with id: 665abc123",
  "data": null,
  "timestamp": "2026-09-09T10:35:00",
  "correlationId": "7f82ab91"
}
```

Every response also carries an `X-Correlation-ID` response header, matching
the `correlationId` in the JSON body (for errors) and matching what appears
in the server logs for that request.

---

## 6. Postman Testing Guide

Import the endpoints above into a Postman collection (or create requests
manually) and run through these cases:

| # | Test | Request | Expected |
|---|------|---------|----------|
| 1 | Valid ticket | `POST /api/tickets` with full valid body | `201 CREATED` |
| 2 | Empty title | `POST /api/tickets` with `"title": ""` | `400 BAD REQUEST` with `errors.title` |
| 3 | Description too short | `POST /api/tickets` with a 3-character description | `400 BAD REQUEST` with `errors.description` |
| 4 | Non-existing ticket | `GET /api/tickets/000000000000000000000000` | `404 NOT FOUND` |
| 5 | Invalid ticket ID format | `GET /api/tickets/not-a-valid-id` | `400`/`404` depending on Mongo ID parsing |
| 6 | Unexpected server error | e.g. stop MongoDB, then call any endpoint | `500 INTERNAL SERVER ERROR` with a safe message, no stack trace |

For every request, check the **Headers** tab of the response for
`X-Correlation-ID`, and confirm the same ID appears in the Spring Boot
console log for that request.

---

## 7. Demonstrating Correlation ID & Logging

1. Send `POST /api/tickets` from Postman.
2. Copy the `X-Correlation-ID` from the response headers.
3. Look at the backend console — you'll see matching log lines:

```text
2026-09-09 10:30:00 INFO  [7f82ab91] REQUEST  POST /api/tickets
2026-09-09 10:30:00 INFO  [7f82ab91] com.helpdesk.service.TicketServiceImpl - Creating ticket: WiFi not working
2026-09-09 10:30:00 INFO  [7f82ab91] com.helpdesk.service.TicketServiceImpl - Ticket created successfully with id: 665abc123
2026-09-09 10:30:00 INFO  [7f82ab91] RESPONSE POST /api/tickets - 201 - 82ms
```

4. Repeat with `GET /api/tickets/{invalid-id}` and observe the `404` log +
   matching `correlationId` in the JSON error body.

---

## 8. Viva / Demonstration Checklist

- [ ] Backend starts and connects to MongoDB
- [ ] All 5 CRUD endpoints work in Postman
- [ ] Invalid requests return `400` with field-level validation messages
- [ ] Non-existent ticket returns `404` via `TicketNotFoundException` + `@ControllerAdvice`
- [ ] Unexpected errors return `500` without leaking stack traces
- [ ] Every request/response is logged with a correlation ID
- [ ] `X-Correlation-ID` header is present on every response
- [ ] React dashboard, ticket list (with search/filter), create form, and
      detail/edit view all work end-to-end against the live API
- [ ] Frontend shows friendly error messages (with correlation ID) instead
      of raw backend errors

---

## 9. Notes

- Authentication is intentionally **not implemented** — this project's goal
  is to demonstrate REST architecture, validation, exception handling,
  logging, and observability, not access control.
- Never commit real `.env` files; only the `.env.example` templates are
  version-controlled.
