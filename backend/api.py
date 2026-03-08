import os

from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS
from flask_restx import Api

from config.oauth import init_oauth
from database import init_db
from flask_session import Session
from routes.auth import auth_bp
from routes.b2b import b2b_ns
from routes.catalog import catalog_ns
from routes.inventory import inventory_ns
from routes.orders import orders_ns
from routes.users import users_ns

load_dotenv()


def create_app():
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SECRET_KEY"] = os.environ["SECRET_KEY"]
    app.config["SESSION_TYPE"] = "filesystem"

    Session(app)
    cors_origins = os.environ.get("CORS_ORIGINS", "http://localhost:5173")
    CORS(app, origins=cors_origins, supports_credentials=True)

    @app.after_request
    def add_cors_headers(response):
        response.headers["Access-Control-Allow-Origin"] = cors_origins
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        return response

    init_oauth(app)

    app.register_blueprint(auth_bp)

    api = Api(app, title="Supply Chain API", version="1.0", doc="/docs")

    api.add_namespace(users_ns, path="/users")
    api.add_namespace(catalog_ns, path="/catalog")
    api.add_namespace(orders_ns, path="/orders")
    api.add_namespace(inventory_ns, path="/inventory")
    api.add_namespace(b2b_ns, path="/b2b")

    init_db(app)
    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=8000)
