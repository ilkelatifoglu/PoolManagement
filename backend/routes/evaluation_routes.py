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
