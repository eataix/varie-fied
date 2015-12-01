from typing import List

from flask import jsonify, request, Response

from app import db
from app.api_1_0 import api
from app.api_1_0.authentication import auth
from app.models import Superintendent


@api.route('/superintendents/')
@auth.login_required
def get_superintendents() -> Response:
    superintendents = Superintendent.query.all()  # type: List[Superintendent]
    return jsonify({'progress_items': [superintendent.to_json() for superintendent in superintendents]})


@api.route('/superintendents/', methods=['POST'])
@auth.login_required
def new_superintendent() -> Response:
    superintendent = Superintendent.from_json(request.json)  # type: Superintendent
    db.session.add(superintendent)
    db.session.commit()
    return jsonify(superintendent.to_json()), 201


@api.route('/superintendents/<int:superintendent_id>')
@auth.login_required
def get_superintendent(superintendent_id: int) -> Response:
    superintendent = Superintendent.query.get_or_404(superintendent_id)  # type: Superintendent
    return jsonify(superintendent.to_json())


@api.route('/superintendents/<int:superintendent_id>', methods=['PUT'])
@auth.login_required
def edit_superintendent(superintendent_id: int) -> Response:
    superintendent = Superintendent.query.get_or_404(superintendent_id)  # type: Superintendent
    superintendent.name = request.json.get('name', superintendent.name)
    superintendent.first_line_address = request.json.get('first_line_address', superintendent.first_line_address)
    superintendent.second_line_address = request.json.get('second_line_address', superintendent.second_line_address)
    db.session.add(superintendent)
    db.session.commit()
    return jsonify(superintendent.to_json())


@api.route('/superintendents/<int:superintendent_id>', methods=['DELETE'])
@auth.login_required
def delete_superintendent(superintendent_id: int) -> Response:
    superintendent = Superintendent.query.get_or_404(superintendent_id)  # type: Superintendent
    db.session.delete(superintendent)
    db.session.commit()
    return jsonify(superintendent.to_json())
