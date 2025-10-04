# routes.py  — website (server-rendered) routes using fastfood_items.json
from flask import Blueprint, render_template, request, redirect, url_for, session, jsonify, current_app
from pathlib import Path
import json
import re

# Exported Blueprint (import this in app.py)
routes = Blueprint("routes", __name__)

# -----------------------------
# Data loading (cached in memory)
# -----------------------------
_DATA = None  # in-memory cache

def _load_all():
    """
    Load the full fastfood_items.json once and keep it in memory.
    Set app.config['FOOD_JSON_PATH'] if the file lives elsewhere.
    """
    global _DATA
    if _DATA is not None:
        return _DATA

    json_path = Path(current_app.config.get("FOOD_JSON_PATH", "fastfood_items.json"))
    if not json_path.exists():
        raise FileNotFoundError(f"fastfood_items.json not found at: {json_path.resolve()}")

    with json_path.open("r", encoding="utf-8") as f:
        data = json.load(f)

    # normalize common keys
    for row in data:
        row.setdefault("restaurant", "")
        row.setdefault("item", row.get("name", ""))
        row.setdefault("category", "")
        if "kcal" not in row and "calories" in row:
            row["kcal"] = row.get("calories")
        if "protein_g" not in row and "protein" in row:
            row["protein_g"] = row.get("protein")
        if "carbs_g" not in row and "carbs" in row:
            row["carbs_g"] = row.get("carbs")
        if "fat_g" not in row and "fat" in row:
            row["fat_g"] = row.get("fat")
    _DATA = data
    return _DATA

# -----------------------------
# Helpers
# -----------------------------
def _num(x):
    try:
        return float(x)
    except Exception:
        return 0.0

def _all_restaurants():
    data = _load_all()
    return sorted({(r.get("restaurant") or "").strip() for r in data if r.get("restaurant")})

def _items_for(restaurant: str):
    data = _load_all()
    r = (restaurant or "").strip()
    return [row for row in data if (row.get("restaurant") or "").strip() == r]

def _is_main(item: dict) -> bool:
    if "is_main_candidate" in item:
        return bool(item["is_main_candidate"])
    cat = (item.get("category") or "").lower()
    if not cat:
        return True
    if any(x in cat for x in ["side", "sauce", "drink", "dessert", "shake", "condiment"]):
        return False
    if any(x in cat for x in ["main", "burger", "sandwich", "wrap", "bowl", "entree", "combo", "taco", "pizza", "nugget", "wing", "salad"]):
        return True
    return True

def _score(item: dict, goal: str) -> float:
    kcal = _num(item.get("kcal"))
    p    = _num(item.get("protein_g"))
    c    = _num(item.get("carbs_g"))
    f    = _num(item.get("fat_g"))

    g = (goal or "cutting").lower()
    if g == "bulking":
        return (2.5 * p) + (0.01 * kcal)          # reward protein + calories
    if g == "keto":
        return (2.0 * p) - (1.5 * c) + (0.5 * f)  # low carbs, decent fat & protein
    return (3.0 * p) - (0.02 * kcal) - (0.5 * f)  # cutting default

def _project(item: dict) -> dict:
    return {
        "restaurant": item.get("restaurant"),
        "item": item.get("item") or item.get("name") or "Unknown Item",
        "category": item.get("category"),
        "serving_size": item.get("serving_size"),
        "kcal": item.get("kcal"),
        "protein_g": item.get("protein_g"),
        "carbs_g": item.get("carbs_g"),
        "fat_g": item.get("fat_g"),
        "sodium_mg": item.get("sodium_mg"),
        "is_main_candidate": bool(item.get("is_main_candidate", False)),
    }

# -----------------------------
# PAGES (server-rendered)
# -----------------------------

# 1) Onboarding / Profile setup
@routes.route("/", methods=["GET", "POST"])
def onboarding():
    if request.method == "POST":
        session["profile"] = {
            "name": request.form.get("name", "").strip(),
            "goal": request.form.get("goal", "cutting"),
            "age": request.form.get("age", "").strip(),
            "weight": request.form.get("weight", "").strip(),
            "username": request.form.get("username", "").strip(),
            # NOTE: do not store plaintext passwords in production
        }
        return redirect(url_for("routes.home"))
    return render_template("onboarding.html", title="Onboarding")

# 2) Homepage
@routes.get("/home")
def home():
    prof = session.get("profile", {})
    restaurants = _all_restaurants()

    # Build a cross-restaurant “top picks” carousel: take a couple top mains from each
    aggregated = []
    for r in restaurants[:25]:
        mains = [it for it in _items_for(r) if _is_main(it)]
        ranked = sorted(mains, key=lambda it: _score(it, prof.get("goal", "cutting")), reverse=True)
        aggregated.extend([_project(x) | {"restaurant": r} for x in ranked[:2]])
    slideshow = aggregated[:12]

    return render_template(
        "home.html",
        title="Home",
        profile=prof,
        restaurants=restaurants,
        slideshow=slideshow
    )

# 3) Restaurant details
@routes.route("/restaurant", methods=["GET", "POST"])
def restaurant_details():
    prof = session.get("profile", {})
    restaurants = _all_restaurants()
    selected = request.values.get("restaurant") or (restaurants[0] if restaurants else "")
    items = _items_for(selected)
    mains = [it for it in items if _is_main(it)]
    items_proj = [_project(it) for it in items]

    return render_template(
        "restaurant.html",
        title=f"{selected} — Details",
        profile=prof,
        restaurants=restaurants,
        restaurant=selected,
        mains_count=len(mains),
        items=items_proj
    )

# 4) Top 3 items for a restaurant
@routes.get("/top3")
def top3():
    prof = session.get("profile", {})
    restaurant = (request.args.get("restaurant") or "").strip()
    if not restaurant:
        return redirect(url_for("routes.restaurant_details"))

    mains = [it for it in _items_for(restaurant) if _is_main(it)]
    ranked = sorted(
        mains,
        key=lambda it: (
            _score(it, prof.get("goal", "cutting")),
            _num(it.get("protein_g")),
            -_num(it.get("kcal"))
        ),
        reverse=True
    )
    picks = [_project(it) for it in ranked[:3]]

    return render_template(
        "top3.html",
        title=f"Top 3 @ {restaurant}",
        profile=prof,
        restaurant=restaurant,
        picks=picks
    )

# 5) Item nutrition facts
@routes.get("/item")
def item_details():
    restaurant = (request.args.get("restaurant") or "").strip()
    name = (request.args.get("name") or "").strip()
    match = None
    for it in _items_for(restaurant):
        nm = (it.get("item") or it.get("name") or "").strip()
        if nm.lower() == name.lower():
            match = _project(it)
            break

    return render_template(
        "item.html",
        title=f"{name} — Nutrition",
        restaurant=restaurant,
        item=match,
        name=name
    )

# 6) Account details
@routes.get("/account")
def account():
    prof = session.get("profile", {})
    return render_template("account.html", title="Account", profile=prof)

# -----------------------------
# Optional JSON helpers (for debugging)
# -----------------------------
@routes.get("/restaurants.json")
def restaurants_json():
    return jsonify({"restaurants": _all_restaurants()})

@routes.get("/items.json")
def items_json():
    r = request.args.get("restaurant", "")
    return jsonify({"restaurant": r, "items": [_project(x) for x in _items_for(r)]})
