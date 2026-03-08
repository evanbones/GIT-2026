from flask import request
from flask_restx import Namespace, Resource
from sqlalchemy.exc import SQLAlchemyError

from services.b2b_service import (
    create_group_buy,
    create_offer,
    delete_group_buy,
    delete_offer,
    get_all_group_buys,
    get_all_offers,
    get_group_buy,
    get_offer,
    join_group_buy,
    update_group_buy,
    update_offer,
)

b2b_ns = Namespace("b2b", description="Business to Business Group Buys and Offers")


@b2b_ns.route("/group-buys")
class GroupBuyList(Resource):
    def get(self):
        """List group buy initiatives, optionally filtered by retailer_id, producer_id, item_id, or status."""
        retailer_id = request.args.get("retailer_id", type=int)
        producer_id = request.args.get("producer_id", type=int)
        item_id = request.args.get("item_id", type=int)
        status = request.args.get("status", type=str)
        return {"group_buys": get_all_group_buys(retailer_id=retailer_id, item_id=item_id, status=status, producer_id=producer_id)}, 200

    def post(self):
        """Create a new group buy initiative."""
        data = request.get_json()
        try:
            result = create_group_buy(data)
        except SQLAlchemyError as e:
            return {"error": str(e)}, 400
        else:
            return {"message": "Group buy created", "group_buy": result}, 201


@b2b_ns.route("/group-buys/<int:gb_id>")
class GroupBuyDetail(Resource):
    def get(self, gb_id):
        """Retrieve a specific group buy."""
        gb = get_group_buy(gb_id)
        if gb:
            return {"group_buy": gb}, 200
        return {"error": "Group buy not found"}, 404

    def put(self, gb_id):
        """Update group buy status or current quantities."""
        data = request.get_json()
        try:
            gb = update_group_buy(gb_id, data)
        except SQLAlchemyError as e:
            return {"error": str(e)}, 400
        else:
            if gb:
                return {"message": "Group buy updated", "group_buy": gb}, 200
            return {"error": "Group buy not found"}, 404

    def delete(self, gb_id):
        """Delete a group buy initiative."""
        try:
            success = delete_group_buy(gb_id)
        except SQLAlchemyError as e:
            return {"error": str(e)}, 400
        else:
            if success:
                return {"message": "Group buy deleted"}, 200
            return {"error": "Group buy not found"}, 404


@b2b_ns.route("/group-buys/<int:gb_id>/join")
class GroupBuyJoin(Resource):
    def post(self, gb_id):
        """Join an existing open group buy."""
        data = request.get_json()
        try:
            result = join_group_buy(gb_id, data)
        except SQLAlchemyError as e:
            return {"error": str(e)}, 400
        if result:
            return {"message": "Joined group buy", "group_buy": result}, 200
        return {"error": "Group buy not found or not open"}, 404


@b2b_ns.route("/offers")
class OfferList(Resource):
    def get(self):
        """List direct B2B stock offers, optionally filtered by producer_id or retailer_id."""
        producer_id = request.args.get("producer_id", type=int)
        retailer_id = request.args.get("retailer_id", type=int)
        return {"offers": get_all_offers(producer_id=producer_id, retailer_id=retailer_id)}, 200

    def post(self):
        """Submit a new offer from a retailer to a producer."""
        data = request.get_json()
        try:
            result = create_offer(data)
        except SQLAlchemyError as e:
            return {"error": str(e)}, 400
        else:
            return {"message": "Offer submitted", "offer": result}, 201


@b2b_ns.route("/offers/<int:offer_id>")
class OfferDetail(Resource):
    def get(self, offer_id):
        """Retrieve a specific direct offer."""
        offer = get_offer(offer_id)
        if offer:
            return {"offer": offer}, 200
        return {"error": "Offer not found"}, 404

    def put(self, offer_id):
        """Update an offer's status (e.g., accepted, rejected)."""
        data = request.get_json()
        try:
            offer = update_offer(offer_id, data)
        except SQLAlchemyError as e:
            return {"error": str(e)}, 400
        else:
            if offer:
                return {"message": "Offer updated", "offer": offer}, 200
            return {"error": "Offer not found"}, 404

    def delete(self, offer_id):
        """Delete a direct offer."""
        try:
            success = delete_offer(offer_id)
        except SQLAlchemyError as e:
            return {"error": str(e)}, 400
        else:
            if success:
                return {"message": "Offer deleted"}, 200
            return {"error": "Offer not found"}, 404
