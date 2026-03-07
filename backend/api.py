import os

from dotenv import load_dotenv
from flask import Flask
from flask_restx import Api

from database import init_db
from routes import users_ns

load_dotenv()


def create_app():
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ["DATABASE_URL"]
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    api = Api(app, title="API", version="1.0", doc="/docs")
    api.add_namespace(users_ns, path="/users")
    init_db(app)
    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
