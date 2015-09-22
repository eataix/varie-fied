import requests
from faker import Factory
from requests.auth import HTTPBasicAuth
from selenium import webdriver
from selenium.common.exceptions import WebDriverException
from selenium.webdriver.firefox.webdriver import WebDriver

auth = HTTPBasicAuth(username='admin', password='password')


def get_with_password(url):
    return requests.get(url, auth=auth)


def post_with_password(url, json):
    return requests.post(url=url, json=json, auth=auth)


fake = Factory.create()


class browser_test:
    def __enter__(self) -> WebDriver:
        try:
            self.browser = webdriver.Firefox()
        except WebDriverException:
            self.browser = None
        return self.browser

    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.browser is not None:
            self.browser.quit()
