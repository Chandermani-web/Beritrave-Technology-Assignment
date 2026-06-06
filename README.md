Beritrave Technology — Task Manager (MERN)

Production-ready, full-stack Task Management application built with MongoDB, Express, Node.js, and React (Vite + Tailwind). Includes per-user authentication (JWT), secure password hashing, and per-user task ownership with full CRUD.

## Features

- JWT-based authentication and authorization
- User registration and login flows
- Secure password hashing with `bcryptjs`
- Per-user tasks: create, read, update, delete
- Task status updates (PATCH endpoint)
- React dashboard with responsive UI and task list
- Axios instance + interceptors for auth token handling
- Backend validation and ownership checks for protected routes

## Tech Stack

- Backend: Node.js, Express, MongoDB (Mongoose)
- Auth: JWT (`jsonwebtoken`), password hashing with `bcryptjs`
- Frontend: React 18, Vite, Tailwind CSS, React Router
- HTTP client: `axios`

## Prerequisites

- Node.js (>=18) and npm
- MongoDB instance (local, Atlas, or connection string)

## Environment

Copy and update the environment templates in each folder before running:

- Backend: backend/.env (see backend/.env.example)
  - `MONGO_URI` — MongoDB connection string
  - `JWT_SECRET` — secret for signing JWTs
  - `PORT` — backend port (default 5000)

- Frontend: frontend/.env (see frontend/.env.example)
  - e.g. `VITE_API_URL` pointing to backend API

## Setup & Run (Development)

Backend

```powershell
cd backend
npm install
cp .env.example .env
# edit .env to provide MONGO_URI and JWT_SECRET
npm run dev
```

Frontend

```powershell
cd frontend
npm install
cp .env.example .env
# edit .env to set VITE_API_URL
npm run dev
```

Open the frontend (usually http://localhost:5173) after starting both servers.

## Build (Production)

Frontend

```powershell
cd frontend
npm run build
```

Backend (example)

```powershell
cd backend
npm install --production
NODE_ENV=production node src/server.js
```

## Repository Structure (top-level)

- `backend/` — Express API, models, controllers, routes
- `frontend/` — Vite React app, pages, components
- `.env.example` files in each folder with required variables

## Committing / Deployment

- This commit adds the full scaffold (backend + frontend). For deployment, provide environment variables securely (CI/CD or host env) and enable HTTPS for production.

## Next Steps / Suggestions

- Add integration tests and seed scripts
- Add Docker/Docker Compose for easy local setup
- Add CI (GitHub Actions) for linting and tests
