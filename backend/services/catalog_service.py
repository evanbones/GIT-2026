from database import db
from models.catalog import Item


def get_all_items():
    items = Item.query.all()
    return [
        {"id": i.id, "name": i.name, "sku": i.sku, "producer_id": i.producer_id, "unit_type": i.unit_type}
        for i in items
    ]


def get_item(item_id):
    item = db.session.get(Item, item_id)
    if not item:
        return None
    return {
        "id": item.id,
        "name": item.name,
        "sku": item.sku,
        "producer_id": item.producer_id,
        "unit_type": item.unit_type,
    }


def create_item(data):
    item = Item(
        producer_id=data.get("producer_id"), name=data.get("name"), sku=data.get("sku"), unit_type=data.get("unit_type")
    )
    db.session.add(item)
    db.session.commit()
    return {"id": item.id, "name": item.name, "sku": item.sku}


def update_item(item_id, data):
    item = db.session.get(Item, item_id)
    if not item:
        return None

    item.name = data.get("name", item.name)
    item.sku = data.get("sku", item.sku)
    item.unit_type = data.get("unit_type", item.unit_type)

    db.session.commit()
    return {"id": item.id, "name": item.name, "sku": item.sku}


def delete_item(item_id):
    item = db.session.get(Item, item_id)
    if not item:
        return False
    db.session.delete(item)
    db.session.commit()
    return True
