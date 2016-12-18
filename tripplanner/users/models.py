from flask import current_app
from itsdangerous import TimedJSONWebSignatureSerializer, BadSignature, SignatureExpired

from tripplanner import db, utils


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    username = db.Column(db.String(255), nullable=False, index=True, unique=True)
    password = db.Column(db.String(255), nullable=False, server_default='')

    def __init__(self, username, raw_password):
        self.username = username
        self.password = utils.hash_password(raw_password)

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
