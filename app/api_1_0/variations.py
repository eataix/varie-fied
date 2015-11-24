from typing import Any, Dict, List

from flask import jsonify, request, Response

from app import db
from app.api_1_0 import api
from app.api_1_0.authentication import auth
from app.models import Variation


@api.route('/variations/')
@auth.login_required
def get_variations() -> Response:
    variations = Variation.query.all()  # type: List[Variation]
    return jsonify({'variations': [project.to_json() for project in variations]})


@api.route('/variations/', methods=['POST'])
@auth.login_required
def new_variation() -> Response:
    variation = Variation.from_json(request.json)  # type: Variation
    db.session.add(variation)
    db.session.commit()
    return jsonify(variation.to_json()), 201


@api.route('/variations/<int:variation_id>')
@auth.login_required
def get_variation(variation_id: int) -> Response:
    variation = Variation.query.get_or_404(variation_id)  # type: Variation
    return jsonify(variation.to_json())


@api.route('/variations/<int:variation_id>', methods=['PUT'])
@auth.login_required
def edit_variation(variation_id: int) -> Response:
    variation = Variation.query.get_or_404(variation_id)  # type: Variation
    variation.subcontractor = request.json.get('subcontractor', variation.subcontractor)
    variation.invoice_no = request.json.get('invoice_no', variation.invoice_no)
    variation.description = request.json.get('description', variation.description)
    variation.amount = request.json.get('amount', variation.amount)
    variation.pending = request.json.get('pending', variation.pending)
    variation.approved = request.json.get('approved', variation.approved)
    variation.declined = request.json.get('declined', variation.declined)
    variation.completed = request.json.get('completed', variation.completed)
    variation.note = request.json.get('note', variation.note)
    db.session.add(variation)
    db.session.commit()
    return jsonify(variation.to_json())


@api.route('/variations/<int:variation_id>', methods=['DELETE'])
@auth.login_required
def delete_variation(variation_id: int) -> Response:
    variation = Variation.query.get_or_404(variation_id)  # type: Variation
    db.session.delete(variation)
    db.session.commit()
    return jsonify(variation.to_json())


@api.route('/variations/<int:variation_id>/items/')
@auth.login_required
def get_variation_items(variation_id: int) -> Response:
    variation = Variation.query.get_or_404(variation_id)  # type: Variation
    variation.items.sort(key=lambda i: i.id)
    return jsonify({'items': [item.to_json() for item in variation.items]})
