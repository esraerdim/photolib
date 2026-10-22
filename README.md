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

`server/index.js` starts Express. `GET /api/health` only checks that the server is up. The photographs still live in `client/src/data/works.js` until they move into the database.
