# Backend Run Instructions

## Prerequisites

- Node.js v16+
- PostgreSQL

## Setup

- `cd client-managment-backend`
- `npm install`
- Create `.env` with:
  - `DB_USER=postgres`
  - `DB_PASSWORD=your_postgres_password`
  - `DB_NAME=client_management`
  - `DB_HOST=localhost`
  - `DB_PORT=5432`
  - `JWT_SECRET=your_super_secret_jwt_key`
  - `NODE_ENV=development`
- Create database: `createdb client_management`
- Seed data: `npm run seed`
- Start server: `npm run dev`
- API base: `http://localhost:5000/api`
# client-management-backend
