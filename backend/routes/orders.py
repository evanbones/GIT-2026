from flask import request
from flask_restx import Namespace, Resource, fields
from sqlalchemy.exc import SQLAlchemyError

from services.order_service import create_order, delete_order, get_all_orders, get_order, update_order

orders_ns = Namespace("orders", description="B2C Inventory Order Operations")

order_item_model = orders_ns.model(
    "OrderItemPayload",
    {
        "stock_id": fields.Integer(required=True, description="Associated stock ID"),
        "quantity": fields.Float(required=True, description="Quantity ordered"),
        "unit_price": fields.Float(required=True, description="Unit price at time of order"),
    },
)

order_model = orders_ns.model(
    "OrderPayload",
    {
        "consumer_id": fields.Integer(required=True, description="ID of the consumer placing the order"),
        "retailer_id": fields.Integer(required=True, description="ID of the retailer"),
        "total_amount": fields.Float(required=True, description="Total order cost"),
        "status": fields.String(required=True, description="Current order status (e.g., Pending, Shipped)"),
        "order_items": fields.List(fields.Nested(order_item_model), description="List of items in the order"),
    },
)

order_update_model = orders_ns.model(
    "OrderUpdatePayload", {"status": fields.String(required=True, description="New status for the order")}
)


@orders_ns.route("")
class OrderList(Resource):
    def get(self):
        """List all inventory orders, optionally filtered by retailer_id."""
        retailer_id = request.args.get("retailer_id", type=int)
        return {"orders": get_all_orders(retailer_id=retailer_id)}, 200

    @orders_ns.expect(order_model)
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

    @orders_ns.expect(order_update_model)
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
