from flask import request
from flask_restx import Namespace, Resource

from services.user_service import create_user, get_all_users, get_user

users_ns = Namespace("users", description="User Management Operations")


@users_ns.route("")
class UserList(Resource):
    def get(self):
        """
        List all users.
        """
        return {"users": get_all_users()}, 200

    def post(self):
        """
        Create a new user. Payload must specify user_type (producer, retailer, consumer).
        """
        data = request.get_json()
        result = create_user(data)
        if "error" in result:
            return result, 400
        return {"message": "User created", "user": result}, 201


@users_ns.route("/<int:user_id>")
class UserDetail(Resource):
    def get(self, user_id):
        """
        Retrieve a single user by their ID.
        """
        user = get_user(user_id)
        if user:
            return {"user": user}, 200
        return {"error": "User not found"}, 404
