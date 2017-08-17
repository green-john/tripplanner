import base64

import datetime

from tripplanner import db
from tripplanner.users.models import User, Role
from tripplanner.trips.models import Trip


class MockDate(datetime.date):

    def __new__(cls, *args, **kwargs):
        return datetime.date.__new__(cls, *args, **kwargs)


def create_user(user='user1', password='pass1', first_name='Us', last_name='Ser'):
    return User(user, password, first_name, last_name)


def create_and_save_user(username='user1', password='pass1',
                         first_name='Us', last_name='Ser'):
    u = create_user(username, password, first_name, last_name)
    db.session.add(u)
    db.session.commit()

    return u


def encode_info_basic_http_auth(username, password):
    """
    Encodes the username and password to be sent in the `Authenticate`
    header in http using basic authentication.

    :param username: username
    :param password: password
    :return: encoded value for the http 'Authenticate' header
    """
    user_pass = '{}:{}'.format(username, password)
    user_pass = base64.b64encode(user_pass.encode('ascii')).decode('ascii')

    return 'Basic {}'.format(user_pass)


def encode_info_token_http_auth(token):
    """
    Encodes the token to be sent in the Authenticate header.
    :param token: token to be sent
    :return: the body of the `Authorization` header
    """
    return ' Token {}'.format(token.decode('ascii'))


def create_user_admin(username='admin', password='admin'):
    admin_user = create_and_save_user(username, password)
    admin_user.roles.append(Role.admin())
    db.session.add(admin_user)
    db.session.commit()

    return admin_user


def create_user_manager(username='manager', password='manager'):
    manager_user = create_and_save_user(username, password)
    manager_user.roles.append(Role.manager())
    db.session.add(manager_user)
    db.session.commit()

    return manager_user


def decode_data(encoded_data):
    return encoded_data.decode('UTF-8')


def create_and_save_trip(destination, start_date, end_date, comment, user):
    t = Trip(destination, start_date, end_date, comment, user)
    db.session.add(t)
    db.session.commit()
    return t


