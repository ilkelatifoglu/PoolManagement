from flask import Blueprint, request, jsonify
from services.auth_service import AuthService

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    result = AuthService.login(data['email'], data['password'])
    
    if result:
        return jsonify({
            'token': result['token'],
            'user': result['user']
        })
    return jsonify({'message': 'Invalid credentials'}), 401

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        user_data = request.json
        user_id = AuthService.register(user_data)
        return jsonify({'message': 'Registration successful', 'user_id': user_id}), 201
    except Exception as e:
        return jsonify({'message': str(e)}), 400