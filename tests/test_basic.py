from flask import current_app
from app import create_app, db
from flask.ext.testing import LiveServerTestCase
import requests
from requests.auth import HTTPBasicAuth

auth = HTTPBasicAuth(username='admin', password='password')


class BasicTestCase(LiveServerTestCase):
    def create_app(self):
        app = create_app('testing')
        app.config['LIVESERVER_PORT'] = 8943
        return app

    def setUp(self):
        self.app_context = self.app.app_context()
        self.app_context.push()
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_app_exists(self):
        self.assertIsNotNone(current_app)

    def test_app_is_testing(self):
        self.assertTrue('TESTING' in current_app.config and current_app.config['TESTING'])

    def test_app_is_not_accessible_by_default(self):
        response = requests.get(self.get_server_url())
        self.assertEqual(response.status_code, 401)

    def test_app_is_accessible_with_password(self):
        response = requests.get(self.get_server_url(), auth=auth)
        self.assertEqual(response.status_code, 200)
