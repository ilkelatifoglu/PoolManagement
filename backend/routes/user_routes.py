from flask import Blueprint, jsonify, request, make_response
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

@user_bp.route('/schedule', methods=['GET', 'PUT', 'OPTIONS'])
def schedule():
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,OPTIONS')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response

    @token_required
    def protected_route(current_user):
        if request.method == 'GET':
            schedule = UserService.get_schedule(current_user['user_id'])
            return jsonify(schedule)
        elif request.method == 'PUT':
            schedule_data = request.json
            UserService.update_schedule(current_user['user_id'], schedule_data)
            return jsonify({'message': 'Schedule updated successfully'})

    return protected_route()