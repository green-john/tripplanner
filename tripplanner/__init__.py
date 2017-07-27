from flask import Flask
from flask_mail import Mail
from flask_sqlalchemy import SQLAlchemy
from flask_httpauth import HTTPBasicAuth, HTTPTokenAuth

from tripplanner.config import config

db = SQLAlchemy()
mail = Mail()
basic_auth = HTTPBasicAuth()
token_auth = HTTPTokenAuth(scheme='Token')


def create_app(config_name):
    """
    Creates the application with the specified configuration
    :param config_name: name of the configuration to use
    :return: application initialized
    """
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    app.url_map.strict_slashes = False

    # Imports here to avoid circular imports
    from tripplanner.users.views import user_app
    from tripplanner.core.views import core_app
    app.register_blueprint(core_app)
    app.register_blueprint(user_app)

    mail.init_app(app)
    db.init_app(app)

    return app
