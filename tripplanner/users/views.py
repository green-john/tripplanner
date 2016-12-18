from flask import Blueprint, request, jsonify, url_for, g
from flask_restful import abort
from flask_httpauth import HTTPBasicAuth, HTTPTokenAuth

from tripplanner import db
from tripplanner.users.models import User


user_app = Blueprint('user', __name__)
basic_auth = HTTPBasicAuth()
token_auth = HTTPTokenAuth(scheme='Token')


@user_app.route('/users/', methods=['POST'])
def register_user():
    username = request.get_json().get('username')
    password = request.get_json().get('password')

    if not username or not password or len(request.get_json()) > 2:
        abort(400)

    user = User(username, password)
    db.session.add(user)
    db.session.commit()

    return jsonify({'username': username}), 201


@user_app.route('/users/<int:_id>/')
def get_user(_id):
    user = User.query.get(_id)
    if not user:
        abort(400)

    return jsonify({'username': user.username})


@user_app.route('/users/')
def all_users():
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

