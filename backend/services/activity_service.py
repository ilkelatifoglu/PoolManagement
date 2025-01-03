from database.connection import get_cursor, commit_db
from database.queries.activity_queries import GET_SWIMMER_ACTIVITIES, GET_COACH_ACTIVITIES

class ActivityService:
    @staticmethod
    def get_swimmer_activities(swimmer_id):
        try:
            cursor = get_cursor()
            cursor.execute(GET_SWIMMER_ACTIVITIES, (swimmer_id, swimmer_id, swimmer_id))
            activities = cursor.fetchall()
            print("Swimmer activities:", activities)

            # Serialize the activities for JSON response
            serialized_activities = []
            for activity in activities:
                serialized_activities.append({
                    "activity_id": activity["activity_id"],
                    "status": activity["status"],
                    "activity_name": activity["activity_name"],
                    "activity_date": activity["activity_date"].strftime('%Y-%m-%d'),  # Format date
                    "start_time": str(activity["start_time"]),  # Format timedelta to string
                    "end_time": str(activity["end_time"]),      # Format timedelta to string
                    "pool_name": activity["pool_name"],
                    "instructor_name": activity["instructor_name"] or "N/A"
                })

            return serialized_activities
        except Exception as e:
            print(f"Error fetching swimmer activities: {e}")
            raise

    @staticmethod
    def get_coach_activities(coach_id):
        try:
            cursor = get_cursor()
            cursor.execute(GET_COACH_ACTIVITIES, (coach_id, coach_id))
            activities = cursor.fetchall()
            print("Coach activities:", activities)

            # Serialize the activities for JSON response
            serialized_activities = []
            for activity in activities:
                serialized_activities.append({
                    "activity_id": activity["activity_id"],
                    "activity_name": activity["activity_name"],
                    "status": activity["status"],
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

    @staticmethod
    def cancel_activity(swimmer_id, activity_id):
        cursor = get_cursor()
        try:
            # Update the status in the booking table
            update_query = """
                UPDATE booking 
                SET status = 'CANCELLED' 
                WHERE booking_id = %s
            """
            cursor.execute(update_query, (activity_id,))
            commit_db()
            return "Activity canceled successfully."
        except Exception as e:
            print(f"Error canceling activity: {e}")
            raise

    @staticmethod
    def withdraw_class(user_id, class_id):
        """
        Remove the schedule entry for a swimmer and class.
        """
        cursor = get_cursor()
        try:
            # Check if the entry exists
            cursor.execute(
                "SELECT * FROM schedules WHERE swimmer_id = %s AND class_id = %s",
                (user_id, class_id)
            )
            schedule_entry = cursor.fetchone()

            if not schedule_entry:
                return "Schedule entry not found."

            # Delete the entry
            cursor.execute(
                "DELETE FROM schedules WHERE swimmer_id = %s AND class_id = %s",
                (user_id, class_id)
            )
            commit_db()
            return "Class withdrawn successfully."
        except Exception as e:
            print(f"Error in withdraw_class: {e}")
            raise

    from database.connection import get_cursor, commit_db

    @staticmethod
    def cancel_class(class_id):
        cursor = get_cursor()
        try:
            # Check if the class exists and is active
            cursor.execute("SELECT status FROM booking WHERE booking_id = %s", (class_id,))
            class_status = cursor.fetchone()

            if not class_status:
                return "Class not found."
            if class_status['status'] == 'CANCELLED':
                return "Class is already cancelled."

            # Update the class status to CANCELLED
            update_query = "UPDATE booking SET status = 'CANCELLED' WHERE booking_id = %s"
            cursor.execute(update_query, (class_id,))

            commit_db()
            return "Class cancelled successfully."
        except Exception as e:
            print(f"Error canceling class with class_id={class_id}: {e}")
            raise
