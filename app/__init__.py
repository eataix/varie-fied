from flask import Flask

from flask.ext.bootstrap import Bootstrap
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.moment import Moment
from flask.ext.assets import Environment, Bundle

from config import config

bootstrap = Bootstrap()
db = SQLAlchemy()


def create_app(config_name):
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    config[config_name].init_app(app)

    bootstrap.init_app(app)
    db.init_app(app)
    moment = Moment(app)

    from app.main import main as main_blueprint
    app.register_blueprint(main_blueprint)

    from app.api_1_0 import api as api_1_0_blueprint
    app.register_blueprint(api_1_0_blueprint, url_prefix='/api/v1.0')

    from flask_bootstrap import WebCDN

    assets = Environment(app)
    js = Bundle('components/arrive/minified/arrive.min.js',
                'components/bootstrap-material-design/dist/js/ripples.min.js',
                'components/bootstrap-material-design/dist/js/material.min.js',
                'components/sweetalert/dist/sweetalert.min.js',
                'components/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js',
                'components/parsleyjs/dist/parsley.min.js',
                'components/accounting/accounting.min.js',
                'components/selectize/dist/js/standalone/selectize.min.js',
                'components/bootstrap-table/dist/bootstrap-table.min.js',
                'components/x-editable/dist/bootstrap3-editable/js/bootstrap-editable.min.js',
                'components/bootstrap-table/dist/extensions/editable/bootstrap-table-editable.min.js',
                filters='uglifyjs', output='gen/packed.js')
    assets.register('js_all', js)

    css = Bundle('components/bootstrap-material-design/dist/css/material.min.css',
                 'components/bootstrap-material-design/dist/css/ripples.min.css',
                 'components/bootstrap-material-design/dist/css/roboto.min.css',
                 'components/sweetalert/dist/sweetalert.css',
                 'components/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css',
                 'components/selectize/dist/css/selectize.bootstrap3.css',
                 'components/bootstrap-table/dist/bootstrap-table.min.css',
                 'components/x-editable/dist/bootstrap3-editable/css/bootstrap-editable.css',
                 'css/main.css',
                 filters='cleancss', output='gen/packed.css')
    assets.register('css_all', css)
    assets.auto_build = False
    assets.config['UGLIFYJS_EXTRA_ARGS'] = ['--compress', 'unused=false', '--mangle']

    return app
