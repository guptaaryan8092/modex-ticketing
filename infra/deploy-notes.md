# Deployment Guide

This guide covers deploying the Ticket Booking System to cloud providers.

## Prerequisites
- GitHub Repository with your code pushed.
- Accounts on:
  - **Vercel** (for Frontend)
  - **Render** or **Railway** (for Backend & Database)

---

## 1. Database (PostgreSQL)
You need a cloud PostgreSQL instance.

### Option A: Neon / Railway / Render Managed DB
1. Create a new PostgreSQL database service.
2. Copy the **Connection String** (looks like `postgres://user:pass@host:port/dbname`).
3. Save this; you will need it for the Backend `DATABASE_URL`.

---

## 2. Backend Deployment

### Render / Railway
1. **New Web Service**: Connect your GitHub repo.
2. **Root Directory**: Set often to `backend` (or use the custom Dockerfile path if supported, e.g. `infra/Dockerfile.backend`). *Simplest is to point to `backend` and use standard Node environment.*
3. **Build Command**: `npm install`
4. **Start Command**: `npm start`
5. **Environment Variables**:
   - `DATABASE_URL`: (Paste connection string from Step 1)
   - `NODE_ENV`: `production`
   - `PORT`: `3000` (or whatever the platform assigns)

### Migrations
On the first deploy, you need to set up the DB tables.
- **Render**: You can run a "Shell" command or add a "Pre-Deploy Command": `npx sequelize-cli db:migrate`.
- **Railway**: Use the built-in CLI or run locally pointing to remote DB (careful!).

---

## 3. Frontend Deployment (Vercel)

1. **New Project**: Import your GitHub repo.
2. **Framework Preset**: Vite.
3. **Root Directory**: `frontend`.
4. **Environment Variables**:
   - `VITE_API_URL`: The URL of your deployed backend (e.g., `https://my-api.onrender.com`).
     *Note: Do not add trailing slash.*
5. **Deploy**: Click Deploy.

### Important: CORS
If your frontend attempts to talk to backend and fails with CORS:
1. Go to **Backend** code (`backend/src/app.js` or `index.js`).
2. Ensure `cors` is configured to accept your Vercel domain.
   ```js
   app.use(cors({
     origin: process.env.FRONTEND_URL || '*', // Set FRONTEND_URL in env vars for security
     credentials: true
   }));
   ```

---

## 4. Final Checklist
- [ ] Database is accessible to Backend.
- [ ] Backend is running and healthy (visit `/` or `/shows`).
- [ ] Frontend Vercel deployment shows "Ready".
- [ ] Frontend can fetch shows from Backend (check Network tab for CORS or 404s).
