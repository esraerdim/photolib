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

## Deploy

The site and the API are published separately. Neither address is localhost.

- Vercel serves `client/`. Set `VITE_API_URL` to the API's public https address. Vite reads it at build time and bakes it into the site.
- Render serves `server/` (`https://photolib.onrender.com`), with `npm start`. Set `DATABASE_URL`, `AUTH_SECRET`, `BETTER_AUTH_URL` (the API's own https address), `CLIENT_ORIGIN` (the site's https address, or a comma-separated list), `STRIPE_SECRET_KEY` (test mode, `sk_test_...`), and `STRIPE_WEBHOOK_SECRET` (from the Stripe webhook endpoint). No trailing slashes. The live site is on Vercel (`photolib-esra22.vercel.app` / `photolib-weld.vercel.app`). The live webhook URL is `https://photolib.onrender.com/api/stripe/webhook`, listening for `checkout.session.completed`.

The browser and the API are different sites, so a live session cookie is `SameSite=None; Secure`. On localhost it stays `SameSite=Lax`. The `.env` files stay off git; the host dashboards hold the real values.

Before the API can reach the database, copy `server/.env.example` to `server/.env` and fill in `DATABASE_URL` and `AUTH_SECRET`. Copy `client/.env.example` to `client/.env` so the site knows the API address. Both `.env` files are gitignored and must not be committed.

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
- `GET /api/works` returns the photographs, including `price_cents`. A signed-in visitor also gets their own `rating` and `saved` on each one.
- `PUT /api/works/:id/rating` and `PUT /api/works/:id/save` write that visitor's stars and saved list. Both require a session.
- `POST /api/contact` stores a booking request from the contact form.
- `POST /api/checkout` starts a Stripe Checkout session for one print. The caller must be signed in. The body is `{ workId }` only; the price is read from `works.price_cents`. The order is stored as `pending`. This route never marks an order paid.
- `POST /api/stripe/webhook` is called by Stripe. It checks the signature on the raw body. `checkout.session.completed` with `payment_status` of `paid` is the only event that sets an order to `paid`.
- `GET /api/orders/session/:sessionId` returns that signed-in user's order: status, title, unit price, quantity, and the photograph. It never changes the status. The success page calls it a few times, because the webhook can arrive just after Stripe redirects.
- `GET /api/orders/session/:sessionId/items/:workId/file` downloads that photograph. The order must belong to the signed-in user and already be `paid`.
- `/api/auth/*` is Better Auth: sign up, sign in, sign out, and the session cookie.

`server/auth.js` is Better Auth. It owns the `user`, `session`, `account`, and `verification` tables. `server/schema.sql` is ours: `works` (the photographs, including `price_cents`), `ratings` (one person's stars on one photograph), `saves` (one person's saved photographs), `booking_requests` (contact form submissions), `orders` (one row per purchase, `pending` until paid), and `order_items` (the print title and price at the moment of purchase). `npm run db:seed` copies `client/src/data/works.js` into `works`. `npm run db:contact` creates the booking table if it is missing.
