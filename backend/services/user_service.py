from database import db
from models.user import Consumer, Producer, Retailer, User


def get_all_users():
    """
    Retrieves all users from the database.

    Returns:
        list[dict]: A list of dictionaries representing the users.

    """
    users = User.query.all()
    return [u.to_dict() for u in users]


def get_user(user_id):
    """
    Retrieves a specific user by their ID.

    Args:
        user_id (int): The ID of the user to retrieve.

    Returns:
        dict: The user's data as a dictionary, or None if not found.

    """
    user = db.session.get(User, user_id)
    return user.to_dict() if user else None


def create_user(data):
    """
    Creates a new user of a specific polymorphic subtype based on data provided.

    Args:
        data (dict): The payload containing user details (email, password_hash, user_type).
                     Must contain subtype-specific fields (e.g., company_name for producers).

    Returns:
        dict: The newly created user data, or an error dictionary if the type is invalid.

    """
    user_type = data.get("user_type")
    email = data.get("email")
    password_hash = data.get("password_hash")  # TODO: HASH BEFORE THIS (tokens or something idk)

    if user_type == "producer":
        user = Producer(
            email=email,
            password_hash=password_hash,
            user_type="producer",
            company_name=data.get("company_name"),
            primary_address=data.get("primary_address"),
        )
    elif user_type == "retailer":
        user = Retailer(
            email=email,
            password_hash=password_hash,
            user_type="retailer",
            company_name=data.get("company_name"),
            store_address=data.get("store_address"),
        )
    elif user_type == "consumer":
        user = Consumer(
            email=email,
            password_hash=password_hash,
            user_type="consumer",
            first_name=data.get("first_name"),
            last_name=data.get("last_name"),
            shipping_address=data.get("shipping_address"),
        )
    else:
        return {"error": f"Invalid user type: {user_type}"}

    db.session.add(user)
    db.session.commit()
    return user.to_dict()


def update_user(user_id, data):
    user = db.session.get(User, user_id)
    if not user:
        return None

    user.email = data.get("email", user.email)

    if user.user_type in {"producer", "retailer"}:
        user.company_name = data.get("company_name", user.company_name)
    elif user.user_type == "consumer":
        user.first_name = data.get("first_name", user.first_name)

    db.session.commit()
    return user.to_dict()


def delete_user(user_id):
    user = db.session.get(User, user_id)
    if not user:
        return False
    db.session.delete(user)
    db.session.commit()
    return True
