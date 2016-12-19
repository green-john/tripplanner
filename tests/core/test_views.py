import datetime
import unittest

from flask import json

from tests import utils
from tripplanner import create_app, db
from tripplanner.users.models import Role


class TestCoreViews(unittest.TestCase):

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

    def test_create_trip(self):
        user = utils.create_and_save_user()
        trip_dict = {'destination': 'Country1', 'start_date': datetime.date(2017, 1, 1),
                     'end_date': datetime.date(2017, 2, 1), 'comment': 'Very Nice',
                     'user_id': user.id}
        token = user.generate_rest_auth_token()
        headers = {'Authorization': utils.encode_info_token_http_auth(token)}
        response = self.client.post('/trips/', data=json.dumps(trip_dict),
                                    headers=headers, content_type='application/json')

        self.assertEqual(response.status_code, 201)

    def test_create_trip_by_regular_user_on_behalf_of_other_user_fail(self):
        user1 = utils.create_and_save_user('u1', 'pu1')
        user2 = utils.create_and_save_user('u2', 'pu2')
        trip_dict = {'destination': 'Country1', 'start_date': datetime.date(2017, 1, 1),
                     'end_date': datetime.date(2017, 2, 1), 'comment': 'Very Nice',
                     'user_id': user2.id}
        token = user1.generate_rest_auth_token()
        headers = {'Authorization': utils.encode_info_token_http_auth(token)}
        response = self.client.post('/trips/', data=json.dumps(trip_dict),
                                    headers=headers, content_type='application/json')

        self.assertEqual(response.status_code, 401)

    def test_create_trip_by_admin_user_on_behalf_of_other_user_success(self):
        user1 = utils.create_and_save_user('u1', 'pu1')
        user_admin = utils.create_user_admin('u2', 'pu2')
        trip_dict = {'destination': 'Country1', 'start_date': datetime.date(2017, 1, 1),
                     'end_date': datetime.date(2017, 2, 1), 'comment': 'Very Nice',
                     'user_id': user1.id}
        token = user_admin.generate_rest_auth_token()
        headers = {'Authorization': utils.encode_info_token_http_auth(token)}
        response = self.client.post('/trips/', data=json.dumps(trip_dict),
                                    headers=headers, content_type='application/json')

        self.assertEqual(response.status_code, 201)

    def test_create_trip_non_existent_user_id(self):
        user_admin = utils.create_user_admin('u1', 'pu1')
        trip_dict = {'destination': 'Country1', 'start_date': datetime.date(2017, 1, 1),
                     'end_date': datetime.date(2017, 2, 1), 'comment': 'Very Nice',
                     'user_id': '5'}
        token = user_admin.generate_rest_auth_token()
        headers = {'Authorization': utils.encode_info_token_http_auth(token)}
        response = self.client.post('/trips/', data=json.dumps(trip_dict),
                                    headers=headers, content_type='application/json')

        self.assertEqual(response.status_code, 404)
