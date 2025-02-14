from flask import Blueprint, jsonify, request
from services.cart_service import CartService
from utils.jwt_util import token_required

cart_bp = Blueprint('cart', __name__)

@cart_bp.route('/cart', methods=['GET'])
@token_required
def get_cart(current_user):
    if request.method == 'OPTIONS':
    # Respond to preflight request
        return '', 200
    cart_items = CartService.get_cart_items(current_user['user_id'])
    return jsonify(cart_items)

@cart_bp.route('/cart/<int:booking_id>', methods=['DELETE'])
@token_required
def delete_cart_item(current_user, booking_id):
    """
    Deletes a specific item from the cart based on booking_id and reservation type.
    """
    data = request.get_json()
    reservation_type = data.get("reservation_type")  # Fetch the reservation type

    if not reservation_type:
        return jsonify({"error": "Reservation type is required"}), 400

    CartService.delete_cart_item(booking_id, reservation_type, current_user['user_id'])
    return jsonify({'message': 'Item removed successfully'})


@cart_bp.route('/balance', methods=['GET'])
@token_required
def get_balance(current_user):
    if request.method == 'OPTIONS':
        return '', 200
    balance = CartService.get_balance(current_user['user_id'])
    return jsonify({"balance": balance})

@cart_bp.route('/confirm', methods=['POST'])
@token_required
def confirm_purchase(current_user):
    data = request.json
    total_price = data.get("total_price")
    booking_id = data.get("booking_id")
    reservation_type = data.get("reservation_type")

    CartService.confirm_purchase(booking_id, reservation_type, current_user['user_id'], total_price)
    return jsonify({"message": "Purchase confirmed successfully"})

@cart_bp.route('/add-money', methods=['POST'])
@token_required
def add_money_to_balance(current_user):
    data = request.json
    amount = abs(data.get("amount"))  # Ensure positive value

    if not amount or amount <= 0:
        return jsonify({"error": "Invalid amount"}), 400

    try:
        CartService.add_money_to_balance(current_user['user_id'], amount)
        return jsonify({"message": "Money added successfully!"})
    except Exception as e:
        print(f"Error adding money: {e}")
        return jsonify({"error": "Failed to add money"}), 500
    
@cart_bp.route("/available-memberships", methods=["GET"])
@token_required
def get_available_memberships(current_user):
    try:
        memberships = CartService.get_available_memberships(current_user["user_id"])
        return jsonify(memberships)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@cart_bp.route("/become-member", methods=["POST"])
@token_required
def become_member(current_user):
    try:
        data = request.get_json()
        membership_id = data.get("membership_id")
        if not membership_id:
            return jsonify({"error": "Membership ID is required"}), 400

        CartService.become_member(current_user["user_id"], membership_id)
        return jsonify({"message": "Membership added successfully!"})
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "An unexpected error occurred"}), 500