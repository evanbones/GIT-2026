import logging
import os

from flask import Blueprint, jsonify, redirect, session, url_for

from config.oauth import oauth
from models.user import User

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

        session["user"] = {
            "id": user.id,
            "email": user.email,
            "picture": user.picture,
            "user_type": user.user_type,
        }
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


@auth_bp.route("/user")
def get_user():
    if session.get("authenticated") and "user" in session:
        return jsonify({"authenticated": True, "user": session["user"]})
    return jsonify({"authenticated": False, "user": None})
