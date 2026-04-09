# RS2 Shopping Cart

## Overview

This is a simple shopping cart system where users can:

- Log in
- Search products by name and type
- Add products to a basket
- Prevent adding the same product twice
- View their basket

The main goal of this project was to focus on **correctness, validation and backend consistency**, rather than just UI.

## Tech Stack

- Node.js + Express + TypeScript
- SQLite
- JWT for authentication
- bcrypt for password hashing

## Structure

I separated the code into:

- controllers: handle requests/responses
- services: business logic
- middleware: authentication

This keeps the code easier to reason about and avoids mixing responsibilities.

## Key Decisions

### Authentication

Passwords are hashed using bcrypt instead of being stored in plain text.

JWT is used for authentication and protected routes require a valid token.

### Backend Validation

Even though validation could be done in the frontend, I enforced it in the backend to ensure the API behaves correctly even if called directly.

Examples:

- product name: only letters, max length 30
- product type: only Books, Music, Games
- quantity: positive integer

### SQL Injection

All queries use parameterized statements (`?`) instead of string interpolation.

This prevents SQL injection and keeps queries safe.

### Basket Logic

One important requirement is that the same product cannot be added twice.

I handled this in two ways:

- checking in the backend before inserting
- adding a UNIQUE constraint in the database (userId + productId)

This ensures consistency even if multiple requests happen.

### Quantity Field

The original model did not include quantity in the basket.

I added it to better represent the number of items selected by the user and to support the quantity input required in the UI.

## Endpoints

### POST /login

Returns a JWT token.

### GET /products

Supports filtering by name and type.

Requires authentication.

### POST /basket

Adds a product to the basket.

Prevents duplicates.

### GET /basket

Returns all products in the user's basket.

## How to Run

```bash
npm install
npm run dev
```

Server runs on:

```
http://localhost:3000
```

### Test Credentials

A default user was seeded for testing purposes:

- loginName: admin
- password: 1234

## Notes

I kept the implementation simple but focused on:

- keeping the backend as the source of truth
- enforcing business rules
- writing safe queries
- structuring the code clearly

The idea was to build something small but solid and easy to reason about.

---

## Additional Notes

- Product name is validated on both client and server.
- User input is normalized (trimmed) before validation to avoid false negatives.
- The product list is rendered using a table to match the "grid/table" requirement.
- Duplicate products are intentionally prevented as specified in the requirements.
- In a real-world scenario, the basket would allow updating quantities instead of blocking duplicates.
