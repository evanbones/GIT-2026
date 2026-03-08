from database import db
from models.b2b import BuyStockOffer, GroupBuy
from models.catalog import Item
from models.user import Retailer


def get_all_group_buys():
    gbs = GroupBuy.query.all()
    return [
        {
            "id": g.id,
            "initiator_retailer_id": g.initiator_retailer_id,
            "item_id": g.item_id,
            "status": g.status,
            "current_quantity": float(g.current_quantity),
        }
        for g in gbs
    ]


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
    g.status = data.get("status", g.status)
    g.current_quantity = data.get("current_quantity", g.current_quantity)
    db.session.commit()
    return {"id": g.id, "status": g.status, "current_quantity": float(g.current_quantity)}


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


def get_all_offers(producer_id=None):
    q = BuyStockOffer.query
    if producer_id is not None:
        q = q.filter(BuyStockOffer.producer_id == producer_id)
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
    o.status = data.get("status", o.status)
    db.session.commit()
    return {"id": o.id, "status": o.status}


def delete_offer(offer_id):
    o = db.session.get(BuyStockOffer, offer_id)
    if not o:
        return False
    db.session.delete(o)
    db.session.commit()
    return True
