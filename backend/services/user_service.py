from database.connection import get_cursor, commit_db
from database.queries.user_queries import *
import datetime

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

    @staticmethod
    def get_schedule(user_id):
        try:
            cursor = get_cursor()
            cursor.execute(GET_USER_SCHEDULE, (user_id,))
            schedule = cursor.fetchall()
            
            formatted_schedule = {}
            for slot in schedule:
                day = slot['day_of_week']
                if day not in formatted_schedule:
                    formatted_schedule[day] = {}
                
                time_str = slot['time_slot'].strftime('%H:00') if hasattr(slot['time_slot'], 'strftime') else f"{slot['time_slot']}:00"
                formatted_schedule[day][time_str] = slot['is_available']
                
            return formatted_schedule
        except Exception as e:
            raise

    @staticmethod
    def update_schedule(user_id, schedule_data):
        try:
            cursor = get_cursor()
            cursor.execute(DELETE_USER_SCHEDULE, (user_id,))
            
            for day, times in schedule_data.items():
                for time_slot, is_available in times.items():
                    if is_available:
                        cursor.execute(UPDATE_USER_SCHEDULE, (
                            user_id,
                            day,
                            time_slot,
                            is_available
                        ))
            
            commit_db()
            return True
        except Exception as e:
            raise