from database import db
from models.catalog import Item


def get_all_items():
    """
    Retrieves all catalog items (acting as categories/products).

    Returns:
        list[dict]: A list of dictionaries representing the catalog items.

    """
    items = Item.query.all()
    return [
        {"id": i.id, "name": i.name, "sku": i.sku, "producer_id": i.producer_id, "unit_type": i.unit_type}
        for i in items
    ]


def create_item(data):
    """
    Creates a new item in the catalog.

    Args:
        data (dict): Payload containing item details (producer_id, name, sku, unit_type, description).

    Returns:
        dict: The created item data.

    """
    item = Item(
        producer_id=data.get("producer_id"),
        name=data.get("name"),
        description=data.get("description"),
        sku=data.get("sku"),
        unit_type=data.get("unit_type"),
    )
    db.session.add(item)
    db.session.commit()
    return {"id": item.id, "name": item.name, "sku": item.sku}
