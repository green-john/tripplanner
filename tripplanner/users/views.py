from flask import Blueprint, request, jsonify, g, abort

from tripplanner import db, basic_auth, token_auth
from tripplanner.auth.decorators import allow_superuser
from tripplanner.errors.validation import ValidationError
from tripplanner.users.models import User

user_app = Blueprint('user', __name__)


@user_app.route('/api/v1/users/', methods=['POST'])
def register_user():
    user = None
    try:
        user = User.create_from_json(request.get_json())
    except ValidationError:
        abort(400)

    if user:
        db.session.add(user)
        db.session.commit()
        return jsonify(user.as_dict()), 201


@user_app.route('/api/v1/users/<int:_id>/', methods=['GET'])
@token_auth.login_required
@allow_superuser(allow_owner=True)
def get_user(_id):
    user = User.query.get(_id)
    if not user:
        abort(400)

    return jsonify(user.as_dict())


@user_app.route('/api/v1/users/<int:_id>/', methods=['PUT'])
@token_auth.login_required
@allow_superuser(True)
def update_user(_id):
    try:
        user = User.query.get(_id)
        user.update_from_dict(request.get_json())
        db.session.add(user)
        db.session.commit()
    except ValidationError as err:
        return jsonify({'error': [f'Error validating input data: {err.get_error_message()}']}), 400
    except:
        db.session.rollback()
        return jsonify({'error': ['There was a problem updating the user']}), 400

    return jsonify(user.as_dict()), 204


@user_app.route('/api/v1/users/<int:_id>/', methods=['DELETE'])
@token_auth.login_required
@allow_superuser(True)
def delete_user(_id):
    User.query.filter_by(id=_id).delete()

    return jsonify({}), 204


@user_app.route('/api/v1/users/', methods=['GET'])
@token_auth.login_required
@allow_superuser()
def all_users():
    users = User.query.all()
    return jsonify([u.as_dict() for u in users])


@user_app.route('/api/v1/get_info/', methods=['POST'])
@token_auth.login_required
@allow_superuser(True)
def get_user_given_token():
    return jsonify(g.user.as_dict())


@user_app.route('/api/v1/token/', methods=['POST'])
@basic_auth.login_required
def get_token():
    g.user.generate_rest_auth_token()
    return jsonify(g.user.as_dict())
