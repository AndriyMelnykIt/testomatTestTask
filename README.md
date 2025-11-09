# REST API Client Test Task

A synchronous-style REST API client with automatic retries, session management, and timeout handling.

## Project Structure

- `BE/` - Backend API server (Express.js)
  - `server.js` - In-memory REST API with simulated errors/timeouts
  - `client/` - Node.js client library with request queueing and retry logic
  - `test/` - Unit tests for the client library
- `FE/` - Frontend UI (Next.js + TypeScript)
  - Interactive testing interface for the API client

## Prerequisites

- Node.js v18 or higher
- npm

## Installation

Install dependencies for the backend:

```bash
npm install
```

Install dependencies for the frontend:

```bash
cd FE
npm install
cd ..
```

## Running the Application

### 1. Start the Backend Server

In the first terminal:

```bash
npm run dev
```

The server will start at `http://localhost:3000`

### 2. Start the Frontend

In a second terminal:

```bash
npm run fe:dev
```

Open your browser and navigate to `http://localhost:5173`

## Using the UI

### Authentication
- Enter a **User ID** (any value: 1, 2, user123, etc.) in the "Auth Token" field
- Each user ID has isolated data storage

### Making Requests

**GET Request:**
- Endpoint: `/api/pets`
- Returns list of pets for the current user

**POST Request:**
- Endpoint: `/api/pets`
- Enter pet name in "Pet Name" field
- Creates a new pet for the current user

**GET by ID:**
- Endpoint: `/api/pets/:id` (e.g., `/api/pets/1`)
- Returns a specific pet

**Reset User Data:**
- Clears all pets for the current user

### Testing Multi-User Isolation

1. Set Auth Token to `1`
2. Create a pet (e.g., "cat")
3. Set Auth Token to `2`
4. Click GET - you'll see an empty list (different user)
5. Create a pet for user 2 (e.g., "dog")
6. Switch back to Auth Token `1` - you'll only see "cat"

## Testing the Node.js Client Library

### Run Unit Tests

```bash
npm test
```

Tests automatically:
- Start the server on a random port
- Disable random errors for deterministic results
- Test request chaining, session isolation, retries, and timeouts

## API Endpoints

### GET /pets
Returns array of pets for the authenticated user

```bash
curl -H "Authorization: Bearer 1" http://localhost:3000/pets
```

### GET /pets/:id
Returns a specific pet by ID

```bash
curl -H "Authorization: Bearer 1" http://localhost:3000/pets/1
```

### POST /pets
Creates a new pet

```bash
curl -X POST -H "Authorization: Bearer 1" -H "Content-Type: application/json" -d "{\"name\":\"cat\"}" http://localhost:3000/pets
```

### DELETE /pets
Deletes all pets for the authenticated user

```bash
curl -X DELETE -H "Authorization: Bearer 1" http://localhost:3000/pets
```

## Features

### Backend Server
- In-memory data storage (isolated by Bearer token)
- Random error simulation (500/401 responses)
- Random timeout simulation
- Can be disabled via `NO_RANDOM=1` environment variable

### Client Library
- **Synchronous-style API**: Requests are queued and executed sequentially
- **Session Management**: `requestSession()` creates isolated execution contexts
- **Automatic Retries**: Retries on 500/401 errors (up to 2 retries with exponential backoff)
- **Timeout Handling**: 1-second timeout per request
- **Bearer Authentication**: `request.auth(token)` sets Authorization header

### Frontend
- TypeScript + Next.js
- Real-time request logging
- Visual feedback for pending/success/error states
- Detailed response viewer

## Building for Production

### Build Backend
Backend doesn't require a build step - it runs directly with Node.js

### Build Frontend

```bash
cd FE
npm run build
npm run start
```

The production build will be available at `http://localhost:5173`

## Troubleshooting

**Port already in use:**
- Change the port in `BE/server.js` or `FE/package.json`

**401 Errors:**
- Make sure you've entered an Auth Token in the UI

**404 on POST:**
- Ensure endpoint is exactly `/api/pets` (not `/api/pets/:id`)

**Buttons disabled after request:**
- The client has a 1-second timeout - buttons will re-enable automatically
- If the server hangs (simulated timeout), wait for the timeout

## Environment Variables

**Backend:**
- `PORT` - Server port (default: 3000)
- `NO_RANDOM` - Disable random errors/timeouts (set to `1` for tests)
- `DEBUG` - Enable debug logging (e.g., `DEBUG=server*,client*`)

**Frontend:**
- `NEXT_PUBLIC_API_BASE_URL` - Backend URL (default: `http://localhost:3000`)
