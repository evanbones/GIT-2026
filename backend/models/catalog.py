from database import db


class Item(db.Model):
    __tablename__ = "items"
    id = db.Column(db.Integer, primary_key=True)
    producer_id = db.Column(db.Integer, db.ForeignKey("producers.id"), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    sku = db.Column(db.String(100), unique=True)
    unit_type = db.Column(db.String(50), nullable=False)

    prices = db.relationship("Price", backref="item", cascade="all, delete-orphan")


class Price(db.Model):
    __tablename__ = "prices"
    id = db.Column(db.Integer, primary_key=True)
    item_id = db.Column(db.Integer, db.ForeignKey("items.id", ondelete="CASCADE"), nullable=False)
    min_quantity = db.Column(db.Integer)
    max_quantity = db.Column(db.Integer)
    price_per_unit = db.Column(db.Numeric(10, 2), nullable=False)
