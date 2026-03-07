from flask import request
from flask_restx import Namespace, Resource

from services.user_service import create_user, delete_user, get_all_users, get_user

users_ns = Namespace("users", description="User operations")


@users_ns.route("")
class UserList(Resource):
    def get(self):
        """List all users"""
        return {"users": get_all_users()}, 200

    def post(self):
        """Create a new user"""
        return create_user(request.get_json()), 201


@users_ns.route("/<int:user_id>")
class User(Resource):
    def get(self, user_id):
        """Get a user by ID"""
        user = get_user(user_id)
        return ({"user": user}, 200) if user else ({"error": "Not found"}, 404)

    def delete(self, user_id):
        """Delete a user by ID"""
        deleted = delete_user(user_id)
        return ({"message": "Deleted"}, 200) if deleted else ({"error": "Not found"}, 404)
