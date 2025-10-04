import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const getMenuSuggestions = async (restaurant, fitnessGoals) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/suggestions`, {
            restaurant,
            fitnessGoals
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching menu suggestions:', error);
        throw error;
    }
};