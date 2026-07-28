from flask import Blueprint, request, jsonify
from middleware.authMiddleware import auth_required, get_current_user_id
from models.Score import Score
from models.Achievement import Achievement
from models.User import User
from config.database import database
from bson.objectid import ObjectId

game_bp = Blueprint('game', __name__)

@game_bp.route('/save-score', methods=['POST'])
@auth_required
def save_score():
    user_id = get_current_user_id()
    data = request.get_json()
    
    difficulty = data.get('difficulty')
    completion_time = data.get('completionTime')
    score = data.get('score')
    
    if not difficulty or completion_time is None or score is None:
        return jsonify({'error': 'Missing required fields'}), 400
    
    if difficulty not in ['easy', 'medium', 'hard']:
        return jsonify({'error': 'Invalid difficulty'}), 400
    
    score_id = Score.create(user_id, difficulty, completion_time, score)
    
    # Get total games for achievement check
    total_games = Score.get_stats_by_user(user_id)['totalGames']
    
    # Check and unlock achievements
    unlocked = Achievement.check_and_unlock(user_id, difficulty, completion_time, total_games)
    
    return jsonify({
        'message': 'Score saved',
        'scoreId': score_id,
        'newAchievements': unlocked
    }), 201

@game_bp.route('/history', methods=['GET'])
@auth_required
def get_history():
    user_id = get_current_user_id()
    scores = Score.get_by_user(user_id)
    
    result = []
    for s in scores:
        result.append({
            'id': str(s['_id']),
            'difficulty': s['difficulty'],
            'completionTime': s['completionTime'],
            'score': s['score'],
            'playedAt': s['playedAt'].isoformat() if 'playedAt' in s else None
        })
    
    return jsonify({'history': result}), 200
