import axios from 'axios';

// Set the base URL for your Flask API
const API_BASE_URL = 'http://localhost:5001/api';

/**
 * Fetches the full menu for a specific restaurant.
 * @param {string} restaurantName 
 * @returns {Promise<Array>} List of menu items
 */
export const getRestaurantMenu = async (restaurantName) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/menu/${encodeURIComponent(restaurantName)}`);
        return response.data.items || [];
    } catch (error) {
        console.error(`Error fetching menu for ${restaurantName}:`, error);
        throw new Error("Failed to load restaurant menu.");
    }
};

/**
 * Fetches the top menu suggestions based on user goals and an optional category filter.
 * Uses a GET request with query parameters for reliability.
 * @param {string} restaurant 
 * @param {string} fitnessGoal 
 * @param {string} category 
 * @returns {Promise<{suggestions: Array, runner_ups: Array}>}
 */
export const getMenuSuggestions = async (restaurant, fitnessGoal, category = 'All') => {
    const params = new URLSearchParams({
        restaurant: restaurant,
        fitnessGoal: fitnessGoal,
        category: category
    });
    
    try {
        const response = await axios.get(`${API_BASE_URL}/suggestions?${params.toString()}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching menu suggestions:', error);
        throw error;
    }
};