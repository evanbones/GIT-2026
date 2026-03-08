from flask import request
from flask_restx import Namespace, Resource
from sqlalchemy.exc import SQLAlchemyError

from services.catalog_service import create_item, delete_item, get_all_items, get_item, update_item

catalog_ns = Namespace("catalog", description="Catalog and Category Operations")


@catalog_ns.route("/items")
class ItemList(Resource):
    def get(self):
        """
        Retrieve the entire item catalog.
        """
        return {"items": get_all_items()}, 200

    def post(self):
        """
        Add a new item to the catalog.
        """
        data = request.get_json()
        try:
            result = create_item(data)
        except SQLAlchemyError as e:
            return {"error": str(e)}, 400
        else:
            return {"message": "Item created", "item": result}, 201


@catalog_ns.route("/items/<int:item_id>")
class ItemDetail(Resource):
    def get(self, item_id):
        """Retrieve a specific item."""
        item = get_item(item_id)
        if item:
            return {"item": item}, 200
        return {"error": "Item not found"}, 404

    def put(self, item_id):
        """Update a specific item."""
        data = request.get_json()
        try:
            item = update_item(item_id, data)
        except SQLAlchemyError as e:
            return {"error": str(e)}, 400
        else:
            if item:
                return {"message": "Item updated", "item": item}, 200
            return {"error": "Item not found"}, 404

    def delete(self, item_id):
        """Delete an item from the catalog."""
        try:
            success = delete_item(item_id)
        except SQLAlchemyError as e:
            return {"error": str(e)}, 400
        else:
            if success:
                return {"message": "Item deleted"}, 200
            return {"error": "Item not found"}, 404
