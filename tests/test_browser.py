import time

from selenium.common.exceptions import NoSuchElementException

from app.models import Project
from tests.base import CustomTestCase
from tests.utils import browser_test


class ViewsTest(CustomTestCase):
    def test_index(self):
        with browser_test() as browser:
            browser.get('http://admin:password@127.0.0.1:8943')
            self.assertIn('Varie-fied', browser.title)
            h1 = browser.find_elements_by_tag_name('h1')
            self.assertEqual(len(h1), 2)
            self.assertEqual(h1[0].text, 'Active projects')
            self.assertEqual(h1[1].text, 'Previous projects')
            modals = browser.find_elements_by_css_selector('[data-toggle="modal"]')
            self.assertEqual(len(modals), 2)
            self.assertEqual(modals[0].text, 'New Project')
            self.assertEqual(modals[1].text, 'New Variation')

            self.assertEqual(len(browser.find_elements_by_css_selector('[data-target="#new-project-dialog"]')), 1)
            self.assertEqual(len(browser.find_elements_by_css_selector('[data-target="#new-variation-dialog"]')), 1)
            try:
                browser.find_elements_by_id('new-project-dialog')
            except NoSuchElementException:
                self.fail('new-project-dialog should exist')
            try:
                browser.find_elements_by_id('new-variation-dialog')
            except NoSuchElementException:
                self.fail('new-variation-dialog should exist')

    def test_new_project(self):
        with browser_test() as browser:
            browser.get('http://admin:password@127.0.0.1:8943')
            time.sleep(1)
            elem = browser.find_element_by_css_selector('[data-target="#new-project-dialog"]')
            elem.click()
            time.sleep(1)
            elem = browser.find_element_by_id('extra_project_name')
            elem.send_keys('an awesome project')
            elem = browser.find_element_by_id('extra_reference_number')
            elem.send_keys('01/15')
            elem = browser.find_element_by_id('extra_margin')
            elem.send_keys('0.1')
            elem = browser.find_element_by_name('clientName')
            elem.send_keys('a client')
            elem = browser.find_element_by_name('firstAddressLine')
            elem.send_keys('address 1')
            elem = browser.find_element_by_name('secondAddressLine')
            elem.send_keys('address 2')
            elem = browser.find_element_by_id('btn-add-project')
            elem.click()
            time.sleep(1)
            elem = browser.find_element_by_class_name('confirm')
            elem.click()

            projects = Project.query.all()
            self.assertEqual(len(projects), 1)
            project = projects[0]
            self.assertEqual(project.name, 'an awesome project')
            self.assertEqual(project.reference_number, '01/15')
            self.assertEqual(project.margin, 0.1)
            self.assertIsNone(project.admin_fee)
