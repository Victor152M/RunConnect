import os
import time
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from functools import wraps


load_dotenv()

API_KEY = os.environ.get("API_KEY")

app = Flask(__name__)
CORS(app)

now = int(time.time())

users = [
    {"lat": 44.428, "lng": 26.105, "name": "Alex", "timestamp": now - 2758, "last_seen_seconds": 2758},
    {"lat": 44.421, "lng": 26.099, "name": "Maria", "timestamp": now - 75, "last_seen_seconds": 75},
    {"lat": 48.206, "lng": 16.375, "name": "Lukas", "timestamp": now - 583, "last_seen_seconds": 583},
    {"lat": 48.212, "lng": 16.368, "name": "Sophie", "timestamp": now - 1053, "last_seen_seconds": 1053}
]


def require_api_key(func):
    @wraps(func)
    def decorated(*args, **kwargs):
        key = request.headers.get("api-key")
        if key != API_KEY:
            return jsonify({"error": "Unauthorized"}), 401
        return func(*args, **kwargs)
    return decorated


@app.route("/locations", methods=["GET"])
@require_api_key
def locations():
    now = int(time.time())
    for user in users:
        user["last_seen_seconds"] = now - user["timestamp"]
    return jsonify(users)


@app.route("/upload_location", methods=["POST"])
@require_api_key
def upload_location():
    data = request.json

    name = data.get("name")
    lat = data.get("lat")
    lng = data.get("lng")

    if not name or lat is None or lng is None:
        return jsonify({"error": "Invalid data"}), 400

    now = int(time.time())

    for user in users:
        if user["name"] == name:
            user["lat"] = lat
            user["lng"] = lng
            user["timestamp"] = now
            user["last_seen_seconds"] = now - user["timestamp"]
            return jsonify({"status": "updated"})

    users.append({
        "name": name,
        "lat": lat,
        "lng": lng,
        "timestamp": now,
        "last_seen_seconds": 0
    })

    return jsonify({"status": "created"}), 201


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

