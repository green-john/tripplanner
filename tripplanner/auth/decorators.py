from functools import wraps

from flask import g
from flask_restful import abort


def allow_superuser(allow_owner=False):
    def out_dec(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            id_ = kwargs.get('_id', '')
            user = g.user
            if user.is_admin() or (allow_owner and id_ == user.id):
                return f(*args, **kwargs)
            else:
                abort(401)
        return decorated
    return out_dec
