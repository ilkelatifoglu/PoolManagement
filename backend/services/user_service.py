from database.connection import get_cursor, commit_db
from database.queries.user_queries import *
from werkzeug.security import generate_password_hash, check_password_hash

class UserService:
    @staticmethod
    def create_user(user_data):
        cursor = get_cursor()
        try:
            # Hash password before storing
            hashed_password = generate_password_hash(user_data['password'])
            
            # Insert base user
            cursor.execute(CREATE_USER, (
                user_data['name'],
                user_data['gender'],
                user_data['email'],
                hashed_password,
                user_data['birth_date'],
                user_data['blood_type'],
                user_data['phone_number']
            ))
            
            user_id = cursor.lastrowid
            
            # Handle role-specific data
            if user_data['role'] == 'manager':
                cursor.execute(CREATE_MANAGER, (
                    user_id,
                    user_data['employment_date'],
                    user_data['experience_level']
                ))
            elif user_data['role'] == 'swimmer':
                cursor.execute(CREATE_SWIMMER, (
                    user_id,
                    user_data['swim_level'],
                    user_data['balance']
                ))
            # TODO: add other roles
            
            commit_db()
            return user_id
            
        except Exception as e:
            print(f"Error creating user: {e}")
            raise

    @staticmethod
    def get_user(user_id):
        cursor = get_cursor()
        cursor.execute(GET_USER_BY_ID, (user_id,))
        return cursor.fetchone()

    @staticmethod
    def get_user_by_email(email):
        cursor = get_cursor()
        cursor.execute(GET_USER_BY_EMAIL, (email,))
        return cursor.fetchone()