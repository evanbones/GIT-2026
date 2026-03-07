from datetime import datetime
from typing import ClassVar

from database import db


class User(db.Model):
    __tablename__: ClassVar[str] = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_type = db.Column(db.String(50), nullable=False)

    __mapper_args__: ClassVar[dict] = {"polymorphic_on": user_type, "polymorphic_identity": "user"}

    def to_dict(self):
        return {"id": self.id, "email": self.email, "user_type": self.user_type, "created_at": str(self.created_at)}


class Producer(User):
    __tablename__: ClassVar[str] = "producers"
    id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    company_name = db.Column(db.String(255), nullable=False)

    __mapper_args__: ClassVar[dict] = {"polymorphic_identity": "producer"}


class Retailer(User):
    __tablename__: ClassVar[str] = "retailers"
    id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    company_name = db.Column(db.String(255), nullable=False)

    __mapper_args__: ClassVar[dict] = {"polymorphic_identity": "retailer"}


class Consumer(User):
    __tablename__: ClassVar[str] = "consumers"
    id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    first_name = db.Column(db.String(255), nullable=False)

    __mapper_args__: ClassVar[dict] = {"polymorphic_identity": "consumer"}
