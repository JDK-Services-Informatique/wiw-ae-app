# Deploy frontend to Vercel (monorepo)

This project is a monorepo with:
- `backend/`
- `frontend/` (Vercel `Root Directory`)

Follow these steps to deploy the frontend on Vercel and wire the API URL:

1) Create a Vercel project
- In Vercel, choose "Import Project" → select your repository.
- In **Root Directory**, set: `frontend` (important for monorepo).

2) Build & Output settings (optional — Vercel detects Vite)
- Build Command: `npm run build` (or `npm run vercel-build`)
- Output Directory: `dist`

3) Environment Variables (in Vercel Project Settings)
- Add the runtime environment variable used by the frontend:
  - `VITE_API_URL` = `https://<your-backend-host>/api` (example: `https://wiw-api.onrender.com/api`)
- Optionally add `NODE_ENV=production`.

4) Deploy
- Trigger a deployment from the Vercel dashboard or push to the repo's branch configured for deployments.

5) Post-deploy
- In your backend host, ensure CORS allows the Vercel URL.
- If you update backend URL later, update the `VITE_API_URL` variable in Vercel and redeploy.

Notes
- `import.meta.env.VITE_API_URL` is injected at build time — the frontend will call that URL at runtime.
- For local testing, copy `.env.example` to `.env` and set `VITE_API_URL=http://localhost:4000/api`.

If you want, I can:
- Add a `vercel.json` at repo root instead of `frontend/vercel.json` and include redirects/rewrites for the SPA.
- Prepare a `README` with step-by-step screenshots for Vercel.
