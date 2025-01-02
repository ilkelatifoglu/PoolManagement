from database.connection import get_cursor, commit_db
from database.queries.training_queries import (
    GET_SELF_TRAININGS,
    ADD_TRAINING,
    ADD_SELF_TRAINING,
    DELETE_TRAINING,
    DELETE_SELF_TRAINING,
    GET_TRAININGS_FOR_SWIMMERS,
    GET_TRAININGS_FOR_COACH,
    CREATE_BUSY_SESSIONS_VIEW, GET_AVAILABLE_COACHES
)
from database.queries.booking_queries import ADD_BOOKING
from datetime import timedelta

class TrainingService:

    @staticmethod
    def get_self_trainings(swimmer_id):
        try:
            cursor = get_cursor()
            print(f"Fetching self-trainings for swimmer_id: {swimmer_id}")
            cursor.execute(GET_SELF_TRAININGS, (swimmer_id,))
            self_trainings = cursor.fetchall()

            # Convert timedelta fields to a JSON-serializable format
            for training in self_trainings:
                if isinstance(training['start_time'], timedelta):
                    training['start_time'] = str(training['start_time'])  # Convert to HH:MM:SS format
                if isinstance(training['end_time'], timedelta):
                    training['end_time'] = str(training['end_time'])  # Convert to HH:MM:SS format

            # print(f"Fetched self-trainings for swimmer_id {swimmer_id}: {self_trainings}")
            return [dict(training) for training in self_trainings]

        except Exception as e:
            print(f"Error in get_self_trainings: {e}")
            raise

    @staticmethod
    def add_training(swimmer_id, session_id, pool_id, lane_number, goal, coach_id):
        try:
            cursor = get_cursor()

            # Step 1: Create a booking
            print("Creating booking...")
            cursor.execute(ADD_BOOKING, (session_id, pool_id, lane_number, 'READY'))
            booking_id = cursor.lastrowid  # Get the generated booking_id
            print(f"Booking created with ID: {booking_id}")

            # Step 2: Create the training entry
            print(f"Creating training with booking_id: {booking_id}, swimmer_id: {swimmer_id}, coach_id: {coach_id}, goal: {goal}")
            cursor.execute(ADD_TRAINING, (booking_id, swimmer_id, coach_id, goal))  # Include coach_id in the query
            print(f"Training created with ID: {booking_id}")

            # Commit transaction
            commit_db()
            return {"message": "Training created successfully", "training_id": booking_id}

        except Exception as e:
            print(f"Error in add_training: {e}")
            raise Exception(f"Error in add_training: {e}")


    @staticmethod
    def add_self_training(swimmer_id, session_id, pool_id, lane_number, goal):
        try:
            cursor = get_cursor()

            # Step 1: Create a booking
            print("Creating booking...")
            cursor.execute(ADD_BOOKING, (session_id, pool_id, lane_number, 'READY'))
            booking_id = cursor.lastrowid  # Get the generated booking_id
            print(f"Booking created with ID: {booking_id}")

            # Step 2: Use booking_id as self_training_id
            print("Creating self-training...")
            cursor.execute(ADD_SELF_TRAINING, (booking_id, swimmer_id, goal))
            print(f"Self-training created with ID: {booking_id}")

            # Commit the transaction
            commit_db()
            return {"message": "Self-training created successfully", "self_training_id": booking_id}

        except Exception as e:
            print(f"Error in add_self_training: {e}")
            raise Exception(f"Error in add_self_training: {e}")


    @staticmethod
    def delete_training(training_id, swimmer_id):
        try:
            cursor = get_cursor()
            cursor.execute(DELETE_TRAINING, (training_id, swimmer_id))
            commit_db()
        except Exception as e:
            print(f"Error in delete_training: {e}")
            raise

    @staticmethod
    def delete_self_training(self_training_id, swimmer_id):
        try:
            cursor = get_cursor()
            cursor.execute(DELETE_SELF_TRAINING, (self_training_id, swimmer_id))
            commit_db()
        except Exception as e:
            print(f"Error in delete_self_training: {e}")
            raise

    @staticmethod
    def get_trainings_for_swimmers():
        try:
            cursor = get_cursor()
            cursor.execute(GET_TRAININGS_FOR_SWIMMERS)
            trainings = cursor.fetchall()
            return [dict(training) for training in trainings]
        except Exception as e:
            raise Exception(f"Error fetching trainings for swimmers: {str(e)}")

    @staticmethod
    def get_trainings_for_coach(coach_id):
        try:
            cursor = get_cursor()
            cursor.execute(GET_TRAININGS_FOR_COACH, (coach_id,))
            trainings = cursor.fetchall()
            return [dict(training) for training in trainings]
        except Exception as e:
            raise Exception(f"Error fetching trainings for coach: {str(e)}")

    @staticmethod
    def get_available_coaches():
        try:
            cursor = get_cursor()

            # Step 1: Refresh the view
            cursor.execute("DROP VIEW IF EXISTS busy_sessions;")
            cursor.execute(CREATE_BUSY_SESSIONS_VIEW)

            # Step 2: Fetch available coaches
            cursor.execute(GET_AVAILABLE_COACHES)
            coaches = cursor.fetchall()

            if not coaches:
                print("No available coaches found.")

            # Format the response
            formatted_coaches = [
                {
                    "coach_id": coach["coach_id"],
                    "coach_name": coach["coach_name"],
                    "specialization": coach["specialization"],
                    "session_id": coach["session_id"],
                    "pool_id": coach["pool_id"],
                    "date": coach["date"].strftime("%Y-%m-%d"),  # Format date for JSON response
                    "start_time": str(coach["start_time"]),
                    "end_time": str(coach["end_time"]),
                }
                for coach in coaches
            ]

            return formatted_coaches

        except Exception as e:
            print(f"Error fetching available coaches: {e}")
            raise Exception(f"Error fetching available coaches: {str(e)}")
