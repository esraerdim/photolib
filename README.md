# Lena Voss — Photography Portfolio

Single-page photography portfolio. The site is a React + Tailwind app. The API is a separate Express server.

## Run

Two terminals:

```
cd client
npm install
npm run dev
```

```
cd server
npm install
npm run dev
```

The site is at http://localhost:5173. The API is at http://localhost:3001.

Before the API can reach the database, copy `server/.env.example` to `server/.env` and fill in `DATABASE_URL` and `AUTH_SECRET`. That file is listed in `.gitignore` and must not be committed.

## Structure

```
client/     the website (React, Vite, Tailwind)
server/     the API (Express)
```

Inside `client/`:

```
src/components/   header, hero, gallery, about, contact, rating
src/layouts/      site shell (header and footer)
src/pages/        home page
src/data/works.js the twelve photographs
public/assets/img photos
```

`server/index.js` starts Express and mounts the routes.

- `GET /api/health` checks that the server is up.
- `GET /api/works` returns the photographs. A signed-in visitor also gets their own `rating` and `saved` on each one.
- `PUT /api/works/:id/rating` and `PUT /api/works/:id/save` write that visitor's stars and saved list. Both require a session.
- `/api/auth/*` is Better Auth: sign up, sign in, sign out, and the session cookie.

`server/auth.js` is Better Auth. It owns the `user`, `session`, `account`, and `verification` tables. `server/schema.sql` is ours: `works` (the photographs), `ratings` (one person's stars on one photograph), and `saves` (one person's saved photographs). `npm run db:seed` copies `client/src/data/works.js` into `works`.
