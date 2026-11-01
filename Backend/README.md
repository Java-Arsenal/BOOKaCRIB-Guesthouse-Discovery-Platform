# BOOKaCRIB: Backend API

Node.js/Express REST API for the BOOKaCRIB Guesthouse Discovery Platform. This is the single source of truth for authentication, validation, and atomic write operations (ratings and favourites).

## Tech Stack

- Node.js / Express.js (TypeScript)
- Firebase Admin SDK (Firestore + Auth)
- Cloudinary for guesthouse images
- Joi for input validation

## Project Structure

```
Backend/
├── src/
│   ├── config/        # Firebase Admin and Cloudinary
│   ├── controllers/   # Admin, guesthouse, customer, and rating endpoints
│   ├── middleware/    # Auth (verifyToken, requireAdmin, requireActiveCustomer),
│   │                  # validation, and error handling
│   ├── routes/        # Express routes
│   ├── schemas/       # Joi request schemas
│   ├── app.ts
│   └── server.ts
├── scripts/           # Seed scripts
├── firestore.rules
└── package.json
```

## Main Endpoints

| Method | Path | Access |
|---|---|---|
| GET | `/api/health` | Public |
| GET | `/api/guesthouses` | Public |
| POST / DELETE | `/api/guesthouses`, `/api/guesthouses/:id` | Admin |
| POST | `/api/guesthouses/:id/images` | Admin |
| POST / GET | `/api/customers`, `/api/customers/me` | Signed-in customer |
| PUT / DELETE | `/api/customers/me/favourites/:guesthouseId` | Active customer |
| GET | `/api/customers` | Admin (list customers) |
| PATCH | `/api/customers/:customerId/status` | Admin (suspend or restore) |
| DELETE | `/api/customers/:customerId` | Admin (removes profile and login) |
| POST / GET | `/api/admins`, `/api/admins/me` | Admin |
| POST | `/api/ratings` | Active customer |

## Setup and Run

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Environment variables.** Create a `.env` file in `Backend/`:

   ```
   PORT=5000
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_CLIENT_EMAIL=your_service_account_email
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   CORS_ORIGINS=http://localhost:5173
   ```

   Get the Firebase values from Firebase Console, Project Settings, Service Accounts, Generate new private key. Service account key files are gitignored and must never be committed. `CORS_ORIGINS` is a comma-separated list of allowed web origins.

3. **Seed data (optional):** if the database is empty, populate it with test guesthouses:

   ```bash
   npx tsx scripts/seedGuesthouses.ts
   ```

4. **Start the API:**

   ```bash
   npm run dev
   ```

5. **Production build and start:**

   ```bash
   npm run build
   npm start
   ```

## Deployment (Render)

- Root directory: `Backend`
- Build command: `npm install && npm run build`
- Start command: `npm start`
- Set the same environment variables as above. Set `CORS_ORIGINS` to include the deployed Web-App URL.

## First Admin Account

Admin routes require an existing admin, so the very first admin is created with a script that uses the Firebase Admin SDK directly. It creates the Firebase Auth user and writes the matching document to the `admins` collection (document ID = the user's UID):

```bash
npx tsx scripts/createFirstAdmin.ts you@example.com "Password123!" "Your Name"
```

After that, further admins can be created from the Web-App.
