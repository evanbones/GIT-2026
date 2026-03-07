from datetime import datetime

from database import db


class InventoryOrder(db.Model):
    """
    Represents an order placed by a consumer to a retailer.
    """

    __tablename__ = "inventory_orders"

    id = db.Column(db.Integer, primary_key=True)
    consumer_id = db.Column(db.Integer, db.ForeignKey("consumers.id"), nullable=False)
    retailer_id = db.Column(db.Integer, db.ForeignKey("retailers.id"), nullable=False)
    order_date = db.Column(db.DateTime, default=datetime.utcnow)
    total_amount = db.Column(db.Numeric(10, 2), nullable=False)
    status = db.Column(db.String(50), nullable=False)

    order_items = db.relationship("OrderItem", backref="order", cascade="all, delete-orphan")


class OrderItem(db.Model):
    """
    Represents an individual line item within an InventoryOrder.
    """

    __tablename__ = "order_items"

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey("inventory_orders.id", ondelete="CASCADE"), nullable=False)
    stock_id = db.Column(db.Integer, db.ForeignKey("stocks.id"), nullable=False)
    quantity = db.Column(db.Numeric(10, 2), nullable=False)
    unit_price = db.Column(db.Numeric(10, 2), nullable=False)
