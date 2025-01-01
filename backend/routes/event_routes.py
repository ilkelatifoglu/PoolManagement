from flask import Blueprint, request, jsonify
from services.event_service import create_new_event

event_routes = Blueprint('event_routes', __name__)

@event_routes.route('/events', methods=['POST'])
def create_event_route():
    try:
        event_data = request.json
        required_fields = ['manager_id', 'event_name', 'event_type', 'capacity', 'date', 'start_time', 'end_time', 'pool_id']
        missing_fields = [field for field in required_fields if field not in event_data]

        if missing_fields:
            return jsonify({"error": f"Missing fields: {', '.join(missing_fields)}"}), 400

        create_new_event(event_data)
        return jsonify({"message": "Event created successfully"}), 201
    except Exception as e:
        print(f"Error in create_event_route: {e}")  # Debugging log
        return jsonify({"error": str(e)}), 500
