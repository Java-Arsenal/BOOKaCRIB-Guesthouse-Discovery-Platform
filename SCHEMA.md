# Firestore Schema: BOOKaCRIB Guesthouse Discovery Platform

Four top-level collections. This schema is confirmed against the final backend code and live implementation.

## admins

Document ID = Firebase Auth UID.

| Field | Type | Notes |
|---|---|---|
| admin_id | string | same as document ID |
| full_name | string | admin display name |
| email | string | admin email |
| role | string | "admin" or "superadmin" |
| lastActive | string | time of the admin's last login; written by the Web-App on login (best-effort, a failed write is ignored) |
| created_at | timestamp | server timestamp |

## customers

Document ID = Firebase Auth UID.

| Field | Type | Notes |
|---|---|---|
| customer_id | string | same as document ID |
| full_name | string | required, 2–100 chars |
| email | string \| null | from Firebase Auth token |
| favourites | array\<string\> | guesthouse IDs; handled via backend PUT/DELETE routes |
| status | string | "active" or "suspended"; set by an admin through the backend. Suspended customers are rejected by the API |
| created_at | timestamp | server timestamp |

## guesthouses

Document ID = auto-generated.

| Field | Type | Notes |
|---|---|---|
| name | string | required |
| description | string | required, at least 10 characters |
| amenities | array\<string\> | optional, defaults to [] |
| location | object | { latitude: number, longitude: number } |
| price_per_night_bwp | number | required, positive |
| city | string | required |
| country | string | required |
| contact_details | object | { contact_name: string, phone: string, email: string } |
| logo_url | string \| null | Cloudinary-hosted image URL |
| gallery_urls | array\<string\> | Cloudinary-hosted image URLs |
| average_rating | number | calculated via backend transaction |
| rating_sum | number | used by backend to calculate average |
| rating_count | number | used by backend to calculate average |
| created_by | string | UID of the admin who created the listing |
| created_at | timestamp | server timestamp |
| updated_at | timestamp | server timestamp, set on update |

## ratings

Document ID convention = {customer_id}_{guesthouse_id} (ensures one rating per customer per guesthouse).

| Field | Type | Notes |
|---|---|---|
| rating_id | string | {customer_id}_{guesthouse_id} |
| guesthouse_id | string | required |
| customer_id | string | from auth token |
| score | number | required (integer 1–5) |
| comment | string | optional |
| created_at | timestamp | |
| updated_at | timestamp | |

**Status: Fully Implemented.** The backend uses a Firestore Transaction to ensure that when a rating is created, updated, or deleted, the associated guesthouse document's `rating_sum`, `rating_count`, and `average_rating` are updated atomically to prevent data drift.

## Relationships

- guesthouses.created_by → admins (one admin creates many guesthouses)
- ratings.guesthouse_id → guesthouses (one guesthouse has many ratings)
- ratings.customer_id → customers (one customer has many ratings, max one per guesthouse)
- customers.favourites → array of guesthouse document IDs (many-to-many, modeled as an array)
