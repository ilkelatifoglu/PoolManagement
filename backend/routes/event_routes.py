from flask import Blueprint, request, jsonify
from services.event_service import create_new_event
from services.event_service import create_new_event, get_ready_events, register_to_event, cancel_event_by_id, get_all_ready_events, fetch_event_types
from utils.jwt_util import token_required

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
        print(f"Error in create_event_route: {str(e)}")
        return jsonify({"error": f"Failed to create event. Details: {str(e)}"}), 500


@event_routes.route('/events-ready', methods=['GET'], endpoint="get_ready_events")
def get_ready_events_route():
    try:
        swimmer_id = request.args.get('swimmer_id')  # Ensure swimmer_id is passed
        print(f"Received swimmer_id: {swimmer_id}")  # Debugging log
        if not swimmer_id:
            return jsonify({"error": "Missing swimmer_id"}), 400

        events = get_ready_events(swimmer_id)
        print(f"Fetched events: {events}")  # Debugging log
        return jsonify(events), 200
    except Exception as e:
        print(f"Error in /events-ready endpoint: {str(e)}")  # Debugging log
        return jsonify({"error": str(e)}), 500



@event_routes.route('/events/attend', methods=['POST'], endpoint="attend_event")
def register_to_event_route():
    try:
        data = request.json
        if not data.get('swimmer_id') or not data.get('event_id'):
            return jsonify({"error": "Missing swimmer_id or event_id"}), 400
        register_to_event(data['swimmer_id'], data['event_id'])
        return jsonify({"message": "Successfully registered for the event"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@event_routes.route('/cancel-event', methods=['POST'])
@token_required
def cancel_event_route(user_data):
    try:
        data = request.json
        if 'event_id' not in data:
            return jsonify({"error": "Missing event_id"}), 400
        
        print(f"Received event_id for cancellation: {data['event_id']}")
        cancel_event_by_id(data['event_id'])
        return jsonify({"message": "Class event successfully"}), 200
    except Exception as e:
        print(f"Error in cancel_event_route: {str(e)}")
        return jsonify({"error": str(e)}), 500

@event_routes.route('/all-ready-events', methods=['GET'])
def get_all_ready_events_route():
    try:
        events = get_all_ready_events()
        return jsonify(events), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@event_routes.route('/event-types', methods=['GET'])
def get_event_types():
    try:
        event_types = fetch_event_types()
        return jsonify(event_types), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
