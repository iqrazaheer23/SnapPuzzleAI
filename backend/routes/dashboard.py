from flask import Blueprint, jsonify
from middleware.authMiddleware import auth_required, get_current_user_id
from models.Score import Score
from models.Achievement import Achievement
from config.database import database
from bson.objectid import ObjectId

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('', methods=['GET'])
@auth_required
def get_dashboard():
    user_id = get_current_user_id()
    
    stats = Score.get_stats_by_user(user_id)
    achievements = Achievement.get_user_achievements(user_id)
    
    # Get recent history
    scores = database.get_scores_collection()
    recent = list(scores.find(
        {'userId': ObjectId(user_id) if isinstance(user_id, str) else user_id}
    ).sort('playedAt', -1).limit(5))
    
    recent_games = [{
        'id': str(s['_id']),
        'difficulty': s['difficulty'],
        'completionTime': s['completionTime'],
        'score': s['score'],
        'playedAt': s['playedAt'].isoformat() if 'playedAt' in s else None
    } for s in recent]
    
    return jsonify({
        'stats': stats,
        'achievementCount': len(achievements),
        'achievements': [{
            'name': a['achievementName'],
            'unlockedAt': a['unlockedAt'].isoformat() if 'unlockedAt' in a else None
        } for a in achievements],
        'recentGames': recent_games
    }), 200
