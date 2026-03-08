from database import db
from models.b2b import BuyStockOffer, GroupBuy, GroupBuyParticipant
from models.catalog import Item
from models.inventory import Inventory, Stock
from models.user import Retailer


def _serialize_group_buy(g):
    item = db.session.get(Item, g.item_id)
    return {
        "id": g.id,
        "initiator_retailer_id": g.initiator_retailer_id,
        "item_id": g.item_id,
        "item_name": item.name if item else None,
        "item_unit": item.unit_type if item else None,
        "target_quantity": float(g.target_quantity),
        "current_quantity": float(g.current_quantity),
        "deadline": g.deadline.isoformat() if g.deadline else None,
        "status": g.status,
    }


def get_all_group_buys(retailer_id=None, item_id=None, status=None, producer_id=None):
    q = GroupBuy.query
    if producer_id is not None:
        q = q.join(Item, GroupBuy.item_id == Item.id).filter(Item.producer_id == producer_id)
    if retailer_id is not None:
        q = q.filter(GroupBuy.initiator_retailer_id == retailer_id)
    if item_id is not None:
        q = q.filter(GroupBuy.item_id == item_id)
    if status is not None:
        q = q.filter(GroupBuy.status == status)
    return [_serialize_group_buy(g) for g in q.all()]


def join_group_buy(gb_id, data):
    g = db.session.get(GroupBuy, gb_id)
    if not g or g.status != "open":
        return None
    retailer_id = data.get("retailer_id")
    new_pledged = float(data.get("pledged_quantity", 0))
    existing = db.session.get(GroupBuyParticipant, (gb_id, retailer_id))
    if existing:
        delta = new_pledged - float(existing.pledged_quantity)
        existing.pledged_quantity = new_pledged
    else:
        delta = new_pledged
        db.session.add(GroupBuyParticipant(
            group_buy_id=gb_id,
            retailer_id=retailer_id,
            pledged_quantity=new_pledged,
        ))
    g.current_quantity = max(0.0, float(g.current_quantity) + delta)
    if g.current_quantity >= float(g.target_quantity):
        g.status = "closed"
    db.session.commit()
    return _serialize_group_buy(g)


def get_group_buy(gb_id):
    g = db.session.get(GroupBuy, gb_id)
    if not g:
        return None
    return {"id": g.id, "initiator_retailer_id": g.initiator_retailer_id, "item_id": g.item_id, "status": g.status}


def create_group_buy(data):
    gb = GroupBuy(
        initiator_retailer_id=data.get("initiator_retailer_id"),
        item_id=data.get("item_id"),
        target_quantity=data.get("target_quantity"),
        deadline=data.get("deadline"),
        status=data.get("status", "open"),
    )
    db.session.add(gb)
    db.session.commit()
    return {"id": gb.id, "status": gb.status}


def update_group_buy(gb_id, data):
    g = db.session.get(GroupBuy, gb_id)
    if not g:
        return None
    old_status = g.status
    g.status = data.get("status", g.status)
    g.current_quantity = data.get("current_quantity", g.current_quantity)
    if g.status == "cancelled" and old_status != "cancelled" and float(g.current_quantity) > 0:
        stock = (Stock.query
                 .join(Inventory, Stock.inventory_id == Inventory.id)
                 .join(Item, Stock.item_id == Item.id)
                 .filter(Item.id == g.item_id)
                 .first())
        if stock:
            stock.quantity = float(stock.quantity) + float(g.current_quantity)
    db.session.commit()
    return _serialize_group_buy(g)


def delete_group_buy(gb_id):
    g = db.session.get(GroupBuy, gb_id)
    if not g:
        return False
    db.session.delete(g)
    db.session.commit()
    return True


def _serialize_offer(o):
    retailer = db.session.get(Retailer, o.retailer_id)
    item = db.session.get(Item, o.item_id)
    return {
        "id": o.id,
        "retailer_id": o.retailer_id,
        "retailer_name": retailer.company_name if retailer else None,
        "producer_id": o.producer_id,
        "item_id": o.item_id,
        "item_name": item.name if item else None,
        "item_unit": item.unit_type if item else None,
        "offered_price": float(o.offered_price),
        "requested_quantity": float(o.requested_quantity),
        "status": o.status,
    }


def get_all_offers(producer_id=None, retailer_id=None):
    q = BuyStockOffer.query
    if producer_id is not None:
        q = q.filter(BuyStockOffer.producer_id == producer_id)
    if retailer_id is not None:
        q = q.filter(BuyStockOffer.retailer_id == retailer_id)
    return [_serialize_offer(o) for o in q.all()]


def get_offer(offer_id):
    o = db.session.get(BuyStockOffer, offer_id)
    if not o:
        return None
    return {"id": o.id, "retailer_id": o.retailer_id, "producer_id": o.producer_id, "status": o.status}


def create_offer(data):
    o = BuyStockOffer(
        retailer_id=data.get("retailer_id"),
        producer_id=data.get("producer_id"),
        item_id=data.get("item_id"),
        offered_price=data.get("offered_price"),
        requested_quantity=data.get("requested_quantity"),
        status=data.get("status", "pending"),
    )
    db.session.add(o)
    db.session.commit()
    return {"id": o.id, "status": o.status}


def update_offer(offer_id, data):
    o = db.session.get(BuyStockOffer, offer_id)
    if not o:
        return None
    old_status = o.status
    o.status = data.get("status", o.status)
    if o.status == "rejected" and old_status != "rejected":
        stock = (Stock.query
                 .join(Inventory, Stock.inventory_id == Inventory.id)
                 .filter(Inventory.producer_id == o.producer_id, Stock.item_id == o.item_id)
                 .first())
        if stock:
            stock.quantity = float(stock.quantity) + float(o.requested_quantity)
    db.session.commit()
    return {"id": o.id, "status": o.status}


def delete_offer(offer_id):
    o = db.session.get(BuyStockOffer, offer_id)
    if not o:
        return False
    db.session.delete(o)
    db.session.commit()
    return True
