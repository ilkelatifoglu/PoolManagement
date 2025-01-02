from flask import Flask, jsonify, request
from flask_cors import CORS
from database.connection import mysql, init_app
from routes.auth_routes import auth_bp
from routes.activity_routes import activities_bp
from dotenv import load_dotenv
import os
from routes.class_routes import class_routes  # Import your class routes
from routes.report_routes import report_bp  # Import report routes
from routes.manager_routes import manager_bp  # Import report routes

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
    app.register_blueprint(activities_bp, url_prefix='/activities')
    app.register_blueprint(class_routes, url_prefix='/api')  # This registers the `/api` prefix
    app.register_blueprint(report_bp, url_prefix='/report')  # Register report routes with `/report` prefix
    app.register_blueprint(manager_bp, url_prefix='/manager')  # Register report routes with `/report` prefix

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
    app.run(debug=True, port=3001)