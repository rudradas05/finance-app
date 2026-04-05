# Finance Backend API

A RESTful backend for a finance dashboard system with role-based access control, built with Node.js, Express, PostgreSQL, and Prisma ORM.

---

## Tech Stack

| Layer          | Technology        |
| -------------- | ----------------- |
| Runtime        | Node.js v22       |
| Framework      | Express.js        |
| Database       | PostgreSQL        |
| ORM            | Prisma 5          |
| Authentication | JWT + bcryptjs    |
| Validation     | express-validator |
| Rate Limiting  | express-rate-limit|
| CSV Export     | fast-csv          |

---

## Core Features (As Per Assignment)

### 1. User and Role Management
- Register and manage users
- Three roles — Viewer, Analyst, Admin
- Activate or deactivate user accounts
- All actions restricted based on role

### 2. Financial Records Management
- Create, view, update, and soft delete records
- Each record stores amount, type, category, date, and notes
- Filter by type, category, and date range
- Pagination support

### 3. Dashboard Summary APIs
- Total income, total expenses, and net balance
- Category wise totals
- Monthly trends
- Weekly trends (last 7 days)
- Recent 10 transactions

### 4. Access Control
- JWT based authentication on all protected routes
- Role based middleware enforced on every route
- Viewers, Analysts, and Admins each have clearly defined permissions

### 5. Validation and Error Handling
- Input validation on all routes using express-validator
- Meaningful error messages with correct HTTP status codes
- Global error handler for unhandled errors
- 404 handler for unknown routes

### 6. Data Persistence
- PostgreSQL database
- Prisma ORM for schema management and migrations
- Soft delete so records are never permanently lost

---

## Extra Features Added

| Feature          | Description                                                                 |
| ---------------- | --------------------------------------------------------------------------- |
| Search           | Search records by keyword across category and notes fields                  |
| CSV Export       | Export filtered financial records as a downloadable CSV file                |
| Password Change  | Any logged in user can change their own password securely                   |
| Rate Limiting    | 100 requests per 15 min globally, 10 per 15 min on auth routes              |
| Audit Logs       | Every create, update, and delete action is logged with user info and timestamp |
| UUID Primary Keys| All IDs use UUID format instead of integers for better security             |

---

## Roles and Permissions

| Action                           | Viewer | Analyst | Admin |
| -------------------------------- | ------ | ------- | ----- |
| View dashboard summary           | ✅     | ✅      | ✅    |
| Change own password              | ✅     | ✅      | ✅    |
| View records                     | ❌     | ✅      | ✅    |
| View analytics                   | ❌     | ✅      | ✅    |
| Create / Update / Delete records | ❌     | ❌      | ✅    |
| Export records to CSV            | ❌     | ❌      | ✅    |
| Manage users                     | ❌     | ❌      | ✅    |
| View audit logs                  | ❌     | ❌      | ✅    |

---

## API Endpoints

> All protected routes require `Authorization: Bearer <token>` in the request header.

### Authentication

| Method | Endpoint             | Access | Description            |
| ------ | -------------------- | ------ | ---------------------- |
| POST   | `/api/auth/register` | Public | Register a new user    |
| POST   | `/api/auth/login`    | Public | Login and get token    |

### Users

| Method | Endpoint                     | Access | Description                   |
| ------ | ---------------------------- | ------ | ----------------------------- |
| GET    | `/api/users/me`              | All    | Get own profile               |
| PUT    | `/api/users/change-password` | All    | Change own password           |
| GET    | `/api/users`                 | Admin  | Get all users                 |
| GET    | `/api/users/:id`             | Admin  | Get user by ID                |
| PUT    | `/api/users/:id`             | Admin  | Update user role or status    |
| DELETE | `/api/users/:id`             | Admin  | Delete a user                 |

### Financial Records

| Method | Endpoint              | Access         | Description                |
| ------ | --------------------- | -------------- | -------------------------- |
| GET    | `/api/records`        | Admin, Analyst | Get all records with filters |
| GET    | `/api/records/export` | Admin          | Export records as CSV file |
| GET    | `/api/records/:id`    | Admin, Analyst | Get a single record        |
| POST   | `/api/records`        | Admin          | Create a new record        |
| PUT    | `/api/records/:id`    | Admin          | Update a record            |
| DELETE | `/api/records/:id`    | Admin          | Soft delete a record       |

### Dashboard

| Method | Endpoint                    | Access         | Description                    |
| ------ | --------------------------- | -------------- | ------------------------------ |
| GET    | `/api/dashboard/summary`    | All            | Total income, expense, balance |
| GET    | `/api/dashboard/categories` | Admin, Analyst | Category wise totals           |
| GET    | `/api/dashboard/monthly`    | Admin, Analyst | Monthly trends                 |
| GET    | `/api/dashboard/weekly`     | Admin, Analyst | Last 7 days trends             |
| GET    | `/api/dashboard/recent`     | Admin, Analyst | Last 10 transactions           |

### Audit Logs

| Method | Endpoint     | Access | Description                    |
| ------ | ------------ | ------ | ------------------------------ |
| GET    | `/api/audit` | Admin  | Get all audit logs with filters|

---

## Filtering and Query Parameters

### Financial Records
```
GET /api/records?type=income
GET /api/records?type=expense
GET /api/records?category=salary
GET /api/records?search=food
GET /api/records?startDate=2024-01-01&endDate=2024-12-31
GET /api/records?page=1&limit=10
GET /api/records?type=income&search=salary&page=1&limit=5
```

### CSV Export
```
GET /api/records/export
GET /api/records/export?type=income
GET /api/records/export?startDate=2024-01-01&endDate=2024-12-31
```

### Audit Logs
```
GET /api/audit?action=CREATE
GET /api/audit?resource=record
GET /api/audit?startDate=2024-01-01&endDate=2024-12-31
GET /api/audit?page=1&limit=20
```

---

## Setup Instructions

### Prerequisites
- Node.js v18 or higher
- PostgreSQL installed and running
- pgAdmin (optional but recommended)

### 1. Clone the repository

```bash
git clone https://github.com/rudradas05/finance-app.git
cd finance-app/finance-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create the database

Open pgAdmin and create a database named `finance_db`, or run:

```bash
psql -U postgres -c "CREATE DATABASE finance_db;"
```

### 4. Setup environment variables

Create a `.env` file inside `finance-backend/`:

```env
PORT=3000
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/finance_db"
JWT_SECRET=your_jwt_secret_key
```

### 5. Run database migrations

```bash
npx prisma migrate dev
npx prisma generate
```

### 6. Start the server

```bash
# Development
npm run dev

# Production
npm start
```

Server runs at `http://localhost:3000`

---

## Project Structure

```
finance-backend/
├── prisma/
│   ├── schema.prisma               # Database models and enums
│   └── migrations/                 # Auto-generated migration history
├── src/
│   ├── config/
│   │   └── db.js                   # Prisma client instance
│   ├── controllers/
│   │   ├── authController.js       # Register and login logic
│   │   ├── userController.js       # User management logic
│   │   ├── recordController.js     # Financial records logic
│   │   ├── dashboardController.js  # Analytics and summary logic
│   │   └── auditController.js      # Audit log retrieval
│   ├── middleware/
│   │   ├── auth.js                 # JWT token verification
│   │   ├── roleCheck.js            # Role based access control
│   │   └── auditLog.js             # Automatic action logging
│   ├── routes/
│   │   ├── auth.js                 # /api/auth
│   │   ├── users.js                # /api/users
│   │   ├── records.js              # /api/records
│   │   ├── dashboard.js            # /api/dashboard
│   │   └── audit.js                # /api/audit
│   ├── validators/
│   │   ├── authValidator.js        # Register and login validation rules
│   │   └── recordValidator.js      # Record create and update validation rules
│   └── app.js                      # Express app setup and entry point
├── .env                            # Environment variables (not committed)
├── .gitignore
└── package.json
```

---

## Assumptions Made

- Only **Admins** can create, update, and delete financial records
- **Analysts** have read-only access to records and analytics
- **Viewers** can only see the dashboard summary and change their own password
- Deleted records use soft delete — data is flagged as deleted but never removed from the database
- JWT tokens expire after **7 days**
- All primary keys use **UUID** format for better security
- Passwords are always hashed using **bcrypt** before storing — plain text passwords are never saved
- Sensitive fields like passwords are automatically stripped before being saved to audit logs
- Audit logs are only created when a request succeeds (2xx response)
- Rate limiting is applied globally with stricter limits on auth routes to prevent brute force attacks