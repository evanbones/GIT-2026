from datetime import datetime

from database import db


class StockRequestList(db.Model):
    """
    A producer-scoped list grouping incoming stock requests.
    """

    __tablename__ = "stock_request_lists"

    id = db.Column(db.Integer, primary_key=True)
    producer_id = db.Column(db.Integer, db.ForeignKey("producers.id"), nullable=False)
    status = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    requests = db.relationship("StockRequest", backref="list", cascade="all, delete-orphan")


class StockRequest(db.Model):
    """
    A retailer's request for a specific item quantity, grouped under a StockRequestList.
    """

    __tablename__ = "stock_requests"

    id = db.Column(db.Integer, primary_key=True)
    list_id = db.Column(db.Integer, db.ForeignKey("stock_request_lists.id", ondelete="CASCADE"), nullable=False)
    retailer_id = db.Column(db.Integer, db.ForeignKey("retailers.id"), nullable=False)
    item_id = db.Column(db.Integer, db.ForeignKey("items.id"), nullable=False)
    quantity_requested = db.Column(db.Numeric(10, 3), nullable=False)
    status = db.Column(db.String(50), nullable=False)
