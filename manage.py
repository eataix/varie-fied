import os
from app import create_app, db
from app.models import Variation, Project, Item
from flask.ext.script import Manager, Shell
from flask.ext.migrate import Migrate, MigrateCommand
from flask.ext.assets import ManageAssets

app = create_app(os.getenv('FLASK_CONFIG') or 'default')
manager = Manager(app)
migrate = Migrate(app, db)


def make_shell_context():
    return dict(app=app, db=db, Variation=Variation, Project=Project, Item=Item)


manager.add_command("shell", Shell(make_context=make_shell_context))
manager.add_command("db", MigrateCommand)
manager.add_command("assets", ManageAssets())

if __name__ == '__main__':
    manager.run()
