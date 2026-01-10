from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

API_KEY = os.environ.get("API_KEY")

app = Flask(__name__)
CORS(app)

users = [
    {"id": 1, "lat": 44.428, "lng": 26.105, "name": "Alex"},
    {"id": 2, "lat": 44.421, "lng": 26.099, "name": "Maria"},
    { "id": 3, "lat": 48.206, "lng": 16.375, "name": "Lukas" },
    { "id": 4, "lat": 48.212, "lng": 16.368, "name": "Sophie" }
]


def require_api_key(func):
    @wraps(func)
    def decorated(*args, **kwargs):
        key = request.headers.get("api-key")
        if key != API_KEY:
            return jsonify({"error": "Unauthorized"}), 401
        return func(*args, **kwargs)
    return decorated


@app.route("/locations")
@require_api_key
def locations():
    return jsonify(users)



if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

    