import requests
from faker import Factory
from requests.auth import HTTPBasicAuth
from selenium import webdriver

auth = HTTPBasicAuth(username='admin', password='password')


def get_with_password(url):
    return requests.get(url, auth=auth)


def post_with_password(url, json):
    return requests.post(url=url, json=json, auth=auth)


fake = Factory.create()

class browser_test:
    def __enter__(self):
        self.browser = webdriver.Firefox()
        return self.browser

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.browser.quit()
