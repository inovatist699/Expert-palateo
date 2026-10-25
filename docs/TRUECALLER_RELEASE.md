# Truecaller security release — 25 October 2026

The previous integration accepted mock/test codes as verified identities, skipped provider verification and created random tokens that were not accepted by the real authentication service. The developer account now has a Palateo project in test mode, with Android package in.palateo.app and the existing signed APK certificate registered. Its public client ID is included in Android resources. Provider production approval and a real session integration are still pending. This release disables that incomplete sign-in flow and keeps email authentication available.

Both Express aliases and the Vercel endpoint use the same canonical handler. Every verification POST fails closed with HTTP 503 and `TRUECALLER_UNAVAILABLE`, including old Android clients. Requests cannot create users, claim verified phone ownership, write profiles or issue fake tokens. There is no mock bypass in development or test environments. Tests stub the network instead of using a production code path for test identities.

The current website and rebuilt Android client omit the unavailable sign-in button. Native SDK initialization stays disabled through the explicit truecaller_enabled resource until approval and real session integration. SDK 3.3 initialization, Activity Result launcher wiring, random state and PKCE handling are corrected. Existing email sessions, accounts and data are preserved. The earlier unknown-hours fix and shared body-parser security patch are included.

Before Truecaller can be enabled, obtain provider production approval and implement a reviewed provider-code exchange and real session issuance against the existing canonical authentication service. Verify PKCE/state, provider-confirmed phone ownership, consent, account linking, session persistence and logout on a physical Android device. Never accept a typed phone number as proof, trust a browser-supplied identity, or substitute a random token when session issuance fails.

This release closes an authentication bypass. It does not claim that live Truecaller sign-in is configured or tested.
