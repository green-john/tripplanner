import datetime

from tripplanner import db, utils
from tripplanner.errors.validation import ValidationError
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
        Creates a new trip given its data. Assumes the given data is correct
        and has already been validated.
        """
        start_date, end_date = Trip.validate_data(destination, start_date, end_date)
        self.destination = destination
        self.start_date = start_date
        self.end_date = end_date
        self.comment = comment
        self.user = user

    def __repr__(self):
        return '<Trip destination:{} start:{} end:{}>'.format(self.destination,
                                                              self.start_date,
                                                              self.end_date)

    def update_from_dict(self, d):
        self.update(d.get('destination'), d.get('start_date'),
                    d.get('end_date'), d.get('comment'))

    def update(self, destination, start_date, end_date, comment):
        try:
            start_date, end_date = Trip.validate_data(destination, start_date, end_date)
            self.destination = destination
            self.start_date = start_date
            self.end_date = end_date
            self.comment = comment
        except ValidationError as err:
            raise err

    def as_dict(self):
        data = {
            'id': self.id,
            'destination': self.destination,
            'start_date': utils.print_date(self.start_date),
            'end_date': utils.print_date(self.end_date),
            'comment': self.comment
        }

        today = datetime.date.today()
        if self.start_date > today:
            data['days_left'] = (self.start_date - today).days

        return data

    @staticmethod
    def validate_data(destination, start_date, end_date):
        """
        Validates the date is correct. Raises ValidationError if:
            destination is empty or
            start_date or end_date have wrong format
            start_date >= end_date
            
        returns the parsed dates
        """
        if not destination or not destination.strip():
            raise ValidationError("Destination cannot be empty")

        try:
            start_date = utils.parse_date(start_date)
            end_date = utils.parse_date(end_date)
        except ValueError as err:
            raise ValidationError(str(err))

        if start_date > end_date:
            raise ValidationError("Start date must be before end date")

        return start_date, end_date

    @staticmethod
    def create_from_dict(d, user):
        destination = d.get('destination')
        start_date = d.get('start_date')
        end_date = d.get('end_date')
        comment = d.get('comment')

        try:
            return Trip(destination, start_date, end_date, comment, user)
        except ValidationError as err:
            raise err
