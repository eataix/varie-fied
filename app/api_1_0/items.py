from flask import jsonify, request

from . import api
from .. import db
from .authentication import auth
from ..models import Item


@api.route('/items/')
@auth.login_required
def get_items():
    items = Item.query.all()
    return jsonify({'items': [item.to_json() for item in items]})


@api.route('/items/<int:item_id>')
@auth.login_required
def get_item(item_id):
    variation = Item.query.get_or_404(item_id)
    return jsonify(variation.to_json())


@api.route('/items/', methods=['POST'])
@auth.login_required
def new_item():
    item = Item.from_json(request.json)
    db.session.add(item)
    db.session.commit()
    return jsonify(item.to_json()), 201


@api.route('/variations/<int:item_id>', methods=['PUT'])
@auth.login_required
def edit_item(item_id):
    item = Item.query.get_or_404(item_id)
    item.amount = request.json.get('amount', item.amount)
    item.description = request.json.get('description', item.description)
    db.session.commit()
    return jsonify(item.to_json())


@api.route('/variations/<int:item_id>', methods=['DELETE'])
@auth.login_required
def delete_item(item_id):
    item = Item.query.get_or_404(item_id)
    db.session.delete(item)
    db.session.commit()
    return jsonify(item.to_json())
