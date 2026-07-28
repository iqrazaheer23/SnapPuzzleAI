from pymongo import MongoClient
import os

class Database:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            uri = os.getenv('MONGO_URI', 'mongodb://localhost:27017/snappuzzle')
            cls._instance.client = MongoClient(uri, serverSelectionTimeoutMS=5000)
            cls._instance.db = cls._instance.client.get_default_database()
        return cls._instance
    
    def get_db(self):
        return self.db
    
    def get_users_collection(self):
        return self.db.users
    
    def get_scores_collection(self):
        return self.db.scores
    
    def get_achievements_collection(self):
        return self.db.achievements

# Export a singleton instance
database = Database()
