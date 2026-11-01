# BOOKaCRIB: Web Admin Portal

React + TypeScript web application used by administrators to register and manage guesthouse listings and to manage mobile-app customer accounts.

**Team:** Winonah Monare, Wangu Zwiyo

## Tech Stack

- React (Vite) + TypeScript
- Tailwind CSS
- Firebase Auth (admin login)
- Firebase Firestore client SDK (reads only, never writes)
- REST API (all writes: create/delete guesthouses, image upload, customer suspend/delete)

## Project Structure

```
Web-App/
├── src/
│   ├── components/   # AdminDashboard, AdminLogin, RegisterGuesthouse,
│   │                 # GuesthouseListing, AdminManagement, UserManagement, etc.
│   ├── services/     # api.tsx (REST API wrappers)
│   ├── firebase.tsx  # Firebase initialization
│   └── App.tsx       # Routing
├── vercel.json       # SPA rewrite rule for Vercel
└── package.json
```

## Setup and Run

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Environment variables.** Create a `.env` file in `Web-App/`:

   ```
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

   For the deployed site, set `VITE_API_BASE_URL` to `https://bookacrib-guesthouse-discovery-platform.onrender.com/api` in the Vercel project settings. Firebase client configuration is read from `src/firebase.tsx`.

3. **Start the dev server:**

   ```bash
   npm run dev
   ```

4. **Production build:**

   ```bash
   npm run build
   ```

## Features

- Admin login, which records the admin's last-active time.
- Dashboard with guesthouse totals, a city distribution card, and a live customer reviews feed where admins can delete a review (the guesthouse's average rating is recalculated).
- Register, edit, and delete guesthouse listings, with logo and gallery uploads.
- Admin management: creating an admin creates a real Firebase Auth account through the Backend, with the role chosen from a dropdown (admin or superadmin).
- Customer management: list, suspend, restore, and delete mobile-app accounts.

## Notes

- All writes (create/delete guesthouse, upload images, suspend or delete a customer) must go through the backend API. Never write to Firestore directly from this app.
- Admin-only screens require an account that exists both in Firebase Auth and in the `admins` collection; otherwise the API returns `403 FORBIDDEN`.
- Guesthouse descriptions must be at least 10 characters, or the API rejects the registration with a validation error.
