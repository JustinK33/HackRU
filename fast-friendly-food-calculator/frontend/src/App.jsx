import React, { useState } from 'react';
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