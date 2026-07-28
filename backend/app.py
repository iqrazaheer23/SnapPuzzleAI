from flask import Flask
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_jwt_extended import JWTManager
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Configuration
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'dev-secret-key-change-in-production')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 86400  # 24 hours
app.config['MONGO_URI'] = os.getenv('MONGO_URI', 'mongodb://localhost:27017/snappuzzle')

# Initialize extensions
jwt = JWTManager(app)
limiter = Limiter(
    key_func=get_remote_address,
    app=app,
    default_limits=["200 per day", "50 per hour"]
)

# CORS - update for production
CORS(app, resources={
    r"/api/*": {
        "origins": os.getenv('FRONTEND_URL', '*').split(','),
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Database connection
try:
    client = MongoClient(app.config['MONGO_URI'], serverSelectionTimeoutMS=5000)
    db = client.get_default_database()
    # Test connection
    client.admin.command('ping')
    print("✅ MongoDB connected successfully")
except Exception as e:
    print(f"❌ MongoDB connection failed: {e}")
    db = None

# Register blueprints
from routes.auth import auth_bp
from routes.game import game_bp
from routes.leaderboard import leaderboard_bp
from routes.dashboard import dashboard_bp
from routes.achievements import achievements_bp

app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(game_bp, url_prefix='/api/game')
app.register_blueprint(leaderboard_bp, url_prefix='/api/leaderboard')
app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
app.register_blueprint(achievements_bp, url_prefix='/api/achievements')

@app.route('/')
def index():
    return {"message": "SnapPuzzle AI API", "status": "running", "version": "1.0.0"}

@app.route('/health')
def health():
    return {"status": "healthy", "database": "connected" if db is not None else "disconnected"}

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=int(os.getenv('PORT', 5000)))
