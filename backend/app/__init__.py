from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from .config import Config
from .models.db import db
from .auth.routes import auth_bp
from .employees.routes import employees_bp
from .incidents.routes import incidents_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize extensions
    db.init_app(app)
    JWTManager(app)
    CORS(app, supports_credentials=True)
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(employees_bp, url_prefix='/api/employees')
    app.register_blueprint(incidents_bp, url_prefix='/api/incidents')
    
    return app


