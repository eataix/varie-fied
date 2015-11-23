from typing import Any, Dict, List

from flask import jsonify, request, Response

from app import db
from app.api_1_0 import api
from app.api_1_0.authentication import auth
from app.models import Item


@api.route('/items/')
@auth.login_required
def get_items() -> Response:
    items = Item.query.all()  # type: List[Item]
    return jsonify({'items': [item.to_json() for item in items]})


@api.route('/items/<int:item_id>')
@auth.login_required
def get_item(item_id: int) -> Response:
    item = Item.query.get_or_404(item_id)  # type: Item
    return jsonify(item.to_json())


@api.route('/items/', methods=['POST'])
@auth.login_required
def new_item() -> Response:
    item = Item.from_json(request.json)  # type: Item
    db.session.add(item)
    db.session.commit()
    return jsonify(item.to_json()), 201


@api.route('/items/<int:item_id>', methods=['PUT'])
@auth.login_required
def edit_item(item_id: int) -> Response:
    item = Item.query.get_or_404(item_id)  # type: Item
    item.amount = request.json.get('amount', item.amount)
    item.description = request.json.get('description', item.description)
    db.session.commit()
    return jsonify(item.to_json())


@api.route('/items/<int:item_id>', methods=['DELETE'])
@auth.login_required
def delete_item(item_id: int) -> Response:
    item = Item.query.get_or_404(item_id)  # type: Item
    db.session.delete(item)
    db.session.commit()
    return jsonify(item.to_json())
