from datetime import datetime
from database.connection import get_cursor, commit_db
from database.queries.evaluation_queries import GET_CLASS_EVALUATIONS_FOR_COACH, GET_COACH_AVERAGE_RATING, GET_EVAL_ITEMS, GET_EVALUATIONS_FOR_COACH, INSERT_EVALUATION

class EvaluationService:
    @staticmethod
    def get_eval_items(swimmer_id):
        cursor = get_cursor()
        cursor.execute(GET_EVAL_ITEMS, {"swimmer_id": swimmer_id})
        rows = cursor.fetchall()
        print(rows)  # Debugging

        if not rows:
            return []

        eval_items = []
        for row in rows:
            formatted_date = row['Date'].strftime("%a, %d %b %Y") if row['Date'] else None
            formatted_time = " - ".join(
                time.strftime("%H:%M") for time in map(lambda t: datetime.strptime(t, "%H:%M:%S"), row['Time'].split(" - "))
            ) if row['Time'] else None

            eval_items.append({
                "Reservation": row['Reservation'],
                "Coach": row['Coach'],
                "Date": formatted_date,
                "Time": formatted_time,
                "Pool": row['Pool'],
                "Price": float(row['Price']),
                "BookingID": row['booking_id'],
                "CoachID": row.get('CoachID'),
                "ClassID": row.get('ClassID'),
                "is_evaluated_coach": row.get('is_evaluated_coach'),
                "is_evaluated_class": row.get('is_evaluated_class'),
                "is_evaluated": row.get('is_evaluated'),
            })

        return eval_items

    @staticmethod
    def save_evaluation(data, swimmer_id):
        if not (data.get("coach_id") or data.get("class_id")):
            raise ValueError("Either coach_id or class_id must be provided.")

        cursor = get_cursor()

        # Insert evaluation only if there is input in rate or comment
        if data.get("rating") or data.get("comment"):
            if data.get("Reservation") == "Training":
                query_data = {
                    "swimmer_id": swimmer_id,
                    "coach_id": data.get("coach_id"),
                    "class_id": None,  # Class ID should be NULL for Training
                    "training_id": data["BookingId"],  # Use BookingId as training_id
                    "rating": data.get("rating"),
                    "comment": data.get("comment"),
                }
            elif data.get("Reservation") == "Class":
                query_data = {
                    "swimmer_id": swimmer_id,
                    "coach_id": data.get("coach_id"),
                    "class_id": data["BookingId"],
                    "training_id": None,  # Training ID should be NULL for Class
                    "rating": data.get("rating"),
                    "comment": data.get("comment"),
                }

            cursor.execute(INSERT_EVALUATION, query_data)

        # Update the relevant evaluation fields
        if data.get("Reservation") == "Training":
            cursor.execute(
                "UPDATE training SET is_evaluated = 1 WHERE training_id = %s",
                (data["BookingId"],),
            )
        elif data.get("Reservation") == "Class":
            print("Data received in save_evaluation:", data)
            if data.get("evaluate_coach"):
                cursor.execute(
                    "UPDATE schedules SET is_evaluated_coach = 1 WHERE class_id = %s AND swimmer_id = %s",
                    (data["class_id"], swimmer_id),
                )
            else:
                cursor.execute(
                    "UPDATE schedules SET is_evaluated_class = 1 WHERE class_id = %s AND swimmer_id = %s",
                    (data["class_id"], swimmer_id),
                )

        commit_db()

    @staticmethod
    def get_coach_average_rating():
        cursor = get_cursor()
        cursor.execute(GET_COACH_AVERAGE_RATING)
        rows = cursor.fetchall()

        return [
            {
                "CoachId": row["CoachID"],  # Make sure the key is `CoachId` to match the frontend
                "CoachName": row["CoachName"],
                "AverageRating": row["AverageRating"]
            }
            for row in rows
        ]    
    
    @staticmethod
    def get_evaluations_for_coach(coach_id):
        cursor = get_cursor()
        cursor.execute(GET_EVALUATIONS_FOR_COACH, {"coach_id": coach_id})
        rows = cursor.fetchall()

        return [
            {
                "CoachId": row["CoachID"],
                "CoachName": row["CoachName"],
                "Rating": row["Rating"],
                "ReservationType": row["ReservationType"],
                "Comment": row["Comment"],
                "SessionDate": row["SessionDate"].strftime("%a, %d %b %Y") if row["SessionDate"] else None,
                "PoolName": row["PoolName"],
                "AverageRating": float(row["AverageRating"]) if row["AverageRating"] else None,
                "EvaluationDate": row["EvaluationDate"].strftime("%a, %d %b %Y") if row["EvaluationDate"] else None,
            }
            for row in rows
        ]

    @staticmethod
    def get_class_evaluations_for_coach(coach_id):
        cursor = get_cursor()
        cursor.execute(GET_CLASS_EVALUATIONS_FOR_COACH, {"coach_id": coach_id})
        rows = cursor.fetchall()
        print("Fetched Class Evaluations for Coach from DB:", rows)  # Debugging

        return [
            {
                "CoachName": row["CoachName"],
                "ClassName": row["ClassName"],
                "SessionDate": row["SessionDate"].strftime("%a, %d %b %Y") if row["SessionDate"] else None,
                "PoolName": row["PoolName"],
                "Rating": row["Rating"],
                "AverageRating": float(row["AverageRating"]) if row["AverageRating"] else None,
                "EvaluationDate": row["EvaluationDate"].strftime("%a, %d %b %Y") if row["EvaluationDate"] else None,
                "Comment": row["Comment"],
            }
            for row in rows
        ]
