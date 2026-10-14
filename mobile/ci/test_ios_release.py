import datetime
import unittest
from ios_release import validate_profile


class ProfileValidation(unittest.TestCase):
    def setUp(self):
        self.profile = {
            "TeamIdentifier": ["ABCDE12345"],
            "UUID": "12345678-1234-1234-1234-123456789abc",
            "Entitlements": {"application-identifier": "ABCDE12345.in.palateo.app"},
            "ExpirationDate": datetime.datetime.now() + datetime.timedelta(days=30),
        }

    def test_store_profile(self):
        self.assertEqual(validate_profile(self.profile), "ABCDE12345")

    def test_wrong_app(self):
        self.profile["Entitlements"]["application-identifier"] = "ABCDE12345.other.app"
        with self.assertRaises(ValueError):
            validate_profile(self.profile)

    def test_expired(self):
        self.profile["ExpirationDate"] = datetime.datetime(2000, 1, 1)
        with self.assertRaises(ValueError):
            validate_profile(self.profile)

    def test_non_store_profiles(self):
        for key, value in [("ProvisionedDevices", ["device"]), ("ProvisionsAllDevices", True)]:
            with self.subTest(key=key), self.assertRaises(ValueError):
                validate_profile({**self.profile, key: value})
        self.profile["Entitlements"]["get-task-allow"] = True
        with self.assertRaises(ValueError):
            validate_profile(self.profile)


if __name__ == "__main__":
    unittest.main()
