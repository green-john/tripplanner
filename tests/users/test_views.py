import json
import unittest

from nose2.tools import params

from tripplanner import db, create_app
from tripplanner.users.models import Role


class TestUserViews(unittest.TestCase):

    def setUp(self):
        self.app = create_app('test')
        self.app_context = self.app.app_context()
        self.app_context.push()
        db.create_all()
        Role.create_roles()
        self.client = self.app.test_client()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_register_user_success(self):
        user = {'username': 'test1', 'password': 'pass1'}
        response = self.client.post('/users/', data=json.dumps(user),
                                    content_type='application/json')
        decoded_data = response.data.decode('UTF-8')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(json.loads(decoded_data)['username'], user['username'])

    @params(({'username': 'user'}, 400),
            ({'password': 'user'}, 400),
            ({'username': 'user', 'password': 'pass', 'other': 'pass'}, 400),
            ({'username': '', 'password': 'pass'}, 400),
            ({'username': 'user', 'password': ''}, 400))
    def test_register_user_incomplete_data(self, user_data, status_code):
        response = self.client.post('/users/', data=json.dumps(user_data),
                                    content_type='application/json')
        self.assertEqual(response.status_code, status_code)

