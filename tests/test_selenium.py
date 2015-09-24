import random
import time

from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.firefox.webdriver import WebDriver

from app.models import Project, Client, Variation, Item, ProgressItem
from tests.base import CustomTestCase
from tests.utils import SeleniumTest, fake


class ViewsTest(CustomTestCase):
    def test_index(self):
        with SeleniumTest() as browser:
            if browser is None:
                self.skipTest('No browser')
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
    def new_project(browser: WebDriver, number_clients: int) -> None:
        elem = browser.find_element_by_css_selector('[data-target="#new-project-dialog"]')
        elem.click()
        time.sleep(1)
        elem = browser.find_element_by_id('extra_project_name')
        elem.send_keys("{}".format(fake.company()))
        elem = browser.find_element_by_id('extra_reference_number')
        elem.send_keys("{}".format(fake.ean8()))
        elem = browser.find_element_by_id('extra_margin')
        elem.send_keys("{:f}".format(random.random()))

        elem = browser.find_element_by_class_name('add-client-row')
        for __ in range(number_clients - 1):
            elem.click()

        clientNameElems = browser.find_elements_by_name('clientName')
        firstAddressLineElems = browser.find_elements_by_name('firstAddressLine')
        secondAddressLineElems = browser.find_elements_by_name('secondAddressLine')

        for idx in range(number_clients):
            clientNameElems[idx].send_keys("{}".format(fake.company()))
            first, second = fake.address().split('\n')
            firstAddressLineElems[idx].send_keys("{}".format(first))
            secondAddressLineElems[idx].send_keys("{}".format(second))

        elem = browser.find_element_by_id('btn-add-project')
        elem.click()
        time.sleep(1)
        elem = browser.find_element_by_class_name('confirm')
        elem.click()
        time.sleep(5)

    def test_new_project(self):
        with SeleniumTest() as browser:
            if browser is None:
                self.skipTest('No browser')
            total_clients = 0
            num_trials = 10
            for idx in range(num_trials):
                browser.get('http://admin:password@127.0.0.1:8943')
                num_clients = random.randint(1, 10)
                self.new_project(browser, num_clients)

                total_clients += num_clients

                projects = Project.query.all()
                self.assertEqual(len(projects), idx + 1)

                project = Project.query.order_by(Project.pid.desc()).first()
                self.assertEqual(len(project.clients), num_clients)

                clients = Client.query.all()
                self.assertEqual(len(clients), total_clients)

                clients = Client.query.filter(Client.project_id == project.pid).all()
                self.assertEqual(len(clients), num_clients)

    def test_new_variation(self):
        with SeleniumTest() as browser:
            if browser is None:
                self.skipTest('No browser')
            for _ in range(10):
                browser.get('http://admin:password@127.0.0.1:8943')
                self.new_project(browser, 2)

            num_variations = 10
            total_items = 0
            for variation_idx in range(num_variations):
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
                self.assertNotEqual(elem.get_attribute('value'), '0.00%')
                elem = browser.find_element_by_id('admin-fee')
                self.assertFalse(elem.is_displayed())
                elem = browser.find_element_by_id('subtotal')
                self.assertEqual(elem.get_attribute('value'), '$0.00')

                elem = browser.find_element_by_class_name('input-group-addon')
                elem.click()
                elem.click()
                time.sleep(1)
                elem = browser.find_element_by_id('input_subcontractor')
                elem.send_keys(fake.company())

                elem = browser.find_element_by_id('input_description')
                self.assertFalse(elem.is_displayed())

                elem = browser.find_element_by_class_name('add-row')
                num_items = random.randint(1, 5)
                total_items += num_items
                for _ in range(num_items - 1):
                    elem.click()

                elems = browser.find_elements_by_name('description')
                self.assertTrue(len(elems), num_items)
                for idx, elem in enumerate(elems):
                    elem.send_keys("item {}".format(idx + 1))

                elems = browser.find_elements_by_name('amount')
                self.assertTrue(len(elems), num_items)
                sum_item_price = 0
                for idx, elem in enumerate(elems):
                    item_price = random.randint(800, 1200)
                    elem.send_keys("{:f}".format(item_price))
                    sum_item_price += item_price
                    elem = browser.find_element_by_id('value-of-work')
                    self.assertEqual(elem.get_attribute('value'), "${:,.2f}".format(sum_item_price))
                    elem = browser.find_element_by_id('margin')
                    margin = float(elem.get_attribute('value')[:-1]) / 100.0
                    elem = browser.find_element_by_id('subtotal')
                    subtotal = sum_item_price * (1 + margin)
                    self.assertEqual(elem.get_attribute('value'), "${:,.2f}".format(subtotal))

                elem = browser.find_element_by_id('btn_submit')
                elem.click()

                time.sleep(2)
                elem = browser.find_element_by_class_name('confirm')
                elem.click()

                time.sleep(5)

                variations = Variation.query.all()  # type: List[Variation]
                self.assertEqual(len(variations), variation_idx + 1)

                items = Item.query.all()  # type: List[Variation]
                self.assertEqual(len(items), total_items)

    def test_new_progress_items(self):
        number_projects = 3
        avg_progress_item = 20
        exp_progress_item = 0
        number_trials = [2 * (i + 1) for i in range(number_projects)]
        dict_num_progress_items = {i: 0 for i in range(number_projects)}

        with SeleniumTest() as browser:
            if browser is None:
                self.skipTest('No browser')

            for _ in range(number_projects):
                browser.get('http://admin:password@127.0.0.1:8943')
                self.new_project(browser, 2)

            while sum(number_trials) != 0:
                browser.get('http://admin:password@127.0.0.1:8943')
                elems = browser.find_element_by_id('content').find_elements_by_tag_name('a')
                self.assertEqual(len(elems), number_projects)

                index = None
                for idx, elem in enumerate(number_trials):
                    if elem > 0:
                        number_trials[idx] -= 1
                        elems[idx].click()
                        index = idx
                        break

                time.sleep(1)

                browser.find_element_by_css_selector('[data-target="#new-progress-item-dialog"]').click()
                time.sleep(3)

                self.assertEqual(len(browser.find_elements_by_class_name('input-progress-item-name')), 1)
                self.assertEqual(len(browser.find_elements_by_class_name('input-progress-item-value')), 1)

                number_progress_items = random.randint(1, avg_progress_item * 2 - 1)
                amplitude = random.randint(2, 3)
                for idx in range(amplitude * number_progress_items - 1):
                    browser.find_element_by_class_name('add-progress-item-row').click()
                    elems = browser.find_elements_by_class_name('input-progress-item-name')
                    self.assertEqual(len(elems), idx + 2)
                    elems = browser.find_elements_by_class_name('input-progress-item-value')
                    self.assertEqual(len(elems), idx + 2)
                time.sleep(1)
                exp_progress_item += number_progress_items
                dict_num_progress_items[index] += number_progress_items

                for idx in range((amplitude - 1) * number_progress_items):
                    browser.find_element_by_class_name('delete-progress-item-row').click()
                    elems = browser.find_elements_by_class_name('input-progress-item-name')
                    self.assertEqual(len(elems), amplitude * number_progress_items - idx - 1)
                    elems = browser.find_elements_by_class_name('input-progress-item-value')
                    self.assertEqual(len(elems), amplitude * number_progress_items - idx - 1)

                elems1 = browser.find_elements_by_class_name('input-progress-item-name')
                self.assertEqual(len(elems1), number_progress_items)
                for elem in elems1:
                    elem.send_keys('{}'.format(fake.text()))
                elems2 = browser.find_elements_by_class_name('input-progress-item-value')
                self.assertEqual(len(elems2), number_progress_items)
                for elem in elems2:
                    elem.send_keys('{:.2f}'.format(random.randint(100, 2000)))
                browser.find_element_by_id('btn-add-new-progress-items').click()
                time.sleep(2)
                elem = browser.find_element_by_class_name('confirm')
                elem.click()
                time.sleep(3)

                progress_items = ProgressItem.query.all()
                self.assertEqual(len(progress_items), exp_progress_item)

                progress_items = ProgressItem.query.filter(ProgressItem.project_id == index + 1).all()
                self.assertEqual(len(progress_items), dict_num_progress_items[index])
