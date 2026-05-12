# Flowspace Frontend

Flowspace is a collaborative workspace and task management frontend built for a productivity app with kanban boards.

The matching backend lives here: [backend repository](https://github.com/RobinHawiz/flowspace-backend).

## Table of Contents

- [Features](#features)
- [Project Status](#project-status)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Routing](#routing)
- [Realtime Events](#realtime-events)
- [Running Locally](#running-locally)
- [Scripts](#scripts)

## Features

- **Authentication:** users can sign up, log in, log out, and stay authenticated through the backend's HttpOnly cookie based JWT authentication.
- **Workspace overview:** users can view all workspaces they have access to and create new workspaces.
- **Workspace management:** workspace titles can be updated, and workspaces can be deleted.
- **Workspace membership:** members can be listed, added by email, and removed with admin/member role handling.
- **Kanban board UI:** each workspace contains ordered columns and ordered tasks with drag and drop interactions.
- **Task management:** tasks can be created, updated, deleted, reordered within a column, and moved across columns.
- **Realtime workspace updates:** Socket.IO keeps workspace and membership changes in sync across tabs and clients.
- **Responsive interface:** the app UI is mobile responsive and includes accessible labeling for images and buttons.

## Project Status

The project is currently a pre v1 release. Core workspace and task features are implemented, and realtime synchronization is in place for workspace and membership changes. Column and task changes are still updated through standard HTTP requests rather than dedicated socket events.

Planned for v1:

- Realtime updates for workspace columns.
- Realtime updates for tasks.

Planned for v2:

- Notification center for important workspace events.
- Frontend support for backend lexicographical ordering of columns and tasks.

Planned for v3:

- UX overhaul and codebase refactoring.

## Tech Stack

- **Framework:** React
- **Language:** TypeScript
- **Build tool:** Vite
- **Routing:** React Router
- **Server state:** TanStack Query
- **Realtime:** Socket.IO client
- **Validation:** Zod
- **Drag and drop:** dnd-kit
- **Styling:** Tailwind CSS v4 + daisyUI
- **Notifications:** React Toastify
- **Deployment:** Azure App Service with GitHub Actions

## Architecture

The frontend is mainly organized around route pages, with shared folders for API calls, cache logic, global state, and reusable components.

Project structure:

```text
src/
├── api/              # HTTP request functions grouped by domain
├── cache/            # Query client, query options, and cache helpers
├── components/       # Shared UI components
├── contexts/         # Auth and Socket.IO providers
├── hooks/            # Reusable hooks for auth/session handling
├── routes/
│   ├── public/       # Login and sign up pages
│   └── protected/    # Workspace overview and individual workspace pages
├── types/            # Zod schemas and TypeScript types
├── utils/            # Small utility helpers
├── main.css          # Global styles and custom Tailwind utilities
└── main.tsx          # App entrypoint, providers, and router setup
```

The frontend data handling typically works like this:

```text
UI component -> mutation/query option -> API request -> cache helper -> rerender
Socket event -> cache helper -> rerender
```

Responsibilities are split roughly like this:

- **API layer:** raw HTTP communication with the backend.
- **Cache layer:** TanStack Query options and shared cache update helpers.
- **Contexts:** authentication state and the global socket connection.
- **Route components:** page specific UI and interactions.
- **Shared components:** reusable layouts and modals.

## Routing

The app uses lazy loaded route modules through React Router.

Current routes:

- `/` - log in page
- `/sign-up` - sign up page
- `/workspaces` - workspace overview
- `/workspaces/:workspaceId` - individual workspace board

Protected routes are wrapped by `PrivateRoutes`, which waits for the initial token check before deciding whether to render the app or redirect to the log in page.

## Realtime Events

The frontend establishes a Socket.IO connection after authentication succeeds.

Current realtime behavior focuses on workspace level changes:

- workspace created
- workspace updated
- workspace deleted
- workspace member added
- workspace membership added
- workspace member removed
- workspace membership removed

The socket layer updates the TanStack Query cache directly so the UI stays in sync across tabs and clients.

To avoid duplicating the same change locally:

- mutating HTTP requests generate a UUID and send it in the `X-Client-Request-Id` header
- the backend receives that value and includes the same `clientRequestId` in the socket event
- when the event comes back to the originating client, the frontend consumes that tracked id and skips applying the same cache update twice

Workspace list and workspace page components join relevant workspace rooms so users receive surface level updates for workspaces they have access to.

## Running Locally

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_SOCKET_SERVER_URL=http://localhost:3000
```

### 3. Start the development server

```bash
npm run dev
```

> [!NOTE]
> The repo includes a small env check script in [getenv.js](./getenv.js), and `npm run dev` / `npm run build` both validate these variables before continuing.

## Scripts

| Script              | Purpose                                                         |
| ------------------- | --------------------------------------------------------------- |
| `npm run check-env` | Validate required `VITE_*` environment variables.               |
| `npm run dev`       | Start the Vite development server.                              |
| `npm run build`     | Validate env vars, type check and build the app for production. |
| `npm run preview`   | Validate env vars and preview the production build locally.     |
