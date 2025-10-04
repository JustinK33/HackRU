from flask import Flask

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///fast_friendly_food.db
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

@app.route('/')
def home():
    return "Welcome to the Fast Friendly Food Calculator!"

if __name__ == '__main__':
    app.run(debug=True)