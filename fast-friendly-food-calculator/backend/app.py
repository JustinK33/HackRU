import sys
import os
import json
from flask import Flask, jsonify, Blueprint, request
from flask_cors import CORS
from pathlib import Path

# --- FLASK APP SETUP ---
# The app object must be created first before anything else.
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# --- CORE APPLICATION LOGIC AND BLUEPRINT DEFINITION ---

# The single blueprint that will hold all of our API routes
api = Blueprint("api", __name__)

# Cache the data in memory to avoid reloading it on every request
_DATA = None

def load_data():
    """
    Loads the JSON data from the fastfood_items.json file.
    This function will find the file relative to its own location.
    """
    global _DATA
    if _DATA is not None:
        return _DATA

    # Get the directory of the current file (app.py) and construct the path
    json_path = Path(__file__).parent / "fastfood_items.json"
    
    if not json_path.exists():
        raise FileNotFoundError(f"fastfood_items.json not found at: {json_path.resolve()}")
    
    try:
        with json_path.open("r", encoding="utf-8") as f:
            _DATA = json.load(f)
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON from file {json_path}: {e}", file=sys.stderr)
        _DATA = []
    
    NAME_KEYS = ["item", "name", "menu_item_name", "product_name"]

    for row in _DATA:
        row.setdefault("restaurant", "")
        category_val = row.get("category", "").lower()
        specific_name = ""
        for key in NAME_KEYS:
            if key in row and row[key]:
                specific_name = row[key]
                break
        row.setdefault("item", specific_name)
        row.setdefault("category", category_val)

    return _DATA

def num(x):
    try:
        return float(x)
    except Exception:
        return 0.0

def _items_for(restaurant_name, category="all"):
    data = load_data()
    items = []
    for item in data:
        restaurant_match = restaurant_name == "*" or (item.get("restaurant") or "").lower() == restaurant_name.lower()
        category_match = category.lower() == "all" or (item.get("category") or "").lower() == category.lower()
        if restaurant_match and category_match:
            items.append(item)
    return items

def project_for_frontend(item):
    return {
        "name": item.get("item", item.get("name", "N/A")),
        "category": item.get("category", "N/A"),
        "description": item.get("description", "A classic choice."),
        "calories": num(item.get("calories", item.get("kcal", 0))),
        "protein_g": num(item.get("protein", item.get("protein_g", 0))),
        "carbs_g": num(item.get("carbs", item.get("carbs_g", 0))),
        "fat_g": num(item.get("fat", item.get("fat_g", 0))),
        "sodium_mg": num(item.get("sodium", item.get("sodium_mg", 0)))
    }

# --- API ROUTES ---
@api.get("/menu/<restaurant_name>")
def get_restaurant_menu_items(restaurant_name):
    try:
        items = _items_for(restaurant_name)
        frontend_items = [project_for_frontend(item) for item in items]
        return jsonify({"restaurant": restaurant_name, "items": frontend_items})
    except FileNotFoundError as e:
        print(f"Error: {e}", file=sys.stderr)
        return jsonify({"error": "Data file not found"}), 500

@api.get("/suggestions")
def get_menu_suggestions():
    restaurant = request.args.get("restaurant")
    goal = request.args.get("fitnessGoal")
    category = request.args.get("category", "all")
    if not restaurant or not goal:
        return jsonify({"error": "Missing restaurant or fitnessGoal parameter."}), 400
    items = _items_for(restaurant, category)
    if not items:
        return jsonify({"suggestions": [], "runner_ups": []})
    def score(item, goal):
        p = num(item.get("protein_g") or item.get("protein"))
        c = num(item.get("carbs_g") or item.get("carbs"))
        f = num(item.get("fat_g") or item.get("fat"))
        k = num(item.get("kcal") or item.get("calories"))
        if goal == "cutting":
            return p * 5 - k
        elif goal == "bulking":
            return p * 5 + k
        elif goal == "keto":
            return p * 3 + f * 2 - c * 4
        return p
    ranked = sorted(items, key=lambda it: score(it, goal), reverse=True)[:5]
    main_suggestions = ranked[:3]
    runner_ups = ranked[3:5]
    return jsonify({
        "suggestions": [project_for_frontend(it) for it in main_suggestions],
        "runner_ups": [project_for_frontend(it) for it in runner_ups]
    })

@api.get("/restaurants")
def get_restaurants():
    try:
        data = load_data()
        all_items = _items_for("*")
        unique_restaurants = sorted(list(set(item['restaurant'] for item in all_items)))
        return jsonify({"restaurants": unique_restaurants})
    except FileNotFoundError:
        print("[ERROR] fastfood_items.json not found. Check the file location.", file=sys.stderr)
        return jsonify({"error": "Data file not found"}), 500
    except Exception as e:
        print(f"[ERROR] Failed to load restaurants: {e}", file=sys.stderr)
        return jsonify({"error": "Internal server error"}), 500
    
# --- FINAL BLUEPRINT REGISTRATION AND NON-API ROUTES ---
# This line MUST come after all of your @api.get decorators
app.register_blueprint(api, url_prefix="/api")

# --- WEBSITE ROUTES (non-API) ---
@app.route("/")
def index():
    return "Welcome to the Macrave Backend API."

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5001))
    app.run(debug=True, port=port)