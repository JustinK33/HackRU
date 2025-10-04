from flask import Blueprint, request, jsonify, current_app
from pathlib import Path
import json

api = Blueprint("api", __name__)

# Load JSON once and cache in memory
_DATA = None

def load_data():
    global _DATA
    if _DATA is not None:
        return _DATA
    # JSON is at project root: fast-friendly-food-calculator/fastfood_items.json
    project_root = Path(__file__).resolve().parents[1]
    json_path = project_root / "fastfood_items.json"
    if not json_path.exists():
        raise FileNotFoundError(f"Could not find {json_path}")
    with json_path.open("r", encoding="utf-8") as f:
        _DATA = json.load(f)
    # normalize some common keys
    for row in _DATA:
        row.setdefault("restaurant", "")
        row.setdefault("item", row.get("name", ""))
        if "kcal" not in row and "calories" in row:
            row["kcal"] = row["calories"]
    return _DATA

def num(x):
    try:
        return float(x)
    except Exception:
        return 0.0

def is_main(item: dict) -> bool:
    # heuristics to exclude sides/drinks/sauces if not marked
    if "is_main_candidate" in item:
        return bool(item["is_main_candidate"])
    
    cat = (item.get("category") or "").lower()
    item_name = (item.get("item") or item.get("name") or "").lower()
    
    # Always exclude these
    if any(x in cat for x in ["drink", "beverage", "soda", "juice", "coffee", "tea", "water"]):
        return False
    if any(x in item_name for x in ["drink", "soda", "juice", "coffee", "tea", "water", "beverage"]):
        return False
    
    # Exclude small sides and condiments
    if any(x in cat for x in ["sauce", "condiment", "dip", "spread"]):
        return False
    if any(x in item_name for x in ["sauce", "dip", "spread", "condiment"]):
        return False
    
    # Include main items
    if any(x in cat for x in ["main", "burger", "sandwich", "wrap", "bowl", "entree", "combo", "taco", "pizza", "nugget", "wing", "salad", "chicken", "beef", "fish", "pork"]):
        return True
    if any(x in item_name for x in ["burger", "sandwich", "wrap", "bowl", "taco", "pizza", "nugget", "wing", "salad", "chicken", "beef", "fish", "pork", "meal", "combo"]):
        return True
    
    # If no category or unclear, include it (be more inclusive)
    return True

def is_dessert_or_low_protein(item: dict) -> bool:
    """Check if item is a dessert or has low protein (for cutting goals)"""
    cat = (item.get("category") or "").lower()
    item_name = (item.get("item") or item.get("name") or "").lower()
    protein = num(item.get("protein_g") or item.get("protein"))
    
    # Exclude desserts
    if any(x in cat for x in ["dessert", "sweet", "treat"]):
        return True
    if any(x in item_name for x in ["pie", "cake", "sundae", "shake", "ice cream", "cookie", "brownie", "donut"]):
        return True
    
    # Exclude low protein items
    if protein < 10:
        return True
    
    return False

def is_high_carb(item: dict) -> bool:
    """Check if item is high in carbs (for keto goals)"""
    carbs = num(item.get("carbs_g") or item.get("carbs"))
    # For keto, exclude items with more than 25g carbs (more reasonable)
    return carbs > 25

def is_obvious_dessert(item: dict) -> bool:
    """Check if item is obviously a dessert"""
    cat = (item.get("category") or "").lower()
    item_name = (item.get("item") or item.get("name") or "").lower()
    
    # Exclude obvious desserts
    if any(x in cat for x in ["dessert", "sweet", "treat"]):
        return True
    if any(x in item_name for x in ["pie", "cake", "sundae", "shake", "ice cream", "cookie", "brownie", "donut"]):
        return True
    
    return False

def score(item: dict, goal: str) -> float:
    kcal = num(item.get("kcal"))
    p = num(item.get("protein_g") or item.get("protein"))
    c = num(item.get("carbs_g") or item.get("carbs"))
    f = num(item.get("fat_g") or item.get("fat"))
    g = (goal or "cutting").lower()
    
    # Minimum thresholds for each goal
    min_protein = 10  # Minimum protein to be considered
    min_calories = 200  # Minimum calories for a substantial meal
    
    # Penalize items that don't meet basic requirements
    if p < min_protein:
        return -1000  # Heavily penalize low protein items
    if kcal < min_calories:
        return -1000   # Heavily penalize very low calorie items
    
    if g == "cutting":
        # For cutting: prioritize high protein, moderate calories, avoid high fat
        # Penalize high calorie items heavily
        if kcal > 600:
            return -200  # Penalize high calorie items
        if f > 30:
            return -100  # Penalize high fat items
        # Score based on protein density and reasonable calories
        protein_density = p / max(kcal, 1) * 100  # protein per 100 calories
        return (protein_density * 10) + (p * 2) - (kcal * 0.1) - (f * 0.5)
    
    elif g == "bulking":
        # For bulking: prioritize high protein AND high calories
        if kcal < 400:
            return -100  # Penalize low calorie items for bulking
        # Score based on both protein and calories
        return (p * 3) + (kcal * 0.05) - (f * 0.2)  # High protein + calories
    
    elif g == "keto":
        # For keto: prioritize high fat, low carbs, moderate protein
        if c > 30:
            return -1000  # Heavily penalize high carb items
        if c > 25:
            return -800  # Penalize items with too many carbs
        if f < 15:
            return -400  # Heavily penalize low fat items
        # Score based on fat content and low carbs
        return (f * 4) + (p * 1.5) - (c * 10)  # High fat, low carbs
    
    # Default to cutting if goal not recognized
    return (p * 2) - (kcal * 0.1) - (f * 0.5)

def project_for_frontend(item: dict) -> dict:
    """Shape the output for MenuSuggestions.jsx (name, description, calories)."""
    return {
        "name": item.get("item") or item.get("name") or "Unknown Item",
        "description": (item.get("category") or "Main") + (
            f" · {item.get('serving_size')}" if item.get("serving_size") else ""
        ),
        "calories": int(num(item.get("kcal"))),
        # include some extras if you want to display later:
        "protein_g": num(item.get("protein_g") or item.get("protein")),
        "carbs_g": num(item.get("carbs_g") or item.get("carbs")),
        "fat_g": num(item.get("fat_g") or item.get("fat")),
        "sodium_mg": num(item.get("sodium_mg")),
        "restaurant": item.get("restaurant"),
    }

@api.route("/restaurants", methods=["GET"])
def restaurants():
    data = load_data()
    names = sorted({(r.get("restaurant") or "").strip() for r in data if r.get("restaurant")})
    return jsonify({"restaurants": names})

@api.route("/suggestions", methods=["POST"])
def suggestions():
    """
    Body JSON:
      {
        "restaurant": "Taco Bell",
        "fitnessGoals": "cutting"   # or "bulking"/"keto"
      }
    Returns:
      { "suggestions": [ {name, description, calories, ...}, ... ] }
    """
    body = request.get_json(silent=True) or {}
    restaurant = (body.get("restaurant") or "").strip()
    goal = (body.get("fitnessGoals") or "cutting").strip().lower()

    if not restaurant:
        return jsonify({"error": "restaurant is required"}), 400

    data = load_data()
    items = [row for row in data if (row.get("restaurant") or "").strip() == restaurant]
    
    if not items:
        return jsonify({"error": f"No items found for restaurant: {restaurant}"}), 404
    
    # Get main items first
    mains = [it for it in items if is_main(it)]
    
    # Apply goal-specific filtering BEFORE scoring
    if goal == "cutting":
        # For cutting, exclude obvious desserts and very low protein items
        mains = [it for it in mains if not is_obvious_dessert(it)]
        mains = [it for it in mains if num(it.get("protein_g") or it.get("protein")) >= 10]
    elif goal == "keto":
        # For keto, exclude very high carb items (be more reasonable)
        mains = [it for it in mains if num(it.get("carbs_g") or it.get("carbs")) <= 30]
        mains = [it for it in mains if num(it.get("kcal")) >= 200]
    elif goal == "bulking":
        # For bulking, exclude very low calorie items
        mains = [it for it in mains if num(it.get("kcal")) >= 300]
    
    # If we filtered out too many items, be less strict
    if len(mains) < 3:
        # For cutting, at least exclude obvious desserts
        if goal == "cutting":
            mains = [it for it in items if is_main(it)]
            mains = [it for it in mains if not is_obvious_dessert(it)]
        # For keto, at least exclude very high carb items
        elif goal == "keto":
            mains = [it for it in items if is_main(it)]
            mains = [it for it in mains if num(it.get("carbs_g") or it.get("carbs")) <= 40]
        # For bulking, just get main items
        else:
            mains = [it for it in items if is_main(it)]
    
    # If still no items, include everything (last resort)
    if not mains:
        mains = items[:20]  # Take first 20 items as fallback
    
    # If we have fewer than 5 main items, include more items (be more inclusive)
    if len(mains) < 5:
        # Include items that might be sides but are substantial
        additional_items = []
        for item in items:
            if item not in mains:
                cat = (item.get("category") or "").lower()
                item_name = (item.get("item") or item.get("name") or "").lower()
                protein = num(item.get("protein_g") or item.get("protein"))
                
                # Only include substantial sides that meet goal requirements
                if any(x in cat for x in ["side", "appetizer", "snack"]) and any(x in item_name for x in ["nugget", "wing", "salad", "soup", "chili"]):
                    # For cutting, only include if high protein
                    if goal == "cutting" and protein >= 15:
                        additional_items.append(item)
                    # For other goals, include if substantial
                    elif goal != "cutting":
                        additional_items.append(item)
        
        mains.extend(additional_items[:10])  # Add up to 10 additional items
    
    # If still no items, include everything (last resort)
    if not mains:
        mains = items[:20]  # Take first 20 items as fallback
    
    # Rank all items and get top 5 (3 main + 2 runner-ups)
    ranked = sorted(mains, key=lambda it: score(it, goal), reverse=True)[:5]
    
    # Separate into main suggestions and runner-ups
    main_suggestions = ranked[:3]
    runner_ups = ranked[3:5]
    
    return jsonify({
        "suggestions": [project_for_frontend(it) for it in main_suggestions],
        "runner_ups": [project_for_frontend(it) for it in runner_ups]
    })

@api.route("/health", methods=["GET"])
def health():
    return jsonify(ok=True)
