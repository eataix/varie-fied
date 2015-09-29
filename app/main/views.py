from flask import render_template, send_file

from app.main import main
from app.main.authentication import auth
from app.models import Project


@main.route('/')
@auth.login_required
def index():
    projects = Project.query.all()  # type: List[Project]
    return render_template('index.html', projects=projects, front=True)


@main.route('/project/<project_id>/variation')
@auth.login_required
def project_variation(project_id):
    projects = Project.query.all()  # type: List[Project]
    current_project = Project.query.get_or_404(project_id)  # type: Project
    return render_template('variation.html', projects=projects, current_project=current_project,
                           variations=current_project.variations,
                           prefix='Variations of',
                           alt_url='/project/{}/progress'.format(project_id), alt_text='Progress')


@main.route('/project/<project_id>/progress')
@auth.login_required
def project_progress(project_id):
    projects = Project.query.all()  # type: List[Project]
    current_project = Project.query.get_or_404(project_id)  # type: Project
    return render_template('progress.html', projects=projects, current_project=current_project,
                           progress=current_project.progress_items,
                           prefix='Progress of',
                           alt_url='/project/{}/variation'.format(project_id), alt_text='Variations')


@main.route('/export/<int:project_id>')
@auth.login_required
def export_project(project_id):
    current_project = Project.query.get_or_404(project_id)  # type: Project
    fn = current_project.export()
    return send_file('../generated/' + fn, mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                     as_attachment=True)
