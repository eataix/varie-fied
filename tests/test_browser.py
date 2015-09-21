import random
import time

from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.firefox.webdriver import WebDriver

from app.models import Project, Client
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

    @staticmethod
    def new_project(browser: WebDriver) -> None:
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
        time.sleep(2)
        elem = browser.find_element_by_class_name('confirm')
        elem.click()

    def test_new_project(self):
        with browser_test() as browser:
            browser.get('http://admin:password@127.0.0.1:8943')
            time.sleep(1)
            self.new_project(browser)

            projects = Project.query.all()
            self.assertEqual(len(projects), 1)
            project = projects[0]
            self.assertEqual(project.name, 'an awesome project')
            self.assertEqual(project.reference_number, '01/15')
            self.assertEqual(project.margin, 0.1)
            self.assertIsNone(project.admin_fee)

            clients = Client.query.all()
            self.assertEqual(len(clients), 1)
            client = clients[0]
            self.assertEqual(client.project_id, project.pid)

    def test_new_variation(self):
        with browser_test() as browser:
            browser.get('http://admin:password@127.0.0.1:8943')
            time.sleep(1)
            self.new_project(browser)
            time.sleep(1)
            browser.get('http://admin:password@127.0.0.1:8943')
            elem = browser.find_element_by_css_selector('[data-target="#new-variation-dialog"]')
            elem.click()
            time.sleep(2)

            elems = browser.find_elements_by_tag_name('input')
            self.assertEqual(elems[0].get_attribute('value'), '')
            self.assertEqual(elems[1].get_attribute('value'), '')

            elem = browser.find_element_by_id('input_subcontractor')
            self.assertEqual(elem.get_attribute('value'), '')

            elem = browser.find_element_by_id('input_invoice_no')
            self.assertEqual(elem.get_attribute('value'), '')

            elem = browser.find_element_by_id('value-of-work')
            self.assertEqual(elem.get_attribute('value'), '')

            elem = browser.find_element_by_id('margin')
            self.assertEqual(elem.get_attribute('value'), '')

            elem = browser.find_element_by_id('admin-fee')
            self.assertTrue(elem.is_displayed())

            elem = browser.find_element_by_id('subtotal')
            self.assertEqual(elem.get_attribute('value'), '')

            elem = browser.find_element_by_class_name('selectize-input')
            elem.click()
            elems = browser.find_elements_by_class_name('option')
            random.choice(elems).click()

            time.sleep(2)

            elem = browser.find_element_by_id('value-of-work')
            self.assertEqual(elem.get_attribute('value'), '$0.00')
            elem = browser.find_element_by_id('margin')
            self.assertNotEqual(elem.get_attribute('value'), '15%')
            elem = browser.find_element_by_id('admin-fee')
            self.assertFalse(elem.is_displayed())
            elem = browser.find_element_by_id('subtotal')
            self.assertEqual(elem.get_attribute('value'), '$0.00')

            elem = browser.find_element_by_class_name('input-group-addon')
            elem.click()
            elem.click()
            elem.click()
            elem.click()
            elem = browser.find_element_by_id('input_subcontractor')
            elem.send_keys('subcontractor 1')
            # elem = browser.find_element_by_id('input_invoice_no')
            # elem.send_keys('subcontractor 1')
            elem = browser.find_element_by_id('input_subcontractor')
            elem.send_keys('subcontractor 1')

            elem = browser.find_element_by_id('input_description')
            self.assertFalse(elem.is_displayed())

            elem = browser.find_element_by_class_name('add-row')
            elem.click()
            elem.click()

            elems = browser.find_elements_by_name('description')
            self.assertTrue(len(elems), 3)
            for idx, elem in enumerate(elems):
                elem.send_keys("item {}".format(idx + 1))

            elems = browser.find_elements_by_name('amount')
            self.assertTrue(len(elems), 3)
            for idx, elem in enumerate(elems):
                elem.send_keys("1000")
                elem = browser.find_element_by_id('value-of-work')
                self.assertEqual(elem.get_attribute('value'), "${:,.2f}".format(1000 * (idx + 1)))
                elem = browser.find_element_by_id('subtotal')
                subtotal = 1000 * (idx + 1) * 1.1
                self.assertEqual(elem.get_attribute('value'), "${:,.2f}".format(subtotal))

            elem = browser.find_element_by_id('btn_submit')
            elem.click()

            time.sleep(2)
            elem = browser.find_element_by_class_name('confirm')
            elem.click()

