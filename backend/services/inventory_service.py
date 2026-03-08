from database import db
from models.catalog import Item, Price
from models.inventory import Inventory, Stock


def get_all_inventories():
    inventories = Inventory.query.all()
    return [
        {"id": i.id, "producer_id": i.producer_id, "last_updated": str(i.last_updated)}
        for i in inventories
    ]


def get_inventory(inventory_id):
    inv = db.session.get(Inventory, inventory_id)
    if not inv:
        return None
    return {
        "id": inv.id,
        "producer_id": inv.producer_id,
        "last_updated": str(inv.last_updated),
    }


def create_inventory(data):
    inv = Inventory(producer_id=data.get("producer_id"))
    db.session.add(inv)
    db.session.commit()
    return {"id": inv.id, "producer_id": inv.producer_id}


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
        {
            "id": s.id,
            "inventory_id": s.inventory_id,
            "item_id": s.item_id,
            "quantity": float(s.quantity),
        }
        for s in stocks
    ]


def get_stock(stock_id):
    s = db.session.get(Stock, stock_id)
    if not s:
        return None
    return {
        "id": s.id,
        "inventory_id": s.inventory_id,
        "item_id": s.item_id,
        "quantity": float(s.quantity),
    }


def create_stock(data):
    inventory_id = data.get("inventory_id")
    quantity = data.get("quantity")

    if not inventory_id:
        raise ValueError("inventory_id is required")
    if quantity is None:
        raise ValueError("quantity is required")
    if not db.session.get(Inventory, inventory_id):
        raise ValueError(f"Inventory {inventory_id} does not exist")

    # Resolve item — accept existing item_id or create a new item inline
    item_id = data.get("item_id")
    if item_id:
        item = db.session.get(Item, item_id)
        if not item:
            raise ValueError(f"Item {item_id} does not exist")
    else:
        item_data = data.get("item")
        if not item_data:
            raise ValueError("Either item_id or item object is required")
        for field in ("name", "unit_type", "producer_id"):
            if not item_data.get(field):
                raise ValueError(f"item.{field} is required")

        prices_data = data.get("prices")
        if not prices_data:
            raise ValueError("prices are required when creating a new item")
        for i, p in enumerate(prices_data):
            if p.get("min_quantity") is None:
                raise ValueError(f"prices[{i}].min_quantity is required")
            if p.get("price_per_unit") is None:
                raise ValueError(f"prices[{i}].price_per_unit is required")

        item = Item(
            producer_id=item_data["producer_id"],
            name=item_data["name"],
            description=item_data.get("description"),
            sku=item_data.get("sku"),
            unit_type=item_data["unit_type"],
        )
        db.session.add(item)
        db.session.flush()

        for p in prices_data:
            db.session.add(
                Price(
                    item_id=item.id,
                    min_quantity=p["min_quantity"],
                    max_quantity=p.get("max_quantity"),
                    price_per_unit=p["price_per_unit"],
                )
            )

    stock = Stock(
        inventory_id=inventory_id,
        item_id=item.id,
        quantity=quantity,
        batch_number=data.get("batch_number"),
        expiration_date=data.get("expiration_date"),
    )
    db.session.add(stock)
    db.session.commit()

    return {
        "id": stock.id,
        "inventory_id": stock.inventory_id,
        "quantity": float(stock.quantity),
        "item": _serialize_item_with_prices(item),
    }


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


def _serialize_item_with_prices(item):
    return {
        "id": item.id,
        "name": item.name,
        "description": item.description,
        "sku": item.sku,
        "unit_type": item.unit_type,
        "prices": [
            {
                "id": p.id,
                "min_quantity": p.min_quantity,
                "max_quantity": p.max_quantity,
                "price_per_unit": float(p.price_per_unit),
            }
            for p in item.prices
        ],
    }


def get_inventory_stocks(inventory_id):
    stocks = (
        db.session.query(Stock)
        .filter(Stock.inventory_id == inventory_id)
        .join(Item, Stock.item_id == Item.id)
        .all()
    )
    return [
        {
            "stock_id": s.id,
            "quantity": float(s.quantity),
            "batch_number": s.batch_number,
            "expiration_date": str(s.expiration_date) if s.expiration_date else None,
            "item": _serialize_item_with_prices(s.item),
        }
        for s in stocks
    ]


def get_inventory_items(inventory_id):
    rows = (
        db.session.query(Item, db.func.sum(Stock.quantity).label("total_quantity"))
        .join(Stock, Item.id == Stock.item_id)
        .filter(Stock.inventory_id == inventory_id)
        .group_by(Item.id)
        .all()
    )
    return [
        {
            **_serialize_item_with_prices(item),
            "total_quantity": float(total),
        }
        for item, total in rows
    ]


def get_item_stock_across_inventories(item_id):
    item = db.session.get(Item, item_id)
    if not item:
        return None
    stocks = (
        db.session.query(Stock, Inventory)
        .join(Inventory, Stock.inventory_id == Inventory.id)
        .filter(Stock.item_id == item_id)
        .all()
    )
    return {
        "item": _serialize_item_with_prices(item),
        "stocks": [
            {
                "stock_id": s.id,
                "quantity": float(s.quantity),
                "batch_number": s.batch_number,
                "expiration_date": (
                    str(s.expiration_date) if s.expiration_date else None
                ),
                "inventory_id": inv.id,
                "producer_id": inv.producer_id,
            }
            for s, inv in stocks
        ],
    }
