from flask import Blueprint, jsonify, request
from services.lifeguard_service import LifeguardService
from utils.jwt_util import token_required

lifeguard_bp = Blueprint('lifeguard', __name__)

@lifeguard_bp.route('/schedules', methods=['GET'])
@token_required
def get_lifeguard_schedules(current_user):
    """Get schedules of all lifeguards"""
    try:
        # Add debug logging
        print(f"Accessing lifeguard schedules with user: {current_user}")
        
        if current_user['user_type'] not in ['manager', 'administrator']:
            return jsonify({'message': 'Unauthorized access'}), 403
            
        schedules = LifeguardService.get_all_schedules()
        return jsonify(schedules), 200
    except Exception as e:
        # Add error logging
        print(f"Error in get_lifeguard_schedules: {str(e)}")
        import traceback
        print(traceback.format_exc())
        return jsonify({'message': f'Internal server error: {str(e)}'}), 500

@lifeguard_bp.route('/lifeguards', methods=['GET'])
@token_required
def get_lifeguards(current_user):
    """Get list of all lifeguards"""
    try:
        # Add debug logging
        print(f"Accessing lifeguards list with user: {current_user}")
        
        if current_user['user_type'] not in ['manager', 'administrator']:
            return jsonify({'message': 'Unauthorized access'}), 403
            
        lifeguards = LifeguardService.get_all_lifeguards()
        return jsonify(lifeguards), 200
    except Exception as e:
        # Add error logging
        print(f"Error in get_lifeguards: {str(e)}")
        import traceback
        print(traceback.format_exc())
        return jsonify({'message': f'Internal server error: {str(e)}'}), 500 