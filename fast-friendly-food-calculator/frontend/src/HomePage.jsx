import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate(); // 2. Call the hook
  const [currentPhase, setCurrentPhase] = useState('name');
  
  // 2. State to store the user's selections and inputs
  const [name, setName] = useState('');
  const [selectedGoal, setSelectedGoal] = useState('');
  const [age, setAge] = useState(30);
  const [weight, setWeight] = useState(150);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleGoalSelect = (goal) => {
    setSelectedGoal(goal);
    setCurrentPhase('metrics');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to send all data to your API
    console.log(`Name: ${name}, Goal: ${selectedGoal}, ...`);
    // 3. Navigate to the new page
    navigate('/hub'); 
  };

  return (
    <div className="App">
      <header className="welcome-header">
        Welcome to
        <h1 className="logo">Macrave</h1>
      </header>

      <div className="form-box">
        <h2>Fast Friendly Food Calculator</h2>

        {/* --- PHASE 1: NAME INPUT --- */}
        {currentPhase === 'name' && (
          <form onSubmit={(e) => { e.preventDefault(); setCurrentPhase('goal'); }} className="name-form">
            <div className="input-group">
              <label htmlFor="name-input">Enter your name:</label>
              <input
                id="name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="next-btn">Next</button>
          </form>
        )}
        
        {/* --- PHASE 2: GOAL SELECTION --- */}
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

        {/* --- PHASE 3: METRIC INPUT --- */}
        {currentPhase === 'metrics' && (
          <form onSubmit={(e) => { e.preventDefault(); setCurrentPhase('account'); }} className="metrics-form">
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

            <button type="submit" className="next-btn">
              Next
            </button>
          </form>
        )}

        {/* --- PHASE 4: ACCOUNT CREATION --- */}
        {currentPhase === 'account' && (
          <form onSubmit={handleSubmit} className="account-form">
            <h3>Create your account:</h3>
            <div className="input-group">
              <label htmlFor="username-input">Username:</label>
              <input
                id="username-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password-input">Password:</label>
              <input
                id="password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <button type="submit" className="submit-btn">
              To Homepage
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default HomePage;