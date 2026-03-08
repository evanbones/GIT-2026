import logging
import os

from flask import Blueprint, jsonify, redirect, request, session, url_for
from sqlalchemy import text

from config.oauth import oauth
from database import db
from models.inventory import Inventory
from models.user import Producer, Retailer, User

logger = logging.getLogger(__name__)

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")


@auth_bp.route("/login")
def login():
    redirect_uri = os.environ.get(
        "GOOGLE_REDIRECT_URI",
        url_for("auth.callback", _external=True),
    )
    return oauth.google.authorize_redirect(redirect_uri)


@auth_bp.route("/callback")
def callback():
    try:
        token = oauth.google.authorize_access_token()
        user_info = token.get("userinfo")
        if not user_info:
            resp = oauth.google.get("https://www.googleapis.com/oauth2/v3/userinfo")
            user_info = resp.json()

        user, is_new = User.find_or_create(
            google_id=user_info.get("sub"),
            email=user_info.get("email"),
            name=user_info.get("name"),
            picture=user_info.get("picture"),
        )

        session["user"] = {**user.to_dict(), "picture": user.picture}
        session["authenticated"] = True

        frontend_url = os.environ.get("CORS_ORIGINS", "http://localhost:5173")
        auth_param = "new" if is_new else "success"
        return redirect(f"{frontend_url}?auth={auth_param}")

    except Exception:
        logger.exception("OAuth callback error")
        frontend_url = os.environ.get("CORS_ORIGINS", "http://localhost:5173")
        return redirect(f"{frontend_url}?auth=error")


@auth_bp.route("/logout", methods=["POST"])
def logout():
    session.clear()
    return jsonify({"success": True})


@auth_bp.route("/onboard", methods=["POST"])
def onboard():
    if not session.get("authenticated"):
        return jsonify({"error": "Not authenticated"}), 401

    data = request.get_json()
    user_type = data.get("user_type", "").lower()
    company_name = data.get("company_name", "").strip()
    address = data.get("address", "").strip()
    description = data.get("description", "").strip()

    if user_type not in ("producer", "retailer"):
        return jsonify({"error": "user_type must be producer or retailer"}), 400
    if not company_name:
        return jsonify({"error": "company_name is required"}), 400
    if not address:
        return jsonify({"error": "address is required"}), 400

    user_id = session["user"]["id"]

    # Remove the existing consumer row and update the base user type
    db.session.execute(text("DELETE FROM consumers WHERE id = :id"), {"id": user_id})
    db.session.execute(text("UPDATE users SET user_type = :ut WHERE id = :id"), {"ut": user_type, "id": user_id})

    if user_type == "producer":
        db.session.execute(
            text("INSERT INTO producers (id, company_name, primary_address, description) VALUES (:id, :cn, :addr, :desc)"),
            {"id": user_id, "cn": company_name, "addr": address, "desc": description or None},
        )
        db.session.flush()
        db.session.add(Inventory(producer_id=user_id))
    else:
        db.session.execute(
            text("INSERT INTO retailers (id, company_name, store_address) VALUES (:id, :cn, :addr)"),
            {"id": user_id, "cn": company_name, "addr": address},
        )

    db.session.commit()

    user = db.session.get(User, user_id)
    db.session.refresh(user)
    session["user"] = {**user.to_dict(), "picture": user.picture}

    return jsonify({"user": session["user"]}), 200


@auth_bp.route("/user")
def get_user():
    if session.get("authenticated") and "user" in session:
        return jsonify({"authenticated": True, "user": session["user"]})
    return jsonify({"authenticated": False, "user": None})
