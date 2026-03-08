from flask import request
from flask_restx import Namespace, Resource, fields
from sqlalchemy.exc import SQLAlchemyError

from services.user_service import create_user, delete_user, get_all_users, get_user, update_user

users_ns = Namespace("users", description="User Management Operations")

user_model = users_ns.model(
    "UserPayload",
    {
        "user_type": fields.String(required=True, description="Type of user: 'producer', 'retailer', or 'consumer'"),
        "email": fields.String(required=True, description="User's email address"),
        "password_hash": fields.String(description="User's password (optional/hashed)"),
        "description": fields.String(description="General profile description"),
        "company_name": fields.String(description="Company name (Required for producer/retailer)"),
        "primary_address": fields.String(description="Primary address (Required for producer)"),
        "store_address": fields.String(description="Store address (Required for retailer)"),
        "first_name": fields.String(description="First name (Required for consumer)"),
        "last_name": fields.String(description="Last name (Optional for consumer)"),
        "shipping_address": fields.String(description="Shipping address (Optional for consumer)"),
    },
)

user_update_model = users_ns.model(
    "UserUpdatePayload",
    {
        "email": fields.String(description="User's email address"),
        "description": fields.String(description="General profile description"),
        "company_name": fields.String(description="Company name"),
        "primary_address": fields.String(description="Primary address"),
        "store_address": fields.String(description="Store address"),
        "first_name": fields.String(description="First name"),
        "last_name": fields.String(description="Last name"),
        "shipping_address": fields.String(description="Shipping address"),
    },
)


@users_ns.route("")
class UserList(Resource):
    @users_ns.doc(params={"type": "Filter users by type (e.g., producer, retailer, consumer)"})
    @users_ns.response(200, "Success")
    def get(self):
        """
        List all users, optionally filtered by type.
        """
        user_type = request.args.get("type")
        return {"users": get_all_users(user_type)}, 200

    @users_ns.expect(user_model)
    @users_ns.response(201, "User successfully created")
    @users_ns.response(400, "Validation Error")
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
    @users_ns.response(200, "Success")
    @users_ns.response(404, "User not found")
    def get(self, user_id):
        """
        Retrieve a single user by their ID.
        """
        user = get_user(user_id)
        if user:
            return {"user": user}, 200
        return {"error": "User not found"}, 404

    @users_ns.expect(user_update_model)
    @users_ns.response(200, "User successfully updated")
    @users_ns.response(400, "Validation Error")
    @users_ns.response(404, "User not found")
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

    @users_ns.response(200, "User successfully deleted")
    @users_ns.response(400, "Database Error")
    @users_ns.response(404, "User not found")
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
