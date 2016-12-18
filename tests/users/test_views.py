import base64
import json
import unittest

from nose2.tools import params

from tripplanner import db, create_app
from tripplanner.users.models import Role
from tests import test_utils


def decode_data(encoded_data):
    return encoded_data.decode('UTF-8')


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
        decoded_data = decode_data(response.data)
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

    def test_get_auth_token_success(self):
        user = test_utils.create_and_save_user()
        auth_header = test_utils.encode_info_basic_http_auth(user.username, 'pass1')
        response = self.client.post('/token/', headers={
            'Authorization': auth_header
        })
        decoded_data = decode_data(response.data)
        self.assertIn('token', json.loads(decoded_data))

    def test_get_auth_token_incorrect_credentials(self):
        user = test_utils.create_and_save_user()
        auth_header = test_utils.encode_info_basic_http_auth(user.username, 'wrongPass')
        response = self.client.post('/token/', headers={
            'Authorization': auth_header
        })

        self.assertEqual(response.status_code, 401)

    def test_get_all_users_from_admin_success(self):
        admin = test_utils.create_user_admin()
        usernames = ['u1', 'u2', 'u3']
        for u in usernames:
            test_utils.create_and_save_user(u, 'pass{}'.format(u))

        usernames.append('admin')

        token = admin.generate_rest_auth_token()
        response = self.client.get('/users/', headers={
            'Authorization': test_utils.encode_info_token_http_auth(token)
        })

        self.assertEqual(response.status_code, 200)
        users = json.loads(decode_data(response.data))
        for u in users:
            self.assertIn(u['username'], usernames)

    def test_get_all_users_from_regular_user_error(self):
        usernames = ['u1', 'u2', 'u3']
        users = [test_utils.create_and_save_user(u, 'pass{}'.format(u))
                 for u in usernames]

        token = users[0].generate_rest_auth_token()
        response = self.client.get('/users/', headers={
            'Authorization': test_utils.encode_info_token_http_auth(token)
        })

        self.assertEqual(response.status_code, 401)

    def test_get_one_user_correct_id(self):
        u = test_utils.create_and_save_user('u1', 'pass_u1')
        token = u.generate_rest_auth_token()

        response = self.client.get('/users/{}/'.format(u.id), headers={
            'Authorization': test_utils.encode_info_token_http_auth(token)
        })

        self.assertEqual(response.status_code, 200)
        u_dict = json.loads(decode_data(response.data))
        self.assertEqual(u_dict['username'], u.username)

    def test_get_one_user_other_user(self):
        u1 = test_utils.create_and_save_user('u1', 'pass_u1')
        u2 = test_utils.create_and_save_user('u2', 'pass_u2')
        token = u1.generate_rest_auth_token()

        response = self.client.get('/users/{}/'.format(u2.id), headers={
            'Authorization': test_utils.encode_info_token_http_auth(token)
        })

        self.assertEqual(response.status_code, 401)
