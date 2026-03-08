import os

from dotenv import load_dotenv
from flask import Flask
from flask_restx import Api

from database import init_db
from routes.catalog import catalog_ns
from routes.orders import orders_ns
from routes.users import users_ns

load_dotenv()


def create_app():
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    api = Api(app, title="Supply Chain API", version="1.0", doc="/docs")

    api.add_namespace(users_ns, path="/users")
    api.add_namespace(catalog_ns, path="/catalog")
    api.add_namespace(orders_ns, path="/orders")

    init_db(app)
    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
