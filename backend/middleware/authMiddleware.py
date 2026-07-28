from functools import wraps
from flask import jsonify, request
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity

def auth_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        try:
            verify_jwt_in_request()
            return fn(*args, **kwargs)
        except Exception as e:
            return jsonify({'error': 'Authentication required', 'message': str(e)}), 401
    return wrapper

def get_current_user_id():
    return get_jwt_identity()
