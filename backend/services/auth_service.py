from werkzeug.security import generate_password_hash, check_password_hash
from database.connection import get_cursor, commit_db
from database.queries.auth_queries import *
from utils.jwt_util import generate_token
from utils.email import send_password_reset_email
from flask import current_app
import datetime
import jwt

class AuthService:
    @staticmethod
    def login(email, password):
        hashed_password = generate_password_hash('john123')
        print("Hashed Password:", hashed_password)
        cursor = get_cursor()
        cursor.execute(LOGIN_USER, (email,))
        user = cursor.fetchone()
        print("User fetched from database:", user) 

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
            
            # Insert phone - only pass phone_number since LAST_INSERT_ID() is used
            cursor.execute(REGISTER_PHONE, (user_data['phone_number'],))

            # Insert swimmer - only pass swim_level since LAST_INSERT_ID() is used
            cursor.execute(REGISTER_SWIMMER, (user_data['swim_level'],))

            commit_db()
            return cursor.lastrowid
        except Exception as e:
            print(f"Registration error: {e}")
            raise

    @staticmethod
    def initiate_password_reset(email):
        cursor = get_cursor()
        cursor.execute(CHECK_EMAIL, (email,))
        user = cursor.fetchone()
        
        if not user:
            return False

        # Generate password reset token
        token = jwt.encode({
            'user_id': user['user_id'],
            'email': user['email'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        }, current_app.config['SECRET_KEY'], algorithm='HS256')

        try:
            # Use the email utility function to send the reset email
            send_password_reset_email(email, token)
            return True
        except Exception as e:
            print(f"Email sending error: {e}")
            raise

    @staticmethod
    def reset_password(token, new_password):
        try:
            # Verify token
            payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
            user_id = payload['user_id']
            
            # Update password
            cursor = get_cursor()
            hashed_password = generate_password_hash(new_password)
            cursor.execute(UPDATE_PASSWORD, (hashed_password, user_id))
            commit_db()
            return True
        except jwt.ExpiredSignatureError:
            raise Exception("Password reset link has expired")
        except jwt.InvalidTokenError:
            raise Exception("Invalid reset token")
        except Exception as e:
            print(f"Password reset error: {e}")
            raise