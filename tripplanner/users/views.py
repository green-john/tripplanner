from flask import Blueprint, request, jsonify, g, abort

from tripplanner import db, basic_auth, token_auth
from tripplanner.auth.decorators import allow_superuser_and_own, allow_superuser
from tripplanner.users.models import User

user_app = Blueprint('user', __name__)


@user_app.route('/users/', methods=['POST'])
def register_user():
    try:
        user = User.create_from_json(request.get_json())
    except ValueError:
        abort(400)

    db.session.add(user)
    db.session.commit()
    return jsonify({'id': user.id, 'username': user.username}), 201


@user_app.route('/users/<int:_id>/', methods=['GET'])
@allow_superuser_and_own
def get_user(_id):
    user = User.query.get(_id)
    if not user:
        abort(400)

    return jsonify({'username': user.username})


@user_app.route('/users/<int:_id>/', methods=['PUT'])
@allow_superuser_and_own
def update_user(_id):
    user = User.query.get(_id)

    # TODO move this the User class.
    new_first_name = request.get_json().get('first_name')
    new_last_name = request.get_json().get('last_name')
    new_username = request.get_json().get('username')

    changes = False
    if new_first_name:
        user.first_name = new_first_name
        changes = True

    if new_last_name:
        user.last_name = new_last_name
        changes = True

    if new_username:
        user.username = new_username
        changes = True

    if changes:
        try:
            db.session.add(user)
            db.session.commit()
        except:
            return jsonify({'errors': ['There was a problem updating the user']}), 400

    return jsonify({'id': user.id, 'username': user.username}), 204


@user_app.route('/users/<int:_id>/', methods=['DELETE'])
@allow_superuser_and_own
def delete_user(_id):
    User.query.filter_by(id=_id).delete()

    return jsonify({}), 204


@user_app.route('/users/', methods=['GET'])
@allow_superuser
def all_users():
    users = User.query.all()
    return jsonify([{'id': u.id, 'username': u.username} for u in users])


@user_app.route('/token/', methods=['POST'])
@basic_auth.login_required
def get_token():
    token = g.user.generate_rest_auth_token()
    return jsonify({'username': g.user.username,
                    'token': token.decode('ascii'),
                    'roles': [r.name for r in g.user.roles],
                    'id': g.user.id})
