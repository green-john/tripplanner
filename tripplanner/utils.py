"""
Utils for the tripplanner app
"""
import datetime
from passlib.apps import custom_app_context

DATE_FORMAT = '%d/%m/%Y'


def hash_password(password):
    """
    Returns the hash of the password using a good hashing algorithm
    :param password: raw password
    :return: hashed password
    """
    return custom_app_context.hash(password)


def verify_password(raw_password, hashed_password):
    """
    Verifies that the password is correct given the hashed password.
    :param raw_password: plain password to verify
    :param hashed_password: Hashed password stored in the db
    :return: `True` if passwords match. `False` otherwise
    """
    return custom_app_context.verify(raw_password, hashed_password)


def parse_date(any_date):
    """
    Parses the given date in the specified format. If the date
    is not in the given format, raises an error.
    :param any_date: the date in the given format
    :return: the date
    """
    try:
        return datetime.datetime.strptime(any_date, DATE_FORMAT).date()
    except ValueError:
        raise


def print_date(any_date):
    """
    Returns the date in the given formatting
    :param any_date: the date
    :return: a string representing the date
    """
    return any_date.strftime(DATE_FORMAT)
