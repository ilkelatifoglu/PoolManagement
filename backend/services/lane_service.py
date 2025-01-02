from flask import request, jsonify
from database.connection import get_cursor
from database.queries.lane_queries import GET_AVAILABLE_LANES

class LaneService:
    @staticmethod
    def get_available_lanes():
        try:
            # Extract query parameters
            pool_id = request.args.get("pool_id")
            session_id = request.args.get("session_id")

            # Validate inputs
            if not pool_id or not session_id:
                return jsonify({"error": "pool_id and session_id are required"}), 400

            cursor = get_cursor()

            # Execute the query
            cursor.execute(GET_AVAILABLE_LANES, {"pool_id": pool_id, "session_id": session_id})
            lanes = cursor.fetchall()

            # Return the results
            return jsonify([{"lane_number": lane["lane_number"], "type": lane["type"]} for lane in lanes]), 200
        except Exception as e:
            print(f"Error fetching available lanes: {e}")
            return jsonify({"error": str(e)}), 500
