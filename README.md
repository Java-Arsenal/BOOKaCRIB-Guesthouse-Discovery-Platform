# BOOKaCRIB Guesthouse Discovery Platform

BOOKaCRIB is a two-part discovery platform that helps travelers find guesthouses across Botswana and gives guesthouse operators a simple, centrally managed online presence. It is strictly a **discovery** tool there is no booking or payment functionality anywhere in the system.

Built by **Group Arsenal** 

## System Overview

| Component | Description | Branch |
|---|---|---|
| **Backend API** | Node.js/Express REST API  single source of truth for all writes, auth, and validation | [`backend`](../../tree/backend) |
| **Web Admin Portal** | React + TypeScript + Tailwind  used by admins to register and manage guesthouse listings | [`web-app`](../../tree/web-app) |
| **Mobile App** | React Native (Expo)  used by travelers to browse, search, favourite, and rate guesthouses | [`mobile-app`](../../tree/mobile-app) |

## Architecture

- **Database:** Firebase Firestore (NoSQL), with four collections: `admins`, `guesthouses`, `customers`, `ratings`.
- **Single write-path:** both clients (web and mobile) read directly via Firestore's real-time listeners, but **every write** goes through the Node.js API, which performs the write inside a Firestore transaction. Firestore Security Rules deny direct client writes as a second layer of enforcement.
- **Auth:** Firebase Authentication issues ID tokens (JWT); the API verifies them on every protected endpoint. Firestore never stores a password or password hash.
- **Storage:** Firebase Storage holds guesthouse logos and gallery images; URLs are referenced from the Firestore guesthouse document.

## Team: Group Arsenal

| Name | Student ID | Team |
|---|---|---|
| Allen Meti  | 24019726 | Backend |
| Thabiso Siele | 24020153 | Backend |
| Winonah Monare | 24019724 | Web-App |
| Guide Gasebatho | 24019721 | Mobile-app |
| Kutlwano Joao | 24019374 | Mobile-App |
| Obakeng Molebatsi | 24019966 | Backend |
| Wangu Zwiyo | 17000492 | Web-App |
| Debbie Bame | 24019852 | Mobile-App |

- **Backend (3):** Allen Meti, Thabiso Siele, Obakeng Molebatsi
- **Web App (2)** Winonah Monare, Guide Gasebatho
- **Mobile App (3)** Wangu Zwiyo, Debbie Bame, Kutlwano Joao

## Branching Workflow

- `main`: protected, always-deployable. Only updated via reviewed PRs from `backend`, `web-app``mobile-app`.
- `backend`, `web-app`, `mobile-app`: integration branches per workstream. Team members branch off these for individual features (e.g. `backend/auth-endpoints`) and PR back in.

## Getting Started

```bash
git clone git@github.com:Java-Arsenal/BOOKaCRIB-Guesthouse-Discovery-Platform-.git
cd BOOKaCRIB-Guesthouse-Discovery-Platform-
git checkout <Backend|Web-App|Mobile-App>
```

Then follow that branch's own `README.md` for install steps and required `.env` values. Firebase project credentials are shared privately with the team, never commit them (each branch's `.gitignore` excludes `.env`).
