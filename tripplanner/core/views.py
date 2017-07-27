import calendar
import datetime
import os

from flask import (Blueprint, request, abort, g, jsonify, send_file,
                   send_from_directory)

from tripplanner import db, token_auth, utils
from tripplanner.auth.decorators import allow_superusers_only, allow_superuser_and_owner
from tripplanner.core.models import Trip
from tripplanner.errors.validation import ValidationError
from tripplanner.users.models import User

core_app = Blueprint('core', __name__)

# Error messages
WRONG_DATE_ERROR_MSG = 'start_date has the wrong format. Must be dd/mm/YYYY'


@core_app.route('/', defaults={'path': ''})
@core_app.route('/<path:path>')
def catch_all(path):
    return send_file('static/templates/base.html')


@core_app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join('tripplanner', 'static'),
                               'img/favicon.ico')


@core_app.errorhandler(404)
def page_not_found(e):
    return send_file('static/templates/404.html'), 404


@core_app.route('/all_trips/', methods=['GET'])
@allow_superusers_only
def get_all_trips():
    trips = Trip.query.all()

    response = []
    for t in trips:
        response.append({'id': t.id, 'destination': t.destination,
                         'start_date': utils.print_date(t.start_date),
                         'end_date': utils.print_date(t.end_date),
                         'comment': t.comment})

    return jsonify(response)


@core_app.route('/trips/', methods=['POST'])
@token_auth.login_required
def create_trip():
    user_id = request.get_json().get('user_id')
    user = User.query.get(user_id)
    if not user:
        return abort(404)

    if not _is_authorised(user_id):
        return abort(401)

    try:
        t = Trip.create_from_dict(request.get_json(), user)

        # Maybe have an object in charged of talking to DB.
        db.session.add(t)
        db.session.commit()
    except ValidationError as err:
        return jsonify({'error': err.get_error_message()}), 400

    return jsonify({'id': t.id, 'destination': t.destination,
                    'start_date': t.start_date}), 201


@core_app.route('/trips/', methods=['GET'])
@token_auth.login_required
def get_all_user_trips():
    user_trips = sorted(g.user.trips, key=lambda x: x.start_date, reverse=True)
    today = datetime.date.today()
    response = []
    for r in user_trips:
        response.append({'id': r.id, 'destination': r.destination,
                         'start_date': utils.print_date(r.start_date)})
        if r.start_date > today:
            response[-1]['days_left'] = (r.start_date - today).days

    return jsonify(response)


@core_app.route('/trips/<_id>/', methods=['PUT'])
@token_auth.login_required
def modify_trip(_id):
    trip = Trip.query.get(_id)
    if not _is_authorised(trip.user.id):
        return abort(401)

    try:
        trip.update_from_dict(request.get_json())
        db.session.add(trip)
        db.session.commit()
        return jsonify({'id': trip.id, 'destination': trip.destination,
                        'start_date': utils.print_date(trip.start_date),
                        'end_date': utils.print_date(trip.end_date),
                        'comment': trip.comment}), 204
    except ValidationError as err:
        return jsonify({'error': [f'Error validating input data: {err.get_error_message()}']}), 400
    except:
        db.session.rollback()
        return jsonify({'error': ['There was a problem updating the user']}), 400


@core_app.route('/trips/filter/', methods=['POST'])
@token_auth.login_required
def filter_trips():
    destination = request.get_json().get('destination')
    start_date = request.get_json().get('start_date')
    end_date = request.get_json().get('end_date')

    trips = g.user.trips
    if destination:
        trips = trips.filter_by(destination=destination)

    if start_date:
        trips = trips.filter_by(start_date=utils.parse_date(start_date))

    if end_date:
        trips = trips.filter_by(end_date=utils.parse_date(end_date))

    response = []
    for t in trips.all():
        response.append({'id': t.id, 'destination': t.destination,
                         'start_date': utils.print_date(t.start_date),
                         'end_date': utils.print_date(t.end_date),
                         'comment': t.comment})

    return jsonify(response)


@core_app.route('/trips/next_month/', methods=['GET'])
@token_auth.login_required
def get_trips_next_month():
    today = datetime.date.today()
    beg_next_month = utils.get_first_day_next_month(today)
    end_next_month = utils.get_last_day_of_month(beg_next_month)

    trips = g.user.trips.filter(Trip.start_date.between(beg_next_month, end_next_month))

    response = []
    for t in trips.all():
        response.append({'id': t.id, 'destination': t.destination,
                         'start_date': utils.print_date(t.start_date),
                         'end_date': utils.print_date(t.end_date),
                         'comment': t.comment})
    return jsonify(response)


def _is_authorised(user_id: str):
    return g.user.is_admin() or g.user.id == user_id


"""
TODO

* Create error page for bad authentication.
* Do role checking with decorators instead of if/elses
* For create_trip improve validation. Maybe add a method to the Trip class.
* Change GET /trips to return all trips and create a new endpoint to return the upcoming trips
* Abstract check for user editing their own trips into a decorator.
"""