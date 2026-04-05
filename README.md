# Finance Backend API

A RESTful backend for a finance dashboard system with role-based access control, built with Node.js, Express, PostgreSQL, and Prisma ORM.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: JWT + bcryptjs
- **Validation**: express-validator

## Features

- JWT Authentication (Register & Login)
- Role Based Access Control (Viewer / Analyst / Admin)
- Financial Records Management (CRUD + Filtering + Pagination)
- Dashboard Analytics (Summary, Category Totals, Monthly & Weekly Trends)
- Search Records by keyword
- Export Records to CSV
- Password Change API
- Rate Limiting (brute force protection)
- Audit Logs (track all actions)
- Soft Delete for records

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

## Setup Instructions

### 1. Clone the repository

\`\`\`bash
git clone https://github.com/your_username/finance-backend.git
cd finance-backend
\`\`\`

### 2. Install dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Setup environment variables

Create a \`.env\` file in the root:
\`\`\`env
PORT=3000
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/finance_db"
JWT_SECRET=your_jwt_secret_key
\`\`\`

### 4. Run database migrations

\`\`\`bash
npx prisma migrate dev
npx prisma generate
\`\`\`

### 5. Start the server

\`\`\`bash
npm run dev
\`\`\`

## API Endpoints

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

## Query Parameters

### Records Filtering

\`\`\`
GET /api/records?type=income
GET /api/records?category=salary
GET /api/records?search=food
GET /api/records?startDate=2024-01-01&endDate=2024-12-31
GET /api/records?page=1&limit=10
\`\`\`

## Assumptions Made

- Only admins can create records — analysts are read-only
- Deleted records use soft delete (isDeleted flag) so data is never lost
- JWT tokens expire after 7 days
- Rate limiting: 100 requests per 15 min globally, 10 requests per 15 min on auth routes
- Audit logs track all create, update, delete operations

## Project Structure

\`\`\`
src/
├── config/
│ └── db.js # Prisma client
├── controllers/ # Business logic
├── middleware/ # Auth, role check, audit log
├── routes/ # API endpoints
├── validators/ # Input validation
└── app.js # Express app
\`\`\`
