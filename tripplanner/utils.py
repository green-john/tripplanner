"""
Utils for the tripplanner app
"""
import calendar
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


def get_first_day_next_month(day):

    """
    Returns the next month given the current day
    :param day: 
    :return: 
    """
    last_day = calendar.monthrange(day.year, day.month)[1]
    one_day = datetime.timedelta(days=1)

    return datetime.date(day.year, day.month, last_day) + one_day


def get_last_day_of_month(day):
    """
    Given a day returns a day of the last day of the same month
    """
    last_day = calendar.monthrange(day.year, day.month)[1]
    return datetime.date(day.year, day.month, last_day)

