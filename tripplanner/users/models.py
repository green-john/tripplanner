from flask import current_app
from itsdangerous import TimedJSONWebSignatureSerializer, BadSignature, SignatureExpired

from tripplanner import db, utils


class Role(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), unique=True, index=True)

    def __repr__(self):
        return '<Role {}>'.format(self.name)

    @staticmethod
    def create_roles():
        admin_role = Role(name="admin")
        manager_role = Role(name="manager")
        regular_role = Role(name="regular")

        db.session.add_all([admin_role, manager_role, regular_role])
        db.session.commit()

    @staticmethod
    def admin():
        return Role.query.filter_by(name='admin').first()

    @staticmethod
    def manager():
        return Role.query.filter_by(name='manager').first()

    @staticmethod
    def regular():
        return Role.query.filter_by(name='regular').first()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    username = db.Column(db.String(255), nullable=False, index=True, unique=True)
    password = db.Column(db.String(255), nullable=False, server_default='')

    first_name = db.Column(db.String(255))
    last_name = db.Column(db.String(255))

    roles = db.relationship('Role', secondary='user_roles', backref=db.backref('users',
                                                                               lazy='dynamic'))

    def __init__(self, username, raw_password, first_name, last_name):
        self.username = username
        self.password = utils.hash_password(raw_password)
        self.first_name = first_name
        self.last_name = last_name
        self.roles.append(Role.regular())

    def verify_password(self, raw_password):
        return utils.verify_password(raw_password, self.password)

    def generate_rest_auth_token(self, expiration=600):
        """
        Generates a token for the user to authenticate on REST requests.
        :return: token for the user to authenticate
        """
        s = TimedJSONWebSignatureSerializer(current_app.config['SECRET_KEY'],
                                            expires_in=expiration)
        return s.dumps({'id': self.id})

    def is_admin(self):
        return Role.admin() in self.roles

    def is_manager(self):
        return Role.manager() in self.roles

    def is_regular(self):
        return Role.regular() in self.roles

    def has_role(self, role: Role):
        return role in self.roles

    @staticmethod
    def get_user_given_rest_token(token):
        """
        Returns the user given its encrypted token, otherwise
        raises an error indicating the token is invalid or
        has expired
        :param token: encrypted auth token with user id
        :param expiration: time for which the token is valid
        :return: user with the decrypted id or None if token is invalid
        """
        s = TimedJSONWebSignatureSerializer(current_app.config['SECRET_KEY'])
        try:
            data = s.loads(token)
        except SignatureExpired:
            raise  # re-raise the last exception
        except BadSignature:
            return None  # Bad signature. Return None

        user = User.query.get(data['id'])
        return user

    @staticmethod
    def create_from_json(json):
        """
        Creates a user given a json dict. The dict must contain username,
        password, first and last name to be a valid user. If any validation
        fails, a validation error would be thrown.
        :param json: dict representing a user
        :return: new user create or error
        """
        username = json.get('username')
        password = json.get('password')
        first_name = json.get('first_name')
        last_name = json.get('last_name')

        if not username or not password or not first_name or not last_name:
            raise ValueError("Users must have username, password, first name and last")

        return User(username, password, first_name, last_name)

    def __repr__(self):
        return '<User {}>'.format(self.username)


class UserRoles(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'))
    role_id = db.Column(db.Integer, db.ForeignKey('role.id', ondelete='CASCADE'))
