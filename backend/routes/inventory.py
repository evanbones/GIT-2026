from flask import request
from flask_restx import Namespace, Resource
from sqlalchemy.exc import SQLAlchemyError

from services.inventory_service import (
    create_inventory,
    create_stock,
    delete_inventory,
    delete_stock,
    get_all_inventories,
    get_all_stocks,
    get_inventory,
    get_inventory_items,
    get_inventory_stocks,
    get_item_stock_across_inventories,
    get_stock,
    update_stock,
)

inventory_ns = Namespace("inventory", description="Retailer Inventory and Stock Management")


@inventory_ns.route("")
class InventoryList(Resource):
    def get(self):
        """List all retailer inventories."""
        return {"inventories": get_all_inventories()}, 200

    def post(self):
        """Create a new inventory for a retailer."""
        data = request.get_json()
        try:
            result = create_inventory(data)
        except SQLAlchemyError as e:
            return {"error": str(e)}, 400
        else:
            return {"message": "Inventory created", "inventory": result}, 201


@inventory_ns.route("/<int:inventory_id>")
class InventoryDetail(Resource):
    def get(self, inventory_id):
        """Retrieve a specific inventory."""
        inv = get_inventory(inventory_id)
        if inv:
            return {"inventory": inv}, 200
        return {"error": "Inventory not found"}, 404

    def delete(self, inventory_id):
        """Delete an inventory."""
        try:
            success = delete_inventory(inventory_id)
        except SQLAlchemyError as e:
            return {"error": str(e)}, 400
        else:
            if success:
                return {"message": "Inventory deleted"}, 200
            return {"error": "Inventory not found"}, 404


@inventory_ns.route("/stocks")
class StockList(Resource):
    def get(self):
        """List all specific stocks within inventories."""
        return {"stocks": get_all_stocks()}, 200

    def post(self):
        """Add new stock for an item. Provide item_id for existing items, or a full item+prices object to create inline."""
        data = request.get_json()
        try:
            result = create_stock(data)
        except (SQLAlchemyError, ValueError) as e:
            return {"error": str(e)}, 400
        else:
            return {"message": "Stock created", "stock": result}, 201


@inventory_ns.route("/<int:inventory_id>/stocks")
class InventoryStocks(Resource):
    def get(self, inventory_id):
        """List all stocks in an inventory with item and price details."""
        return {"stocks": get_inventory_stocks(inventory_id)}, 200


@inventory_ns.route("/<int:inventory_id>/items")
class InventoryItems(Resource):
    def get(self, inventory_id):
        """List all items in an inventory with total quantity and prices."""
        return {"items": get_inventory_items(inventory_id)}, 200


@inventory_ns.route("/items/<int:item_id>/stock")
class ItemStock(Resource):
    def get(self, item_id):
        """Get an item with all its stock records across inventories."""
        result = get_item_stock_across_inventories(item_id)
        if result:
            return result, 200
        return {"error": "Item not found"}, 404


@inventory_ns.route("/stocks/<int:stock_id>")
class StockDetail(Resource):
    def get(self, stock_id):
        """Retrieve specific stock information."""
        stock = get_stock(stock_id)
        if stock:
            return {"stock": stock}, 200
        return {"error": "Stock not found"}, 404

    def put(self, stock_id):
        """Update stock levels, batches, or expirations."""
        data = request.get_json()
        try:
            stock = update_stock(stock_id, data)
        except SQLAlchemyError as e:
            return {"error": str(e)}, 400
        else:
            if stock:
                return {"message": "Stock updated", "stock": stock}, 200
            return {"error": "Stock not found"}, 404

    def delete(self, stock_id):
        """Delete a stock record."""
        try:
            success = delete_stock(stock_id)
        except SQLAlchemyError as e:
            return {"error": str(e)}, 400
        else:
            if success:
                return {"message": "Stock deleted"}, 200
            return {"error": "Stock not found"}, 404
