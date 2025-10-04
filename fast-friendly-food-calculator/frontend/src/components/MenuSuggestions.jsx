import React from 'react';

const MenuSuggestions = ({ suggestions }) => {
    return (
        <div>
            <h2>Top 3 Menu Suggestions</h2>
            <ul>
                {suggestions.map((item, index) => (
                    <li key={index}>
                        <h3>{item.name}</h3>
                        <p>{item.description}</p>
                        <p>Calories: {item.calories}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MenuSuggestions;