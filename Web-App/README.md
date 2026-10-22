<<<<<<< HEAD
# BOOKaCRIB  Web Admin Portal

React + TypeScript + Tailwind CSS admin portal for the BOOKaCRIB Guesthouse Discovery Platform. Used by admins to register and manage guesthouse listings. Reads are via Firestore real-time listeners; all writes go through the backend API.

**Team:** Winonah Monare, Wangu Zwiyo


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
=======
# BOOKaCRIB Guesthouse Discovery Platform

BOOKaCRIB is a two-part discovery platform that helps travelers find guesthouses across Botswana and gives guesthouse operators a simple, centrally managed online presence. It is strictly a **discovery** tool there is no booking or payment functionality anywhere in the system.

Built by **Group Arsenal**

## System Overview

| Component | Description | Branch |
|---|---|---|
| **Backend API** | Node.js/Express REST API  single source of truth for all writes, auth, and validation | [`Backend`](../../tree/Backend) |
| **Web Admin Portal** | React + TypeScript + Tailwind  used by admins to register and manage guesthouse listings | [`Web-App`](../../tree/Web-App) |
| **Mobile App** | React Native (Expo)  used by travelers to browse, search, favourite, and rate guesthouses | [`Mobile-App`](../../tree/Mobile-App) |

## Architecture

- **Database:** Firebase Firestore (NoSQL), with four collections: `admins`, `guesthouses`, `customers`, `ratings`.
- **Single write-path:** both clients (web and mobile) read directly via Firestore's real-time listeners, but **every write** goes through the Node.js API, which performs the write inside a Firestore transaction where the operation must stay atomic. Firestore Security Rules deny direct client writes as a second layer of enforcement.
- **Auth:** Firebase Authentication issues ID tokens (JWT); the API verifies them on every protected endpoint. Firestore never stores a password or password hash.
- **Storage:** Cloudinary holds guesthouse logos and gallery images; URLs are referenced from the Firestore guesthouse document. (Firebase Storage now requires a paid Blaze plan, so the project uses Cloudinary's free tier instead.)

## Team: Group Arsenal

| Name | Student ID | Team |
|---|---|---|
| Allen Meti | 24019726 | Backend |
| Thabiso Siele | 24020153 | Backend |
| Winonah Monare | 24019724 | Web-App |
| Guide Gasebatho | 24019721 | Mobile-App |
| Kutlwano Joao | 24019374 | Mobile-App |
| Obakeng Molebatsi | 24019966 | Backend |
| Wangu Zwiyo | 17000492 | Web-App |
| Debbie Bame | 24019852 | Mobile-App |

- **Backend (3):** Allen Meti, Thabiso Siele, Obakeng Molebatsi
- **Web App (2):** Winonah Monare, Wangu Zwiyo
- **Mobile App (3):** Guide Gasebatho, Debbie Bame, Kutlwano Joao

## Branching Workflow

- `main`: the combined, always-up-to-date branch. Every `Backend`, `Web-App`, and `Mobile-App` branch contains all three folders, kept in sync with `main`.
- No individual feature branches. Each team commits directly to its own team branch (`Backend`, `Web-App`, or `Mobile-App`).
- When a team's work is ready, that team branch is merged into `main` through a reviewed pull request.
- After a merge lands on `main`, `main` is merged back into the other two team branches so every branch stays current. Whoever merges a PR into `main` is responsible for syncing it back out to the other branches.

## Getting Started
>>>>>>> 0c4767100e80679e90ef5ae63b68da385591c754

```bash
git clone git@github.com:Java-Arsenal/BOOKaCRIB-Guesthouse-Discovery-Platform.git
cd BOOKaCRIB-Guesthouse-Discovery-Platform
<<<<<<< HEAD
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
=======
git checkout Backend # or Web-App / Mobile-App / main, every branch has all three folders
```

Then follow that component's own `README.md` (inside `Backend/`, `Web-App/`, or `Mobile-App/`) for install steps and required `.env` values. Firebase project credentials are shared privately with the team, never commit them (each component's `.gitignore` excludes `.env`).
>>>>>>> 0c4767100e80679e90ef5ae63b68da385591c754
