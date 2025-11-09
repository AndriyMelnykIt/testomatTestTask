## You can watch the demo at https://testomat-test-task.vercel.app REST API Client Test Task

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
