# Kisan Price

A working prototype connecting **farmers** (who upload verified quality
certificates and crop sample photos) with **vendors** (who browse, rate,
and purchase directly from farmers). Built with **React + Vite** on the
frontend and a small **Node/Express** backend with JSON file storage.

## What's inside

```
kisan-price/
├── frontend/     React + Vite app (landing page, auth, explore feed, upload, contact)
└── backend/      Express API (auth, listings, ratings, contact, image uploads)
```

### Features

- **Landing page** with animated hero, a live "mandi ticker" of listings, a
  how-it-works section, and feature highlights.
- **Combined login / register page**, with a farmer-or-vendor role toggle
  on registration.
- **Upload page** (only visible once logged in) where a farmer submits a
  crop name, quality grade, price, description, a certificate image, and
  up to 5 sample photos.
- **Explore / feed page** — an Instagram-style grid of every uploaded
  sample. Each card shows the crop, quality badge, price, the farmer's
  name, region and contact number, and their average rating.
- **Detail view** — clicking a card opens a full breakdown: all sample
  photos, the certificate, description, price, farmer contact info, and
  a place to leave a star rating + comment for that farmer.
- **Contact page** with a simple message form.
- **JWT-based auth**, bcrypt-hashed passwords, image uploads via multer,
  everything persisted to a local JSON file (`backend/data/db.json`) so
  the prototype needs no external database.

## Running it locally

You'll need Node.js 18+ installed.

### 1. Backend

```bash
cd backend
npm install
npm run dev        # or: npm start
```

The API runs on `http://localhost:5000`. On first run it creates
`data/db.json` automatically. Optionally seed a few demo listings:

```bash
node seed.js
```

(Demo farmers use the password `password123`.)

### 2. Frontend

In a second terminal:

```bash
cd frontend
npm install
cp .env.example .env    # points the app at http://localhost:5000/api
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Notes on this being a prototype

- Storage is a flat JSON file, not a production database — fine for a
  demo, not for real traffic.
- The JWT secret in `backend/server.js` has a hardcoded fallback; set a
  real `JWT_SECRET` environment variable before deploying anywhere.
- Uploaded images are stored on local disk under `backend/uploads/` and
  served statically — swap for cloud storage (S3, Cloudinary, etc.) for
  production use.
- There's no email verification or password reset flow yet — easy to add
  once you're happy with the core loop.
