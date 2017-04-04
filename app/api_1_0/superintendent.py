from flask import Response, jsonify, request
from typing import List

from app import db
from app.api_1_0 import api
from app.api_1_0.authentication import auth
from app.models import Superintendent


@api.route('/superintendents/')
@auth.login_required
def get_superintendents() -> Response:
    superintendents: List[Superintendent] = Superintendent.query.all()
    return jsonify({'progress_items': [superintendent.to_json() for superintendent in superintendents]})


@api.route('/superintendents/', methods=['POST'])
@auth.login_required
def new_superintendent() -> Response:
    superintendent: Superintendent = Superintendent.from_json(request.json)
    db.session.add(superintendent)
    db.session.commit()
    return jsonify(superintendent.to_json()), 201


@api.route('/superintendents/<int:superintendent_id>')
@auth.login_required
def get_superintendent(superintendent_id: int) -> Response:
    superintendent: Superintendent = Superintendent.query.get_or_404(superintendent_id)
    return jsonify(superintendent.to_json())


@api.route('/superintendents/<int:superintendent_id>', methods=['PUT'])
@auth.login_required
def edit_superintendent(superintendent_id: int) -> Response:
    superintendent: Superintendent = Superintendent.query.get_or_404(superintendent_id)
    superintendent.name = request.json.get('name', superintendent.name)
    superintendent.first_line_address = request.json.get('first_line_address', superintendent.first_line_address)
    superintendent.second_line_address = request.json.get('second_line_address', superintendent.second_line_address)
    db.session.add(superintendent)
    db.session.commit()
    return jsonify(superintendent.to_json())


@api.route('/superintendents/<int:superintendent_id>', methods=['DELETE'])
@auth.login_required
def delete_superintendent(superintendent_id: int) -> Response:
    superintendent: Superintendent = Superintendent.query.get_or_404(superintendent_id)
    db.session.delete(superintendent)
    db.session.commit()
    return jsonify(superintendent.to_json())
