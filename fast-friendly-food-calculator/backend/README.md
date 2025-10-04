# Fast Friendly Food Calculator Backend

This is the backend component of the Fast Friendly Food Calculator application, built using Flask. The backend is responsible for handling requests related to restaurant input and fitness goals, and it provides suggestions for menu items based on user preferences.

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd fast-friendly-food-calculator/backend
   ```

2. **Create a virtual environment:**
   ```
   python3 -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **Install dependencies:**
   ```
   pip install -r requirements.txt
   ```

4. **Run the application:**
   ```
   python app.py
   ```

The application will start on `http://localhost:5000`.

## API Usage

### Endpoints

- **POST /suggestions**
  - Description: Receives restaurant input and fitness goals, returns top 3 menu suggestions.
  - Request Body:
    ```json
    {
      "restaurant": "Restaurant Name",
      "fitnessGoals": "Fitness Goals"
    }
    ```
  - Response:
    ```json
    {
      "suggestions": [
        "Menu Item 1",
        "Menu Item 2",
        "Menu Item 3"
      ]
    }
    ```

## Directory Structure

- `app.py`: Main entry point for the Flask application.
- `requirements.txt`: Lists Python dependencies.
- `models/`: Contains data models related to menu items and nutrition facts.
- `routes/`: Defines API endpoints for the application.

For more information on the frontend, please refer to the frontend README located in the `frontend` directory.