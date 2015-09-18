from flask import jsonify, request

from app import db
from app.models import Client
from app.api_1_0 import api
from app.api_1_0.authentication import auth


@api.route('/clients/')
@auth.login_required
def get_clients():
    clients = Client.query.all()
    """:type : list[Client]"""
    return jsonify({'progress_items': [client.to_json() for client in clients]})


@api.route('/clients/<int:client_id>')
@auth.login_required
def get_client(client_id):
    client = Client.query.get_or_404(client_id)
    return jsonify(client.to_json())


@api.route('/clients/', methods=['POST'])
@auth.login_required
def new_client():
    client = Client.from_json(request.json)
    db.session.add(client)
    db.session.commit()
    return jsonify(client.to_json()), 201


@api.route('/clients/<int:client_id>', methods=['PUT'])
@auth.login_required
def edit_client(client_id):
    client = Client.query.get_or_404(client_id)
    """:type : Client"""
    client.name = request.json.get('name', client.name)
    client.first_line_address = request.json.get('first_line_address', client.first_line_address)
    client.second_line_address = request.json.get('second_line_address', client.second_line_address)
    db.session.add(client)
    db.session.commit()
    return jsonify(client.to_json())


@api.route('/clients/<int:client_id>', methods=['DELETE'])
@auth.login_required
def delete_client(client_id):
    client = Client.query.get_or_404(client_id)
    db.session.delete(client)
    db.session.commit()
    return jsonify(client.to_json())
