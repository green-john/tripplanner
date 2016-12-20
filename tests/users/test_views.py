import base64
import json
import unittest

from nose2.tools import params

from tripplanner import db, create_app
from tripplanner.users.models import User, Role
from tests import utils


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
        user = {'username': 'test1', 'password': 'pass1', 'first_name': 'Us',
                'last_name': 'Er'}
        response = self.client.post('/users/', data=json.dumps(user),
                                    content_type='application/json')
        decoded_data = utils.decode_data(response.data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(json.loads(decoded_data)['username'], user['username'])

    @params(({'username': 'user'}, 400),
            ({'password': 'user'}, 400),
            ({'username': 'user', 'password': 'pass', 'other': 'pass'}, 400),
            ({'username': '', 'password': 'pass'}, 400),
            ({'username': 'user', 'password': ''}, 400),
            ({'username': 'user', 'password': 'pass', 'first_name': 'Us'}, 400),
            ({'username': 'user', 'password': '', 'last_name': 'Er'}, 400),
            ({'username': 'user', 'password': 'pass', 'first_name': 'Us'}, 400))
    def test_register_user_incomplete_data(self, user_data, status_code):
        response = self.client.post('/users/', data=json.dumps(user_data),
                                    content_type='application/json')
        self.assertEqual(response.status_code, status_code)

    def test_get_auth_token_success(self):
        user = utils.create_and_save_user()
        auth_header = utils.encode_info_basic_http_auth(user.username, 'pass1')
        response = self.client.post('/token/', headers={
            'Authorization': auth_header
        })
        decoded_data = utils.decode_data(response.data)
        self.assertIn('token', json.loads(decoded_data))

    def test_get_auth_token_incorrect_credentials(self):
        user = utils.create_and_save_user()
        auth_header = utils.encode_info_basic_http_auth(user.username, 'wrongPass')
        response = self.client.post('/token/', headers={
            'Authorization': auth_header
        })

        self.assertEqual(response.status_code, 401)

    def test_get_all_users_from_admin_success(self):
        admin = utils.create_user_admin()
        usernames = ['u1', 'u2', 'u3']
        for u in usernames:
            utils.create_and_save_user(u, 'pass{}'.format(u))

        usernames.append('admin')

        token = admin.generate_rest_auth_token()
        response = self.client.get('/users/', headers={
            'Authorization': utils.encode_info_token_http_auth(token)
        })

        self.assertEqual(response.status_code, 200)
        users = json.loads(utils.decode_data(response.data))
        for u in users:
            self.assertIn(u['username'], usernames)

    def test_get_all_users_from_regular_user_error(self):
        usernames = ['u1', 'u2', 'u3']
        users = [utils.create_and_save_user(u, 'pass{}'.format(u))
                 for u in usernames]

        token = users[0].generate_rest_auth_token()
        response = self.client.get('/users/', headers={
            'Authorization': utils.encode_info_token_http_auth(token)
        })

        self.assertEqual(response.status_code, 401)

    def test_get_one_user_correct_id(self):
        u = utils.create_and_save_user('u1', 'pass_u1')
        token = u.generate_rest_auth_token()

        response = self.client.get('/users/{}/'.format(u.id), headers={
            'Authorization': utils.encode_info_token_http_auth(token)
        })

        self.assertEqual(response.status_code, 200)
        u_dict = json.loads(utils.decode_data(response.data))
        self.assertEqual(u_dict['username'], u.username)

    def test_get_one_user_other_user(self):
        u1 = utils.create_and_save_user('u1', 'pass_u1')
        u2 = utils.create_and_save_user('u2', 'pass_u2')
        token = u1.generate_rest_auth_token()

        response = self.client.get('/users/{}/'.format(u2.id), headers={
            'Authorization': utils.encode_info_token_http_auth(token)
        })

        self.assertEqual(response.status_code, 401)

    def test_update_user_with_user_manager(self):
        u_manager = utils.create_user_manager()
        u1 = utils.create_and_save_user('u1', 'pu1', 'Us1', 'Er1')
        u2 = utils.create_and_save_user('u2', 'pu2', 'Us2', 'Er2')

        token = u_manager.generate_rest_auth_token()
        headers = {
            'Authorization': utils.encode_info_token_http_auth(token)
        }

        for actual_u in [u1, u2]:
            new_first_name = 'Mod{}'.format(actual_u.first_name)
            new_last_name = 'Mod{}'.format(actual_u.last_name)
            update_data = {'first_name': new_first_name,
                           'last_name': new_last_name}
            response = self.client.put('/users/{}/'.format(actual_u.id),
                                       data=json.dumps(update_data),
                                       content_type='application/json',
                                       headers=headers)

            self.assertEqual(response.status_code, 201)
            u_from_db = User.query.get(actual_u.id)
            self.assertEqual(u_from_db.first_name, new_first_name)
            self.assertEqual(u_from_db.last_name, new_last_name)

    def test_delete_user_with_user_manager(self):
        u_manager = utils.create_user_manager()
        u1 = utils.create_and_save_user('u1', 'pu1', 'Us1', 'Er1')
        u2 = utils.create_and_save_user('u2', 'pu2', 'Us2', 'Er2')

        token = u_manager.generate_rest_auth_token()
        headers = {
            'Authorization': utils.encode_info_token_http_auth(token)
        }

        for actual_u in [u1, u2]:
            response = self.client.delete('/users/{}/'.format(actual_u.id),
                                          headers=headers)
            self.assertEqual(response.status_code, 204)
            self.assertIsNone(User.query.get(actual_u.id))
