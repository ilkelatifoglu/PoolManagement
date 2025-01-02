from flask import Blueprint, jsonify, request
from utils.jwt_util import token_required
from services.training_service import TrainingService

training_bp = Blueprint("training", __name__)


@training_bp.route("/self-trainings", methods=["GET"])
@token_required
def get_self_trainings(current_user):
    try:
        swimmer_id = current_user["user_id"]
        self_trainings = TrainingService.get_self_trainings(swimmer_id)
        return jsonify(self_trainings), 200
    except Exception as e:
        print(f"Error in get_self_trainings for swimmer_id {swimmer_id}: {e}")
        return jsonify({"error": f"Error fetching self-trainings: {str(e)}"}), 500


@training_bp.route("/trainings", methods=["POST"])
@token_required
def create_training(current_user):
    if current_user["user_type"] != "coach":
        return jsonify({"error": "Unauthorized access"}), 403
    data = request.json
    try:
        TrainingService.add_training(
            coach_id=current_user["user_id"],
            session_id=data["session_id"],
            goal=data["goal"]
        )
        return jsonify({"message": "Training added successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@training_bp.route('/self-trainings', methods=['POST'])
@token_required
def add_self_training(current_user):
    try:
        print("add_self_training route hit!")
        swimmer_id = current_user['user_id']
        data = request.json
        print(f"Received data: {data}")

        # Validate payload
        if not all(k in data for k in ['session_id', 'pool_id', 'lane_number', 'goal']):
            raise Exception("Invalid payload structure. Expected keys: 'session_id', 'pool_id', 'lane_number', 'goal'.")

        session_id = data['session_id']
        pool_id = data['pool_id']
        lane_number = data['lane_number']
        goal = data['goal']

        print(f"Adding self-training for swimmer_id: {swimmer_id}, session_id: {session_id}, pool_id: {pool_id}, lane_number: {lane_number}, goal: {goal}")

        result = TrainingService.add_self_training(swimmer_id, session_id, pool_id, lane_number, goal)
        return jsonify(result), 201

    except Exception as e:
        print(f"Error in add_self_training route: {e}")
        return jsonify({"error": str(e)}), 500



@training_bp.route("/trainings/<int:training_id>", methods=["DELETE"])
@token_required
def delete_training(current_user, training_id):
    try:
        TrainingService.delete_training(training_id, current_user["user_id"])
        return jsonify({"message": "Training canceled successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@training_bp.route("/self-trainings/<int:self_training_id>", methods=["DELETE"])
@token_required
def delete_self_training(current_user, self_training_id):
    try:
        TrainingService.delete_self_training(self_training_id, current_user["user_id"])
        return jsonify({"message": "Self-training canceled successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500



@training_bp.route("/available-coaches", methods=["GET"])
def get_available_coaches():
    """Fetch available coaches."""
    try:
        print("in route")
        coaches = TrainingService.get_available_coaches()
        return jsonify(coaches), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@training_bp.route("/trainings/sign-up", methods=["POST"])
@token_required
def sign_up_for_training(current_user):
    try:
        if current_user["user_type"] != "swimmer":
            return jsonify({"error": "Unauthorized access"}), 403

        data = request.json
        # Validate that all required fields are present
        if not all(k in data for k in ["session_id", "pool_id", "lane_number", "goal", "coach_id"]):
            return jsonify({"error": "Missing session_id, pool_id, lane_number, goal, or coach_id in request"}), 400

        swimmer_id = current_user.get("user_id")
        coach_id = data["coach_id"]

        print(f"Using swimmer_id: {swimmer_id}, coach_id: {coach_id}")

        # Call the service to add the training
        result = TrainingService.add_training(
            swimmer_id,
            data["session_id"],
            data["pool_id"],
            data["lane_number"],
            data["goal"],
            coach_id  # Pass the coach_id to the service
        )
        return jsonify(result), 201
    except Exception as e:
        print(f"Error in sign_up_for_training: {e}")
        return jsonify({"error": str(e)}), 500
