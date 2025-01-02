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
from flask_mail import Mail
from routes.user_routes import user_bp

load_dotenv()

mail = Mail()

def create_app():
    app = Flask(__name__)
    
    # Simplified CORS configuration
    CORS(app, 
         origins=["http://localhost:3000"],
         allow_headers=["Content-Type", "Authorization"],
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
         supports_credentials=True)

    @app.after_request
    def after_request(response):
        # Ensure OPTIONS requests are handled properly
        if request.method == 'OPTIONS':
            response.status_code = 200
            response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
            response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
            response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
            response.headers['Access-Control-Allow-Credentials'] = 'true'
        
        return response

    # Configure MySQL
    app.config['MYSQL_DATABASE_HOST'] = os.getenv('MYSQL_HOST')
    app.config['MYSQL_DATABASE_USER'] = os.getenv('MYSQL_USER')
    app.config['MYSQL_DATABASE_PASSWORD'] = os.getenv('MYSQL_PASSWORD')
    app.config['MYSQL_DATABASE_DB'] = os.getenv('MYSQL_DATABASE')
    
    # Configure JWT Secret Key
    app.config['SECRET_KEY'] = os.getenv('JWT_SECRET')
    
    # Mail configuration
    app.config['MAIL_SERVER'] = 'smtp.gmail.com'
    app.config['MAIL_PORT'] = 587
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
    app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
    app.config['MAIL_DEFAULT_SENDER'] = ('Pool Management', os.getenv('MAIL_USERNAME'))
    app.config['FRONTEND_URL'] = os.getenv('FRONTEND_URL')

    mail.init_app(app)
    app.mail = mail  # Add mail to app context
    
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
    app.register_blueprint(user_bp, url_prefix='/api/user')  # Note the prefix if you're using one

    return app

app = create_app()

if __name__ == '__main__':
    app.run(port=3001, debug=True)