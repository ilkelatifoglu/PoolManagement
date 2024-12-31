from flask import Flask, jsonify, request
from flask_cors import CORS
from database.connection import mysql, init_app
from routes.auth_routes import auth_bp
from dotenv import load_dotenv
import os

load_dotenv()

def create_app():
    app = Flask(__name__)
    
    # Configure CORS with specific settings
    CORS(app,
         supports_credentials=True,
         origins=["http://localhost:3000"],
         allow_headers=["Content-Type", "Authorization"],
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

    # Configure MySQL
    app.config['MYSQL_DATABASE_HOST'] = os.getenv('MYSQL_HOST')
    app.config['MYSQL_DATABASE_USER'] = os.getenv('MYSQL_USER')
    app.config['MYSQL_DATABASE_PASSWORD'] = os.getenv('MYSQL_PASSWORD')
    app.config['MYSQL_DATABASE_DB'] = os.getenv('MYSQL_DATABASE')
    
    # Configure JWT Secret Key
    app.config['SECRET_KEY'] = os.getenv('JWT_SECRET')
    
    # Initialize extensions
    init_app(app)
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/auth')
    
    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True, port=3001)