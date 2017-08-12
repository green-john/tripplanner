import os
basedir = os.path.abspath(os.path.dirname(__file__))


class Config:
    SECRET_KEY = 'a man a plan a canal panama'
    SQLALCHEMY_COMMIT_ON_TEARDOWN = True
    SQLALCHEMY_RECORD_QUERIES = True
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
    STATIC_FOLDER = "webapp/"
    STATIC_URL_PATH = "/webapp"
    MAIL_USERNAME = 'andresfeliperu@gmail.com'
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')
    MAIL_DEFAULT_SENDER = '"Sender" <noreply@asdf.com>'
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 465
    MAIL_USE_SSL = True
    MAIL_USE_TSL = False


class DevConfig(Config):
    DEBUG = True


class TestConfig(Config):
    TESTING = True

config = {
    'dev': DevConfig,
    'test': TestConfig
}
