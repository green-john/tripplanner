from functools import wraps

from flask import g
from flask_restful import abort
from typing import List

from tripplanner import token_auth
from tripplanner.auth import ACCESS_DENIED_MSG
from tripplanner.users.models import Role, User


def allow_superuser_and_own(f):
    """
    Requires the user stored in the session to have any of the roles
    in `roles`. If the user does not have any of the roles, the
    request is aborted and a 401 is sent to the client.
    :param f: 
    :param roles: 
    :return: 
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        success = False

        def login(*args, **kwargs):
            nonlocal success
            success = True

        token_auth.login_required(login)(*args, **kwargs)
        if success:
            id_ = kwargs['_id']
            user: User = g.user
            if user.has_role(Role.manager()) or user.has_role(Role.admin()) or id_ == user.id:
                return f(*args, **kwargs)
            else:
                abort(401)
        return ACCESS_DENIED_MSG
    return decorated


def allow_superuser(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        success = False

        def login(*args, **kwargs):
            nonlocal success
            success = True

        token_auth.login_required(login)(*args, **kwargs)
        if success:
            user: User = g.user
            if user.has_role(Role.manager()) or user.has_role(Role.admin()):
                return f(*args, **kwargs)
            else:
                abort(401)
        return ACCESS_DENIED_MSG
    return decorated

