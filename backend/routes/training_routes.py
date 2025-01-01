from flask import Blueprint, request, jsonify
from services.training_service import TrainingService
from utils.jwt_util import token_required

training_bp = Blueprint('training', __name__)

@training_bp.route('/self-training', methods=['POST'])
@token_required
def create_self_training(current_user):
    if current_user['role'] != 'swimmer':
        return jsonify({'message': 'Unauthorized access'}), 403
    try:
        data = request.json
        swimmer_id = current_user['user_id']
        response = TrainingService.create_self_training(
            swimmer_id, data['pool_id'], data['date'], data['start_time'], data['end_time']
        )
        return jsonify(response), 201
    except Exception as e:
        return jsonify({'message': str(e)}), 400


@training_bp.route('/training', methods=['POST'])
@token_required
def create_training(current_user):
    if current_user['role'] != 'coach':
        return jsonify({'message': 'Unauthorized access'}), 403
    try:
        data = request.json
        coach_id = current_user['user_id']
        response = TrainingService.create_training(
            coach_id, data['pool_id'], data['date'], data['start_time'], data['end_time'],
            data['name'], data['level'], data['course_content']
        )
        return jsonify(response), 201
    except Exception as e:
        return jsonify({'message': str(e)}), 400


@training_bp.route('/self-training', methods=['GET'])
@token_required
def get_self_trainings(current_user):
    if current_user['role'] != 'swimmer':
        return jsonify({'message': 'Unauthorized access'}), 403
    try:
        swimmer_id = current_user['user_id']
        self_trainings = TrainingService.get_self_trainings_for_swimmer(swimmer_id)
        return jsonify(self_trainings), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 400


@training_bp.route('/training', methods=['GET'])
@token_required
def get_trainings(current_user):
    if current_user['role'] != 'swimmer':
        return jsonify({'message': 'Unauthorized access'}), 403
    try:
        swim_level = request.args.get('level')
        trainings = TrainingService.get_trainings_for_swimmer(swim_level)
        return jsonify(trainings), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 400


@training_bp.route('/cart', methods=['POST'])
@token_required
def add_to_cart(current_user):
    try:
        data = request.json
        swimmer_id = current_user['user_id']
        response = TrainingService.add_to_cart(
            swimmer_id, data['activity_type'], data['activity_id'], data['quantity']
        )
        return jsonify(response), 201
    except Exception as e:
        return jsonify({'message': str(e)}), 400


@training_bp.route('/cart', methods=['GET'])
@token_required
def get_cart(current_user):
    try:
        swimmer_id = current_user['user_id']
        cart_items = TrainingService.get_cart_items(swimmer_id)
        return jsonify(cart_items), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 400


@training_bp.route('/cart/<int:cart_id>', methods=['DELETE'])
@token_required
def remove_from_cart(current_user, cart_id):
    try:
        response = TrainingService.remove_from_cart(cart_id)
        return jsonify(response), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 400
