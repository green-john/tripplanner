import datetime
import unittest

from flask import json
from nose2.tools import params

from tests import utils
from tripplanner import create_app, db
from tripplanner.users.models import Role
from tripplanner.core.models import Trip


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
        trip_dict = {'destination': 'Country1', 'start_date': '01/01/2017',
                     'end_date': '01/02/2017', 'comment': 'Very Nice',
                     'user_id': user.id}
        token = user.generate_rest_auth_token()
        headers = {'Authorization': utils.encode_info_token_http_auth(token)}
        response = self.client.post('/trips/', data=json.dumps(trip_dict),
                                    headers=headers, content_type='application/json')

        self.assertEqual(response.status_code, 201)
        trip = Trip.query.get(json.loads(utils.decode_data(response.data))['id'])
        self.assertEqual(trip.start_date, datetime.date(2017, 1, 1))
        self.assertEqual(trip.end_date, datetime.date(2017, 2, 1))

    @params('a/a/b', '-2/3/1234', '32/10/20111', '30/13/2011')
    def test_create_trip_bad_date_format(self, start_date):
        user = utils.create_and_save_user()
        trip_dict = {'destination': 'Country1', 'start_date': start_date,
                     'end_date': '10/12/2017', 'comment': 'Very Nice',
                     'user_id': user.id}
        token = user.generate_rest_auth_token()
        headers = {'Authorization': utils.encode_info_token_http_auth(token)}
        response = self.client.post('/trips/', data=json.dumps(trip_dict),
                                    headers=headers, content_type='application/json')

        data = json.loads(utils.decode_data(response.data))

        self.assertEqual(response.status_code, 400)
        self.assertIn('start_date has the wrong format. Must be dd/mm/YYYY',
                      data['errors'])

    def test_create_trip_by_regular_user_on_behalf_of_other_user_fail(self):
        user1 = utils.create_and_save_user('u1', 'pu1')
        user2 = utils.create_and_save_user('u2', 'pu2')
        trip_dict = {'destination': 'Country1', 'start_date': '01/01/2017',
                     'end_date': '01/02/2017', 'comment': 'Very Nice',
                     'user_id': user2.id}
        token = user1.generate_rest_auth_token()
        headers = {'Authorization': utils.encode_info_token_http_auth(token)}
        response = self.client.post('/trips/', data=json.dumps(trip_dict),
                                    headers=headers, content_type='application/json')

        self.assertEqual(response.status_code, 401)

    def test_create_trip_by_admin_user_on_behalf_of_other_user_success(self):
        user1 = utils.create_and_save_user('u1', 'pu1')
        user_admin = utils.create_user_admin('u2', 'pu2')
        trip_dict = {'destination': 'Country1', 'start_date': '01/01/2017',
                     'end_date': '01/02/2017', 'comment': 'Very Nice',
                     'user_id': user1.id}
        token = user_admin.generate_rest_auth_token()
        headers = {'Authorization': utils.encode_info_token_http_auth(token)}
        response = self.client.post('/trips/', data=json.dumps(trip_dict),
                                    headers=headers, content_type='application/json')

        self.assertEqual(response.status_code, 201)

    def test_create_trip_non_existent_user_id(self):
        user_admin = utils.create_user_admin('u1', 'pu1')
        trip_dict = {'destination': 'Country1', 'start_date': '01/01/2017',
                     'end_date': '01/02/2017', 'comment': 'Very Nice',
                     'user_id': '5'}
        token = user_admin.generate_rest_auth_token()
        headers = {'Authorization': utils.encode_info_token_http_auth(token)}
        response = self.client.post('/trips/', data=json.dumps(trip_dict),
                                    headers=headers, content_type='application/json')

        self.assertEqual(response.status_code, 404)

    def test_list_trips_admin_user_future_and_past_trips(self):
        user_admin = utils.create_user_admin()

        for day in [1, 2, 3]:
            utils.create_and_save_trip('D{}'.format(day), '{}/1/2016'.format(day),
                                       '{}/02/2016'.format(day), 'Test trip', user_admin)

        for day in [1, 2, 3]:
            utils.create_and_save_trip('D{}'.format(day), '{}/1/2017'.format(day),
                                       '{}/02/2017'.format(day), 'Test trip', user_admin)

        headers = {'Authorization': utils.encode_info_token_http_auth(
            user_admin.generate_rest_auth_token())}

        response = self.client.get('/trips/', headers=headers)
        self.assertEqual(response.status_code, 200)

        date_order = ['03/01/2017', '02/01/2017', '01/01/2017',
                      '03/01/2016', '02/01/2016', '01/01/2016']
        data = json.loads(utils.decode_data(response.data))
        for i in range(3):
            self.assertTrue(data[i].get('days_left'))
            self.assertEqual(data[i]['start_date'], date_order[i])

        for i in range(3, 6):
            self.assertFalse(data[i].get('days_left'))
            self.assertEqual(data[i]['start_date'], date_order[i])

    def test_filter_trips_by_destination(self):
        user_admin = utils.create_user_admin()
        headers = {'Authorization': utils.encode_info_token_http_auth(
            user_admin.generate_rest_auth_token())}
        #  Dict used to insert records. Key is the destination, value is how many
        #  records to insert
        records_to_insert = {'DEST1': 2, 'DEST2': 3, 'DEST3': 1}
        for dest, count in records_to_insert.items():
            for _ in range(count):
                utils.create_and_save_trip('{}'.format(dest), '1/1/2016',
                                           '01/02/2016', 'Test trip', user_admin)

        for dest, count in records_to_insert.items():
            query = {'destination': dest}
            response = self.client.post('/trips/filter/', data=json.dumps(query),
                                        headers=headers, content_type='application/json')

            self.assertEqual(response.status_code, 200)
            data = json.loads(utils.decode_data(response.data))
            self.assertEqual(len(data), count)

    def test_filter_trips_by_start_date(self):
        user_admin = utils.create_user_admin()
        headers = {'Authorization': utils.encode_info_token_http_auth(
            user_admin.generate_rest_auth_token())}
        #  Dict used to insert records. Key is the destination, value is how many
        #  records to insert
        records_to_insert = {'01/02/2016': 2, '02/02/2016': 3, '03/02/2016': 1}
        for start_date, count in records_to_insert.items():
            for _ in range(count):
                utils.create_and_save_trip('test dest', '{}'.format(start_date),
                                           '01/02/2016', 'Test trip', user_admin)

        for start_date, count in records_to_insert.items():
            query = {'start_date': start_date}
            response = self.client.post('/trips/filter/', data=json.dumps(query),
                                        headers=headers, content_type='application/json')

            self.assertEqual(response.status_code, 200)
            data = json.loads(utils.decode_data(response.data))
            self.assertEqual(len(data), count)

    def test_filter_trips_by_end_date(self):
        user_admin = utils.create_user_admin()
        headers = {'Authorization': utils.encode_info_token_http_auth(
            user_admin.generate_rest_auth_token())}
        #  Dict used to insert records. Key is the destination, value is how many
        #  records to insert
        records_to_insert = {'01/02/2016': 2, '02/02/2016': 3, '03/02/2016': 1}
        for end_date, count in records_to_insert.items():
            for _ in range(count):
                utils.create_and_save_trip('test dest', '01/02/2016',
                                           '{}'.format(end_date), 'Test trip', user_admin)

        for end_date, count in records_to_insert.items():
            query = {'end_date': end_date}
            response = self.client.post('/trips/filter/', data=json.dumps(query),
                                        headers=headers, content_type='application/json')

            self.assertEqual(response.status_code, 200)
            data = json.loads(utils.decode_data(response.data))
            self.assertEqual(len(data), count)

    def test_get_itinerary_for_next_month(self):
        user_admin = utils.create_user_admin()
        headers = {'Authorization': utils.encode_info_token_http_auth(
            user_admin.generate_rest_auth_token())}
        for _ in range(5):
            today = datetime.date.today()
            if today.month == 12:
                next_month = datetime.date(today.year + 1, 1, 1)
            else:
                next_month = datetime.date(today.year, today.month + 1, 1)
            next_month = next_month.strftime("%d/%m/%Y")
            utils.create_and_save_trip('TEST', next_month, next_month, 'TEST', user_admin)

        for _ in range(5):
            today = datetime.date.today().strftime("%d/%m/%Y")
            utils.create_and_save_trip('TEST', today, today, 'TEST', user_admin)

        response = self.client.get('/trips/next_month/', headers=headers)
        self.assertEqual(response.status_code, 200)
        data = json.loads(utils.decode_data(response.data))

        self.assertEqual(len(data), 5)

