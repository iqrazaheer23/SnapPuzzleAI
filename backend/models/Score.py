from datetime import datetime
from config.database import database
from bson.objectid import ObjectId

class Score:
    def __init__(self, user_id, difficulty, completion_time, score):
        self.user_id = user_id
        self.difficulty = difficulty
        self.completion_time = completion_time
        self.score = score
        self.played_at = datetime.utcnow()
    
    def to_dict(self):
        return {
            'userId': ObjectId(self.user_id) if isinstance(self.user_id, str) else self.user_id,
            'difficulty': self.difficulty,
            'completionTime': self.completion_time,
            'score': self.score,
            'playedAt': self.played_at
        }
    
    @classmethod
    def create(cls, user_id, difficulty, completion_time, score):
        scores = database.get_scores_collection()
        score_obj = cls(user_id, difficulty, completion_time, score)
        result = scores.insert_one(score_obj.to_dict())
        return str(result.inserted_id)
    
    @classmethod
    def get_by_user(cls, user_id, limit=50):
        scores = database.get_scores_collection()
        return list(scores.find(
            {'userId': ObjectId(user_id) if isinstance(user_id, str) else user_id}
        ).sort('playedAt', -1).limit(limit))
    
    @classmethod
    def get_best_by_user(cls, user_id):
        scores = database.get_scores_collection()
        return scores.find_one(
            {'userId': ObjectId(user_id) if isinstance(user_id, str) else user_id},
            sort=[('score', -1)]
        )
    
    @classmethod
    def get_stats_by_user(cls, user_id):
        scores = database.get_scores_collection()
        uid = ObjectId(user_id) if isinstance(user_id, str) else user_id
        
        total = scores.count_documents({'userId': uid})
        best_score = scores.find_one({'userId': uid}, sort=[('score', -1)])
        best_time = scores.find_one({'userId': uid}, sort=[('completionTime', 1)])
        
        avg_cursor = scores.aggregate([
            {'$match': {'userId': uid}},
            {'$group': {'_id': None, 'avgTime': {'$avg': '$completionTime'}, 'avgScore': {'$avg': '$score'}}}
        ])
        avg = list(avg_cursor)
        
        easy_wins = scores.count_documents({'userId': uid, 'difficulty': 'easy'})
        medium_wins = scores.count_documents({'userId': uid, 'difficulty': 'medium'})
        hard_wins = scores.count_documents({'userId': uid, 'difficulty': 'hard'})
        
        return {
            'totalGames': total,
            'bestTime': best_time['completionTime'] if best_time else None,
            'averageTime': round(avg[0]['avgTime'], 2) if avg else 0,
            'highestScore': best_score['score'] if best_score else 0,
            'easyWins': easy_wins,
            'mediumWins': medium_wins,
            'hardWins': hard_wins
        }
