from flask.ext.testing import LiveServerTestCase

from app import create_app, db


class CustomTestCase(LiveServerTestCase):
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
