from datetime import datetime
from typing import ClassVar

from database import db


class User(db.Model):
    __tablename__: ClassVar[str] = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=True)
    google_id = db.Column(db.String(255), unique=True, nullable=True)
    picture = db.Column(db.String(512), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_type = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text)
    profile_photo = db.Column(db.LargeBinary)

    __mapper_args__: ClassVar[dict] = {"polymorphic_on": user_type, "polymorphic_identity": "user"}

    @classmethod
    def find_or_create(cls, google_id, email, name, picture):
        user = cls.query.filter_by(google_id=google_id).first()
        if not user:
            user = cls.query.filter_by(email=email).first()
        if user:
            user.google_id = google_id
            user.picture = picture
            db.session.commit()
            return user, False
        parts = name.split() if name else []
        first_name = parts[0] if parts else None
        last_name = " ".join(parts[1:]) if len(parts) > 1 else None
        user = Consumer(
            email=email,
            google_id=google_id,
            picture=picture,
            first_name=first_name,
            last_name=last_name,
        )
        db.session.add(user)
        db.session.commit()
        return user, True

    def to_dict(self):
        return {"id": self.id, "email": self.email, "user_type": self.user_type, "created_at": str(self.created_at)}


class Producer(User):
    __tablename__: ClassVar[str] = "producers"
    id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    company_name = db.Column(db.String(255), nullable=False)
    primary_address = db.Column(db.Text, nullable=False)
    images = db.Column(db.LargeBinary)

    __mapper_args__: ClassVar[dict] = {"polymorphic_identity": "producer"}


class Retailer(User):
    __tablename__: ClassVar[str] = "retailers"
    id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    company_name = db.Column(db.String(255), nullable=False)
    store_address = db.Column(db.Text, nullable=False)
    images = db.Column(db.LargeBinary)

    __mapper_args__: ClassVar[dict] = {"polymorphic_identity": "retailer"}


class Consumer(User):
    __tablename__: ClassVar[str] = "consumers"
    id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    first_name = db.Column(db.String(255), nullable=False)
    last_name = db.Column(db.String(255), nullable=True)
    shipping_address = db.Column(db.Text, nullable=True)

    __mapper_args__: ClassVar[dict] = {"polymorphic_identity": "consumer"}
