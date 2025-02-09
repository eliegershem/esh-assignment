import os
from flask import Flask, jsonify, request, Response
from flask_cors import CORS
from prometheus_client import Counter, Histogram, generate_latest, CONTENT_TYPE_LATEST
import time

app = Flask(__name__)
CORS(app)

# Custom metrics
REQUEST_COUNT = Counter(
    'request_count', 'App Request Count',
    ['method', 'endpoint', 'http_status']
)

REQUEST_LATENCY = Histogram(
    'request_latency_seconds', 'Request latency',
    ['endpoint']
)

ERROR_COUNT = Counter(
    'error_count', 'Error Count',
    ['endpoint', 'error_type']
)

# Get environment variables with default values
API_BASE = os.getenv("API_BASE", "/api")
MESSAGE_CONTENT = os.getenv("MESSAGE_CONTENT", "Hello")

@app.before_request
def before_request():
    request.start_time = time.time()

@app.after_request
def after_request(response):
    if hasattr(request, 'start_time'):
        request_latency = time.time() - request.start_time
        REQUEST_LATENCY.labels(endpoint=request.path).observe(request_latency)
        
    REQUEST_COUNT.labels(
        method=request.method,
        endpoint=request.path,
        http_status=response.status_code
    ).inc()
    
    if response.status_code >= 400:
        ERROR_COUNT.labels(
            endpoint=request.path,
            error_type=str(response.status_code)
        ).inc()
    
    return response

@app.route('/metrics')
def metrics():
    return Response(generate_latest(), mimetype=CONTENT_TYPE_LATEST)

@app.route(f"{API_BASE}")
def get_data():
    response = {
        "message": MESSAGE_CONTENT
    }
    return jsonify(response)

@app.route('/health')
def health():
    return jsonify({"status": "healthy"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)