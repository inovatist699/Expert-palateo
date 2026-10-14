# Palateo mobile release

Bundle/package identifier: `in.palateo.app` (confirmed by owner). Native projects use Capacitor 8 with bundled app assets; no remote `server.url` or live-update mechanism is configured.

From the repository root:

```sh
npm --prefix server ci
npm --prefix mobile ci
npm run check
npm run mobile:sync
```

Open `mobile/ios/App/App.xcodeproj` on a Mac with Xcode 26 or later and the iOS 26 SDK or later. Select your Apple team, verify the bundle ID and capabilities, run on an iPhone, then Archive and validate before uploading to TestFlight. The current minimum supported iOS version is 15.0. Confirm privacy labels, review login, screenshots, encryption questionnaire, and age rating in App Store Connect.

Open `mobile/android` in Android Studio with the SDK 36 toolchain and the JDK required by its Gradle version. Run on an Android device. Generate a signed Android App Bundle using the existing upload key, and verify package ownership in Play Console. The current target API is 36. Use internal testing first. Never commit signing files or their passwords.

The app uses the existing Supabase backend. Optional live Palo requests go to `https://palateo.in/api/palo`, which must be deployed with the native-origin CORS support and a reachable AI gateway. This computer's loopback gateway cannot serve production users. Local taste recommendations do not require live AI permission.

`npm run mobile:sync` must follow every source or native bridge change. Generated `www` and copied native web assets are ignored by Git. App icons use the existing Palateo logo. Support, privacy and deletion pages are bundled, but their public web URLs also need deployment before store submission.

No native archive, signed AAB, physical-device test or store submission has been completed in this Windows workspace. See `docs/RELEASE_READINESS.md` for the remaining release gates and disclosure draft.

## GitHub Actions

`.github/workflows/mobile.yml` runs regression checks, CSP verification, signing-profile tests and dependency audits before compiling both platforms. Android produces a debug APK for device testing and an unsigned release AAB for build verification. iOS produces a simulator app ZIP. These automatic artifacts are not store submissions. The macOS runner runs `cap sync` to regenerate the Swift package paths created on Windows.

For store-signed artifacts, create a GitHub environment named `mobile-release`, restrict it to `main`, and add the following environment secrets through the repository Settings → Environments UI. Set required reviewers where your GitHub plan supports them. Never paste secret values into chat, source or workflow inputs.

| Secret | Value |
| --- | --- |
| `IOS_CERTIFICATE_BASE64` | Base64 of the Apple Distribution `.p12`, including its private key |
| `IOS_CERTIFICATE_PASSWORD` | Password used when exporting that `.p12` |
| `IOS_PROFILE_BASE64` | Base64 of the App Store distribution profile for `in.palateo.app`, matching that certificate |
| `ANDROID_KEYSTORE_BASE64` | Base64 of your Android upload keystore; keep an offline backup |
| `ANDROID_STORE_PASSWORD` | Keystore password |
| `ANDROID_KEY_ALIAS` | Upload key alias |
| `ANDROID_KEY_PASSWORD` | Upload key password |

After the workflow is reviewed and merged to `main`, open Actions → Mobile builds → Run workflow. Select `main`, enable `signed`, and enter an integer build number greater than every previous upload to both stores (maximum 2100000000). The release version is currently 1.0; increment the native marketing version when releasing a new version. Missing or mismatched signing inputs fail the build. Signed outputs are a Play AAB, an App Store IPA and iOS dSYMs, retained as workflow artifacts for 14 days. Signing credentials are installed only for the manual release step and removed afterward on disposable hosted runners. The workflow never uploads to either store.

Download the debug APK for Android smoke testing. The simulator ZIP requires a Mac/iOS Simulator; a physical iPhone needs a signed build distributed through TestFlight or an appropriate development profile. Follow the full device checklist before uploading release artifacts or promoting a release. GitHub-hosted runner usage is subject to your account's Actions quota.
