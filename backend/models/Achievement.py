from datetime import datetime
from config.database import database
from bson.objectid import ObjectId

ACHIEVEMENT_DEFINITIONS = [
    {'id': 'first_puzzle', 'name': 'First Puzzle', 'description': 'Complete your first puzzle'},
    {'id': 'easy_complete', 'name': 'Easy Rider', 'description': 'Complete Easy Mode'},
    {'id': 'medium_complete', 'name': 'Medium Master', 'description': 'Complete Medium Mode'},
    {'id': 'hard_complete', 'name': 'Hard Hero', 'description': 'Complete Hard Mode'},
    {'id': 'hard_speedster', 'name': 'Speed Demon', 'description': 'Complete Hard Mode under 60 seconds'},
    {'id': 'games_10', 'name': 'Dedicated Player', 'description': 'Complete 10 games'},
    {'id': 'games_50', 'name': 'Puzzle Addict', 'description': 'Complete 50 games'},
]

class Achievement:
    @staticmethod
    def get_user_achievements(user_id):
        achievements = database.get_achievements_collection()
        return list(achievements.find({
            'userId': ObjectId(user_id) if isinstance(user_id, str) else user_id
        }))
    
    @staticmethod
    def has_achievement(user_id, achievement_name):
        achievements = database.get_achievements_collection()
        return achievements.find_one({
            'userId': ObjectId(user_id) if isinstance(user_id, str) else user_id,
            'achievementName': achievement_name
        }) is not None
    
    @staticmethod
    def unlock_achievement(user_id, achievement_name):
        if Achievement.has_achievement(user_id, achievement_name):
            return None
        
        achievements = database.get_achievements_collection()
        doc = {
            'userId': ObjectId(user_id) if isinstance(user_id, str) else user_id,
            'achievementName': achievement_name,
            'unlockedAt': datetime.utcnow()
        }
        result = achievements.insert_one(doc)
        return str(result.inserted_id)
    
    @staticmethod
    def check_and_unlock(user_id, difficulty, completion_time, total_games):
        unlocked = []
        
        # First puzzle
        if total_games == 1 and not Achievement.has_achievement(user_id, 'First Puzzle'):
            Achievement.unlock_achievement(user_id, 'First Puzzle')
            unlocked.append('First Puzzle')
        
        # Difficulty achievements
        if difficulty == 'easy' and not Achievement.has_achievement(user_id, 'Easy Rider'):
            Achievement.unlock_achievement(user_id, 'Easy Rider')
            unlocked.append('Easy Rider')
        elif difficulty == 'medium' and not Achievement.has_achievement(user_id, 'Medium Master'):
            Achievement.unlock_achievement(user_id, 'Medium Master')
            unlocked.append('Medium Master')
        elif difficulty == 'hard' and not Achievement.has_achievement(user_id, 'Hard Hero'):
            Achievement.unlock_achievement(user_id, 'Hard Hero')
            unlocked.append('Hard Hero')
        
        # Hard under 60 seconds
        if difficulty == 'hard' and completion_time < 60 and not Achievement.has_achievement(user_id, 'Speed Demon'):
            Achievement.unlock_achievement(user_id, 'Speed Demon')
            unlocked.append('Speed Demon')
        
        # Total games
        if total_games >= 10 and not Achievement.has_achievement(user_id, 'Dedicated Player'):
            Achievement.unlock_achievement(user_id, 'Dedicated Player')
            unlocked.append('Dedicated Player')
        
        if total_games >= 50 and not Achievement.has_achievement(user_id, 'Puzzle Addict'):
            Achievement.unlock_achievement(user_id, 'Puzzle Addict')
            unlocked.append('Puzzle Addict')
        
        return unlocked
