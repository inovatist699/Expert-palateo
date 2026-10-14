# Independent web and Android maintenance

The owner authorized a daily Codex maintenance agent at 9 AM Asia/Kolkata and automatic release of passing fixes on 15 October 2026. Automation ID: `palateo-web-and-android-maintenance`, attached to the current Codex chat. iOS is deferred. This is a scheduled Codex agent, not a continuously running production daemon.

## Build and release boundaries

| Surface | Source/configuration | Generated output | Checks / release |
| --- | --- | --- | --- |
| Web | Shared `src/`, `config/vercel.json`, `scripts/build.cjs` | `work/palateo_cloudflare_pages/` | `npm run web:check`, `npm run update:csp`; `.github/workflows/web.yml` |
| Android | Shared app source plus `mobile/native.js`, `mobile/capacitor.config.json`, `mobile/android/` | `mobile/.web-build/`, then `mobile/www/`, then APK/AAB | `npm run mobile:build`, `npm run check:builds`, `npx cap sync android` in `mobile/`; `.github/workflows/mobile.yml` |
| Backend | `server/`, shared API handlers, Supabase contracts | Hosted API/database | Existing API/auth tests and backward-compatible contracts for installed app versions |

An Android build assembles shared source into its private staging directory and never reads or writes the web deployment directory. A web build never writes mobile output. The mobile bundle has its own native bridge and bundled authentication SDK; server APIs and private configuration are excluded. `work/check-build-isolation.cjs` exercises both directions in a disposable fixture, including stale mobile server-file removal.

The shared source keeps behavior/security fixes consistent; native configuration and release artifacts stay separate. A web deployment does not update an installed Android app. Android changes require a fresh signed build and the applicable Play release flow. Keep backend compatibility with already-installed versions. Website-only and native-only changes have separate workflow triggers; shared app changes run both workflows.

## Maintenance run

Use an isolated checkout of the latest repository state; never reset the user's dirty working directory or include unrelated files. Inspect CI, production health/errors, compatible dependency/security updates and provider availability. Make only justified fixes. Check official sources when version or provider behavior may have changed. Do not invent venue data, capabilities or claimed model training.

Run affected tests, audits, build isolation and browser checks, and wait for required native CI on the exact release commit. Review the diff before merging. The owner authorized routine automatic merges and releases after these gates pass. Preserve branch protections and do not disable checks. If no actionable work exists, remain quiet. Notify on completed releases, meaningful failures or required user action.

## Web release

The existing target is Vercel team `team_IDls8zTG4aRll5HgBB3VaPHH` (`palateo`), project `prj_FDDeOkC7enBhavqpKgKdUIy1Bg69` (`palateo-app`), with public domain `palateo.in`. Deploy only the generated web directory. The Vercel connector currently lacks that team scope; the existing CLI login successfully inspected the exact project, so use that authorized CLI fallback when necessary. Do not extract or print authentication tokens.

Before promotion, record the previous production deployment and identify the candidate's commit. Stage a production deployment without assigning domains, smoke-test it, promote it, then verify the public login, recommendations, account deletion using a disposable account, support/privacy pages and optional live Palo behavior. Roll back a confirmed regression using the recorded prior deployment. Do not restore deleted user data during rollback.

## Android release

Package: `in.palateo.app`. The verified local baseline is version 1.0/build 7. Use a fresh version code higher than every previously uploaded build. Check signature, package/version and source commit; retain hashes and signed APK/AAB artifacts. Reuse the existing upload key; never replace it during maintenance. Local private material is in ignored `mobile/signing/`. CI signing requires four protected `mobile-release` environment secrets documented in `mobile/README.md`.

Automatic Play publication additionally needs a Play app record, publishing service-account access stored securely, a matching registered upload certificate and the account's testing/release eligibility. That publishing access is not configured in this task. Until it exists, the agent can prepare verified signed artifacts and must report the publishing blocker. It must not claim an app was released to Play or bypass required testing. No iOS certificate, build or publication work is part of this maintenance scope.

Do not delete real users/data, run destructive migrations, purchase services or alter account ownership as routine maintenance. Stop and report concrete missing access or unsafe release conditions. Codex must be available for its local scheduled agent to execute; GitHub CI remains a separate service.
