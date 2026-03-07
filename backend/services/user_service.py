from database import db
from models.user import User


def get_all_users():
    return [u.to_dict() for u in User.query.all()]


def get_user(user_id):
    user = User.query.get(user_id)
    return user.to_dict() if user else None


def create_user(data):
    user = User(name=data.get("name"))
    db.session.add(user)
    db.session.commit()
    return user.to_dict()


def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return None
    db.session.delete(user)
    db.session.commit()
    return True
