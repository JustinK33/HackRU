# Fast Friendly Food Calculator

This project is a Fast Friendly Food Calculator app that suggests the top 3 menu items based on restaurant input and fitness goals. It consists of a Flask backend and a React frontend.

## Frontend Setup

1. Navigate to the `frontend` directory:
   ```
   cd frontend
   ```

2. Install the required dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open your browser and go to `http://localhost:3000` to view the application.

## Backend Setup

1. Navigate to the `backend` directory:
   ```
   cd backend
   ```

2. Create a virtual environment (optional but recommended):
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. Install the required Python packages:
   ```
   pip install -r requirements.txt
   ```

4. Run the Flask application:
   ```
   python app.py
   ```

## Usage

- Enter the restaurant name and your fitness goals in the frontend.
- The app will communicate with the Flask backend to fetch the top 3 menu suggestions based on your input.

## Project Structure

```
fast-friendly-food-calculator
├── backend
│   ├── app.py
│   ├── requirements.txt
│   ├── models
│   │   └── __init__.py
│   ├── routes
│   │   └── __init__.py
│   └── README.md
├── frontend
│   ├── src
│   │   ├── App.jsx
│   │   ├── components
│   │   │   └── MenuSuggestions.jsx
│   │   └── utils
│   │       └── api.js
│   ├── public
│   │   └── index.html
│   ├── package.json
│   └── README.md
└── README.md
```