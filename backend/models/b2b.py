from datetime import datetime

from database import db


class GroupBuy(db.Model):
    """
    Represents a B2B group buying initiative started by a retailer.
    """

    __tablename__ = "group_buys"

    id = db.Column(db.Integer, primary_key=True)
    initiator_retailer_id = db.Column(db.Integer, db.ForeignKey("retailers.id"), nullable=False)
    item_id = db.Column(db.Integer, db.ForeignKey("items.id"), nullable=False)
    target_quantity = db.Column(db.Numeric(10, 3), nullable=False)
    current_quantity = db.Column(db.Numeric(10, 3), default=0)
    deadline = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(50), nullable=False)

    participants = db.relationship("GroupBuyParticipant", backref="group_buy", cascade="all, delete-orphan")


class GroupBuyParticipant(db.Model):
    """
    Represents a retailer joining an existing GroupBuy.
    """

    __tablename__ = "group_buy_participants"

    group_buy_id = db.Column(db.Integer, db.ForeignKey("group_buys.id", ondelete="CASCADE"), primary_key=True)
    retailer_id = db.Column(db.Integer, db.ForeignKey("retailers.id"), primary_key=True)
    pledged_quantity = db.Column(db.Numeric(10, 3), nullable=False)
    joined_at = db.Column(db.DateTime, default=datetime.utcnow)


class BuyStockOffer(db.Model):
    """
    Represents a direct B2B offer from a retailer to a producer.
    """

    __tablename__ = "buy_stock_offers"

    id = db.Column(db.Integer, primary_key=True)
    retailer_id = db.Column(db.Integer, db.ForeignKey("retailers.id"), nullable=False)
    producer_id = db.Column(db.Integer, db.ForeignKey("producers.id"), nullable=False)
    item_id = db.Column(db.Integer, db.ForeignKey("items.id"), nullable=False)
    offered_price = db.Column(db.Numeric(10, 2), nullable=False)
    requested_quantity = db.Column(db.Numeric(10, 3), nullable=False)
    status = db.Column(db.String(50), nullable=False)
