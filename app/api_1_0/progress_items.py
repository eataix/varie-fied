from typing import List
from flask import jsonify, request, Response

from app import db
from app.api_1_0 import api
from app.api_1_0.authentication import auth
from app.models import ProgressItem


@api.route('/progress_items/')
@auth.login_required
def get_progress_items() -> Response:
    progress_items = ProgressItem.query.all()  # type: List[ProgressItem]
    return jsonify({'progress_items': [progress_item.to_json() for progress_item in progress_items]})


@api.route('/progress_items/<int:progress_item_id>')
@auth.login_required
def get_progress_item(progress_item_id: int) -> Response:
    progress_item = ProgressItem.query.get_or_404(progress_item_id)  # type: ProgressItem
    return jsonify(progress_item.to_json())


@api.route('/progress_items/', methods=['POST'])
@auth.login_required
def new_progress_item() -> Response:
    progress_item = ProgressItem.from_json(request.json)  # type: ProgressItem
    db.session.add(progress_item)
    db.session.commit()
    return jsonify(progress_item.to_json()), 201


@api.route('/progress_items/<int:item_id>', methods=['PUT'])
@auth.login_required
def edit_progress_item(item_id: int) -> Response:
    progress_item = ProgressItem.query.get_or_404(item_id)  # type: ProgressItem
    progress_item.completed_value = request.json.get('completed_value', progress_item.completed_value)
    progress_item.contract_value = request.json.get('contract_value', progress_item.contract_value)
    progress_item.name = request.json.get('name', progress_item.name)
    db.session.add(progress_item)
    db.session.commit()
    return jsonify(progress_item.to_json())


@api.route('/progress_items/<int:item_id>', methods=['DELETE'])
@auth.login_required
def delete_progress_item(item_id: int) -> Response:
    progress_item = ProgressItem.query.get_or_404(item_id)  # type: ProgressItem
    db.session.delete(progress_item)
    db.session.commit()
    return jsonify(progress_item.to_json())
