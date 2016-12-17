#!/usr/bin/env python

from flask_script import Manager, Shell

from tripplanner import create_app, db

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


if __name__ == '__main__':
    manager.run()
