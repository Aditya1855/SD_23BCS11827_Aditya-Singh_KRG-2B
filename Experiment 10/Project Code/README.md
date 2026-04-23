# Multiplayer Game Lobby Service (Full-Stack)

This project is a **complete Lobby Service implementation** for a multiplayer game system.
It focuses only on the Lobby Service domain (not full microservices infrastructure).

## Features

- Create players
- Create lobbies
- Join / leave lobby
- Auto host reassignment when host leaves
- Toggle ready / unready
- Start game with strict rules
- Live lobby updates through Socket.IO rooms
- Lobby search by lobby code
- Event feed for real-time activity

## Tech Stack

- **Frontend:** React + Vite + TypeScript + Tailwind CSS
- **State/data:** React Query
- **Forms:** React Hook Form
- **Backend:** Node.js + NestJS + TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Realtime:** Socket.IO
- **Validation:** class-validator

## Folder Structure

```text
client/
  src/
    api/
    components/
    socket/
    types/
server/
  src/
    common/filters/
    health/
    lobby/
    player/
    prisma/
    websocket/
  prisma/
README.md
```

## Prerequisites

- Node.js 20+
- npm 10+
- PostgreSQL 14+

## Environment Variables

### Server (`server/.env`)

Copy `server/.env.example` to `server/.env` and update values:

```env
PORT=3000
CLIENT_URL=http://localhost:5173
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/lobby_service?schema=public
```

### Client (`client/.env`)

Copy `client/.env.example` to `client/.env`:

```env
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
```

## PostgreSQL Setup

1. Create a database named `lobby_service`.
2. Ensure credentials in `DATABASE_URL` match your local Postgres user/password.

Example using psql:

```sql
CREATE DATABASE lobby_service;
```

## Backend Setup (NestJS + Prisma)

```bash
cd server
npm install
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run prisma:seed
npm run start:dev
```

Server runs at `http://localhost:3000`.

## Frontend Setup (React + Vite)

Open a second terminal:

```bash
cd client
npm install
npm run dev
```

Client runs at `http://localhost:5173`.

## REST APIs

### Players

- `POST /players`
- `GET /players`
- `GET /players/:id`

### Lobbies

- `POST /lobbies`
- `GET /lobbies`
- `GET /lobbies/:id`
- `GET /lobbies/code/:lobbyCode`
- `GET /lobbies/:id/members`
- `POST /lobbies/:id/join`
- `POST /lobbies/:id/leave`
- `POST /lobbies/:id/ready`
- `POST /lobbies/:id/start`

## WebSocket Events

### Client emits

- `join_lobby_room` `{ lobbyId }`
- `leave_lobby_room` `{ lobbyId }`

### Server emits

- `lobby_created`
- `player_joined`
- `player_left`
- `ready_changed`
- `host_changed`
- `lobby_updated`
- `game_started`

## Business Rules Implemented

- Creator becomes host and first member
- Join allowed only when lobby exists, OPEN, not full, not already joined
- FULL status when max reached; back to OPEN when below max
- Host reassigned to next joined member on host leave
- Lobby set to CLOSED when last player leaves
- Only members can change ready status
- Only host can start game
- Start game only when lobby is OPEN/FULL, minimum 2 players, all ready
- On start, lobby goes `IN_PROGRESS` and a `GameSession` is created

## Seed Data

`npm run prisma:seed` inserts:

- 4 sample players
- 2 sample lobbies
- lobby members with mixed ready states

## Sample User Flow

1. Open app and create/select a current player.
2. Create a new lobby from dashboard.
3. Join with another player (switch current player selector).
4. Toggle both users to ready.
5. Start game as host.
6. Open another browser tab and observe live updates in both tabs.

## Build Validation

Both projects compile successfully:

- `cd server && npm run build`
- `cd client && npm run build`
