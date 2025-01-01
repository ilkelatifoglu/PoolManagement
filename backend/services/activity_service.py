from database.connection import get_cursor
from database.queries.activity_queries import GET_SWIMMER_ACTIVITIES, GET_COACH_ACTIVITIES

class ActivityService:
    @staticmethod
    def get_swimmer_activities(swimmer_id):
        try:
            cursor = get_cursor()
            cursor.execute(GET_SWIMMER_ACTIVITIES, (swimmer_id,))
            activities = cursor.fetchall()
            print("Swimmer activities:", activities)

            # Serialize the activities for JSON response
            serialized_activities = []
            for activity in activities:
                serialized_activities.append({
                    "activity_name": activity["activity_name"],
                    "activity_date": activity["activity_date"].strftime('%Y-%m-%d'),  # Format date
                    "start_time": str(activity["start_time"]),  # Format timedelta to string
                    "end_time": str(activity["end_time"]),      # Format timedelta to string
                    "pool_name": activity["pool_name"],
                    "instructor_name": activity["instructor_name"]
                })

            return serialized_activities
        except Exception as e:
            print(f"Error fetching swimmer activities: {e}")
            raise

    @staticmethod
    def get_coach_activities(coach_id):
        try:
            cursor = get_cursor()
            cursor.execute(GET_COACH_ACTIVITIES, (coach_id,))
            activities = cursor.fetchall()
            print("Coach activities:", activities)

            # Serialize the activities for JSON response
            serialized_activities = []
            for activity in activities:
                serialized_activities.append({
                    "activity_name": activity["activity_name"],
                    "activity_date": activity["activity_date"].strftime('%Y-%m-%d'),  # Format date
                    "start_time": str(activity["start_time"]),  # Format timedelta to string
                    "end_time": str(activity["end_time"]),      # Format timedelta to string
                    "pool_name": activity["pool_name"],
                    "participant_count": activity["participant_count"]
                })

            return serialized_activities
        except Exception as e:
            print(f"Error fetching coach activities: {e}")
            raise

