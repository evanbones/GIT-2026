from database import db
from models.orders import InventoryOrder, OrderItem


def get_all_orders():
    orders = InventoryOrder.query.all()
    return [
        {"id": o.id, "consumer_id": o.consumer_id, "total_amount": float(o.total_amount), "status": o.status}
        for o in orders
    ]


def create_order(data):
    order = InventoryOrder(
        consumer_id=data.get("consumer_id"),
        retailer_id=data.get("retailer_id"),
        total_amount=data.get("total_amount"),
        status=data.get("status", "pending"),
    )
    db.session.add(order)
    db.session.flush()

    items_data = data.get("items", [])
    for item_data in items_data:
        order_item = OrderItem(
            order_id=order.id,
            stock_id=item_data.get("stock_id"),
            quantity=item_data.get("quantity"),
            unit_price=item_data.get("unit_price"),
        )
        db.session.add(order_item)

    db.session.commit()
    return {"id": order.id, "status": order.status, "item_count": len(items_data)}


def get_order(order_id):
    order = db.session.get(InventoryOrder, order_id)
    if not order:
        return None
    return {
        "id": order.id,
        "consumer_id": order.consumer_id,
        "total_amount": float(order.total_amount),
        "status": order.status,
    }


def update_order(order_id, data):
    order = db.session.get(InventoryOrder, order_id)
    if not order:
        return None

    order.status = data.get("status", order.status)
    db.session.commit()
    return {"id": order.id, "status": order.status}


def delete_order(order_id):
    order = db.session.get(InventoryOrder, order_id)
    if not order:
        return False
    db.session.delete(order)
    db.session.commit()
    return True
