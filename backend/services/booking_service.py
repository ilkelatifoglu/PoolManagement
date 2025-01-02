from database.connection import get_cursor, commit_db
from database.queries.training_queries import CANCEL_BOOKED_TRAINING, CANCEL_SELF_TRAINING

class BookingService:
    @staticmethod
    def cancel_training(booking_id, swimmer_id):
        try:
            cursor = get_cursor()
            cursor.execute(CANCEL_BOOKED_TRAINING, (booking_id, swimmer_id))
            commit_db()
        except Exception as e:
            print(f"Error canceling training booking: {e}")
            raise

    @staticmethod
    def cancel_self_training(self_training_id, swimmer_id):
        try:
            cursor = get_cursor()
            cursor.execute(CANCEL_SELF_TRAINING, (self_training_id, swimmer_id))
            commit_db()
        except Exception as e:
            print(f"Error canceling self-training: {e}")
            raise
