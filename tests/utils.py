import requests
from requests.auth import HTTPBasicAuth

auth = HTTPBasicAuth(username='admin', password='password')


def get_with_password(url):
    return requests.get(url, auth=auth)


def post_with_password(url, json):
    return requests.post(url=url, json=json, auth=auth)
