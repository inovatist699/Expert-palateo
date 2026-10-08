# Palateo backend schema and contracts

**Baseline: 7 October 2026.** You use this reference with [TRD](TRD.md), the [migration history](../supabase/migrations/), and [browser callers](../work/palateo_cloudflare_pages/app/index.html).

## Evidence and schema limits

The repository lacks complete creation SQL for preexisting app tables. Migrations require existing tables, columns, functions, and enabled row level security (RLS); these files cannot initialize the whole backend. Live schema was verified via authenticated PostgREST introspection and RLS regression tests on 7 October 2026. Migration presence aligns with the observed deployed privileges.

“Client contract” means fields the app uses, with verified columns confirmed against live PostgREST endpoints. Do not rerun migrations automatically or publish credentials.

## Preexisting application tables

| Object | Observed client contract | Intended client privileges in migration history |
| --- | --- | --- |
| `profiles` | `id`, `display_name`, `phone`, `email`, `onboarding_completed`; reads `profile_photo_url`, `bio` | Authenticated SELECT, INSERT, UPDATE |
| `taste_profiles` | `user_id`, `cuisines`, `spice_level`, `budget`, `ambience`, `occasions`, `priorities`, `max_distance_km`, `confidence`, `taste_vector` | Authenticated SELECT, INSERT, UPDATE |
| `saved_restaurants` | Upserts `user_id`, `restaurant_id`; deletes by both; reads restaurant IDs | Authenticated SELECT, INSERT, UPDATE, DELETE |
| `interactions` | Inserts `user_id`, `restaurant_id`, `type`, `source`, `metadata`; replays `created_at`, ordered with `id` | Authenticated SELECT, INSERT |
| `app_events` | Inserts `user_id`, `event_name`, `metadata` | Authenticated INSERT |
| `connections` | Writes `requester_id`, `recipient_id`, `status`; caller names that pair as its conflict target | Authenticated INSERT, DELETE |
| `recommendation_events` | No direct current frontend caller | No anon/authenticated table grant |
| `restaurants` | Catalogue base table and historical import target | Direct anon/authenticated privileges revoked by the later view migration |

The app uses Auth user IDs for ownership and database restaurant IDs for activity/saves. Their foreign-key definitions are unavailable here. Supabase owns `auth.users`; consent resides in user metadata.

Taste payloads use objects such as `{primary: ...}` for cuisine, ambience, and occasion. `priorities` also contains `dietary_preference`; null `max_distance_km` represents “anywhere.” `taste_vector` holds normalized feature totals. `confidence` represents answer completeness, not prediction accuracy.

Feedback appends interactions rather than deleting history: `like`, `dislike`, or `visited`, with `metadata.removed = true` for undo. Latest ordered events reconstruct current feedback. Saves, directions, and unsaves also produce activity. The app rebuilds learning from active feedback to avoid replay inflation and duplicate feature learning. Cloud queue and account/revision guards reduce races; they do not provide a database transaction across interaction and taste writes.

## Authentication and authorization migrations

[Profile bootstrap](../supabase/migrations/202609300001_profiles_auth_rls.sql) checks required profile columns and existing RLS, rejects FORCE RLS, and adds an Auth insert trigger. It derives a display name from metadata/email and inserts a profile on ID conflict with no replacement. It adds self SELECT/INSERT/UPDATE policies and a restrictive `auth.uid() = id` owner guard.

[Least privilege grants](../supabase/migrations/202610020004_least_privilege_public_tables.sql) requires RLS on eight preexisting tables and removes broad client privileges, including TRUNCATE. Its comments assume existing owner policies on other app tables; their complete definitions are absent. [RPC restrictions](../supabase/migrations/202610020005_restrict_security_definer_rpc.sql) remove direct public execution of four trigger functions, preserving the bootstrap grant to `supabase_auth_admin`. Review actual grants and policies before asserting isolation guarantees.

## Public catalogue view

[The view migration](../supabase/migrations/202610030001_public_restaurant_catalog_view.sql) defines `restaurant_catalog` with `security_barrier = true`, grants anon/authenticated SELECT, and revokes direct access to `restaurants`.

It exposes `id`, provider/place identifiers, name, address, area, city, coordinates, cuisines, price/display price, rating/review count, tags, dietary options, ambience/occasion tags, spice, photo, and maps URL. It excludes source-only fields such as phone, opening hours, `source_updated_at`, and `review_insights`. Those columns appear in imports/updates but are not part of this public view.

Imports use provider/place conflict keys; curated UI IDs can differ from database IDs. SQL adds `price_display text` and `review_insights text[] NOT NULL DEFAULT '{}'`. Other catalogue types remain unspecified locally.

## Defined waitlist schema and RPCs

[Waitlist SQL](../supabase/migrations/202610060001_waitlist.sql) defines `launch_waitlist`: UUID primary key with generated default; unique normalized email text with length/format checks; city text restricted to Ahmedabad, Vadodara, Other; fixed consent-version text default `waitlist-2026-10-06`; and required creation timestamp defaulting to now. It enables RLS, revokes client table access, and indexes creation time.

`join_launch_waitlist(text, text, boolean)` returns void, validates inputs, uses SECURITY DEFINER with an empty search path, and exposes execute to anon/authenticated. A transaction advisory lock protects global caps of 30 recent inserts/minute and 5,000 total rows. Email duplicates use `ON CONFLICT DO NOTHING`; cap checks happen before insertion, so duplicates can also be rejected when capped. This is not per-IP throttling.

[Email SQL](../supabase/migrations/202610060002_waitlist_email.sql) adds nullable `welcome_attempt_at`/`welcome_sent_at` timestamps and required integer `welcome_attempts` default zero. `waitlist_welcome(text, text, boolean)` returns boolean and checks a server token digest. Claiming enforces fewer than three attempts per email, a 24-hour retry interval, and a conservative aggregate budget below 90; receipt calls mark successful sends.

## Server endpoint and operations

[POST `/api/waitlist`](../work/palateo_cloudflare_pages/api/waitlist.js) accepts email, city, consent, and optional honeypot. Success returns `{ok:true}`; errors return 400 invalid input, 403 origin, 405 method, 413 size, 415 content type, 429 database cap, or 503 storage failure. Resend credentials and the mail token remain server environment values; provider failure keeps the signup saved. Email idempotency uses an email hash.

You inspect migration application, existing policies, catalogue freshness, and service configuration before backend releases. Retain historical migrations; do not rerun them automatically or alter real user data during frontend work. Welcome delivery is best effort, with no dedicated worker shown in this source. Review quotas before scaling; paid infrastructure is not authorized by these documents.
