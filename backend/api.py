from flask import Flask
from flask_restx import Api
from routes import users_ns


def create_app():
    app = Flask(__name__)
    api = Api(app, title="API", version="1.0", doc="/docs")
    api.add_namespace(users_ns, path="/users")
    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
