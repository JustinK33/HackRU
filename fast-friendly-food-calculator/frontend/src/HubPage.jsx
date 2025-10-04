import React from 'react';
import './HubPage.css'; // We'll create this CSS file next

const HubPage = () => {
    return (
        <div className="hub-container">
            <header className="hub-header">
                <div className="header-left">
                    <div className="logo-placeholder"></div>
                    <span className="logo-text">Macrave</span>
                </div>
                <div className="header-right">
                    <button className="account-button">Account Page</button>
                </div>
            </header>

            <main className="hub-content">
                <div className="restaurant-selector">
                    <label htmlFor="restaurant-select">Select a restaurant:</label>
                    <select id="restaurant-select">
                        <option value="cfa">Chick-Fil-A</option>
                        <option value="tbell">Taco Bell</option>
                    </select>
                </div>

                <div className="top-picks-box">
                    <h3>Top Picks</h3>
                    {/* Placeholder content for now */}
                    <p>Features to be incorporated later...</p>
                </div>
            </main>
        </div>
    );
};

export default HubPage;