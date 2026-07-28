from bcrypt import hashpw, gensalt, checkpw
from datetime import datetime
from config.database import database

class User:
    def __init__(self, username, email, password):
        self.username = username
        self.email = email
        self.password_hash = self._hash_password(password)
        self.created_at = datetime.utcnow()
    
    @staticmethod
    def _hash_password(password):
        return hashpw(password.encode('utf-8'), gensalt(rounds=12)).decode('utf-8')
    
    @staticmethod
    def verify_password(password, hashed):
        return checkpw(password.encode('utf-8'), hashed.encode('utf-8'))
    
    def to_dict(self):
        return {
            'username': self.username,
            'email': self.email,
            'passwordHash': self.password_hash,
            'createdAt': self.created_at
        }
    
    @classmethod
    def find_by_email(cls, email):
        users = database.get_users_collection()
        return users.find_one({'email': email.lower()})
    
    @classmethod
    def find_by_username(cls, username):
        users = database.get_users_collection()
        return users.find_one({'username': username})
    
    @classmethod
    def find_by_id(cls, user_id):
        from bson.objectid import ObjectId
        users = database.get_users_collection()
        return users.find_one({'_id': ObjectId(user_id)})
    
    @classmethod
    def create(cls, username, email, password):
        users = database.get_users_collection()
        user = cls(username, email, password)
        result = users.insert_one(user.to_dict())
        return str(result.inserted_id)
