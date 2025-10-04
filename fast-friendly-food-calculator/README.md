# Fast Friendly Food Calculator

A React + Flask application that helps you find the best fast food options based on your fitness goals (bulking, cutting, or keto).

## Features

- **Restaurant Selection**: Choose from various fast food restaurants
- **Fitness Goals**: Select your goal (bulking, cutting, or keto)
- **Smart Suggestions**: Get top 3 menu items optimized for your goals
- **Nutritional Information**: View detailed macro breakdowns

## Setup Instructions

### Backend (Flask)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the Flask server:
   ```bash
   python app.py
   ```

The backend will run on `http://localhost:5001`

### Frontend (React)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The frontend will run on `http://localhost:3000`

## How to Use

1. **Login/Sign Up**: Create an account or login with existing credentials
2. **Set Your Goals**: During signup, select your fitness goal (cutting, bulking, or keto)
3. **Enter Metrics**: Provide your age and weight for personalized recommendations
4. **Access Hub**: You'll be taken to the main application dashboard
5. **Select Restaurant**: Choose from 80+ available restaurants
6. **Get Suggestions**: Click "Get My Recommendations" to see your top 3 options
7. **View Details**: Each suggestion shows detailed nutrition info (calories, protein, carbs, fat, sodium)
8. **Logout**: Use the logout button to end your session

## API Endpoints

- `GET /api/restaurants` - Get list of available restaurants
- `POST /api/suggestions` - Get menu suggestions for a restaurant and goal
- `GET /api/health` - Health check endpoint

## Data

The application uses a comprehensive JSON database of fast food items with nutritional information from various restaurants including McDonald's, Taco Bell, Chipotle, and many more.

## Technology Stack

- **Frontend**: React, React Router, Axios
- **Backend**: Flask, Flask-CORS
- **Data**: JSON-based nutrition database