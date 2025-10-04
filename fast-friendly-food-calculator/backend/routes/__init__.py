from flask import Blueprint, request, jsonify

routes = Blueprint('routes', __name__)

@routes.route('/suggestions', methods=['POST'])
def get_suggestions():
    data = request.json
    restaurant = data.get('restaurant')
    fitness_goals = data.get('fitness_goals')
    
    # Placeholder for actual logic to fetch menu suggestions
    suggestions = [
        {"item": "Grilled Chicken Salad", "calories": 350},
        {"item": "Quinoa Bowl", "calories": 400},
        {"item": "Veggie Wrap", "calories": 300}
    ]
    
    return jsonify(suggestions[:3])  # Return top 3 suggestions

def register_routes(app):
    app.register_blueprint(routes)