import time
import unittest

from itsdangerous import SignatureExpired

from tripplanner import db, create_app, utils
from tripplanner.users.models import User, Role


def create_user():
    return User('user1', 'pass')


def create_and_save_user():
    u = User('user1', 'pass')
    db.session.add(u)
    db.session.commit()

    return u


class TestUser(unittest.TestCase):

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

    def test_password_is_hashed(self):
        u = create_user()
        self.assertNotEqual(u.password, 'pass')

    def test_validate_password(self):
        u = create_user()
        self.assertTrue(u.verify_password('pass'))

    def test_generate_rest_token_happy(self):
        expected_user = create_and_save_user()

        user_token = expected_user.generate_rest_auth_token()

        actual_user = User.get_user_given_rest_token(user_token)
        self.assertEqual(expected_user.id, actual_user.id)

    def test_generate_rest_token_timeout(self):
        exp_time = 1
        expected_user = create_and_save_user()

        token = expected_user.generate_rest_auth_token(exp_time)
        time.sleep(2)

        with self.assertRaises(SignatureExpired):
            User.get_user_given_rest_token(token)

    def test_generate_rest_token_bad_token(self):
        actual_user = User.get_user_given_rest_token('phony_token2123345wafweqrfds')
        self.assertIsNone(actual_user)

    def test_add_roles_to_user(self):
        user = create_and_save_user()
        user.roles.append(Role.ADMIN)
        db.session.add(user)
        db.session.commit()

        actual_user = User.query.get(user.id)
        self.assertIn(Role.ADMIN, actual_user.roles)
        self.assertIn(Role.REGULAR, actual_user.roles)  # All have this by default
