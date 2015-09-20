import os

from flask.ext.httpauth import HTTPBasicAuth

auth = HTTPBasicAuth()


@auth.verify_password
def verify_password(username: str, password: str) -> bool:
    return username.lower() == os.environ.get('USERNAME', 'admin').lower() and password.lower() == os.environ.get('PASSWORD', 'password').lower()
