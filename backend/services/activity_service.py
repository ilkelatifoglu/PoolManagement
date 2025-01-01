from database.connection import get_cursor
from database.queries.activity_queries import GET_SWIMMER_ACTIVITIES, GET_COACH_ACTIVITIES

class ActivityService:
    @staticmethod
    def get_swimmer_activities(swimmer_id):
        try:
            cursor = get_cursor()
            cursor.execute(GET_SWIMMER_ACTIVITIES, (swimmer_id,))
            activities = cursor.fetchall()
            print("Swimmer activities:", activities)  # Debug log
            return activities
        except Exception as e:
            print(f"Error fetching swimmer activities: {e}")
            raise

    @staticmethod
    def get_coach_activities(coach_id):
        try:
            cursor = get_cursor()
            cursor.execute(GET_COACH_ACTIVITIES, (coach_id,))
            activities = cursor.fetchall()
            print("Coach activities:", activities)  # Debug log
            return activities
        except Exception as e:
            print(f"Error fetching coach activities: {e}")
            raise


