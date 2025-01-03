from flask import Blueprint, jsonify, request
from utils.jwt_util import token_required
from services.activity_service import ActivityService

activities_bp = Blueprint('activities', __name__)

@activities_bp.route('/swimmer', methods=['GET'])
@token_required
def get_swimmer_activities(current_user):
    print("current_user in /swimmer:", current_user)  # Debug log
    if current_user['user_type'] != 'swimmer':
        return jsonify({'message': 'Unauthorized access'}), 403
    try:
        swimmer_id = current_user['user_id']
        print("Fetching activities for swimmer_id:", swimmer_id)  # Debug log
        activities = ActivityService.get_swimmer_activities(swimmer_id)
        return jsonify(activities), 200
    except Exception as e:
        print(f"Error in /activities/swimmer: {e}")  # Debug log
        return jsonify({'message': f"Error: {str(e)}"}), 500

@activities_bp.route('/coach', methods=['GET'])
@token_required
def get_coach_activities(current_user):
    print("current_user in /coach:", current_user)  # Debug log
    if current_user['user_type'] != 'coach':
        return jsonify({'message': 'Unauthorized access'}), 403
    try:
        activities = ActivityService.get_coach_activities(current_user['user_id'])
        return jsonify(activities), 200
    except Exception as e:
        print(f"Error in /coach endpoint: {e}")
        return jsonify({'message': str(e)}), 500
    
@activities_bp.route('/cancel-activity/<int:activity_id>', methods=['PUT'])
@token_required
def cancel_activity(current_user, activity_id):
    try:
        # Ensure only swimmers can cancel activities
        if current_user['user_type'] not in ['swimmer', 'coach']:
            return jsonify({'message': 'Unauthorized access'}), 403
        
        # Call the service to cancel the activity
        message = ActivityService.cancel_activity(current_user['user_id'], activity_id)
        return jsonify({'message': message}), 200
    except Exception as e:
        return jsonify({'message': f"Error: {str(e)}"}), 500
    
@activities_bp.route('/withdraw-class', methods=['DELETE'])
@token_required
def withdraw_class(current_user):
    """
    Endpoint to withdraw a class by removing the schedule.
    """
    try:
        data = request.json
        user_id = data.get('userId')
        class_id = data.get('classId')

        if not user_id or not class_id:
            return jsonify({'message': 'Missing required fields'}), 400

        if current_user['user_id'] != user_id or current_user['user_type'] != 'swimmer':
            return jsonify({'message': 'Unauthorized access'}), 403

        message = ActivityService.withdraw_class(user_id, class_id)
        return jsonify({'message': message}), 200
    except Exception as e:
        print(f"Error in /activities/withdraw-class: {e}")
        return jsonify({'message': str(e)}), 500


@activities_bp.route('/cancel-class/<int:class_id>', methods=['POST'])
@token_required
def cancel_class(current_user, class_id):
    try:
        # Ensure only coaches can cancel classes
        if current_user['user_type'] != 'coach':
            return jsonify({'message': 'Unauthorized access'}), 403
        
        # Call the service to cancel the class
        message = ActivityService.cancel_class(class_id)
        return jsonify({'message': message}), 200
    except Exception as e:
        return jsonify({'message': f"Error: {str(e)}"}), 500
