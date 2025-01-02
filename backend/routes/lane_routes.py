from flask import Blueprint
from services.lane_service import LaneService

lane_bp = Blueprint("lane", __name__)

@lane_bp.route("/lanes", methods=["GET"])
def get_available_lanes():
    return LaneService.get_available_lanes()
