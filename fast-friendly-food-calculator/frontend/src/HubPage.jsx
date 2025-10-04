import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './HubPage.css';

const HubPage = () => {
    // State to hold the currently selected restaurant ID
    const [selectedRestaurantId, setSelectedRestaurantId] = useState('cfa'); // Default to cfa

    // Function to handle the change in the dropdown
    const handleRestaurantChange = (event) => {
        setSelectedRestaurantId(event.target.value);
    };

    return (
        <div className="hub-container">
            <header className="hub-header">
                <Link to="/hub" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="header-left">
                        <div className="logo-placeholder"></div>
                        <span className="logo-text">Macrave</span>
                    </div>
                </Link>
                <div className="header-right">
                    <button className="account-button">Account Page</button>
                </div>
            </header>

            <main className="hub-content">
                <div className="restaurant-selector">
                    <label htmlFor="restaurant-select">Select a restaurant:</label>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <select 
                            id="restaurant-select"
                            value={selectedRestaurantId} // Bind to state
                            onChange={handleRestaurantChange} // Update state on change
                        >
                            <option value="cfa">Chick-Fil-A</option>
                            <option value="tbell">Taco Bell</option>
                        </select>
                        {/* Use the selectedRestaurantId in the Link's 'to' prop */}
                        <Link to={`/restaurant/${selectedRestaurantId}`} style={{ textDecoration: 'none' }}>
                            <button className="go-button">Go</button>
                        </Link>
                    </div>
                </div>

                <div className="top-picks-box">
                    <h3>Top Picks</h3>
                    <p>Features to be incorporated later...</p>
                </div>
            </main>
        </div>
    );
};

export default HubPage;