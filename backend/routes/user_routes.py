from flask import Blueprint, jsonify
from services.user_service import UserService
from utils.jwt_util import token_required

user_bp = Blueprint('user', __name__)

@user_bp.route('/profile', methods=['GET'])
@token_required
def get_profile(current_user):
    profile = UserService.get_profile(current_user['user_id'])
    return jsonify(profile)

@user_bp.route('/profile', methods=['PUT'])
@token_required
def update_profile(current_user):
    data = request.json
    UserService.update_profile(current_user['user_id'], data)
    return jsonify({'message': 'Profile updated'})