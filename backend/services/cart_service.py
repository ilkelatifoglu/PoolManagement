from datetime import datetime
from database.connection import get_cursor, commit_db
from database.queries.cart_queries import GET_CART_ITEMS, DELETE_CART_ITEM, GET_BALANCE, DELETE_FROM_SCHEDULES, UPDATE_TRAINING_IS_PAID, UPDATE_SELF_TRAINING_IS_PAID, UPDATE_SCHEDULES_IS_PAID, UPDATE_BALANCE_ON_PURCHASE

class CartService:
    @staticmethod
    def get_cart_items(swimmer_id):
        cursor = get_cursor()
        cursor.execute(GET_CART_ITEMS, {"swimmer_id": swimmer_id})
        rows = cursor.fetchall()
        if not rows:
                return [] 

        cart_items = []
        for row in rows:
            # Format date and time
            formatted_date = row['Date'].strftime("%a, %d %b %Y") if row['Date'] else None
            formatted_time = " - ".join(
                time.strftime("%H:%M") for time in map(lambda t: datetime.strptime(t, "%H:%M:%S"), row['Time'].split(" - "))
            ) if row['Time'] else None

            # Access using dictionary keys
            cart_items.append({
                "Reservation": row['Reservation'],
                "Coach": row['Coach'],
                "Date": formatted_date,  # Use formatted date
                "Time": formatted_time,  # Use formatted time
                "Pool": row['Pool'],
                "Price": float(row['Price']),  # Convert Decimal to float for JSON serialization
                "BookingID": row['booking_id'],
            })

        return cart_items

    @staticmethod
    def delete_cart_item(booking_id, reservation_type, swimmer_id):
        cursor = get_cursor()

        if reservation_type == "Class":
            # Delete only the specific swimmer's schedule entry for the class
            cursor.execute(DELETE_FROM_SCHEDULES, (booking_id, swimmer_id))
        else:
            # Delete from booking for other reservation types
            cursor.execute(DELETE_CART_ITEM, (booking_id,))

        commit_db()

    @staticmethod
    def get_balance(swimmer_id):
        cursor = get_cursor()
        cursor.execute(GET_BALANCE, {"swimmer_id": swimmer_id})
        result = cursor.fetchone()
        if result:
            return result["balance"]  # Assuming the column is named 'balance'
        return 0  # Return 0 if no balance is found

    @staticmethod
    def confirm_purchase(booking_id, reservation_type, swimmer_id, total_price):
        cursor = get_cursor()
        try:
            if reservation_type == "Training":
                cursor.execute(UPDATE_TRAINING_IS_PAID, {"booking_id": booking_id})
            elif reservation_type == "Personal Use":
                cursor.execute(UPDATE_SELF_TRAINING_IS_PAID, {"booking_id": booking_id})
            elif reservation_type == "Class":
                cursor.execute(UPDATE_SCHEDULES_IS_PAID, {"booking_id": booking_id, "swimmer_id": swimmer_id})
            
            # Deduct the total price from the swimmer's balance
            cursor.execute(UPDATE_BALANCE_ON_PURCHASE, {"amount": total_price, "swimmer_id": swimmer_id})
            
            commit_db()
        except Exception as e:
            print(f"Error during purchase confirmation: {e}")
            raise