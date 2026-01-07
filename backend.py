from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/locations")
def locations():
    users = [
        {"id": 1, "lat": 44.428, "lng": 26.105, "name": "Alex"},
        {"id": 2, "lat": 44.421, "lng": 26.099, "name": "Maria"},
        { "id": 3, "lat": 48.206, "lng": 16.375, "name": "Lukas" },
        { "id": 4, "lat": 48.212, "lng": 16.368, "name": "Sophie" }
    ]
    return jsonify(users)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

    