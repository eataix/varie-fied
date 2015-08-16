from flask import render_template, redirect

from . import main
from .authentication import auth
from .. import db
from ..models import Project


@main.route('/')
@auth.login_required
def index():
    projects = Project.query.all()
    return render_template('index.html', projects=projects, front=True)


@main.route('/project/<project_id>')
@auth.login_required
def handle_project(project_id):
    projects = Project.query.all()
    current_project = Project.query.get_or_404(project_id)
    return render_template('project.html', projects=projects, current_project=current_project,
                           variations=current_project.variations)


@main.route('/new/project/<project_name>')
@auth.login_required
def new_project_post(project_name):
    if project_name:
        project = Project()
        project.name = project_name
        db.session.add(project)
        return redirect('/')
    else:
        return 500

