import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './RestaurantPage.css';
// CORRECTED Import paths: Now relative to src/
import cfaMenu from './menu/cfa.json'; 
import tbellMenu from './menu/tbell.json';

// Utility to map restaurant IDs to imported JSON files
const menuMap = {
    cfa: cfaMenu,
    tbell: tbellMenu,
    // Add more restaurants here as JSON files are created
};

// Component to display a single menu item
const MenuItemCard = ({ item }) => (
    <div className="menu-item-card">
        <div className="item-left">
            <div className="item-image-placeholder"></div>
            <span className="item-name">{item.name}</span>
        </div>
        <button className="nutrition-button">View nutrition</button>
    </div>
);

const RestaurantPage = () => {
    // Get the dynamic part of the URL (e.g., 'cfa' or 'tbell')
    const { restaurantId } = useParams();
    const [restaurantData, setRestaurantData] = useState(null);

    useEffect(() => {
        // Look up the imported JSON data based on the URL parameter
        const data = menuMap[restaurantId];
        if (data) {
            setRestaurantData(data);
        } else {
            setRestaurantData(null); // Or show an error state
        }
    }, [restaurantId]); // Re-run effect if the restaurant ID in the URL changes

    // Fallback while data is loading or if ID is invalid
    if (!restaurantData) {
        return <div className="loading-container">Loading menu or Invalid Restaurant ID...</div>;
    }

    // Header component structure
    const Header = () => (
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
    );

    return (
        <div className="restaurant-page-container">
            <Header />

            <main className="restaurant-content">
                {/* Restaurant Header Box */}
                <div className="restaurant-header-box">
                    <div className="restaurant-info">
                        <div className="restaurant-logo-placeholder"></div>
                        <h1 className="restaurant-name">{restaurantData.restaurant}</h1>
                    </div>
                    <button className="generate-button">Generate top 3</button>
                </div>

                {/* Menu Items */}
                <div className="menu-list">
                    <h2>Full Menu</h2>
                    {restaurantData.items.map((item) => (
                        <MenuItemCard key={item.id || item.name} item={item} />
                    ))}
                </div>
            </main>
        </div>
    );
};

export default RestaurantPage;