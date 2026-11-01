# Contribution Log: BOOKaCRIB Guesthouse Discovery Platform

Team: Group Arsenal. Contributions below are based on the project's Git history and the team's own account of who built what.

## Members

| Name | Student ID | Team | Role |
|---|---|---|---|
| Allen Meti | 24019726 | Backend | Group Leader |
| Thabiso Siele | 24020153 | Backend | Member |
| Obakeng Molebatsi | 24019966 | Backend | Member |
| Winonah Monare | 24019724 | Web-App | Member |
| Wangu Zwiyo | 17000492 | Web-App | Member |
| Guide Gasebatho | 24019721 | Mobile-App | Member |
| Kutlwano Joao | 24019374 | Mobile-App | Member |
| Debbie Bame | 24019852 | Mobile-App | Member |

## Allen Meti: Backend, Group Leader

- Set up the project foundation: repository structure, Express app, Firebase configuration, error handler, `verifyToken` middleware, and the Jest test setup.
- Built the admin module: `requireAdmin` and validation middleware, admin endpoints, and the `createFirstAdmin` script.
- Built the guesthouses module, including the Cloudinary image upload flow. Replaced Firebase Storage with Cloudinary and added rollback when an upload fails.
- Connected the database, seeded the guesthouse data, and set production CORS.
- Connected the Web-App's guesthouse registration, listings, and dashboard screens to the live Backend API, replacing direct Firestore writes and hard-coded data.
- Routed mobile-user management through the Backend API: list, suspend, and delete customer accounts, with suspension enforced on customer endpoints.
- Mobile-App: wired Firebase Auth with persistent sessions, built the login screen and `AuthContext`, ran customer-profile creation on every login, connected ratings to the Backend, and removed all mock data.
- Mobile-App search: dynamic multi-select amenity filters, separate sort and filter controls, a collapsible filter panel, and a clean search bar.
- Mobile-App features: skeleton loading, a list/Google Maps toggle with maps on the search and detail screens, "Forgot password" through Firebase Auth, editing the display name, deleting your own ratings, and a guest reviews section on the detail screen.
- Web-App features: admin creation through the Backend (creates a real Firebase Auth account), a role dropdown, editing guesthouse listings through the Backend API, dynamic admin email in the sidebar, a city distribution card covering every city, last-active tracking at login, and a live reviews feed with review moderation.
- Merged teammates' backend test suites into `main` and removed obsolete feature branches.
- Displayed guesthouse photos and host details: logo thumbnails in the Web-App listing, and logo, gallery, and host contact details on the Mobile-App search and detail screens.
- Added the BOOKaCRIB logo, app icons and favicon, and used the logo on the admin login screen.
- Deployed the platform: Backend on Render, Web-App on Vercel, and the Mobile-App Android APK through EAS Build.
- Secured credentials (`.gitignore` rules for service-account keys, `.env` handling) and fixed dependency audit vulnerabilities.
- Managed the Git branching workflow: reviewed and merged work into `main` and synced it back out to the Backend, Web-App, and Mobile-App branches.
- Wrote and maintained the READMEs, the contribution log, and the ERD, and coordinated the team against the assignment specification.

## Thabiso Siele: Backend

- Set up the Backend Firebase emulator and the guesthouse API.
- Configured Firestore, seed data, and validation.
- Implemented the guesthouse rating system using Firestore transactions (`rating_sum`, `rating_count`, `average_rating`).
- Developed the customer favourites API with authentication.
- Integrated favourites into the Mobile-App: favourites context, screen, and toggle.
- Connected Mobile-App guesthouse details to rating counts and stored coordinates.
- Documented the ratings and favourites behaviour and prepared backend documentation and a Postman collection.
- Expanded regression tests for favourites and image uploads, and tested Cloudinary cleanup when a Firestore write fails.

## Obakeng Molebatsi: Backend

- Wrote the Joi validation schemas for customers and ratings.
- Wrote the route stubs for customers and ratings using the team's `{ success, data }` response format.
- Wrote `customerController.ts` with the create, get-me, and update-me endpoints and connected them to the routes.
- Manually tested create, fetch, update, duplicate (409), and invalid name (400) against the emulator with a real login token.
- Wrote the schema tests (rating scores, comment rules, customer name rules) and the customer controller tests for profile endpoints and favourites failure cases.
- Wrote the emulator test simulating 20 parallel ratings and the rating failure-case tests.
- Documented Postman success and failure examples.

## Winonah Monare: Web-App

- Built the Web-App guesthouse registration screen.
- Built the Web-App admin management screen.
- Built the Web-App user management screen, later reworked to go through the Backend API.
- Built the authentication flow, OTP verification workflow, React Router navigation, and the admin dashboard UI, including the sign-out button and dashboard styling.

## Wangu Zwiyo: Web-App

- Built the Web-App guesthouse dashboard.
- Built the Web-App guesthouse listings screen.

## Guide Gasebatho: Mobile-App

- Built the Mobile-App search and browse feature: `SearchScreen`, `GuesthouseDetailScreen`, and `SearchBar`.
- Implemented the default cheapest-first sort order.
- Ensured browsing and search work for guests with no account.
- Loaded the Fraunces and Inter fonts and restyled the search screen and search bar.

## Kutlwano Joao: Mobile-App

- Built `RatingInput.tsx`, `ProfileScreen.tsx`, and `MyRatingsScreen.tsx`.
- Built the first versions of `ratings.ts` and `useCurrentUser.ts` against mock data.
- Built the mock data and the preview page so screens could be demoed before login and the backend existed.

## Debbie Bame: Mobile-App

- Built the Mobile-App favourites screen.
- Implemented favourite and unfavourite through the Backend API.
