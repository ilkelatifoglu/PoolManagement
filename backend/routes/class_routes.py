from flask import Blueprint, request, jsonify
from services.class_service import create_new_class, get_filtered_classes, add_class_to_cart
from services.pool_service import get_all_pools
from services.class_service import get_filtered_classes, add_class_to_cart
from services.class_service import create_new_class, get_filtered_classes, add_class_to_cart
from utils.jwt_util import token_required
from services.class_service import fetch_classes_not_in_cart
from services.class_service import cancel_class_by_id, get_ready_classes


class_routes = Blueprint('class_routes', __name__)

@class_routes.route('/classes', methods=['POST'])
@token_required
def create_class_route(user_data):
    try:
        # Ensure the user is a coach
        if user_data["user_type"] != "coach":
            return jsonify({"error": "Only coaches can create classes."}), 403

        class_data = request.json
        required_fields = [
            'name', 'level', 'capacity', 'enroll_deadline',
            'session_date', 'start_time', 'end_time', 'lane_number', 'pool_id', 'price'
        ]
        missing_fields = [field for field in required_fields if field not in class_data]

        if missing_fields:
            return jsonify({"error": f"Missing fields: {', '.join(missing_fields)}"}), 400

        create_new_class(class_data, user_data["user_id"])
        return jsonify({"message": "Class created successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Route to fetch all available classes
@class_routes.route('/fetch-classes', methods=['GET'])
@token_required
def fetch_classes(user_data):
    try:
        swimmer_id = user_data['user_id']
        classes = fetch_classes_not_in_cart(swimmer_id)
        return jsonify(classes), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    
@class_routes.route('/cart', methods=['POST'])
@token_required
def add_to_cart(user_data):
    try:
        data = request.json
        required_fields = ['class_id']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({"error": f"Missing fields: {', '.join(missing_fields)}"}), 400

        data['swimmer_id'] = user_data['user_id']  # Add user_id from token
        add_class_to_cart(data)
        return jsonify({"message": "Class added to cart successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500



    
# Route to fetch all pools
@class_routes.route('/pools', methods=['GET'])
def get_pools_route():
    try:
        pools = get_all_pools()
        return jsonify(pools), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@class_routes.route('/ready-classes', methods=['GET'])
@token_required
def get_ready_classes_route(user_data):
    try:
        ready_classes = get_ready_classes()
        return jsonify(ready_classes), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

 
@class_routes.route('/cancel-class', methods=['POST'])
@token_required
def cancel_class_route(user_data):
    try:
        data = request.json
        if 'class_id' not in data:
            return jsonify({"error": "Missing class_id"}), 400
        
        print(f"Received class_id for cancellation: {data['class_id']}")
        cancel_class_by_id(data['class_id'])
        return jsonify({"message": "Class cancelled successfully"}), 200
    except Exception as e:
        print(f"Error in cancel_class_route: {str(e)}")
        return jsonify({"error": str(e)}), 500
