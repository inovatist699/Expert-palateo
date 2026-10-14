# Release readiness — 15 October 2026

Status: release candidate source prepared; **not cleared for public launch or store submission**. The owner confirmed both store accounts are ready and approved `in.palateo.app` for both identifiers.

## Implemented

- iOS/Xcode and Android/Gradle projects, bundled web assets, native foreground location, Android back handling and external browser links.
- Existing brand exported to native icons; template splash artwork removed.
- Android API 36, cleartext traffic disabled, device backups disabled; iOS location purpose strings.
- Production backend requires PostgreSQL, a private auth secret and public HTTPS auth URL. No default account is seeded. Database initialization failures stop startup and database health failures return 503. PostgreSQL TLS validates certificates; private-network deployments may explicitly set `PGSSLMODE=disable`.
- Exact allowed origins, including Capacitor's local origins; no arbitrary Railway/Vercel origins.
- In-app password-confirmed deletion, associated-data cleanup, public deletion instructions and support page. Supabase deletion migration applied; a transaction test used synthetic accounts and rolled everything back. Better Auth local deletion and session invalidation tested. PostgreSQL Better Auth trigger still needs staging verification.
- Optional phone number; new passwords require at least eight characters in the UI. Consent records are stored rather than inferred for Better Auth. Updated privacy text reflects Palo's processing and bounded device-local memory.
- Explicit permission before live AI context sharing; withdrawal control in Palate → Privacy and account.
- GitHub Actions configuration for regression/audit gates and both native builds, with manual signed IPA/AAB exports from `main`. Signing secrets and workflow execution are pending; see `mobile/README.md`.

- GitHub Actions workflow prepared for Android and iOS, including manual signed exports. Configure the mobile-release environment secrets listed in mobile/README.md. Native CI execution and signing remain pending.

## Required before submission

1. Build and test on real iPhone and Android devices: fresh install, returning login, password recovery, quiz, saved places, Love/Pass/undo, denied location, network loss, foreground/background, keyboard/safe areas, screen reader, and deletion. Verify the archived iOS privacy report and SDK manifests. Browser tests do not certify these native behaviors.
2. Produce and validate a signed iOS archive with Xcode 26/iOS 26 SDK or later, and a signed Android AAB targeting API 36. This machine has no Xcode, Java or Android SDK. The new GitHub Actions workflow provides macOS and Android runners; configure its `mobile-release` environment secrets and run it from reviewed `main`. Do not send secrets in chat.
3. Deploy the frontend and API candidate to staging, then verify the full hosted flow. Public URLs must serve this release: `https://palateo.in/privacy/`, `/support/`, `/delete-account/`. Configure the hosted Palo API's authenticated, network-reachable gateway. The local OmniRoute process is not production hosting.
4. Verify production secrets, database backups/restore and auth email delivery. If a previous backend deployment seeded the published demonstration account, rotate its credential or remove that account after confirming ownership. Removal of seed code does not change an existing account.
5. Audit venue data and image rights. The catalogue currently contains snapshot/illustrative information; remove or clearly label any samples and unverified social activity before public launch. Verify every city/store claim against available data.
6. Complete Apple App Privacy and Google Data Safety from actual provider contracts and production behavior. Confirm AI-provider retention and suitability for user data, including the UncloseAI service; disable any provider without acceptable terms. Review waitlist RPC privileges and enable leaked-password protection if supported by the Supabase plan. No advisor finding was produced for the new deletion function; existing waitlist RPC and auth warnings remain.
7. Provide a private, working reviewer account in each console and capture screenshots from the final native builds. Complete age-rating, content-rights, export-compliance, support-contact and distribution-country forms. Do not describe this as medical/allergy advice or guaranteed live venue information.
8. Use TestFlight and Play internal/closed testing before release. Check any testing requirement shown for the specific Play developer account. Store review decides minimum-functionality acceptance; a wrapper is not an approval guarantee.

## Store listing draft

Name: **Palateo**

Apple subtitle: **Restaurants for your taste**

Google short description: **Discover restaurants with matches shaped by your taste and feedback.**

Description:

Find a place that fits what you feel like eating. Set your cuisine, spice, budget and dietary preferences, browse the supported city catalogue, and save places for later. Love or pass on places and dishes to refine your taste matches. Explore the map or ask Palo for food ideas. Optional live AI answers require your permission; local recommendations remain available without it.

Venue details can change. Confirm menus, prices, hours and dietary suitability with the venue. Recommendations are estimates and are not medical or allergy-safety advice.

Suggested category: Food & Drink. Confirm the final rating using each store's questionnaire.

## Data-disclosure worksheet — verify before submitting

| Data | Purpose / handling to verify |
| --- | --- |
| Name, email, optional phone, account ID | Account functionality; linked to account; Supabase or configured Better Auth backend |
| Taste choices, ratings, saves, follows, account events | Functionality and personalization; linked to account |
| Palo text and preference context | Optional live AI provider processing after permission; device memory up to 25 episodes/30 days |
| Location | Optional foreground city selection on device; inspect map-provider requests and final build before declaring collection status |
| Diagnostics and network metadata | Scrubbed Sentry error reporting and infrastructure security processing |
| Voice | Browser/device speech service when supported; inspect native behavior and provider processing before enabling or declaring audio collection |

No advertising SDK or cross-app tracking was added. This is a worksheet, not a completed legal certification or store declaration.

## Launch and rollback

Record the prior frontend/backend deployment IDs before promotion. Test login, taste persistence, deletion with a disposable account and Palo on staging. Promote a tested build, monitor server health and scrubbed errors, and pause rollout for failed login/deletion, data leakage, or a significant new error spike. Roll back by promoting the recorded prior deployment. The additive deletion RPC can remain; do not restore deleted personal data to reverse an app deployment. Verify restore procedures separately with test data.

## Official references

- [Apple account deletion](https://developer.apple.com/support/offering-account-deletion-in-your-app/)
- [Apple review guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Apple SDK submission requirements](https://developer.apple.com/news/?id=ueeok6yw)
- [Google deletion requirements](https://support.google.com/googleplay/android-developer/answer/13327111)
- [Google target API requirements](https://developer.android.com/google/play/requirements/target-sdk)
- [Supabase security advisor guidance](https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable)
- [Leaked password protection](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection)
