# Lucrum Income Management System

This repository contains the Income Management Service (IMS) for Lucrum, a personal finance management application. Built with Node.js, Express, and TypeScript, it is responsible for managing each user's income and expenses. Users can set and update their monthly income balance, create recurring and variable expenses, and allocate income across different spending categories. Recurring expenses persist month to month, while variable expenses are automatically reset at the start of each month. All routes are protected — each request reads the JWT from the shared `user` HTTP-only cookie set by the Account Management Service, verifies it, and scopes every database query to the authenticated user. The service connects to PostgreSQL via a connection pool and uses parameterized queries throughout. It is containerized with Docker and deployed on an AWS EC2 instance, with HTTPS enforced via Nginx as a reverse proxy and SSL certificates managed by Certbot.

---

## Overview

The system provides REST API endpoints for:

- Retrieving the authenticated user's income balance
- Updating the authenticated user's income balance
- Creating, retrieving, updating, and deleting expenses

Authentication is handled via JWT tokens stored in HTTP-only cookies, shared with the Account Management System.

---

## Tech Stack

- Node.js
- Express
- PostgreSQL
- JWT (jsonwebtoken)
- Docker

---

## API Routes

### Income

| Method | Endpoint         | Description                        |
|--------|------------------|------------------------------------|
| GET    | /income/balance  | Get the current user's balance     |
| PATCH  | /income/update   | Update the current user's balance  |

### Expenses

| Method | Endpoint          | Description                        |
|--------|-------------------|------------------------------------|
| GET    | /expenses         | Get all expenses for the user      |
| POST   | /expenses         | Create a new expense               |
| PATCH  | /expenses/:id     | Update an expense                  |
| DELETE | /expenses/:id     | Delete an expense                  |

---

## Authentication Flow

- Each route reads the `user` cookie and verifies the JWT
- The decoded `userId` is used to scope all queries to the authenticated user

---

## Database

The service connects to PostgreSQL using a connection pool:

```ts
export const pool = new Pool({
  connectionString: env.DEV_DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});
```
