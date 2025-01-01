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

