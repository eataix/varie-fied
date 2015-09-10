from flask import current_app
import requests
from tests.utils import get_with_password
from tests.base import CustomTestCase


class BasicTestCase(CustomTestCase):
    def test_app_exists(self):
        self.assertIsNotNone(current_app)

    def test_app_is_testing(self):
        self.assertTrue('TESTING' in current_app.config and current_app.config['TESTING'])

    def test_app_is_not_accessible_by_default(self):
        response = requests.get(self.get_server_url())
        self.assertEqual(response.status_code, 401)

    def test_app_is_accessible_with_password(self):
        response = get_with_password(self.get_server_url())
        self.assertEqual(response.status_code, 200)
