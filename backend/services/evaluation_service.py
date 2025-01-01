from datetime import datetime
from database.connection import get_cursor, commit_db
from database.queries.evaluation_queries import GET_EVAL_ITEMS

class EvaluationService:
    @staticmethod
    def get_eval_items(swimmer_id):
        cursor = get_cursor()
        cursor.execute(GET_EVAL_ITEMS, {"swimmer_id": swimmer_id})
        rows = cursor.fetchall()
        if not rows:
                return [] 

        eval_items = []
        for row in rows:

            formatted_date = row['Date'].strftime("%a, %d %b %Y") if row['Date'] else None
            formatted_time = " - ".join(
                time.strftime("%H:%M") for time in map(lambda t: datetime.strptime(t, "%H:%M:%S"), row['Time'].split(" - "))
            ) if row['Time'] else None

            # Access using dictionary keys
            eval_items.append({
                "Reservation": row['Reservation'],
                "Coach": row['Coach'],
                "Date": formatted_date,  # Use formatted date
                "Time": formatted_time,  # Use formatted time
                "Pool": row['Pool'],
                "Price": float(row['Price']),  # Convert Decimal to float for JSON serialization
                "BookingID": row['booking_id'],
            })

        return eval_items

