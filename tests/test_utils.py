import base64

from tripplanner import db
from tripplanner.users.models import User, Role


def create_user(user='user1', password='pass1'):
    return User(user, password)


def create_and_save_user(username='user1', password='pass1'):
    u = create_user(username, password)
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
