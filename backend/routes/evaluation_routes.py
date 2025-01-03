from flask import Blueprint, jsonify, request
from services.evaluation_service import EvaluationService
from utils.jwt_util import token_required 

evaluation_bp = Blueprint('eval', __name__)
@evaluation_bp.route('/evaluations', methods=['GET'])
@token_required
def get_evaluations(current_user):
    if request.method == 'OPTIONS':
        return '', 200
    evaluations = EvaluationService.get_eval_items(current_user['user_id'])
    return jsonify(evaluations)

@evaluation_bp.route('/submit-evaluation', methods=['POST'])
@token_required
def submit_evaluation(current_user):
    data = request.json
    swimmer_id = current_user["user_id"]
    EvaluationService.save_evaluation(data, swimmer_id)
    return jsonify({"message": "Evaluation submitted successfully"}), 200

@evaluation_bp.route('/coach-average-rating', methods=['GET'])
@token_required
def get_coach_average_rating(current_user):
    ratings = EvaluationService.get_coach_average_rating()
    print("Backend Coach Ratings Response:", ratings)  # Debugging backend response
    return jsonify(ratings), 200

@evaluation_bp.route('/coach-evaluations/<int:coach_id>', methods=['GET'])
@token_required
def get_coach_evaluations(current_user, coach_id):
    print("Requested CoachID:", coach_id)  # Debugging incoming coach_id
    evaluations = EvaluationService.get_evaluations_for_coach(coach_id)
    return jsonify(evaluations), 200

@evaluation_bp.route('/class-evaluations/<int:coach_id>', methods=['GET'])
@token_required
def get_class_evaluations(current_user, coach_id):
    print("Requested CoachID for Class Evaluations:", coach_id)  # Debugging
    evaluations = EvaluationService.get_class_evaluations_for_coach(coach_id)
    return jsonify(evaluations), 200
