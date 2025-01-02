from flask import Blueprint, jsonify
from services.session_service import SessionService

session_routes = Blueprint("session_routes", __name__)

@session_routes.route("/sessions", methods=["GET"])
def get_sessions():
    try:
        sessions = SessionService.get_all_sessions()
        return jsonify(sessions), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@session_routes.route("/sessions/available", methods=["GET"])
def get_sessions_with_available_lanes():
    try:
        sessions = SessionService.get_available_sessions()
        return jsonify(sessions), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
