from flask import Blueprint, request, jsonify
from services.user_service import UserService

user_bp = Blueprint('users', __name__)

@user_bp.route('/users', methods=['POST'])
def create_user():
    try:
        user_data = request.json
        user_id = UserService.create_user(user_data)
        return jsonify({'user_id': user_id}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@user_bp.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    try:
        user = UserService.get_user(user_id)
        if user:
            return jsonify(user)
        return jsonify({'message': 'User not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 400