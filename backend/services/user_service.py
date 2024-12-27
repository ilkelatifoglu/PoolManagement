from database.connection import get_cursor, commit_db
from database.queries.user_queries import *

class UserService:
    @staticmethod
    def get_profile(user_id):
        try:
            cursor = get_cursor()
            cursor.execute(GET_USER_PROFILE, (user_id,))
            profile = cursor.fetchone()
            
            if not profile:
                raise ValueError("User not found")
                
            return profile
        except Exception as e:
            print(f"Error fetching profile: {e}")
            raise

    @staticmethod
    def update_profile(user_id, data):
        try:
            cursor = get_cursor()
            
            # Update basic user info
            cursor.execute(UPDATE_USER_PROFILE, (
                data.get('name'),
                data.get('gender'),
                data.get('blood_type'),
                user_id
            ))

            # Update phone if provided
            if 'phone_number' in data:
                cursor.execute(UPDATE_USER_PHONE, (
                    user_id,
                    data['phone_number']
                ))

            # Update role-specific info
            if 'swim_level' in data:
                cursor.execute(UPDATE_SWIMMER_PROFILE, (
                    data['swim_level'],
                    user_id
                ))

            commit_db()
            return self.get_profile(user_id)
        except Exception as e:
            print(f"Error updating profile: {e}")
            raise

    @staticmethod
    def get_balance(user_id):
        try:
            cursor = get_cursor()
            cursor.execute(GET_USER_BALANCE, (user_id,))
            result = cursor.fetchone()
            return result['balance'] if result else 0
        except Exception as e:
            print(f"Error getting balance: {e}")
            raise

    @staticmethod
    def update_balance(user_id, amount):
        try:
            cursor = get_cursor()
            cursor.execute(UPDATE_USER_BALANCE, (amount, user_id))
            commit_db()
            return self.get_balance(user_id)
        except Exception as e:
            print(f"Error updating balance: {e}")
            raise