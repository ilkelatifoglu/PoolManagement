from flask import Blueprint, jsonify
from services.pool_service import get_all_pools, PoolService

pool_routes = Blueprint('pool_routes', __name__)

@pool_routes.route('/pools', methods=['GET'])
def get_pools():
    try:
        pools = get_all_pools()
        return jsonify(pools), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@pool_routes.route('/pools/available', methods=['GET'])
def get_pools_with_available_sessions():
    try:
        pools = PoolService.get_pools_with_available_sessions()
        return jsonify(pools), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
