import os
from flask import Flask, jsonify
from flask_cors import CORS  # Add this import

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Get environment variables with default values
API_BASE = os.getenv("API_BASE", "/api")
MESSAGE_CONTENT = os.getenv("MESSAGE_CONTENT", "Hello")

@app.route(f"{API_BASE}", methods=['GET'])
def get_data():
    response = {
        "message": MESSAGE_CONTENT
    }
    return jsonify(response)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)