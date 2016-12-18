"""
Utils for the tripplanner app
"""

from passlib.apps import custom_app_context


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
