# Contribution Log: BOOKaCRIB Guesthouse Discovery Platform

Team: Group Arsenal. Contributions below are based on the project's Git history and the team's own account of who built what. Each member lists the task they were allocated, followed by what they completed.

## Members

| Name | Student ID | Team | Role |
|---|---|---|---|
| Allen Meti | 24019726 | Backend, Web-App, Mobile-App | Group Leader |
| Thabiso Siele | 24020153 | Backend | Member |
| Obakeng Molebatsi | 24019966 | Backend | Member |
| Winonah Monare | 24019724 | Web-App | Member |
| Wangu Zwiyo | 17000492 | Web-App | Member |
| Guide Gasebatho | 24019721 | Mobile-App | Member |
| Kutlwano Joao | 24019374 | Mobile-App | Member |
| Debbie Bame | 24019852 | Mobile-App | Member |

## Allen Meti: Backend, Web-App, Mobile-App, Group Leader

**Task allocated:** Auth and admins: Firebase Auth integration, ID token middleware, and admin account creation. As Group Leader: project coordination, branch management, and documentation.

**Tasks completed**

### Backend

- Set up the project foundation: repository structure, Express app, Firebase configuration, error handler, `verifyToken` middleware, and the Jest test setup.
- Built the admin module: `requireAdmin` and validation middleware, admin endpoints, and the `createFirstAdmin` script.
- Built the guesthouses module, including the Cloudinary image upload flow. Replaced Firebase Storage with Cloudinary and added rollback when an upload fails.
- Connected the database, seeded the guesthouse data, and set production CORS.
- Routed mobile-user management through the Backend API: list, suspend, and delete customer accounts, with suspension enforced on customer endpoints.
- Added guesthouse suspension: a `status` field (active or suspended) that admins can change through the PATCH endpoint, with suspended guesthouses hidden from the public list and detail endpoints.
- Merged teammates' backend test suites into `main` and removed obsolete feature branches.
- Secured credentials (`.gitignore` rules for service-account keys, `.env` handling) and fixed dependency audit vulnerabilities.
- Deployed the Backend on Render.

### Web-App

- Connected the Web-App's guesthouse registration, listings, and dashboard screens to the live Backend API, replacing direct Firestore writes and hard-coded data.
- Added admin creation through the Backend (creates a real Firebase Auth account), a role dropdown, editing guesthouse listings through the Backend API, a dynamic admin email in the sidebar, and a city distribution card covering every city.
- Added last-active tracking at login and a live reviews feed with review moderation.
- Added the Mobile Users tab to the admin dashboard navigation, so admins can list, suspend, and delete customer accounts.
- Added a Suspend and Restore action beside Edit and Delete in the guesthouse listings, with a Suspended badge, and routed guesthouse deletion through the Backend API.
- Showed guesthouse logo thumbnails in the listing, added the BOOKaCRIB logo to the admin login screen, and added the favicon.
- Deployed the Web-App on Vercel.

### Mobile-App

- Wired Firebase Auth with persistent sessions, built the login screen and `AuthContext`, ran customer-profile creation on every login, connected ratings to the Backend, and removed all mock data.
- Search: dynamic multi-select amenity filters, separate sort and filter controls, a collapsible filter panel, and a clean search bar.
- Features: skeleton loading, a list/Google Maps toggle with maps on the search and detail screens, "Forgot password" through Firebase Auth, editing the display name, deleting your own ratings, and a guest reviews section on the detail screen.
- Displayed the logo, gallery, and host contact details on the search and detail screens.
- Added the BOOKaCRIB app icons.
- Built the Android APK through EAS Build.

### Project-wide work

- Managed the Git branching workflow: reviewed and merged work into `main` and synced it back out to the Backend, Web-App, and Mobile-App branches.
- Wrote and maintained the READMEs, the contribution log, and the ERD.
- Coordinated the team against the assignment specification.

## Thabiso Siele: Backend

**Task allocated:** Guesthouses: CRUD endpoints, image upload handling (later moved from Firebase Storage to Cloudinary), and Firestore transactions on create and update.

**Tasks completed**

- Set up the Backend Firebase emulator and the guesthouse API.
- Configured Firestore, seed data, and validation.
- Implemented the guesthouse rating system using Firestore transactions (`rating_sum`, `rating_count`, `average_rating`).
- Developed the customer favourites API with authentication.
- Integrated favourites into the Mobile-App: favourites context, screen, and toggle.
- Connected Mobile-App guesthouse details to rating counts and stored coordinates.
- Documented the ratings and favourites behaviour and prepared backend documentation and a Postman collection.
- Expanded regression tests for favourites and image uploads, and tested Cloudinary cleanup when a Firestore write fails.

## Obakeng Molebatsi: Backend

**Task allocated:** Customers and ratings: favourites, rating submission and editing, and the rating and `average_rating` transaction (which must stay atomic).

**Tasks completed**

- Wrote the Joi validation schemas for customers and ratings.
- Wrote the route stubs for customers and ratings using the team's `{ success, data }` response format.
- Wrote `customerController.ts` with the create, get-me, and update-me endpoints and connected them to the routes.
- Manually tested create, fetch, update, duplicate (409), and invalid name (400) against the emulator with a real login token.
- Wrote the schema tests (rating scores, comment rules, customer name rules) and the customer controller tests for profile endpoints and favourites failure cases.
- Wrote the emulator test simulating 20 parallel ratings and the rating failure-case tests.
- Documented Postman success and failure examples.

## Winonah Monare: Web-App

**Task allocated:** Guesthouse registration and media: form (name, description, amenities, price, city, country, contact), `MapPicker` for coordinates, and the image upload flow via the backend.

**Tasks completed**

- Built the Web-App guesthouse registration screen.
- Built the Web-App admin management screen.
- Built the Web-App user management screen, later reworked to go through the Backend API.
- Built the authentication flow, OTP verification workflow, React Router navigation, and the admin dashboard UI, including the sign-out button and dashboard styling.

## Wangu Zwiyo: Web-App

**Task allocated:** Dashboard and listing management: admin login, `GuesthouseTable` with edit and delete, and `DashboardStats` (totals, most highly rated guesthouse).

**Tasks completed**

- Built the Web-App guesthouse dashboard.
- Built the Web-App guesthouse listings screen.

## Guide Gasebatho: Mobile-App

**Task allocated:** Search and browse: `SearchScreen`, `GuesthouseDetailScreen`, `SearchBar`, default sort (cheapest first), and browsing that works for guests with no login.

**Tasks completed**

- Built the Mobile-App search and browse feature: `SearchScreen`, `GuesthouseDetailScreen`, and `SearchBar`.
- Implemented the default cheapest-first sort order.
- Ensured browsing and search work for guests with no account.
- Loaded the Fraunces and Inter fonts and restyled the search screen and search bar.

## Kutlwano Joao: Mobile-App

**Task allocated:** Ratings and profile: `RatingInput` (submit and edit a 1 to 5 rating with a comment) and `ProfileScreen`.

**Tasks completed**

- Built `RatingInput.tsx`, `ProfileScreen.tsx`, and `MyRatingsScreen.tsx`.
- Built the first versions of `ratings.ts` and `useCurrentUser.ts` against mock data.
- Built the mock data and the preview page so screens could be demoed before login and the backend existed.

## Debbie Bame: Mobile-App

**Task allocated:** Auth and favourites: `LoginScreen`, `FavouritesScreen`, `AuthContext`, and favourite and unfavourite through the backend API.

**Tasks completed**

- Built the Mobile-App favourites screen.
- Implemented favourite and unfavourite through the Backend API.
