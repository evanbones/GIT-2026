from flask import Blueprint, request
from flask_restful import Api, Resource
from services.user_service import get_all_users, get_user, create_user, delete_user

users_bp = Blueprint("users", __name__)
api = Api(users_bp)


class UserList(Resource):
    def get(self):
        return {"users": get_all_users()}, 200

    def post(self):
        return create_user(request.get_json()), 201


class User(Resource):
    def get(self, user_id):
        user = get_user(user_id)
        return ({"user": user}, 200) if user else ({"error": "Not found"}, 404)

    def delete(self, user_id):
        deleted = delete_user(user_id)
        return (
            ({"message": "Deleted"}, 200) if deleted else ({"error": "Not found"}, 404)
        )


api.add_resource(UserList, "/users")
api.add_resource(User, "/users/<int:user_id>")
