import os
import requests
from faker import Factory
from requests.auth import HTTPBasicAuth
from selenium import webdriver
from selenium.common.exceptions import WebDriverException
from selenium.webdriver.firefox.firefox_binary import FirefoxBinary

auth = HTTPBasicAuth(username='admin', password='password')


def get_with_password(url):
    return requests.get(url, auth=auth)


def post_with_password(url, json):
    return requests.post(url=url, json=json, auth=auth)


fake = Factory.create()


class SeleniumTest:
    def __enter__(self):
        try:
            binary_path = os.getenv('FIREFOX_BIN')
            if binary_path != '':
                binary = FirefoxBinary(binary_path)
                self.browser = webdriver.Firefox(firefox_binary=binary)
            else:
                self.browser = webdriver.Firefox()
        except (WebDriverException, RuntimeError):
            try:
                self.browser = webdriver.PhantomJS()
                self.browser.set_window_size(1280, 1024)
            except WebDriverException:
                self.browser = None
        if self.browser is not None:
            import logging
            selenium_logger = logging.getLogger('selenium.webdriver.remote.remote_connection')
            selenium_logger.setLevel(logging.WARNING)
        return self.browser

    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.browser is not None:
            self.browser.quit()
