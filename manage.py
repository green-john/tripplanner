#!/usr/bin/env python
import os
import datetime
from subprocess import run
from flask_script import Manager, Shell

from tripplanner import create_app, db, utils
from tripplanner.users.models import User, Role
from tripplanner.core.models import Trip

app = create_app('dev')
manager = Manager(app)


def make_shell_context():
    return {'app': app, 'db': db}


manager.add_command('shell', Shell(make_context=make_shell_context))


@manager.command
def tests():
    run('nose2')


@manager.command
def js_tests():
    os.chdir('tripplanner/webapp/js')
    run(['./node_modules/.bin/nps', 'test'])


@manager.command
def all_tests():
    res = run('nose2')
    if res.returncode == 0:
        js_tests()


@manager.command
def create_db():
    db.create_all()


@manager.command
def drop_db():
    db.drop_all()


def create_roles():
    Role.create_roles()


@manager.command
def create_users_and_trips():
    create_roles()
    u1 = User('u1', 'p1', 'Us', 'Er1')
    u2 = User('u2', 'p2', 'Us', 'Er2')
    u3 = User('u3', 'p3', 'Us', 'Er3')

    admin = User('admin', 'admin', 'Ad', 'Min')
    admin.roles.append(Role.admin())
    user_manager = User('manager', 'manager', 'Man', 'Ager')
    user_manager.roles.append(Role.manager())

    today = datetime.date.today()
    one_day = datetime.timedelta(days=1)
    one_month = datetime.timedelta(days=30)
    two_months = one_day + one_month

    t1 = Trip('D1', utils.print_date(today), utils.print_date(today + one_day), 'C1', u1)
    t2 = Trip('D2', utils.print_date(today + one_day), utils.print_date(today + two_months), 'C1', u1)
    t3 = Trip('D3', utils.print_date(today - one_month), utils.print_date(today - one_day), 'C1', u1)

    db.session.add_all([u1, u2, u3, admin, user_manager, t1, t2, t3])
    db.session.commit()

if __name__ == '__main__':
    manager.run()
