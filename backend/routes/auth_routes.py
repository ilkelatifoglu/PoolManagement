from flask import Blueprint, request, jsonify
from flask_cors import CORS
from services.auth_service import AuthService
from utils.jwt_util import verify_token

auth_bp = Blueprint('auth', __name__)
CORS(auth_bp, origins=["http://localhost:3000"], supports_credentials=True)

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

@auth_bp.route('/register', methods=['POST', 'OPTIONS'])
def register():
    if request.method == 'OPTIONS':
        # Respond to preflight request
        return '', 200
    try:
        user_data = request.json
        
        # Map swim level strings to integers
        swim_level_map = {
            'Beginner': 1,
            'Inter': 2,
            'Advanced': 3,
        }
        
        # Convert swim_level using the mapping
        if 'swim_level' in user_data:
            level_string = user_data['swim_level']
            if level_string in swim_level_map:
                user_data['swim_level'] = swim_level_map[level_string]

        user_id = AuthService.register(user_data)
        return jsonify({'message': 'Registration successful', 'user_id': user_id}), 201
    except Exception as e:
        return jsonify({'message': str(e)}), 400
    
@auth_bp.route('/validateToken', methods=['POST'])
def validate_token():
    token = request.json.get('token')
    if not token:
        return jsonify({"message": "Token is missing"}), 400
    try:
        decoded = verify_token(token)
        return jsonify({"user": decoded}), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 401

