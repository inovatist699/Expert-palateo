# Palateo Android release

Package identifier: `in.palateo.app`. The owner deferred iOS on 15 October 2026; its project is retained, and the current workflow builds Android only.

From the repository root:

```sh
npm --prefix server ci
npm --prefix mobile ci
npm run check
npm run mobile:build
cd mobile
npx cap sync android
```

Android uses Capacitor 8, Java 21, SDK 36 and a bundled web app. There is no remote `server.url` or live-update mechanism. After each app change, rebuild the public assets and sync Android before compilation. Generated web assets, signing files and build outputs are ignored by Git.

## Builds and signing

`.github/workflows/mobile.yml` runs regression checks, CSP verification and dependency audits, then Android lint and native compilation. Automatic runs retain a debug APK, unsigned release AAB and lint report for 14 days.

For signed CI builds, create a GitHub environment named `mobile-release`, restrict it to `main`, and add these environment secrets through Settings → Environments. Use required reviewers if your plan supports them.

| Secret | Value |
| --- | --- |
| `ANDROID_KEYSTORE_BASE64` | Base64 of the upload keystore |
| `ANDROID_STORE_PASSWORD` | Keystore password |
| `ANDROID_KEY_ALIAS` | Upload key alias |
| `ANDROID_KEY_PASSWORD` | Upload key password |

Keep the keystore and passwords backed up securely. Local files in `mobile/signing/` must never be committed. A new upload key was generated locally; if this package already has a registered Play upload key, verify the public fingerprint or follow Play's upload-key reset process before uploading.

After review and merge, open Actions → Android builds → Run workflow, choose `main`, enable `signed`, and enter a positive build number higher than any prior Play upload (maximum 2100000000). Signed runs produce a release APK and AAB. Marketing version is currently 1.0. Signing files are removed after the signing step on disposable hosted runners. No workflow publishes to Play Console.

The release AAB from successful CI run 38650305041 was signed locally as version 1.0, build 7. Google's bundletool generated a universal release APK from that same bundle. AAB verification passed; APK v2/v3 signatures passed and matched the upload certificate. Physical-device and Play internal-track testing remain pending.

## Android launch checks

Install the release APK on a real Android device and test login/recovery, onboarding, saved places, Love/Pass/undo, denied location, network loss, background/foreground, keyboard/safe areas, accessibility and account deletion. A previously installed debug APK uses another certificate and may need uninstalling first, which removes its local app data. For Play-distributed installs, Play App Signing uses the Play app signing key; the direct APK uses the upload key.

The app uses the existing Supabase backend. Optional live Palo requests go to `https://palateo.in/api/palo`; the deployed endpoint needs native-origin CORS and a reachable AI gateway. A local loopback gateway cannot serve production users. Deploy and verify the public privacy, support and deletion URLs and complete Play Data Safety and reviewer-access details before submission. See `docs/RELEASE_READINESS.md` for the remaining launch gates.
