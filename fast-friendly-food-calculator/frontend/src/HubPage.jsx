import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './contexts/UserContext';
import { getMenuSuggestions } from './utils/api';
import MenuSuggestions from './components/MenuSuggestions';
import Carousel from './components/Carousel';
import './HubPage.css';
import macraveLogo from './assets/macrave.png';

const HubPage = () => {
    const { user, logout } = useUser();
    const navigate = useNavigate();
    const [restaurants, setRestaurants] = useState([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [runnerUps, setRunnerUps] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/restaurants');
                const data = await response.json();
                setRestaurants(data.restaurants || []);
            } catch (err) {
                console.error('Error fetching restaurants:', err);
                setError('Failed to load restaurants');
            }
        };
        fetchRestaurants();
    }, []);

    const handleGetSuggestions = () => {
        if (!selectedRestaurant) {
            setError('Please select a restaurant');
            return;
        }

        const encodedRestaurantName = encodeURIComponent(selectedRestaurant);
        navigate(`/restaurant/${encodedRestaurantName}`);
    };

    return (
        <div className="hub-container">
            <header className="hub-header">
                <div 
                    className="header-left clickable" 
                    onClick={() => navigate('/hub')} 
                    style={{cursor: 'pointer'}}
                >
                    <img src={macraveLogo} alt="Macrave Logo" className="macrave-logo" />
                    <span className="logo-text">Macrave</span>
                </div>
                <div className="header-right">
                    <div className="user-info">
                        <span className="welcome-text">Welcome, {user.name}!</span>
                        <span className="goal-badge">{user.fitnessGoal.charAt(0).toUpperCase() + user.fitnessGoal.slice(1)}</span>
                    </div>
                    <button className="logout-button" onClick={logout}>Logout</button>
                </div>
            </header>

            <Carousel />

            <main className="hub-content">
                <div className="welcome-section">
                    <h2>Fast Decisions, Smart Eating</h2>
                    <p>Select a restaurant and we'll find the best options for your <strong>{user.fitnessGoal.charAt(0).toUpperCase() + user.fitnessGoal.slice(1)}</strong> goals!</p>
                    <div className="user-stats">
                        <span className="stat">Age: {user.age}</span>
                        <span className="stat">Weight: {user.weight} lbs</span>
                        <span className="stat">Goal: {user.fitnessGoal.charAt(0).toUpperCase() + user.fitnessGoal.slice(1)}</span>
                    </div>
                </div>

                <div className="selection-section">
                    <div className="restaurant-selector">
                        <label htmlFor="restaurant-select">Choose your restaurant:</label>
                        <select 
                            id="restaurant-select"
                            value={selectedRestaurant}
                            onChange={(e) => setSelectedRestaurant(e.target.value)}
                        >
                            <option value="">🍽️ Pick a restaurant...</option>
                            {restaurants.map((restaurant, index) => (
                                <option key={index} value={restaurant}>
                                    {restaurant}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button 
                        className="get-suggestions-btn"
                        onClick={handleGetSuggestions}
                        disabled={loading || !selectedRestaurant}
                    >
                        {loading ? '🔍 Finding your perfect meal...' : '🚀 View Menu'}
                    </button>
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {suggestions.length > 0 && (
                    <div className="suggestions-section">
                        <MenuSuggestions 
                            suggestions={suggestions} 
                            runnerUps={runnerUps}
                            fitnessGoal={user.fitnessGoal} 
                        />
                    </div>
                )}
            </main>
        </div>
    );
};

export default HubPage;