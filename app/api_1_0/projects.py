from flask import jsonify, request, Response

from app import db
from app.api_1_0 import api
from app.api_1_0.authentication import auth
from app.models import Project, Variation


@api.route('/projects/')
@auth.login_required
def get_projects() -> Response:
    projects = Project.query.all()  # type: List[Project]
    return jsonify({'projects': [project.to_json() for project in projects]})


@api.route('/projects/<int:project_id>')
@auth.login_required
def get_project(project_id: int) -> Response:
    project = Project.query.get_or_404(project_id)  # type: Project
    return jsonify(project.to_json())


@api.route('/projects/', methods=['POST'])
@auth.login_required
def new_project() -> Response:
    project = Project.from_json(request.json)  # type: Project
    db.session.add(project)
    db.session.commit()
    return jsonify(project.to_json()), 201


@api.route('/projects/<int:project_id>', methods=['PUT'])
@auth.login_required
def edit_project(project_id: int) -> Response:
    project = Project.query.get_or_404(project_id)  # type: Project
    project.name = request.json.get('name', project.name)
    project.reference_number = request.json.get('reference_number', project.reference_number)
    project.active = bool(request.json.get('active', project.active))
    project.admin_fee = request.json.get('admin_fee', project.admin_fee)
    project.margin = request.json.get('margin', project.margin)
    db.session.add(project)
    db.session.commit()
    for variation in Variation.query.all():
        subtotal = sum([item.amount for item in variation.items])
        subtotal *= 1.0 + project.margin
        if project.admin_fee is not None:
            subtotal += project.admin_fee
        variation.amount = subtotal
        db.session.add(variation)
    db.session.commit()
    return jsonify(project.to_json())


@api.route('/projects/<int:project_id>/variations/')
@auth.login_required
def get_project_variations(project_id: int) -> Response:
    project = Project.query.get_or_404(project_id)  # type: Project

    project.variations.sort(key=lambda v: v.vid)
    jsons = []
    for (idx, variation) in enumerate(project.variations):
        json = variation.to_json()
        json['virtual_id'] = idx + 1
        jsons.append(json)

    return jsonify({'variations': jsons})


@api.route('/projects/<int:project_id>/progress_items/')
@auth.login_required
def get_project_progress_items(project_id: int) -> Response:
    project = Project.query.get_or_404(project_id)

    project.progress_items.sort(key=lambda p: p.id)
    jsons = []
    for (idx, variation) in enumerate(project.progress_items):
        json = variation.to_json()
        json['virtual_id'] = idx + 1
        jsons.append(json)

    return jsonify({'progress_items': jsons})


@api.route('/projects/<int:project_id>/client')
@auth.login_required
def get_project_client(project_id: int) -> Response:
    project = Project.query.get_or_404(project_id)  # type: Project
    return jsonify({'client': project.client.to_json()})


@api.route('/projects/<int:project_id>/superintendent')
@auth.login_required
def get_project_superintendent(project_id: int) -> Response:
    project = Project.query.get_or_404(project_id)  # type: Project
    return jsonify({'superintendent': project.superintendent.to_json()})


@api.route('/projects/<int:project_id>', methods=['DELETE'])
@auth.login_required
def delete_project(project_id: int) -> Response:
    project = Project.query.get_or_404(project_id)  # type: Project
    db.session.delete(project)
    db.session.commit()
    return jsonify(project.to_json())
