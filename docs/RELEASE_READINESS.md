# Release readiness — 26 October 2026

Status: **not yet cleared for Play submission or Truecaller activation**. The current
public website and manual Android download are version 1.0/build 54, released on
25 October 2026 from main `1604a8d`. The newer Truecaller candidate is based on PR
#22 and has not been released. The earlier build-7 evidence below is historical.

Remaining external gates: Truecaller approval and Play signing-certificate
registration, hosted Supabase custom provider (currently absent), real Android
verification, existing upload signing credentials, and Play Console access/forms.
Use a build number above 54 and above every existing Play upload. API 36 is
already configured. Successful CI is not evidence of physical-device behavior.

## Implemented

- iOS/Xcode and Android/Gradle projects, bundled web assets, native foreground location, Android back handling and external browser links.
- Existing brand exported to native icons; template splash artwork removed.
- Android API 36, cleartext traffic disabled, device backups disabled; iOS location purpose strings.
- Production backend requires PostgreSQL, a private auth secret and public HTTPS auth URL. No default account is seeded. Database initialization failures stop startup and database health failures return 503. PostgreSQL TLS validates certificates; private-network deployments may explicitly set `PGSSLMODE=disable`.
- Exact allowed origins, including Capacitor's local origins; no arbitrary Railway/Vercel origins.
- In-app password-confirmed deletion, associated-data cleanup, public deletion instructions and support page. Supabase deletion migration applied; a transaction test used synthetic accounts and rolled everything back. Better Auth local deletion and session invalidation tested. PostgreSQL Better Auth trigger still needs staging verification.
- Optional phone number; new passwords require at least eight characters in the UI. Consent records are stored rather than inferred for Better Auth. Updated privacy text reflects Palo's processing and bounded device-local memory.
- Explicit permission before live AI context sharing; withdrawal control in Palate → Privacy and account.
- GitHub Actions regression/audit gates and Android native builds passed. The active workflow now targets Android only, with manual signed APK/AAB exports from `main`; configure its four Android secrets for future builds. See `mobile/README.md`.

## Required before submission

1. Test the signed APK on real Android devices: fresh install, returning login, password recovery, quiz, saved places, Love/Pass/undo, denied location, network loss, foreground/background, keyboard/safe areas, screen reader, and deletion. Browser tests and successful compilation do not certify these native behaviors. iOS checks are deferred.
2. The published build-54 artifacts are separate from this unreleased candidate. Produce and verify a newly signed Android API 36 AAB and APK for the final candidate. For future signed CI exports, configure the four Android secrets documented in `mobile/README.md`. Keep the upload key backed up securely and confirm it matches the package's registered upload certificate before uploading.
3. Deploy the frontend and API candidate to staging, then verify the full hosted flow. Public URLs must serve this release: `https://palateo.in/privacy/`, `/support/`, `/delete-account/`. Configure the hosted Palo API's authenticated, network-reachable gateway. The local OmniRoute process is not production hosting.
4. Verify production secrets, database backups/restore and auth email delivery. If a previous backend deployment seeded the published demonstration account, rotate its credential or remove that account after confirming ownership. Removal of seed code does not change an existing account.
5. Audit venue data and image rights. The catalogue currently contains snapshot/illustrative information; remove or clearly label any samples and unverified social activity before public launch. Verify every city/store claim against available data.
6. Complete Google Data Safety from actual provider contracts and production behavior. Confirm AI-provider retention and suitability for user data, including the UncloseAI service; disable any provider without acceptable terms. Review waitlist RPC privileges and enable leaked-password protection if supported by the Supabase plan. No advisor finding was produced for the new deletion function; existing waitlist RPC and auth warnings remain.
7. Provide a private, working reviewer account in Play Console and capture screenshots from the final Android build. Complete content-rating, content-rights, support-contact and distribution-country forms. Do not describe this as medical/allergy advice or guaranteed live venue information.
8. Use Play internal/closed testing before release. Check any testing requirement shown for the specific Play developer account. Store review decides minimum-functionality acceptance; a wrapper is not an approval guarantee.

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
| Name, email, optional phone, verified Truecaller phone (when enabled), account ID | Account functionality; linked to account; Supabase or configured Better Auth backend; Truecaller verification when enabled |
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
