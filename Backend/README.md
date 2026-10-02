# BOOKaCRIB  Backend API

Node.js/Express REST API for the BOOKaCRIB Guesthouse Discovery Platform. This is the **single source of truth for all writes**: the web admin portal and mobile app never write to Firestore directly; they call this API, which authenticates the request, validates the payload, and uses Firestore transactions where an operation must remain atomic.

**Team:** Allen Meti, Thuto Siele, Obakeng Molebatsi

## Tech Stack

- Node.js / Express.js
- Firebase Admin SDK (Firestore + Auth)
- Cloudinary for guesthouse images
- Joi / express-validator for input validation
- Jest for unit/integration tests
- Postman for manual endpoint testing

## Project Structure

```
Backend/
├── src/
│   ├── config/                # Firebase Admin and Cloudinary
│   ├── controllers/           # Admin and guesthouse endpoints
│   ├── middleware/            # Auth, validation, and error handling
│   ├── routes/                # Admin and guesthouse routes
│   ├── schemas/               # Joi request schemas
│   ├── utils/
│   ├── app.ts
│   └── server.ts
├── scripts/                   # Admin creation and emulator seed scripts
├── postman/                   # API collection
├── firebase.json
├── firestore.rules
├── .env.example
├── package.json
└── tsconfig.json
```

## Setup

```bash
git clone git@github.com:Java-Arsenal/BOOKaCRIB-Guesthouse-Discovery-Platform.git
cd BOOKaCRIB-Guesthouse-Discovery-Platform
git checkout Backend
cd Backend

npm install
cp .env.example .env
```

The example environment targets the local Auth and Firestore emulators. Service-account credentials are only needed when connecting to a non-emulated Firebase project. Set the three Cloudinary values in `.env` to enable image uploads.

Start the emulators in one terminal. Java 21 or later is recommended; Firebase CLI currently warns that support for older Java versions will be dropped.
```bash
npm run emulators
```

In another terminal, from `Backend/`, seed the local Auth and Firestore data and start the API:
```bash
npm run seed:emulator
npm run dev
```

The emulator UI is at `http://127.0.0.1:4000`; the API is at `http://127.0.0.1:5000`. The seed script creates `admin@example.test` with password `local-admin-password`, two guesthouses, one customer, and one rating. Import `postman/BOOKaCRIB-Backend.postman_collection.json` and run **Sign in seeded admin** first to populate the bearer token.

## Task Split 

1. **Auth & Admins** : Firebase Auth integration, ID token middleware, admin account creation.
2. **Guesthouses** : CRUD endpoints, Cloudinary image upload handling, Firestore writes.
3. **Customers & Ratings** : favourites, rating submission/edit, the rating + `average_rating` transaction (the one piece that must stay perfectly atomic, test this in isolation).

## Firestore Collections

- `admins`: admin_id, full_name, email, role, created_at
- `guesthouses`: guesthouse_id, created_by, name, logo_url, gallery_urls[], description, amenities[], location, price_per_night_bwp, city, country, contact_details, average_rating, created_at
- `customers`: customer_id (= Firebase Auth UID), full_name, email, favourites[], created_at
- `ratings`: rating_id (`{customer_id}_{guesthouse_id}`), guesthouse_id, customer_id, score, comment, created_at, updated_at

## Testing

```bash
npm test          # Jest
```
Use the shared Postman collection to test endpoints manually before mobile/web integration.

## Security Rules

`firestore.rules` allows public reads of guesthouses and ratings while denying client writes to all collections. The API uses the Admin SDK for writes. Test rule changes with the Firebase emulator before deploying.