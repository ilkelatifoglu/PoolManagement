from werkzeug.security import generate_password_hash, check_password_hash
from database.connection import get_cursor, commit_db
from database.queries.auth_queries import *
from utils.jwt_util import generate_token

class AuthService:
    @staticmethod
    def login(email, password):
        cursor = get_cursor()
        cursor.execute(LOGIN_USER, (email,))
        user = cursor.fetchone()

        if user and check_password_hash(user['password'], password):
            token = generate_token(user)
            return {'token': token, 'user': user}
        return None

    @staticmethod
    def register(user_data):
        cursor = get_cursor()
        try:
            # Hash password
            hashed_password = generate_password_hash(user_data['password'])
            
            # Insert user
            cursor.execute(REGISTER_USER, (
                user_data['name'],
                user_data['gender'],
                user_data['email'],
                hashed_password,
                user_data['birth_date'],
                user_data['blood_type']
            ))
            user_id = cursor.lastrowid

            # Insert phone
            cursor.execute(REGISTER_PHONE, (user_id, user_data['phone_number']))

            # Insert swimmer details
            cursor.execute(REGISTER_SWIMMER, (user_id, user_data['swim_level']))

            commit_db()
            return user_id
        except Exception as e:
            print(f"Registration error: {e}")
            raise