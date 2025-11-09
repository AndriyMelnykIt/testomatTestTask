# REST API Client Test Task

## Install
```bash

npm install

cd FE && npm install && cd ..
```

## Run (dev)
- Backend (http://localhost:3000):
```bash
npm run dev
```
- Frontend (http://localhost:5173):
```bash
npm run fe:dev
```

## How to use (UI)
1) Open http://localhost:5173
2) Enter Auth Token (any user id, e.g. 1 or 2)
3) Endpoints:
   - GET list: `/api/pets`
   - GET by id: `/api/pets/:id`
   - POST create: `/api/pets` (uses “Pet Name” field)
4) “Reset user data” clears all pets for the current token.

Notes:
- Different tokens = different isolated users (Bearer auth).
- If POST returns 404, ensure endpoint is exactly `/api/pets` (no id).

## Run tests (client library)
```bash
npm test
```

## Useful scripts
```bash
npm run dev
npm run fe:dev
npm run fe:build
npm run fe:start
```

## Deploy to Vercel

### Option 1: Via Vercel CLI
```bash
npm i -g vercel
vercel
```

### Option 2: Via GitHub Integration
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Vercel will auto-detect Next.js in `FE/` folder
5. Add environment variable:
   - `NEXT_PUBLIC_API_BASE_URL` = your backend URL (e.g., `https://your-backend.vercel.app` or `https://your-backend.railway.app`)

### Important Notes
- **Backend must be deployed separately** (Vercel, Railway, Render, etc.)
- Set `NEXT_PUBLIC_API_BASE_URL` in Vercel dashboard to point to your backend
- The `vercel.json` config is already set up for the `FE/` folder
