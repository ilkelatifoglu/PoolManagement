from flask import Blueprint, request, jsonify
from services.class_service import create_new_class, get_filtered_classes, add_class_to_cart
from services.pool_service import get_all_pools
from services.class_service import get_filtered_classes, add_class_to_cart
from services.class_service import create_new_class, get_filtered_classes, add_class_to_cart


class_routes = Blueprint('class_routes', __name__)

@class_routes.route('/classes', methods=['POST'])
def create_class_route():
    class_data = request.json
    required_fields = ['name', 'coach_id', 'level', 'capacity', 'enroll_deadline', 'session_date', 'start_time', 'end_time', 'lane_number', 'pool_id', 'price']
    missing_fields = [field for field in required_fields if field not in class_data]

    if missing_fields:
        return jsonify({"error": f"Missing fields: {', '.join(missing_fields)}"}), 400

    try:
        create_new_class(class_data)
        return jsonify({"message": "Class created successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Route to fetch all available classes
@class_routes.route('/fetch-classes', methods=['GET'])
def fetch_classes():
    try:
        filters = request.args.to_dict()
        print("Filters received:", filters)  # Debugging
        classes = get_filtered_classes(filters)
        return jsonify(classes), 200
    except Exception as e:
        print("Error in fetching classes:", str(e))  # Debugging
        return jsonify({"error": str(e)}), 500

    
@class_routes.route('/cart', methods=['POST'])
def add_to_cart():
    try:
        data = request.json
        required_fields = ['swimmer_id', 'class_id']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({"error": f"Missing fields: {', '.join(missing_fields)}"}), 400
        
        add_class_to_cart(data)
        return jsonify({"message": "Class added to cart"}), 201
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