from flask import jsonify, request

from . import api
from .. import db
from .authentication import auth
from ..models import Project


@api.route('/projects/')
@auth.login_required
def get_projects():
    projects = Project.query.all()

    return jsonify({'projects': [project.to_json() for project in projects]})


@api.route('/projects/<int:project_id>')
@auth.login_required
def get_project(project_id):
    project = Project.query.get_or_404(project_id)
    return jsonify(project.to_json())


@api.route('/projects/', methods=['POST'])
@auth.login_required
def new_project():
    project = Project.from_json(request.json)
    db.session.add(project)
    db.session.commit()
    return jsonify(project.to_json()), 201


@api.route('/projects/<int:project_id>', methods=['PUT'])
@auth.login_required
def edit_project(project_id):
    project = Project.query.get_or_404(project_id)
    project.name = request.json.get('name', project.name)
    project.active = bool(request.json.get('active', project.active))
    db.session.add(project)
    db.session.commit()
    return jsonify(project.to_json())


@api.route('/projects/<int:project_id>/variations/')
@auth.login_required
def get_project_variations(project_id):
    project = Project.query.get_or_404(project_id)
    return jsonify({'variations': [variation.to_json() for variation in project.variations]})


@api.route('/projects/<int:project_id>', methods=['DELETE'])
@auth.login_required
def delete_project(project_id):
    project = Project.query.get_or_404(project_id)
    db.session.delete(project)
    db.session.commit()
    return jsonify(project.to_json())
