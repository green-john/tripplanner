#!/usr/bin/env python

from flask_script import Manager, Shell

from tripplanner import create_app, db
from tripplanner.users.models import User, Role

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
def create_users():
    create_roles()
    u1 = User('u1', 'p1', 'Us', 'Er1')
    u2 = User('u2', 'p2', 'Us', 'Er2')
    u3 = User('u3', 'p3', 'Us', 'Er3')

    admin = User('admin', 'admin', 'Ad', 'Min')
    admin.roles.append(Role.admin())
    manag = User('manager', 'manager', 'Man', 'Ager')
    manag.roles.append(Role.manager())

    db.session.add_all([u1, u2, u3, admin, manag])
    db.session.commit()

if __name__ == '__main__':
    manager.run()
