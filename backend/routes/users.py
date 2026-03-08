from flask import request
from flask_restx import Namespace, Resource
from sqlalchemy.exc import SQLAlchemyError

from services.user_service import create_user, delete_user, get_all_users, get_user, update_user

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
        try:
            result = create_user(data)
        except SQLAlchemyError as e:
            return {"error": str(e)}, 400
        else:
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

    def put(self, user_id):
        """Update a user."""
        data = request.get_json()
        try:
            user = update_user(user_id, data)
        except SQLAlchemyError as e:
            return {"error": str(e)}, 400
        else:
            if user:
                return {"message": "User updated", "user": user}, 200
            return {"error": "User not found"}, 404

    def delete(self, user_id):
        """Delete a user."""
        try:
            success = delete_user(user_id)
        except SQLAlchemyError as e:
            return {"error": str(e)}, 400
        else:
            if success:
                return {"message": "User deleted"}, 200
            return {"error": "User not found"}, 404
