from database.connection import get_cursor, commit_db
from database.queries.activity_queries import (
    CREATE_SELF_TRAINING,
    CREATE_TRAINING,
    GET_TRAININGS_FOR_SWIMMER,
    GET_SELF_TRAININGS_FOR_SWIMMER,
    ADD_TO_CART,
    GET_CART_ITEMS,
    REMOVE_FROM_CART
)


class TrainingService:
    @staticmethod
    def create_self_training(swimmer_id, pool_id, date, start_time, end_time):
        try:
            cursor = get_cursor()
            cursor.execute(CREATE_SELF_TRAINING, (swimmer_id, pool_id, date, start_time, end_time))
            commit_db()
            return {"message": "Self-training created successfully."}
        except Exception as e:
            print(f"Error creating self-training: {e}")
            raise

    @staticmethod
    def create_training(coach_id, pool_id, date, start_time, end_time, name, level, course_content):
        try:
            cursor = get_cursor()
            cursor.execute(CREATE_TRAINING, (coach_id, pool_id, date, start_time, end_time, name, level, course_content))
            commit_db()
            return {"message": "Training created successfully."}
        except Exception as e:
            print(f"Error creating training: {e}")
            raise

    @staticmethod
    def get_trainings_for_swimmer(swim_level):
        try:
            cursor = get_cursor()
            cursor.execute(GET_TRAININGS_FOR_SWIMMER, (swim_level,))
            trainings = cursor.fetchall()
            return trainings
        except Exception as e:
            print(f"Error fetching trainings: {e}")
            raise

    @staticmethod
    def get_self_trainings_for_swimmer(swimmer_id):
        try:
            cursor = get_cursor()
            cursor.execute(GET_SELF_TRAININGS_FOR_SWIMMER, (swimmer_id,))
            self_trainings = cursor.fetchall()
            return self_trainings
        except Exception as e:
            print(f"Error fetching self-trainings: {e}")
            raise

    @staticmethod
    def add_to_cart(swimmer_id, activity_type, activity_id, quantity):
        try:
            cursor = get_cursor()
            cursor.execute(ADD_TO_CART, (swimmer_id, activity_type, activity_id, quantity))
            commit_db()
            return {"message": "Activity added to cart successfully."}
        except Exception as e:
            print(f"Error adding activity to cart: {e}")
            raise

    @staticmethod
    def get_cart_items(swimmer_id):
        try:
            cursor = get_cursor()
            cursor.execute(GET_CART_ITEMS, (swimmer_id,))
            cart_items = cursor.fetchall()
            return cart_items
        except Exception as e:
            print(f"Error fetching cart items: {e}")
            raise

    @staticmethod
    def remove_from_cart(cart_id):
        try:
            cursor = get_cursor()
            cursor.execute(REMOVE_FROM_CART, (cart_id,))
            commit_db()
            return {"message": "Item removed from cart."}
        except Exception as e:
            print(f"Error removing item from cart: {e}")
            raise
