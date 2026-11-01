# BOOKaCRIB Guesthouse Discovery Platform

BOOKaCRIB is a two-part discovery platform that helps travelers find guesthouses across Botswana and gives guesthouse operators a simple, centrally managed online presence. It is strictly a **discovery** tool: there is no booking or payment functionality anywhere in the system.

Built by **Group Arsenal**.

## System Overview

| Component | Description | Branch |
|---|---|---|
| **Backend API** | Node.js/Express REST API. Single source of truth for all writes, auth, and validation | [`Backend`](../../tree/Backend) |
| **Web Admin Portal** | React + TypeScript + Tailwind. Used by admins to register and manage guesthouse listings and customer accounts | [`Web-App`](../../tree/Web-App) |
| **Mobile App** | React Native (Expo). Used by travelers to browse, search, favourite, and rate guesthouses | [`Mobile-App`](../../tree/Mobile-App) |

## Live Deployment

| Component | Host | URL |
|---|---|---|
| Backend API | Render (free tier) | https://bookacrib-guesthouse-discovery-platform.onrender.com/api |
| Web Admin Portal | Vercel | https://boo-ka-crib-guesthouse-discovery-pl.vercel.app |
| Mobile App | EAS Build (Android APK) | Installable APK built from the `Mobile-App` folder |

The Render free tier sleeps after a period of inactivity, so the first request after a pause can take up to a minute. Open `/api/health` first to wake the server before a demo.

## Architecture

- **Database:** Firebase Firestore (NoSQL) with four collections: `admins`, `guesthouses`, `customers`, `ratings`. See [SCHEMA.md](SCHEMA.md).
- **Single write-path:** every write from either client goes through the Node.js API, which validates the request and performs the write (inside a Firestore transaction where the operation must stay atomic, such as ratings). Clients never write to Firestore directly.
- **Auth:** Firebase Authentication issues ID tokens (JWT); the API verifies them on every protected endpoint. Admin routes additionally require a matching document in the `admins` collection. Customer accounts can be suspended by an admin, and suspended accounts are rejected by the API. Firestore never stores a password or password hash.
- **Storage:** Cloudinary holds guesthouse logos and gallery images; the URLs are stored on the Firestore guesthouse document. (Firebase Storage now requires a paid Blaze plan, so the project uses Cloudinary's free tier instead.)

## Team: Group Arsenal

| Name | Student ID | Team |
|---|---|---|
| Allen Meti | 24019726 | Backend (Group Leader) |
| Thabiso Siele | 24020153 | Backend |
| Obakeng Molebatsi | 24019966 | Backend |
| Winonah Monare | 24019724 | Web-App |
| Wangu Zwiyo | 17000492 | Web-App |
| Guide Gasebatho | 24019721 | Mobile-App |
| Kutlwano Joao | 24019374 | Mobile-App |
| Debbie Bame | 24019852 | Mobile-App |

- **Backend (3):** Allen Meti, Thabiso Siele, Obakeng Molebatsi
- **Web App (2):** Winonah Monare, Wangu Zwiyo
- **Mobile App (3):** Guide Gasebatho, Debbie Bame, Kutlwano Joao

See [CONTRIBUTIONS.md](CONTRIBUTIONS.md) for the per-member contribution log.

## Branching Workflow

- `main`: the combined, always-up-to-date branch. Every `Backend`, `Web-App`, and `Mobile-App` branch contains all three folders, kept in sync with `main`.
- Each team commits to its own team branch (`Backend`, `Web-App`, or `Mobile-App`).
- When a team's work is ready, that team branch is merged into `main`.
- After a merge lands on `main`, `main` is synced back out to the other team branches so every branch stays current. Whoever merges into `main` is responsible for syncing it back out.

## Getting Started

```bash
git clone git@github.com:Java-Arsenal/BOOKaCRIB-Guesthouse-Discovery-Platform.git
cd BOOKaCRIB-Guesthouse-Discovery-Platform
git checkout main   # every branch has all three folders
```

Then follow that component's own `README.md` (inside `Backend/`, `Web-App/`, or `Mobile-App/`) for install steps and required `.env` values. Firebase project credentials are shared privately with the team and must never be committed (each component's `.gitignore` excludes `.env`).
