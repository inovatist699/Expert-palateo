# Truecaller sign-in activation

Both clients use `custom:palateo-truecaller` in the existing Supabase Auth project.
The shared Vercel/Express handler exchanges Android authorization codes with the
registered client ID and PKCE verifier, then requires Truecaller's verified phone.
It signs a 60-second, nonce-bound identity proof. This proof is **not** a Palateo
session: `signInWithIdToken` obtains Supabase's ordinary access/refresh session.
Existing RLS, refresh, sign-out, legal consent and account deletion remain in use.
No emails, passwords, fake users or application session tokens are generated.

Identity is a normalized verified phone (`phone:+…`), shared across the provider's
Android and web products. This has the same number-reassignment risk as other
phone login. Existing email users must sign in normally and explicitly link
Truecaller from Profile. Never merge accounts using profile email or a typed phone.
The backend does not request email/profile/address/offline-access scopes.

## Current gates

All Truecaller activation flags default off. Approval does not turn them on.
The Android SDK starts on demand after the shared config check, so the prepared
binary can use the approved backend without a code download service. Website
Truecaller is limited to Android browsers; desktop/iPhone retain email sign-in.

Before activation:

1. Apply `server/truecaller-flows.sql` to the canonical Supabase database. It adds
   only private transient state and an RPC executable by `service_role`; it does
   not change user/profile ownership. Native attempts are limited to ten per IP
   hash per three minutes. Web state expires after three minutes; completion is
   atomic and single-use. Expired state is removed on subsequent flow creation
   or completion. Bearer tokens are encrypted at rest with AES-256-GCM.
2. Store a dedicated RSA private key (2048+ bits, PKCS8 PEM encoded as base64) as
   `TRUECALLER_IDENTITY_PRIVATE_KEY` exclusively in the canonical backend's secret
   store. Deploy `supabase/functions/truecaller-flows` with gateway JWT verification
   disabled **for this function only**: the handler verifies its own pinned RS256
   assertion, issuer, audience, exact request-body hash and 20-second expiry before
   forwarding the one fixed state RPC. Its public JWK must match the backend key.
   The Supabase service key remains in the function's managed environment; never
   copy it into Vercel, local files, frontend bundles or release artifacts.
   Assertions can repeat within their short lifetime; the SQL transitions are
   idempotent and completion remains single-use. They are not application sessions.
   Preserve the signing key across deployments; rotation requires overlapping
   published public keys until existing proofs expire and discovery caches refresh.
3. Register a Supabase **custom OIDC** provider with identifier
   `custom:palateo-truecaller`, client ID `palateo-truecaller`, issuer
   `https://palateo.in/api/truecaller`, email optional enabled and nonce checks
   enabled. This is a verification-only adapter for the ID-token grant, not a
   complete OIDC authorization server. Its canonical discovery URL must work:
   `/api/truecaller/.well-known/openid-configuration`; JWKS is
   `/api/truecaller?action=jwks`. Supabase's registration requires authorization
   and token endpoint metadata even for native ID-token use. The named adapter
   endpoints explicitly reject unsupported response/grant types, and discovery
   advertises no OAuth grants. Do not call `signInWithOAuth` for this provider.
   Prove registration and ID-token validation on hosted Supabase before activation;
   satisfying metadata field validation alone does not certify interoperability.
4. Prove hosted Supabase discovery, signature, audience, expiry and nonce
   validation. A bad-nonce proof should fail without creating a user. Then use
   real approved Truecaller verification on an Android device to prove actual
   sessions, refresh/relaunch, cancellation/timeout, consent, logout, account
   isolation and deletion. Do not substitute a fabricated identity for this test.
5. Enable Supabase manual linking, verify linking/conflict handling on disposable
   real test accounts, then set `TRUECALLER_LINKING_ENABLED=true`.
6. Only after provider approval and the above verification, set
   `TRUECALLER_ANDROID_ENABLED=true`. Recheck both clients and signed artifacts.

## Separate website requirements

The older Truecaller mobile-web SDK needs its own **Web** registration and partner
key; the Android client ID is not a substitute. The current Android registration
and its review do not establish website approval.

The prepared web adapter implements the official deep link and periodic polling.
The callback URL must be registered privately as:

`https://palateo.in/api/truecaller?action=web-callback&secret=<random-32-byte-base64url-secret>`

The callback secret authenticates provider delivery; the public request nonce
alone does not. It must not appear in app bundles, analytics, support messages or
public URLs. Restrict/redact callback query strings in infrastructure logs.
`flow_invoked` is acknowledged, rejection terminates the flow, and a verified
delivery cannot overwrite an already completed flow. The callback only stores an
encrypted token; the browser-bound consume fetches the profile from the fixed
`https://profile4-noneu.truecaller.com/v1/default` endpoint without redirects.
Arbitrary callback endpoints are rejected. Only the phone is retained in the
identity proof; other response attributes are ignored.

**Do not enable web yet:** the public legacy SDK documentation returns broad
profile fields and does not establish a phone-only permission mode. Obtain
Truecaller's confirmation of a phone-only registration/consent configuration
compatible with the owner's approved permissions before setting
`TRUECALLER_WEB_PHONE_ONLY_CONFIRMED=true`. Do not request broader scopes silently.
Also configure `TRUECALLER_WEB_PARTNER_KEY`, `TRUECALLER_WEB_CALLBACK_SECRET`,
register the private callback, verify real browser/device delivery and only then
set `TRUECALLER_WEB_ENABLED=true`. If the provider cannot meet the approved scope,
keep web off and email available; the website is not activation-ready merely
because Android is approved.

## Verification

`node work/check-truecaller-auth.cjs` tests the genuine code-exchange contract,
verified-phone rejection, signed nonce/audience proof, fixed destinations,
authenticated callback, encrypted durable handoff, secret-bound one-time consume
and real-session/explicit-linking client APIs using mocked provider transport.
`node work/check-truecaller-sdk.cjs` retains disabled/legacy bypass regressions.
`npm run check`, both builds, CSP, build isolation, browser regressions, audits and
native CI remain required. These tests do not prove provider approval, live
Supabase provider configuration or physical-device behaviour.

Official references: [Supabase custom providers](https://supabase.com/docs/guides/auth/custom-oauth-providers),
[Supabase ID-token implementation](https://github.com/supabase/auth/blob/master/internal/api/token_oidc.go),
[Truecaller Android backend exchange](https://docs.truecaller.com/truecaller-sdk/android/latest-oauth-sdk-3.3.0/integration-steps/integrating-with-your-backend/fetching-user-token),
[mobile web registration](https://docs.truecaller.com/truecaller-sdk/mobile-websites/generating-app-key),
[mobile web callback](https://docs.truecaller.com/truecaller-sdk/mobile-websites/integrating-with-your-mobile-website/fetch-user-profile).

## Play signing configuration

The Truecaller Android credential is tied to `in.palateo.app` and its signing
certificate SHA-1. Register the **Play app signing** certificate shown in Play
Console → App integrity for Play installs, not merely the upload certificate used
for the direct APK. Verify current SDK registration instructions in the provider
console. If the client ID changes, set `TRUECALLER_ANDROID_CLIENT_ID` in the
`mobile-release` GitHub environment variables and the canonical backend
configuration to that same public client ID. The existing registered client ID
remains the default for direct builds. Only server configuration selects the
exchange client; request bodies cannot override it. The native app checks that
its embedded ID matches the backend before requesting authorization. A mismatch
keeps email available instead of starting a broken login.

A single backend client configuration supports one credential at a time. Do not
switch it for Play while expecting older direct APKs with another client ID to
continue Truecaller sign-in. Verify provider support for registering both signing
certificates against one credential, or plan a separately reviewed allowlisted
multi-client implementation. Keep activation off until a Play internal-track
install completes real verification, refresh, linking and deletion.

### Observed hosted state — 26 October 2026

The canonical Supabase project has the private Truecaller state tables and active
`truecaller-flows` function. Its custom OAuth provider table is empty: provider
registration and live interoperability are still pending. Existing PR #22 native
and web checks passed on `ace98ad`; this is compilation/regression evidence only.
The current production deployment is `dpl_D6jdsqyxLoyVxNcWQxfAd8nkMH73` (build 54).
No activation flags were changed during this readiness work.

### Coordinated release preparation � 29 October 2026

The safe authentication implementation is reconciled with the Reels/craving/PWA
source from `9c82bb0` and the mobile layout fixes from `de6f543`. The downloads
index is now source-controlled and points to stable signed artifact filenames;
release packaging must include the matching APK, AAB, checksums, notes and JSON.

Truecaller remains disabled. Hosted custom-provider registration, phone-only web
registration and real device login/session/linking remain unverified. The Vercel
containment rule must remain active until these gates pass; publishing this code
does not certify or activate the provider. Email authentication remains available.
