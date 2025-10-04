/** import React, { useState } from 'react';
import MenuSuggestions from './components/MenuSuggestions';
import './App.css';

const App = () => {
    const [restaurant, setRestaurant] = useState('');
    const [fitnessGoal, setFitnessGoal] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('/api/suggest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ restaurant, fitnessGoal }),
        });
        const data = await response.json();
        setSuggestions(data.suggestions);
    };

    return (
        <div className="App">
            <h1>Fast Friendly Food Calculator</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Enter Restaurant"
                    value={restaurant}
                    onChange={(e) => setRestaurant(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Enter Fitness Goal"
                    value={fitnessGoal}
                    onChange={(e) => setFitnessGoal(e.target.value)}
                    required
                />
                <button type="submit">Get Suggestions</button>
            </form>
            <MenuSuggestions suggestions={suggestions} />
        </div>
    );
};

export default App;

*/

import React, { useState } from 'react';
import './HomePage.css'; // Make sure this path is correct

const HomePage = () => {
  // 1. State to track the current phase of the form
  const [currentPhase, setCurrentPhase] = useState('goal'); // 'goal' or 'metrics'
  // 2. State to store the user's selections
  const [selectedGoal, setSelectedGoal] = useState('');
  const [age, setAge] = useState(30); // Default value
  const [weight, setWeight] = useState(150); // Default value

  const handleGoalSelect = (goal) => {
    setSelectedGoal(goal);
    setCurrentPhase('metrics'); // Move to the next phase
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to send data to your API (selectedGoal, age, weight)
    console.log(`Goal: ${selectedGoal}, Age: ${age}, Weight: ${weight}`);
    alert('Form Submitted! Check the console for data.');
  };

  return (
    <div className="App">
      <header className="welcome-header">
        Welcome to
        <h1 className="logo">Macrave</h1>
      </header>

      <div className="form-box">
        <h2>Fast Friendly Food Calculator</h2>
        
        {/* --- PHASE 1: GOAL SELECTION --- */}
        {currentPhase === 'goal' && (
          <div className="goal-selection">
            <h3>Select your goal:</h3>
            <div className="button-group">
              <button onClick={() => handleGoalSelect('Bulking')}>
                Bulking <span>💪</span>
              </button>
              <button onClick={() => handleGoalSelect('Cutting')}>
                Cutting <span>✂️</span>
              </button>
              <button onClick={() => handleGoalSelect('Keto')}>
                Keto <span>🥦</span>
              </button>
            </div>
          </div>
        )}

        {/* --- PHASE 2: METRIC INPUT --- */}
        {currentPhase === 'metrics' && (
          <form onSubmit={handleSubmit} className="metrics-form">
            <h3>Goal Selected: {selectedGoal}</h3>

            <div className="input-group">
              <label htmlFor="age-range">Enter your age: ({age})</label>
              <input
                id="age-range"
                type="range"
                min="0"
                max="100"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label htmlFor="weight-range">Enter your weight (lbs): ({weight})</label>
              <input
                id="weight-range"
                type="range"
                min="0"
                max="500"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>

            <button type="submit" className="submit-btn">
              Get Suggestions
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default HomePage;