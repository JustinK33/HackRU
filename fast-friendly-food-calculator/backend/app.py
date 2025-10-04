from flask import Flask, request, jsonify
from routes import init_routes

app = Flask(__name__)

@app.route('/')
def home():
    return "Welcome to the Fast Friendly Food Calculator API!"

if __name__ == '__main__':
    init_routes(app)
    app.run(debug=True)