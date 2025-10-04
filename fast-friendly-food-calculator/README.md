# Fast Friendly Food Calculator

This project is a Fast Friendly Food Calculator app that suggests the top 3 menu items based on restaurant input and fitness goals. It consists of a Flask backend and a React frontend.

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

## Backend Setup

1. Navigate to the `backend` directory.
2. Install the required Python packages:
   ```
   pip install -r requirements.txt
   ```
3. Run the Flask application:
   ```
   python app.py
   ```

## Frontend Setup

1. Navigate to the `frontend` directory.
2. Install the required npm packages:
   ```
   npm install
   ```
3. Start the React application:
   ```
   npm start
   ```

## Usage

- Input the restaurant name and your fitness goals in the frontend application.
- The app will suggest the top 3 menu items based on the provided input.

## Contributing

Feel free to fork the repository and submit pull requests for any improvements or features.