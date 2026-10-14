"""Create an IPA on a disposable macOS runner using GitHub environment secrets."""
import base64
import datetime
import hashlib
import os
from pathlib import Path
import plistlib
import re
import secrets
import subprocess
import tempfile

BUNDLE_ID = "in.palateo.app"


def validate_profile(profile):
    team = profile["TeamIdentifier"][0]
    entitlements = profile["Entitlements"]
    if entitlements.get("application-identifier") != team + "." + BUNDLE_ID:
        raise ValueError("Provisioning profile must belong to in.palateo.app")
    if (entitlements.get("get-task-allow") or profile.get("ProvisionedDevices")
            or profile.get("ProvisionsAllDevices")):
        raise ValueError("Use an App Store distribution provisioning profile")
    if profile["ExpirationDate"] <= datetime.datetime.now(datetime.timezone.utc).replace(tzinfo=None):
        raise ValueError("Provisioning profile has expired")
    if not re.fullmatch(r"[A-Z0-9]{10}", team) or not re.fullmatch(r"[A-Fa-f0-9-]{36}", profile["UUID"]):
        raise ValueError("Invalid signing team or profile UUID")
    return team


def main():
    for key in ("IOS_CERTIFICATE_BASE64", "IOS_CERTIFICATE_PASSWORD", "IOS_PROFILE_BASE64"):
        if not os.environ.get(key):
            raise ValueError("Missing signing secret: " + key)
    number = os.environ["PALATEO_BUILD_NUMBER"]
    if not re.fullmatch(r"[1-9][0-9]{0,9}", number) or int(number) > 2100000000:
        raise ValueError("Invalid PALATEO_BUILD_NUMBER")
    project = Path("mobile/ios/App/App.xcodeproj/project.pbxproj")
    original = project.read_text()
    output = Path("mobile/ios/App/output").resolve()
    output.mkdir(parents=True, exist_ok=True)
    installed_profiles = []
    run = lambda *args: subprocess.run(args, check=True)
    with tempfile.TemporaryDirectory(prefix="palateo-signing-", dir=os.environ["RUNNER_TEMP"]) as directory:
        temporary = Path(directory)
        keychain = str(temporary / "signing.keychain-db")
        try:
            certificate = temporary / "distribution.p12"
            certificate.write_bytes(base64.b64decode(os.environ["IOS_CERTIFICATE_BASE64"], validate=True))
            provision = temporary / "distribution.mobileprovision"
            provision.write_bytes(base64.b64decode(os.environ["IOS_PROFILE_BASE64"], validate=True))
            profile = plistlib.loads(subprocess.check_output(["security", "cms", "-D", "-i", str(provision)]))
            team = validate_profile(profile)
            password = secrets.token_urlsafe(32)
            run("security", "create-keychain", "-p", password, keychain)
            run("security", "set-keychain-settings", "-lut", "3600", keychain)
            run("security", "unlock-keychain", "-p", password, keychain)
            run("security", "import", str(certificate), "-P", os.environ["IOS_CERTIFICATE_PASSWORD"], "-t", "cert", "-f", "pkcs12", "-k", keychain, "-T", "/usr/bin/codesign")
            run("security", "set-key-partition-list", "-S", "apple-tool:,apple:,codesign:", "-k", password, keychain)
            run("security", "list-keychains", "-d", "user", "-s", keychain)
            identities = subprocess.check_output(["security", "find-identity", "-v", "-p", "codesigning", keychain], text=True)
            fingerprints = [hashlib.sha1(cert).hexdigest().upper() for cert in profile["DeveloperCertificates"]]
            identity = next((fingerprint for fingerprint in fingerprints if fingerprint in identities), None)
            if not identity:
                raise ValueError("Distribution certificate/private key does not match the provisioning profile")
            for folder in ("Library/MobileDevice/Provisioning Profiles", "Library/Developer/Xcode/UserData/Provisioning Profiles"):
                target = Path.home() / folder / (profile["UUID"] + ".mobileprovision")
                target.parent.mkdir(parents=True, exist_ok=True)
                if target.exists():
                    raise ValueError("Use a fresh runner without an existing copy of this profile")
                target.write_bytes(provision.read_bytes())
                installed_profiles.append(target)
            # Target settings avoid imposing app provisioning on Swift package dependencies.
            settings = f'CODE_SIGN_STYLE = Manual;\n DEVELOPMENT_TEAM = {team};\n PROVISIONING_PROFILE_SPECIFIER = "{profile["UUID"]}";\n CODE_SIGN_IDENTITY = "{identity}";'
            if original.count("CODE_SIGN_STYLE = Automatic;") != 2:
                raise ValueError("Review signing setup: expected two app target configurations")
            project.write_text(original.replace("CODE_SIGN_STYLE = Automatic;", settings))
            archive = temporary / "Palateo.xcarchive"
            run("xcodebuild", "-project", "mobile/ios/App/App.xcodeproj", "-scheme", "App", "-configuration", "Release", "-destination", "generic/platform=iOS", "-archivePath", str(archive), "CURRENT_PROJECT_VERSION=" + number, "archive")
            options = temporary / "ExportOptions.plist"
            options.write_bytes(plistlib.dumps({"method": "app-store-connect", "destination": "export", "teamID": team, "signingStyle": "manual", "signingCertificate": identity, "provisioningProfiles": {BUNDLE_ID: profile["UUID"]}, "manageAppVersionAndBuildNumber": False}))
            run("xcodebuild", "-exportArchive", "-archivePath", str(archive), "-exportOptionsPlist", str(options), "-exportPath", str(output))
            run("ditto", "-c", "-k", "--sequesterRsrc", "--keepParent", str(archive / "dSYMs"), str(output / "Palateo-dSYMs.zip"))
        finally:
            project.write_text(original)
            for target in installed_profiles:
                target.unlink(missing_ok=True)
            subprocess.run(["security", "delete-keychain", keychain], check=False, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


if __name__ == "__main__":
    # Avoid printing subprocess arguments containing certificate passwords on failure.
    try:
        main()
    except subprocess.CalledProcessError as error:
        raise SystemExit(f"Native signing/build tool failed (exit {error.returncode}); see preceding build output") from None
