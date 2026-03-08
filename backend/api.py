import os

from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS
from flask_restx import Api
from flask_session import Session

from config.oauth import init_oauth
from database import init_db
from routes import auth_bp, users_ns

load_dotenv()


def create_app():
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ["DATABASE_URL"]
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SECRET_KEY"] = os.environ["SECRET_KEY"]
    app.config["SESSION_TYPE"] = "filesystem"

    Session(app)
    CORS(app, origins=os.environ.get("CORS_ORIGINS", "http://localhost:5173"), supports_credentials=True)
    init_oauth(app)

    app.register_blueprint(auth_bp)

    api = Api(app, title="API", version="1.0", doc="/docs")
    api.add_namespace(users_ns, path="/users")

    init_db(app)
    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=8000)
