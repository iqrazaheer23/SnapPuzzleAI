from flask import Blueprint, request, jsonify
from models.Score import Score
from config.database import database
from bson.objectid import ObjectId
from pymongo import DESCENDING

leaderboard_bp = Blueprint('leaderboard', __name__)

@leaderboard_bp.route('', methods=['GET'])
def get_leaderboard():
    difficulty = request.args.get('difficulty', 'all')
    sort_by = request.args.get('sortBy', 'score')
    
    scores = database.get_scores_collection()
    
    match_stage = {}
    if difficulty != 'all' and difficulty in ['easy', 'medium', 'hard']:
        match_stage['difficulty'] = difficulty
    
    sort_field = 'score' if sort_by == 'score' else 'completionTime'
    sort_order = DESCENDING if sort_by == 'score' else 1
    
    pipeline = [
        {'$match': match_stage},
        {'$sort': {sort_field: sort_order}},
        {'$limit': 10},
        {
            '$lookup': {
                'from': 'users',
                'localField': 'userId',
                'foreignField': '_id',
                'as': 'user'
            }
        },
        {'$unwind': {'path': '$user', 'preserveNullAndEmptyArrays': True}}
    ]
    
    results = list(scores.aggregate(pipeline))
    
    leaderboard = []
    for idx, r in enumerate(results, 1):
        leaderboard.append({
            'rank': idx,
            'username': r['user']['username'] if 'user' in r and r['user'] else 'Unknown',
            'difficulty': r['difficulty'],
            'time': r['completionTime'],
            'score': r['score']
        })
    
    return jsonify({'leaderboard': leaderboard}), 200
