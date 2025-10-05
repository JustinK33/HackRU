import React, { useState, useEffect } from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import { useUser } from './contexts/UserContext';
import { getRestaurantMenu } from './utils/api'; // Import getRestaurantMenu
import './RestaurantInfo.css'; 
import './GeneratePage.css'; // Importing styles for the new page components if needed for consistency
import macraveLogo from './assets/macrave.png';

const RestaurantInfo = () => {
    const { user, logout } = useUser();
    const { restaurantName } = useParams();
    const navigate = useNavigate();
    const [menuItems, setMenuItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Utility function to get unique categories
    const getUniqueCategories = (items) => {
        const categories = new Set(['All']);
        items.forEach(item => categories.add(item.category));
        return Array.from(categories).sort();
    };

    // Filter menu items based on the selected category
    const filteredMenuItems = menuItems.filter(item => 
        selectedCategory === 'All' || item.category === selectedCategory
    );

    // Fetch the menu items for the selected restaurant
    useEffect(() => {
        const fetchMenu = async () => {
            setIsLoading(true);
            setError('');
            try {
                const data = await getRestaurantMenu(restaurantName); // Use the getRestaurantMenu API call
                setMenuItems(data || []);
            } catch (err) {
                console.error('Error fetching menu items:', err);
                setError('No menu items found for this restaurant or API is unavailable.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchMenu();
    }, [restaurantName]);
    
    // Handler for the "Generate Top 3" button
    const handleGenerateClick = () => {
        // Redirect to the GeneratePage, passing the restaurant and the selected category via state
        navigate(`/generate/${restaurantName}`, { state: { selectedCategory } });
    };

    // Function to get the logo placeholder based on restaurant name
    const getLogoPlaceholder = (name) => {
        // Use the first letter of the restaurant name as the logo placeholder text
        return name.charAt(0).toUpperCase();
    };

    // Determine the title for the page
    const pageTitle = decodeURIComponent(restaurantName.replace(/%20/g, ' '));

    if (isLoading) {
        return (
            <div className="hub-container">
                <header className="hub-header">
                    <div className="header-left clickable" onClick={() => navigate('/hub')}>
                        <img src={macraveLogo} alt="Macrave Logo" className="macrave-logo" />
                        <span className="logo-text">Macrave</span>
                    </div>
                </header>
                <main className="hub-content">
                    <div className="loading-message" style={{color: 'white', marginTop: '50px'}}>Loading menu...</div>
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
                <div className="restaurant-info-box animated-fade-in">
                    <div className="restaurant-header-content">
                        <div className="restaurant-logo-name">
                            <div className="logo-placeholder large">{getLogoPlaceholder(pageTitle)}</div>
                            <h2 className="restaurant-name">{pageTitle} Menu</h2>
                        </div>
                        <button 
                            className="generate-btn"
                            onClick={handleGenerateClick}
                            disabled={menuItems.length === 0}
                        >
                            Generate Top 3
                        </button>
                    </div>
                </div>

                {error && <div className="error-message centered">{error}</div>}

                {menuItems.length > 0 && (
                    <div className="menu-list-container">
                        <div className="filter-and-items">
                            <div className="filter-section">
                                <label htmlFor="category-select" className="filter-label">Filter by Category:</label>
                                <select
                                    id="category-select"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="category-dropdown"
                                >
                                    {getUniqueCategories(menuItems).map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="menu-items-grid">
                            {filteredMenuItems.map((item, index) => (
                                <div key={index} className="menu-item-card">
                                    <div className="item-left">
                                        <div className="item-image-placeholder">🍔</div> {/* Placeholder Image */}
                                        <span className="item-name">{item.name}</span>
                                    </div>
                                    <button 
                                        className="view-nutrition-btn"
                                        onClick={() => navigate('/nutrition', { state: { item, restaurantName } })}
                                    >
                                        View nutrition
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default RestaurantInfo;