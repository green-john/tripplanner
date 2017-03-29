# We need this guys to run as soon as the auth module is imported
from flask import g

from tripplanner import basic_auth, token_auth
from tripplanner.users.models import User

ACCESS_DENIED_MSG = "Unauthorized Access"


@basic_auth.verify_password
def _verify_password(username, password):
    g.user = None
    user = User.query.filter_by(username=username).first()
    if not user or not user.verify_password(password):
        return False
    g.user = user
    return True


@token_auth.verify_token
def _verify_token(token):
    g.user = None
    u = User.get_user_given_rest_token(token)
    if u:
        g.user = u
        return True
    return False


@token_auth.error_handler
def _error_handler():
    return ACCESS_DENIED_MSG
