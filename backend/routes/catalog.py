from flask import request
from flask_restx import Namespace, Resource
from sqlalchemy.exc import SQLAlchemyError

from services.catalog_service import create_item, get_all_items

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
            return {"message": "Item created", "item": result}, 201
        except SQLAlchemyError as e:
            return {"error": str(e)}, 400
        else:
            return {"message": "Item created", "item": result}, 201
