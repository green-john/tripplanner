from flask import Blueprint, request, jsonify, g, abort
from flask_httpauth import HTTPBasicAuth, HTTPTokenAuth

from tripplanner import db
from tripplanner.users.models import User, Role


user_app = Blueprint('user', __name__)
basic_auth = HTTPBasicAuth()
token_auth = HTTPTokenAuth(scheme='Token')


def is_admin_or_manager(user):
    return user.is_admin() or user.is_manager()


@user_app.route('/users/', methods=['POST'])
def register_user():
    username = request.get_json().get('username')
    password = request.get_json().get('password')
    first_name = request.get_json().get('first_name')
    last_name = request.get_json().get('last_name')

    if (not username or not password or not first_name or
            not last_name or len(request.get_json()) > 4):
        abort(400)

    user = User(username, password, first_name, last_name)
    db.session.add(user)
    db.session.commit()

    return jsonify({'username': username}), 201


@user_app.route('/users/<int:_id>/', methods=['GET'])
@token_auth.login_required
def get_user(_id):
    if not is_admin_or_manager(g.user) and g.user.id != _id:
        abort(401)  # Users can only see themselves
    user = User.query.get(_id)
    if not user:
        abort(400)

    return jsonify({'username': user.username})


@user_app.route('/users/<int:_id>/', methods=['PUT'])
@token_auth.login_required
def update_user(_id):
    if not is_admin_or_manager(g.user) and g.user.id != _id:
        abort(401)  # Users can only update themselves
    user = User.query.get(_id)
    new_first_name = request.get_json().get('first_name')
    new_last_name = request.get_json().get('last_name')

    changes = False
    if new_first_name:
        user.first_name = new_first_name
        changes = True

    if new_last_name:
        user.last_name = new_last_name
        changes = True

    if changes:
        db.session.add(user)
        db.session.commit()

    return jsonify({}), 201


@user_app.route('/users/<int:_id>/', methods=['DELETE'])
@token_auth.login_required
def delete_user(_id):
    if not is_admin_or_manager(g.user) and g.user.id != _id:
        abort(401)  # Users can only see themselves
    User.query.filter_by(id=_id).delete()

    return jsonify({}), 204


@user_app.route('/users/', methods=['GET'])
@token_auth.login_required
def all_users():
    if not is_admin_or_manager(g.user):
        return abort(401)
    users = User.query.all()
    return jsonify([{'username': u.username} for u in users])


@user_app.route('/token/', methods=['POST'])
@basic_auth.login_required
def get_token():
    token = g.user.generate_rest_auth_token()
    return jsonify({'token': token.decode('ascii')})


@basic_auth.verify_password
def verify_password(username, password):
    g.user = None
    user = User.query.filter_by(username=username).first()
    if not user or not user.verify_password(password):
        return False
    g.user = user
    return True


@token_auth.verify_token
def verify_token(token):
    g.user = None
    u = User.get_user_given_rest_token(token)
    if u:
        g.user = u
        return True
    return False

