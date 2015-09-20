from typing import Dict

from flask import jsonify

from app.api_1_0 import api
from app.exceptions import ValidationError


def bad_request(message: str) -> Dict[str, str]:
    response = jsonify({'error': 'bad request', 'message': message})
    response.status_code = 400
    return response


def unauthorized(message: str) -> Dict[str, str]:
    response = jsonify({'error': 'unauthorized', 'message': message})
    response.status_code = 401
    return response


def forbidden(message: str) -> Dict[str, str]:
    response = jsonify({'error': 'forbidden', 'message': message})
    response.status_code = 403
    return response


@api.errorhandler(ValidationError)
def validation_error(e):
    return bad_request(e.args[0])
