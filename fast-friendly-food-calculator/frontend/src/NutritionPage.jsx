import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from './contexts/UserContext';
import './HubPage.css';
import './GeneratePage.css';
import './RestaurantInfo.css';
import './NutritionPage.css';
import macraveLogo from './assets/macrave.png';

const NutritionPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useUser();

    // Get the item data and the previous restaurantName from the navigation state
    const { item, restaurantName } = location.state || {};
    
    // A trick to get a different placeholder image each time
    const itemImageUrl = `https://picsum.photos/300/300?random=${item.name}`;

    if (!item) {
        return (
            <div className="hub-container">
                <header className="hub-header">
                    <div className="header-left clickable" onClick={() => navigate('/hub')}>
                        <div className="logo-placeholder"></div>
                        <span className="logo-text">Macrave</span>
                    </div>
                </header>
                <main className="hub-content">
                    <div className="error-message">
                        No item data found. Please navigate from a menu page.
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="hub-container">
            <header className="hub-header">
                <div className="header-left clickable" onClick={() => navigate('/hub')}>
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

            <main className="hub-content">
                <div className="nutrition-page-content">
                    <div className="nutrition-details-header">
                        <h2 className="nutrition-title">{item.name} Nutrition Facts</h2>
                        <button
                            className="return-btn"
                            onClick={() => navigate(`/restaurant/${restaurantName}`)}
                        >
                            Return to menu
                        </button>
                    </div>

                    <div className="nutrition-details-container">
                        {/* Left side block with nutrition facts */}
                        <div className="suggestion-card">
                            <p className="description">{item.description}</p>
                            <div className="nutrition-info">
                                <div className="nutrition-item">
                                    <span className="label">🔥 Calories:</span>
                                    <span className="value">{item.calories}</span>
                                </div>
                                <div className="nutrition-item highlight">
                                    <span className="label">💪 Protein:</span>
                                    <span className="value">{item.protein_g}g</span>
                                </div>
                                <div className="nutrition-item">
                                    <span className="label">🍞 Carbs:</span>
                                    <span className="value">{item.carbs_g}g</span>
                                </div>
                                <div className="nutrition-item">
                                    <span className="label">🥑 Fat:</span>
                                    <span className="value">{item.fat_g}g</span>
                                </div>
                                {item.sodium_mg && (
                                    <div className="nutrition-item">
                                        <span className="label">🧂 Sodium:</span>
                                        <span className="value">{item.sodium_mg}mg</span>
                                    </div>
                                )}
                            </div>
                            <div className="macro-summary">
                                <div className="macro-bar">
                                    <div className="macro-fill protein" style={{width: `${Math.min((item.protein_g / 50) * 100, 100)}%`}}></div>
                                </div>
                                <span className="macro-label">Protein: {item.protein_g}g</span>
                            </div>
                        </div>

                        {/* Right side block with the placeholder image and name */}
                        <div className="item-image-block">
                            <img 
                                src={itemImageUrl}
                                alt={item.name}
                                className="nutrition-image"
                            />
                            <h3 className="item-name-title">{item.name}</h3>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default NutritionPage;