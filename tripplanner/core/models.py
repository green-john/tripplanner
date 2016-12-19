from tripplanner import db, utils
from tripplanner.users.models import User


class Trip(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    destination = db.Column(db.String(64))
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    comment = db.Column(db.String(500))

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    user = db.relationship(User, backref=db.backref('trips', lazy='dynamic'))

    def __init__(self, destination, start_date, end_date, comment, user):
        """
        Creates a new trip. `user_id` must be a valid ID in the DB.

        """
        self.destination = destination
        self.start_date = utils.parse_date(start_date)
        self.end_date = utils.parse_date(end_date)
        self.comment = comment
        self.user = user

    def __repr__(self):
        return '<Trip destination:{} start:{} end:{}>'.format(self.destination,
                                                              self.start_date,
                                                              self.end_date)
