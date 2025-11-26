# WiW Backend (demo skeleton)

## Quick start (local)
- Copy `.env.example` to `.env` and adjust DATABASE_URL
- `npm install`
- `npm run dev`

API:
- POST /api/honoraires  -> requires body: { partenaires: [{ nom, coutHoraire }] }

Notes:
- This backend is a minimal realistic skeleton for demonstration and deployment to Railway.
- Authentication and full Prisma client setup are left as next steps.
