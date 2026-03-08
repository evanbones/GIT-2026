from database import db
from models.inventory import Inventory, Stock


def get_all_inventories():
    inventories = Inventory.query.all()
    return [{"id": i.id, "retailer_id": i.retailer_id, "last_updated": str(i.last_updated)} for i in inventories]


def get_inventory(inventory_id):
    inv = db.session.get(Inventory, inventory_id)
    if not inv:
        return None
    return {"id": inv.id, "retailer_id": inv.retailer_id, "last_updated": str(inv.last_updated)}


def create_inventory(data):
    inv = Inventory(retailer_id=data.get("retailer_id"))
    db.session.add(inv)
    db.session.commit()
    return {"id": inv.id, "retailer_id": inv.retailer_id}


def delete_inventory(inventory_id):
    inv = db.session.get(Inventory, inventory_id)
    if not inv:
        return False
    db.session.delete(inv)
    db.session.commit()
    return True


def get_all_stocks():
    stocks = Stock.query.all()
    return [
        {"id": s.id, "inventory_id": s.inventory_id, "item_id": s.item_id, "quantity": float(s.quantity)}
        for s in stocks
    ]


def get_stock(stock_id):
    s = db.session.get(Stock, stock_id)
    if not s:
        return None
    return {"id": s.id, "inventory_id": s.inventory_id, "item_id": s.item_id, "quantity": float(s.quantity)}


def create_stock(data):
    stock = Stock(
        inventory_id=data.get("inventory_id"),
        item_id=data.get("item_id"),
        quantity=data.get("quantity"),
        batch_number=data.get("batch_number"),
        expiration_date=data.get("expiration_date"),
    )
    db.session.add(stock)
    db.session.commit()
    return {"id": stock.id, "item_id": stock.item_id, "quantity": float(stock.quantity)}


def update_stock(stock_id, data):
    stock = db.session.get(Stock, stock_id)
    if not stock:
        return None
    stock.quantity = data.get("quantity", stock.quantity)
    stock.batch_number = data.get("batch_number", stock.batch_number)
    stock.expiration_date = data.get("expiration_date", stock.expiration_date)
    db.session.commit()
    return {"id": stock.id, "quantity": float(stock.quantity)}


def delete_stock(stock_id):
    stock = db.session.get(Stock, stock_id)
    if not stock:
        return False
    db.session.delete(stock)
    db.session.commit()
    return True
