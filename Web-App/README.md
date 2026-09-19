# BOOKaCRIB  Web Admin Portal

React + TypeScript + Tailwind CSS admin portal for the BOOKaCRIB Guesthouse Discovery Platform. Used by admins to register and manage guesthouse listings. Reads are via Firestore real-time listeners; all writes go through the backend API.

**Team:** Winonah Monare, Guide Gasebatho

## Tech Stack

- React + TypeScript
- Tailwind CSS
- Firebase Auth (admin login)
- Firebase Firestore client SDK (real-time listeners, read-only)
- Google Maps widget for coordinate picking

## Project Structure

```
web-app/
├── src/
│   ├── api/
│   │   └── client.ts           # calls to backend endpoints
│   ├── components/
│   │   ├── GuesthouseForm.tsx
│   │   ├── GuesthouseTable.tsx
│   │   ├── MapPicker.tsx       # Google Maps coordinate widget
│   │   └── DashboardStats.tsx
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Guesthouses.tsx
│   │   └── GuesthouseEdit.tsx
│   ├── hooks/
│   │   └── useFirestoreListener.ts
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── App.tsx
│   └── main.tsx
├── public/
├── package.json
└── tailwind.config.js
```

## Setup

```bash
git clone git@github.com:Java-Arsenal/BOOKaCRIB-Guesthouse-Discovery-Platform-.git
cd BOOKaCRIB-Guesthouse-Discovery-Platform-
git checkout Web-App

npm install
```

Create a `.env` file in `web-app/` 
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_APP_ID=
VITE_API_BASE_URL=http://localhost:5000
```

```bash
npm run dev
```

## Task Split

1. **Guesthouse registration & media**: form (name, description, amenities, price, city, country, contact), `MapPicker` for coordinates, image upload flow to Firebase Storage via the backend.
2. **Dashboard & listing management**: admin login, `GuesthouseTable` with edit/delete, `DashboardStats` (totals, most highly rated guesthouse).

## Notes

- All writes (create/edit/delete guesthouse) must go through the backend API  never write to Firestore directly from this app; Security Rules will reject it anyway.
- Use `useFirestoreListener` for live updates so listing changes appear without a manual refresh.