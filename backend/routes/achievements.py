from flask import Blueprint, jsonify
from middleware.authMiddleware import auth_required, get_current_user_id
from models.Achievement import Achievement, ACHIEVEMENT_DEFINITIONS

achievements_bp = Blueprint('achievements', __name__)

@achievements_bp.route('', methods=['GET'])
@auth_required
def get_achievements():
    user_id = get_current_user_id()
    user_achievements = Achievement.get_user_achievements(user_id)
    unlocked_names = {a['achievementName'] for a in user_achievements}
    
    result = []
    for ach in ACHIEVEMENT_DEFINITIONS:
        result.append({
            'id': ach['id'],
            'name': ach['name'],
            'description': ach['description'],
            'unlocked': ach['name'] in unlocked_names
        })
    
    return jsonify({'achievements': result}), 200
