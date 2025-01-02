from flask import Flask, jsonify, request
from flask_cors import CORS
from database.connection import mysql, init_app
from routes.auth_routes import auth_bp
from routes.cart_routes import cart_bp
from routes.activity_routes import activities_bp
from routes.evaluation_routes import evaluation_bp
from dotenv import load_dotenv
import os
from routes.class_routes import class_routes  # Import your class routes
from routes.event_routes import event_routes  # Import the new routes
from routes.pool_routes import pool_routes
from routes.training_routes import training_bp
from routes.session_routes import session_routes
from routes.lane_routes import lane_bp

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
    app.register_blueprint(cart_bp, url_prefix='/cart')
    app.register_blueprint(activities_bp, url_prefix='/activities')
    app.register_blueprint(class_routes, url_prefix='/api')  # This registers the `/api` prefix
    app.register_blueprint(evaluation_bp, url_prefix='/eval')
    app.register_blueprint(event_routes, url_prefix='/api')  # Register the new blueprint
    app.register_blueprint(pool_routes, url_prefix='/api')
    app.register_blueprint(training_bp, url_prefix='/api') 
    app.register_blueprint(session_routes, url_prefix='/api')
    app.register_blueprint(lane_bp, url_prefix="/api")


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