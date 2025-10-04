from flask import Flask
from flask_cors import CORS
from api_routes import api  # <-- our blueprint

app = Flask(__name__)

# Allow your React dev server to call this API (port 3000 → 5000)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Mount all API endpoints at /api/...
app.register_blueprint(api, url_prefix="/api")

@app.get("/health")
def health():
    return {"ok": True}

if __name__ == "__main__":
    app.run(debug=True, port=5001)
