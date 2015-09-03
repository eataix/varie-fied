import os
from flask.ext.httpauth import HTTPBasicAuth

auth = HTTPBasicAuth()


@auth.verify_password
def verify_password(username, password):
    return username == os.environ.get('USERNAME', 'admin') and password == os.environ.get('PASSWORD', 'password')
