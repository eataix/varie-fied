from flask import render_template, send_file
from typing import List

from app.main import main
from app.main.authentication import auth
from app.models import Project


@main.route('/')
@auth.login_required
def index():
    projects: List[Project] = Project.query.all()
    return render_template('index.html', projects=projects, front=True)


@main.route('/project/<project_id>/variation')
@auth.login_required
def project_variation(project_id):
    projects: List[Project] = Project.query.all()
    current_project: Project = Project.query.get_or_404(project_id)
    return render_template('variation.html', projects=projects, current_project=current_project,
                           variations=current_project.variations,
                           prefix='Variations of',
                           alt_url=f'/project/{project_id}/progress', alt_text='Progress')


@main.route('/project/<project_id>/progress')
@auth.login_required
def project_progress(project_id):
    projects: List[Project] = Project.query.all()
    current_project: Project = Project.query.get_or_404(project_id)
    return render_template('progress.html', projects=projects, current_project=current_project,
                           progress=current_project.progress_items,
                           prefix='Progress of',
                           alt_url=f'/project/{project_id}/variation', alt_text='Variations')


@main.route('/export/<int:project_id>')
@auth.login_required
def export_project(project_id):
    current_project: Project = Project.query.get_or_404(project_id)
    fn = current_project.export()
    return send_file('../generated/' + fn, mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                     as_attachment=True)
