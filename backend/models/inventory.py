from datetime import datetime

from database import db


class Inventory(db.Model):
    """
    Represents a retailer's overall inventory.
    """

    __tablename__ = "inventories"

    id = db.Column(db.Integer, primary_key=True)
    retailer_id = db.Column(db.Integer, db.ForeignKey("retailers.id"), nullable=False, unique=True)
    last_updated = db.Column(db.DateTime, default=datetime.utcnow)

    stocks = db.relationship("Stock", backref="inventory", cascade="all, delete-orphan")


class Stock(db.Model):
    """
    Represents specific stock of an item held in an inventory.
    """

    __tablename__ = "stocks"

    id = db.Column(db.Integer, primary_key=True)
    inventory_id = db.Column(db.Integer, db.ForeignKey("inventories.id"), nullable=True)
    item_id = db.Column(db.Integer, db.ForeignKey("items.id"), nullable=False)
    quantity = db.Column(db.Numeric(10, 3), nullable=False)
    batch_number = db.Column(db.String(100))
    expiration_date = db.Column(db.Date)
    origin_date = db.Column(db.DateTime, default=datetime.utcnow)
