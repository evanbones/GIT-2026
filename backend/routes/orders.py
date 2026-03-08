from flask import request
from flask_restx import Namespace, Resource
from sqlalchemy.exc import SQLAlchemyError

from services.order_service import create_order, get_all_orders

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
