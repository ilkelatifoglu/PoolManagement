from flask import Blueprint, request
from services.lane_service import LaneService

lane_bp = Blueprint("lane", __name__)

@lane_bp.route("/lanes", methods=["GET"])
def get_available_lanes():
    pool_id = request.args.get("pool_id")
    session_id = request.args.get("session_id")
    return LaneService.get_available_lanes(pool_id, session_id)
