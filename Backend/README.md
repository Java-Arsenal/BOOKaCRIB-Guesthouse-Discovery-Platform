# BOOKaCRIB  Backend API

Node.js/Express REST API for the BOOKaCRIB Guesthouse Discovery Platform. This is the **single source of truth for all writes**  the web admin portal and mobile app never write to Firestore directly; they call this API, which authenticates the request, validates the payload, and performs the write inside a Firestore transaction.

**Team:** Allen Meti, Thuto Siele, Obakeng Molebatsi

## Tech Stack

- Node.js / Express.js
- Firebase Admin SDK (Firestore + Auth + Storage)
- Joi / express-validator for input validation
- Jest for unit/integration tests
- Postman for manual endpoint testing

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── firebase.ts        # Firebase Admin SDK init
│   ├── middleware/
│   │   ├── auth.ts            # Firebase ID token verification
│   │   └── validate.ts        # request schema validation
│   ├── routes/
│   │   ├── admins.ts
│   │   ├── guesthouses.ts
│   │   ├── customers.ts
│   │   └── ratings.ts
│   ├── controllers/
│   │   ├── adminController.ts
│   │   ├── guesthouseController.ts
│   │   ├── customerController.ts
│   │   └── ratingController.ts
│   ├── services/
│   │   └── firestoreTransactions.ts   # e.g. rating + average_rating transaction
│   ├── app.ts
│   └── server.ts
├── firestore.rules
├── tests/
├── .env.example
├── package.json
└── tsconfig.json
```

## Setup

```bash
git clone git@github.com:Java-Arsenal/BOOKaCRIB-Guesthouse-Discovery-Platform.git
cd BOOKaCRIB-Guesthouse-Discovery-Platform
git checkout Backend 

npm install
```

Create a `.env` file in `backend/` 
```
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
PORT=5000
```

```bash
npm run dev
```

## Task Split 

1. **Auth & Admins** : Firebase Auth integration, ID token middleware, admin account creation.
2. **Guesthouses** : CRUD endpoints, Firebase Storage upload handling, Firestore transactions on create/update.
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

`firestore.rules` denies all direct client writes to `guesthouses` and `ratings` this is the second enforcement layer behind the API. Test rule changes with the Firebase emulator before deploying.