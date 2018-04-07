from flask import current_app
from itsdangerous import TimedJSONWebSignatureSerializer, BadSignature, SignatureExpired

from tripplanner import db, utils
from tripplanner.errors.validation import ValidationError


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
    token = db.Column(db.String(255), nullable=True)

    first_name = db.Column(db.String(255))
    last_name = db.Column(db.String(255))

    roles = db.relationship('Role', secondary='user_roles', backref=db.backref('users',
                                                                               lazy='dynamic'))

    def __init__(self, username, raw_password, first_name, last_name):
        self.username = username
        self.password = utils.hash_password(raw_password)
        self.first_name = first_name
        self.last_name = last_name
        self.token = ''
        self.roles.append(Role.regular())

    def verify_password(self, raw_password):
        return utils.verify_password(raw_password, self.password)

    def generate_rest_auth_token(self, expiration=None):
        """
        Generates a token for the user to authenticate on REST requests.
        :return: token for the user to authenticate
        """
        s = TimedJSONWebSignatureSerializer(current_app.config['SECRET_KEY'],
                                            expires_in=expiration)
        self.token = s.dumps({'id': self.id}).decode('utf-8')
        self.save()
        return self.token

    def update_from_dict(self, new_data):
        return self.update(new_data.get('first_name'), new_data.get('last_name'))

    def save(self):
        db.session.add(self)
        db.session.commit()

    def update(self, first_name, last_name):
        """
        Updates User's information. Usernames cannot be updated.
        """
        try:
            User.validate_fields(first_name=first_name,
                                 last_name=last_name)

            self.first_name = first_name
            self.last_name = last_name
        except ValidationError as err:
            raise err

    def is_admin(self):
        return self.has_role(Role.admin())

    def is_manager(self):
        return self.has_role(Role.manager())

    def is_superuser(self):
        return self.is_admin() or self.is_manager()

    def is_regular(self):
        return self.has_role(Role.regular())

    def has_role(self, role):
        return role in self.roles

    def get_token(self):
        return self.token

    def as_dict(self):
        return {
            'id': self.id,
            'token': self.token,
            'roles': [r.name for r in self.roles],
            'username': self.username
        }

    @staticmethod
    def get_user_given_rest_token(token):
        """
        Returns the user given its encrypted token, otherwise
        raises an error indicating the token is invalid or
        has expired
        :param token: encrypted login token with user id
        :return: user with the decrypted id or None if token is invalid
        """
        s = TimedJSONWebSignatureSerializer(current_app.config['SECRET_KEY'])
        try:
            data = s.loads(token)
        except (SignatureExpired, BadSignature):
            return None  # Bad signature. Return None

        user = User.query.get(data['id'])
        return user

    @staticmethod
    def validate_fields(**kwargs):
        """
        Validates that the fields are not empty. If any of them are,
        raises ValueError
        """
        fields: dict = {"first_name": kwargs['first_name'],
                        "last_name": kwargs['last_name']}
        empties = []

        for fn, fv in fields.items():
            if not fv or not fv.strip():
                empties.append(fn)

        if empties:
            if len(empties) == 1:
                e_to_print = empties[0]
            else:
                e_to_print = "{} and {}".format(", ".join(empties[:-1]),
                                                empties[-1])

            raise ValidationError(f"{e_to_print} cannot be emtpy.")

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

        try:
            User.validate_fields(username=username,
                                 first_name=first_name,
                                 last_name=last_name)
        except ValidationError as err:
            raise err

        if not password.strip():
            raise ValidationError("Password cannot be empty")

        return User(username, password, first_name, last_name)

    def __repr__(self):
        return '<User {}>'.format(self.username)


class UserRoles(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'))
    role_id = db.Column(db.Integer, db.ForeignKey('role.id', ondelete='CASCADE'))
