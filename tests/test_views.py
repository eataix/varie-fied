from tests.base import CustomTestCase
from tests.utils import get_with_password, post_with_password


class ViewsTest(CustomTestCase):
    def test_projects_empty(self):
        response = get_with_password(self.get_server_url() + '/api/v1.0/projects/')
        self.assertEqual(response.status_code, 200)
        json = response.json()
        self.assertIn('projects', json)
        self.assertTrue(len(json['projects']) == 0)

    def test_projects(self):
        post_json = {
            'name': 'Project',
            'margin': 0.1,
            'admin_fee': None,
            'reference_number': '01/15'
        }
        post_response = post_with_password(url=self.get_server_url() + '/api/v1.0/projects/',
                                           json=post_json)
        self.assertEqual(post_response.status_code, 201)
        response = get_with_password(self.get_server_url() + '/api/v1.0/projects/')
        self.assertEqual(response.status_code, 200)
        get_json = response.json()
        self.assertIn('projects', get_json)
        self.assertTrue(len(get_json['projects']) == 1)
        get_project = get_json['projects'][0]
        self.assertEqual(get_project['name'], post_json['name'])
        self.assertEqual(get_project['margin'], post_json['margin'])
        self.assertEqual(get_project['admin_fee'], post_json['admin_fee'])

    def test_variations(self):
        response = get_with_password(self.get_server_url() + '/api/v1.0/variations/')
        self.assertEqual(response.status_code, 200)
        json = response.json()
        self.assertIn('variations', json)
        self.assertTrue(len(json['variations']) == 0)

    def test_items(self):
        response = get_with_password(self.get_server_url() + '/api/v1.0/items/')
        self.assertEqual(response.status_code, 200)
        json = response.json()
        self.assertIn('items', json)
        self.assertTrue(len(json['items']) == 0)

    def test_progress_items(self):
        response = get_with_password(self.get_server_url() + '/api/v1.0/progress_items/')
        self.assertEqual(response.status_code, 200)
        json = response.json()
        self.assertIn('progress_items', json)
        self.assertTrue(len(json['progress_items']) == 0)
