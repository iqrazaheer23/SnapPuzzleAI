from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from marshmallow import Schema, fields, validate, ValidationError
from middleware.authMiddleware import auth_required
from models.User import User
from models.Score import Score
from models.Achievement import Achievement
import re

auth_bp = Blueprint('auth', __name__)

class RegisterSchema(Schema):
    username = fields.Str(required=True, validate=validate.Length(min=3, max=30))
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=8))

register_schema = RegisterSchema()

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = register_schema.load(request.get_json())
    except ValidationError as err:
        return jsonify({'error': 'Invalid input', 'details': err.messages}), 400
    
    username = data['username'].strip()
    email = data['email'].lower().strip()
    password = data['password']
    
    # Check password strength
    if not re.search(r'[A-Za-z]', password) or not re.search(r'\d', password):
        return jsonify({'error': 'Password must contain at least one letter and one number'}), 400
    
    # Check if username exists
    if User.find_by_username(username):
        return jsonify({'error': 'Username already taken'}), 409
    
    # Check if email exists
    if User.find_by_email(email):
        return jsonify({'error': 'Email already registered'}), 409
    
    user_id = User.create(username, email, password)
    
    access_token = create_access_token(identity=user_id)
    
    return jsonify({
        'message': 'User registered successfully',
        'token': access_token,
        'user': {
            'id': user_id,
            'username': username,
            'email': email
        }
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email', '').lower().strip()
    password = data.get('password', '')
    
    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400
    
    user = User.find_by_email(email)
    if not user:
        return jsonify({'error': 'Invalid credentials'}), 401
    
    if not User.verify_password(password, user['passwordHash']):
        return jsonify({'error': 'Invalid credentials'}), 401
    
    access_token = create_access_token(identity=str(user['_id']))
    
    return jsonify({
        'message': 'Login successful',
        'token': access_token,
        'user': {
            'id': str(user['_id']),
            'username': user['username'],
            'email': user['email']
        }
    }), 200

@auth_bp.route('/profile', methods=['GET'])
@auth_required
def profile():
    user_id = get_jwt_identity()
    user = User.find_by_id(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    stats = Score.get_stats_by_user(user_id)
    achievements = Achievement.get_user_achievements(user_id)
    
    return jsonify({
        'user': {
            'id': str(user['_id']),
            'username': user['username'],
            'email': user['email'],
            'createdAt': user['createdAt'].isoformat() if 'createdAt' in user else None
        },
        'stats': stats,
        'achievements': [a['achievementName'] for a in achievements]
    }), 200
