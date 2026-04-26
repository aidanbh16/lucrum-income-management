# Lucrum Income Management Service

This repository contains the Income Management Service (IMS) for Lucrum.  
It is an Express-based backend responsible for managing user income and expenses.

---

## Overview

The service provides REST API endpoints for:

- Retrieving the authenticated user's income balance
- Updating the authenticated user's income balance
- Creating, retrieving, updating, and deleting expenses

Authentication is handled via JWT tokens stored in HTTP-only cookies, shared with the Account Management Service.

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
