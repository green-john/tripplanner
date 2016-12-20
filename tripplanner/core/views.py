import calendar
import datetime
import os

from flask import (Blueprint, request, abort, g, jsonify, send_file,
                   send_from_directory)

from tripplanner import db, token_auth, utils
from tripplanner.core.models import Trip
from tripplanner.users.models import User

core_app = Blueprint('core', __name__)

# Error messages
WRONG_DATE_ERROR_MSG = 'start_date has the wrong format. Must be dd/mm/YYYY'


@core_app.route('/')
def index_page_redirect_to_angular(**kwargs):
    return send_file('templates/index.html')


@core_app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join('tripplanner', 'static'),
                               'img/favicon.ico')


@core_app.errorhandler(404)
def page_not_found(e):
    return send_file('templates/404.html'), 404


@core_app.route('/trips/', methods=['POST'])
@token_auth.login_required
def create_trip():
    destination = request.get_json().get('destination')
    start_date = request.get_json().get('start_date')
    end_date = request.get_json().get('end_date')
    comment = request.get_json().get('comment')
    user_id = request.get_json().get('user_id')

    if (not destination or not start_date or not end_date or
            not comment or not user_id or len(request.get_json()) > 5):
        return abort(401)

    user = User.query.get(user_id)
    if not user:
        return abort(404)

    if not g.user.is_admin() and g.user.id != user_id:
        return abort(401)

    try:
        t = Trip(destination, start_date, end_date, comment, user)
        db.session.add(t)
        db.session.commit()
    except ValueError:
        return jsonify({'errors': [WRONG_DATE_ERROR_MSG]}), 400

    return jsonify({'id': t.id, 'destination': t.destination,
                    'start_date': t.start_date}), 201


@core_app.route('/trips/', methods=['GET'])
@token_auth.login_required
def get_all_trips():
    records = sorted(g.user.trips, key=lambda x: x.start_date,
                     reverse=True)
    today = datetime.date.today()
    response = []
    for r in records:
        response.append({'id': r.id, 'destination': r.destination,
                         'start_date': utils.print_date(r.start_date)})
        if r.start_date > today:
            response[-1]['days_left'] = (r.start_date - today).days

    return jsonify(response)


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
    new_year = today.year
    new_month = today.month + 1
    if new_month == 13:
        new_year += 1
        new_month = 1

    days_in_month = calendar.monthrange(new_year, new_month)[1]
    beg_next_month = datetime.date(new_year, new_month, 1)
    end_next_month = datetime.date(new_year, new_month, days_in_month)

    trips = g.user.trips.filter(Trip.start_date.between(beg_next_month, end_next_month))

    response = []
    for t in trips.all():
        response.append({'id': t.id, 'destination': t.destination,
                         'start_date': utils.print_date(t.start_date),
                         'end_date': utils.print_date(t.end_date),
                         'comment': t.comment})

    return jsonify(response)
