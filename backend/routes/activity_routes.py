from flask import Blueprint, jsonify
from utils.jwt_util import token_required
from services.activity_service import ActivityService

activities_bp = Blueprint('activities', __name__)

@activities_bp.route('/swimmer', methods=['GET'])
@token_required
def get_swimmer_activities(current_user):
    print("current_user in /swimmer:", current_user)  # Debug log
    if current_user['role'] != 'swimmer':
        return jsonify({'message': 'Unauthorized access'}), 403
    try:
        activities = ActivityService.get_swimmer_activities(current_user['user_id'])
        return jsonify(activities), 200
    except Exception as e:
        print(f"Error in /swimmer endpoint: {e}")
        return jsonify({'message': str(e)}), 500

@activities_bp.route('/coach', methods=['GET'])
@token_required
def get_coach_activities(current_user):
    print("current_user in /coach:", current_user)  # Debug log
    if current_user['role'] != 'coach':
        return jsonify({'message': 'Unauthorized access'}), 403
    try:
        activities = ActivityService.get_coach_activities(current_user['user_id'])
        return jsonify(activities), 200
    except Exception as e:
        print(f"Error in /coach endpoint: {e}")
        return jsonify({'message': str(e)}), 500
