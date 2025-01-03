from flask import Blueprint, jsonify, request, make_response
from services.user_service import UserService
from utils.jwt_util import token_required

user_bp = Blueprint('user', __name__)

@user_bp.route('/profile', methods=['GET', 'OPTIONS'])
@token_required
def get_profile(current_user):
    print("Profile request received for user:", current_user)
    if request.method == 'OPTIONS':
        return '', 200
    try:
        profile = UserService.get_profile(current_user['user_id'])
        print("Profile data:", profile)
        return jsonify(profile)
    except Exception as e:
        print("Error fetching profile:", e)
        import traceback
        print(traceback.format_exc())
        return jsonify({'message': str(e)}), 500

@user_bp.route('/profile', methods=['PUT', 'OPTIONS'])
@token_required
def update_profile(current_user):
    if request.method == 'OPTIONS':
        return '', 200
        
    try:
        print(f"Profile update request received for user: {current_user}")  # Debug log
        data = request.json
        print(f"Update data: {data}")  # Debug log
        
        UserService.update_profile(current_user['user_id'], data)
        return jsonify({'message': 'Profile updated'})
    except Exception as e:
        print(f"Error in update_profile route: {str(e)}")  # Debug log
        import traceback
        print(traceback.format_exc())  # Print full stack trace
        return jsonify({'message': str(e)}), 500

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

@user_bp.route('/password', methods=['PUT'])
@token_required
def update_password(current_user):
    if request.method == 'OPTIONS':
        return '', 200
        
    try:
        data = request.json
        current_password = data.get('currentPassword')
        new_password = data.get('newPassword')
        
        if not current_password or not new_password:
            return jsonify({'message': 'Both current and new password are required'}), 400
            
        success = UserService.update_password(
            current_user['user_id'], 
            current_password, 
            new_password
        )
        
        if success:
            return jsonify({'message': 'Password updated successfully'}), 200
        else:
            return jsonify({'message': 'Current password is incorrect'}), 401
            
    except Exception as e:
        return jsonify({'message': str(e)}), 500