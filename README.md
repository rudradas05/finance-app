# Finance Backend API

A RESTful backend for a finance dashboard system with role-based access control, built with Node.js, Express, PostgreSQL, and Prisma ORM.

## Tech Stack

- **Runtime**: Node.js (v22)
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma 5
- **Auth**: JWT + bcryptjs
- **Validation**: express-validator
- **Rate Limiting**: express-rate-limit
- **CSV Export**: fast-csv

## Features

- JWT Authentication (Register & Login)
- Role Based Access Control (Viewer / Analyst / Admin)
- Financial Records Management (CRUD + Filtering + Pagination)
- Dashboard Analytics (Summary, Category Totals, Monthly & Weekly Trends)
- Search Records by keyword
- Export Records to CSV
- Password Change API
- Rate Limiting (brute force protection)
- Audit Logs (track who did what and when)
- Soft Delete for records
- Global Error Handling & 404 handler
- UUIDs for all primary keys

## Roles & Permissions

| Action                       | Viewer | Analyst | Admin |
| ---------------------------- | ------ | ------- | ----- |
| View dashboard summary       | ✅     | ✅      | ✅    |
| View records                 | ❌     | ✅      | ✅    |
| View analytics               | ❌     | ✅      | ✅    |
| Create/Update/Delete records | ❌     | ❌      | ✅    |
| Manage users                 | ❌     | ❌      | ✅    |
| View audit logs              | ❌     | ❌      | ✅    |
| Export CSV                   | ❌     | ❌      | ✅    |
| Change own password          | ✅     | ✅      | ✅    |

## Setup Instructions

### Prerequisites

- Node.js v18 or higher
- PostgreSQL installed and running
- pgAdmin (optional but recommended)

### 1. Clone the repository

\`\`\`bash
git clone https://github.com/rudradas05/finance-app.git
cd finance-app/finance-backend
\`\`\`

### 2. Install dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Setup environment variables

Create a \`.env\` file inside \`finance-backend/\`:
\`\`\`env
PORT=3000
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/finance_db"
JWT_SECRET=your_jwt_secret_key
\`\`\`

### 4. Create the database

Open pgAdmin and create a database named \`finance_db\`, or run:
\`\`\`bash
psql -U postgres -c "CREATE DATABASE finance_db;"
\`\`\`

### 5. Run database migrations

\`\`\`bash
npx prisma migrate dev
npx prisma generate
\`\`\`

### 6. Start the server

\`\`\`bash

# Development

npm run dev

# Production

npm start
\`\`\`

Server runs at \`http://localhost:3000\`

## API Endpoints

> All protected routes require \`Authorization: Bearer <token>\` header

### Auth

| Method | Endpoint             | Access | Description       |
| ------ | -------------------- | ------ | ----------------- |
| POST   | `/api/auth/register` | Public | Register new user |
| POST   | `/api/auth/login`    | Public | Login user        |

### Users

| Method | Endpoint                     | Access | Description     |
| ------ | ---------------------------- | ------ | --------------- |
| GET    | `/api/users/me`              | All    | Get own profile |
| PUT    | `/api/users/change-password` | All    | Change password |
| GET    | `/api/users`                 | Admin  | Get all users   |
| GET    | `/api/users/:id`             | Admin  | Get user by ID  |
| PUT    | `/api/users/:id`             | Admin  | Update user     |
| DELETE | `/api/users/:id`             | Admin  | Delete user     |

### Financial Records

| Method | Endpoint              | Access         | Description           |
| ------ | --------------------- | -------------- | --------------------- |
| GET    | `/api/records`        | Admin, Analyst | Get all records       |
| GET    | `/api/records/export` | Admin          | Export records to CSV |
| GET    | `/api/records/:id`    | Admin, Analyst | Get record by ID      |
| POST   | `/api/records`        | Admin          | Create record         |
| PUT    | `/api/records/:id`    | Admin          | Update record         |
| DELETE | `/api/records/:id`    | Admin          | Soft delete record    |

### Dashboard

| Method | Endpoint                    | Access         | Description                    |
| ------ | --------------------------- | -------------- | ------------------------------ |
| GET    | `/api/dashboard/summary`    | All            | Total income, expense, balance |
| GET    | `/api/dashboard/categories` | Admin, Analyst | Category wise totals           |
| GET    | `/api/dashboard/monthly`    | Admin, Analyst | Monthly trends                 |
| GET    | `/api/dashboard/weekly`     | Admin, Analyst | Weekly trends                  |
| GET    | `/api/dashboard/recent`     | Admin, Analyst | Recent 10 transactions         |

### Audit Logs

| Method | Endpoint     | Access | Description        |
| ------ | ------------ | ------ | ------------------ |
| GET    | `/api/audit` | Admin  | Get all audit logs |

## Example Requests

### Register

\`\`\`json
POST /api/auth/register
Content-Type: application/json

{
"name": "Rudra Das",
"email": "rudra@example.com",
"password": "password123",
"role": "admin"
}
\`\`\`

### Login

\`\`\`json
POST /api/auth/login
Content-Type: application/json

{
"email": "rudra@example.com",
"password": "password123"
}
\`\`\`

### Create Financial Record

\`\`\`json
POST /api/records
Authorization: Bearer <token>
Content-Type: application/json

{
"amount": 5000,
"type": "income",
"category": "Salary",
"date": "2024-04-01",
"notes": "Monthly salary"
}
\`\`\`

### Change Password

\`\`\`json
PUT /api/users/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
"currentPassword": "password123",
"newPassword": "newpassword456"
}
\`\`\`

## Query Parameters

### Records Filtering & Search

\`\`\`
GET /api/records?type=income
GET /api/records?type=expense
GET /api/records?category=salary
GET /api/records?search=food
GET /api/records?startDate=2024-01-01&endDate=2024-12-31
GET /api/records?page=1&limit=10
GET /api/records?type=income&search=salary&page=1&limit=5
\`\`\`

### Export with Filters

\`\`\`
GET /api/records/export?type=income
GET /api/records/export?startDate=2024-01-01&endDate=2024-12-31
\`\`\`

### Audit Log Filters

\`\`\`
GET /api/audit?action=CREATE
GET /api/audit?resource=record
GET /api/audit?startDate=2024-01-01&endDate=2024-12-31
GET /api/audit?page=1&limit=20
\`\`\`

## Rate Limiting

| Route                     | Limit                       |
| ------------------------- | --------------------------- |
| All routes                | 100 requests per 15 minutes |
| Auth routes (`/api/auth`) | 10 requests per 15 minutes  |

## Assumptions Made

- Only admins can create, update, and delete records — analysts are read-only
- Deleted records use soft delete (\`isDeleted\` flag) so data is never permanently lost
- JWT tokens expire after 7 days
- All IDs use UUID format for better security
- Audit logs automatically track all create, update, and delete operations
- Passwords are never stored in plain text — always hashed with bcrypt
- Sensitive fields (passwords) are automatically removed from audit logs

## Project Structure

\`\`\`
finance-backend/
├── prisma/
│ ├── schema.prisma # Database schema
│ └── migrations/ # Migration history
├── src/
│ ├── config/
│ │ └── db.js # Prisma client setup
│ ├── controllers/ # Business logic
│ │ ├── authController.js
│ │ ├── userController.js
│ │ ├── recordController.js
│ │ ├── dashboardController.js
│ │ └── auditController.js
│ ├── middleware/ # Express middleware
│ │ ├── auth.js # JWT verification
│ │ ├── roleCheck.js # Role based access
│ │ └── auditLog.js # Audit logging
│ ├── routes/ # API route definitions
│ │ ├── auth.js
│ │ ├── users.js
│ │ ├── records.js
│ │ ├── dashboard.js
│ │ └── audit.js
│ ├── validators/ # Input validation rules
│ │ ├── authValidator.js
│ │ └── recordValidator.js
│ └── app.js # Express app entry point
├── .env # Environment variables (not committed)
├── .gitignore
└── package.json
\`\`\`
