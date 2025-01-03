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

