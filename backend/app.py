from flask import Flask, jsonify, request, make_response
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
         resources={r"/auth/*": {  # This will apply to all /auth routes
             "origins": ["http://localhost:3000"],
             "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
             "allow_headers": ["Content-Type", "Authorization"],
             "expose_headers": ["Content-Type", "Authorization"],
             "supports_credentials": True,
             "max_age": 120  # Cache preflight requests for 2 minutes
         }})

    # Configure MySQL
    app.config['MYSQL_DATABASE_HOST'] = os.getenv('MYSQL_HOST')
    app.config['MYSQL_DATABASE_USER'] = os.getenv('MYSQL_USER')
    app.config['MYSQL_DATABASE_PASSWORD'] = os.getenv('MYSQL_PASSWORD')
    app.config['MYSQL_DATABASE_DB'] = os.getenv('MYSQL_DATABASE')
    
    # Initialize extensions
    init_app(app)
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/auth')
    
    @app.after_request
    def after_request(response):
        origin = request.headers.get('Origin')
        if origin == 'http://localhost:3000':
            response.headers.add('Access-Control-Allow-Origin', origin)
            response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
            response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
            response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response
    
    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True, port=5000)