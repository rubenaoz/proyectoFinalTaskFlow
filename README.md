# TaskFlow

TaskFlow is a web app for managing projects and tasks, with user login through JWT. I built it with React, TypeScript, and Vite.

## What it does

Once you log in you can create projects, and inside each project create, edit, and delete tasks (with priority, an assignee, and a due date). Everything except the login screen is protected: without a valid session you can't get into the dashboard or see any project's tasks.

## Tech stack

- React 19 + TypeScript
- Vite as the build tool
- React Router for routing
- Axios for HTTP requests
- MUI (Material UI) + Emotion for the UI components and theming
- ESLint

## Running it locally

Install dependencies:

```bash
npm install
```

Copy `.env.example` to `.env.local` and set your backend URL there:

```bash
VITE_API_URL=https://your-backend-here.com
```

If `VITE_API_URL` isn't set, the app falls back to `/api` in development (meant to be used with a proxy) and to a default URL defined in `types.ts` in production.

Then just start the dev server:

```bash
npm run dev
```

### Other scripts

- `npm run build:pages` — compiles and builds for production, and copies `index.html` to `404.html` (needed so React Router's routes work correctly on GitHub Pages).
- `npm run preview` — serves the already-built production build locally.
- `npm run lint` — runs ESLint.

## Authentication

Login uses JWT. When you submit your credentials, `authService.login()` sends a POST to `/auth/login` and gets back a token. That token is saved in `localStorage` along with the username, and `AuthContext` exposes it to the rest of the app through a hook (`useAuth()`).

To avoid sending the token manually on every request, there's an Axios interceptor in `httpClient.ts` that automatically attaches it as an `Authorization: Bearer <token>` header on any request made after login. Logging out clears everything, both the state and `localStorage`.

## Routes

- `/login` — public
- `/dashboard` — protected, this is where projects are listed and created
- `/projects/:projectId/tasks` — protected, tasks for a specific project
- any other route redirects to `/dashboard`

Protected routes are wrapped by a `ProtectedRoute` component that checks whether there's an active session and, if not, sends you straight to `/login`.

## The API

Data requests (projects and tasks) all go through a configured Axios instance (`httpClient`) that already has the base URL resolved and the token attached automatically. There's also a function that translates API errors into more readable messages, with a specific case for when login fails (401).

Endpoints used:

| Resource | GET | POST | PUT | DELETE |
|---|---|---|---|---|
| Projects | `/projects` | `/projects` | `/projects/:id` | `/projects/:id` |
| Tasks | `/tasks` | `/projects/:projectId/tasks` | `/tasks/:id` | `/tasks/:id` |

## What's missing

Right now it doesn't have automated tests or PWA support. Tasks are fetched all at once from the backend and filtered by project on the client side, which works fine at this scale but wouldn't hold up as well with a lot more data. It also uses PUT for updates (replaces the whole resource) instead of PATCH, which would be more appropriate for partial changes. And the JWT lives in `localStorage`, which isn't the safest option against XSS attacks for a real production app, an httpOnly cookie would be the better choice.
