from database.connection import get_cursor, commit_db
from database.queries.user_queries import *
import datetime
from werkzeug.security import check_password_hash, generate_password_hash

class UserService:
    @staticmethod
    def get_profile(user_id):
        try:
            cursor = get_cursor()
            
            # Get basic user info
            cursor.execute("""
                SELECT u.*, up.phone_number 
                FROM user u 
                LEFT JOIN user_phone up ON u.user_id = up.user_id 
                WHERE u.user_id = %s
            """, (user_id,))
            
            profile = cursor.fetchone()
            
            if not profile:
                raise ValueError("User not found")
                
            # Convert to dict and remove sensitive info
            profile_dict = dict(profile)
            profile_dict.pop('password', None)  # Remove password hash
            
            return profile_dict
            
        except Exception as e:
            print(f"Error in get_profile: {e}")
            raise

    @staticmethod
    def update_profile(user_id, data):
        try:
            cursor = get_cursor()
            print(f"Updating profile for user_id: {user_id}")  # Debug log
            print(f"Update data received: {data}")  # Debug log
            
            # Update basic user info
            update_user_query = """
                UPDATE user 
                SET name = %s
                WHERE user_id = %s
            """
            cursor.execute(update_user_query, (
                data.get('name'),
                user_id
            ))
            print(f"Basic user info updated. Rows affected: {cursor.rowcount}")  # Debug log

            # Update phone if provided
            if 'phone_number' in data:
                print(f"Updating phone number to: {data['phone_number']}")  # Debug log
                
                # First check if phone number exists
                check_phone_query = """
                    SELECT * FROM user_phone 
                    WHERE user_id = %s
                """
                cursor.execute(check_phone_query, (user_id,))
                exists = cursor.fetchone()
                
                if exists:
                    # Update existing phone
                    update_phone_query = """
                        UPDATE user_phone 
                        SET phone_number = %s 
                        WHERE user_id = %s
                    """
                    cursor.execute(update_phone_query, (data['phone_number'], user_id))
                    print("Phone number updated")  # Debug log
                else:
                    # Insert new phone
                    insert_phone_query = """
                        INSERT INTO user_phone (user_id, phone_number)
                        VALUES (%s, %s)
                    """
                    cursor.execute(insert_phone_query, (user_id, data['phone_number']))
                    print("Phone number inserted")  # Debug log

            commit_db()
            return True
            
        except Exception as e:
            print(f"Error in update_profile: {str(e)}")  # Debug log
            import traceback
            print(traceback.format_exc())  # Print full stack trace
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

    @staticmethod
    def update_password(user_id, current_password, new_password):
        try:
            cursor = get_cursor()
            
            # First verify current password
            cursor.execute("SELECT password FROM user WHERE user_id = %s", (user_id,))
            user = cursor.fetchone()
            
            if not user or not check_password_hash(user['password'], current_password):
                return False
            
            # Update to new password
            hashed_password = generate_password_hash(new_password)
            cursor.execute("UPDATE user SET password = %s WHERE user_id = %s", 
                          (hashed_password, user_id))
            commit_db()
            return True
            
        except Exception as e:
            print(f"Error updating password: {e}")
            raise

    @staticmethod
    def get_swimmer_memberships(swimmer_id):
        """
        Fetch memberships for a specific swimmer.
        """
        cursor = get_cursor()
        try:
            cursor.execute(GET_SWIMMER_MEMBERSHIPS, (swimmer_id,))
            memberships = cursor.fetchall()
            return memberships
        except Exception as e:
            print(f"Error fetching memberships for swimmer_id={swimmer_id}: {e}")
            raise