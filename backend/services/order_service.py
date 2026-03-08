from database import db
from models.orders import InventoryOrder, OrderItem


def get_all_orders():
    """
    Retrieves all inventory orders.

    Returns:
        list[dict]: A list of all orders.

    """
    orders = InventoryOrder.query.all()
    return [
        {"id": o.id, "consumer_id": o.consumer_id, "total_amount": float(o.total_amount), "status": o.status}
        for o in orders
    ]


def create_order(data):
    """
    Creates a new InventoryOrder along with its associated OrderItems.

    Args:
        data (dict): The payload containing order data and a list of items.
                     Expected format: {"consumer_id": int, "retailer_id": int,
                     "total_amount": float, "items": [{"stock_id": int, "quantity": float, "unit_price": float}]}

    Returns:
        dict: The resulting order summary including generated ID.

    """
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
