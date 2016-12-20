#!/usr/bin/env python

from flask_script import Manager, Shell

from tripplanner import create_app, db
from tripplanner.users.models import User, Role
from tripplanner.core.models import Trip

app = create_app('dev')
manager = Manager(app)


def make_shell_context():
    return {'app': app, 'db': db}


manager.add_command('shell', Shell(make_context=make_shell_context))


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
    manag = User('manager', 'manager', 'Man', 'Ager')
    manag.roles.append(Role.manager())

    t1 = Trip('D1', '12/12/2016', '12/02/2017', 'C1', u1)
    t2 = Trip('D2', '13/12/2016', '12/01/2017', 'C1', u1)
    t3 = Trip('D3', '14/12/2016', '12/01/2017', 'C1', u1)

    db.session.add_all([u1, u2, u3, admin, manag, t1, t2, t3])
    db.session.commit()

if __name__ == '__main__':
    manager.run()
