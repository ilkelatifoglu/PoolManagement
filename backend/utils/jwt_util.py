from datetime import datetime, timedelta
import jwt
from functools import wraps
from flask import request, jsonify
import os

JWT_SECRET = os.getenv('JWT_SECRET')
JWT_EXPIRATION = 24  # hours

def generate_token(user_data):
    expiration = datetime.utcnow() + timedelta(hours=JWT_EXPIRATION)
    token = jwt.encode({
        'user_id': user_data['user_id'],
        'email': user_data['email'],
        'user_type': user_data['user_type'],
        'exp': expiration
    }, JWT_SECRET, algorithm='HS256')
    return token

def verify_token(token):
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing'}), 401

        token = token.split(' ')[1] if token.startswith('Bearer ') else token
        user_data = verify_token(token)

        if not user_data:
            return jsonify({'message': 'Invalid token'}), 401

        print(f"Decoded user_data: {user_data}")  # Debugging
        return f(user_data, *args, **kwargs)
    return decorated
