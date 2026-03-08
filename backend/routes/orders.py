from flask import request
from flask_restx import Namespace, Resource
from sqlalchemy.exc import SQLAlchemyError

from services.order_service import create_order, delete_order, get_all_orders, get_order, update_order

orders_ns = Namespace("orders", description="B2C Inventory Order Operations")


@orders_ns.route("")
class OrderList(Resource):
    def get(self):
        """
        List all inventory orders.
        """
        return {"orders": get_all_orders()}, 200

    def post(self):
        """
        Create a new B2C order, including nested order items.
        """
        data = request.get_json()
        try:
            result = create_order(data)
        except SQLAlchemyError as e:
            return {"error": str(e)}, 400
        else:
            return {"message": "Order successfully created", "order": result}, 201


@orders_ns.route("/<int:order_id>")
class OrderDetail(Resource):
    def get(self, order_id):
        """Retrieve a specific order."""
        order = get_order(order_id)
        if order:
            return {"order": order}, 200
        return {"error": "Order not found"}, 404

    def put(self, order_id):
        """Update an order's status."""
        data = request.get_json()
        try:
            order = update_order(order_id, data)
        except SQLAlchemyError as e:
            return {"error": str(e)}, 400
        else:
            if order:
                return {"message": "Order updated", "order": order}, 200
            return {"error": "Order not found"}, 404

    def delete(self, order_id):
        """Delete an order."""
        try:
            success = delete_order(order_id)
        except SQLAlchemyError as e:
            return {"error": str(e)}, 400
        else:
            if success:
                return {"message": "Order deleted"}, 200
            return {"error": "Order not found"}, 404
