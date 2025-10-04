import React from 'react';

const MenuSuggestions = ({ suggestions, runnerUps, fitnessGoal }) => {
    const getGoalIcon = (goal) => {
        switch (goal) {
            case 'cutting': return '✂️';
            case 'bulking': return '💪';
            case 'keto': return '🥦';
            default: return '🎯';
        }
    };

    const getGoalDescription = (goal) => {
        switch (goal) {
            case 'cutting': return 'High protein, lower calories for fat loss';
            case 'bulking': return 'High protein and calories for muscle gain';
            case 'keto': return 'High fat, low carbs for ketosis';
            default: return 'Optimized for your goals';
        }
    };

    return (
        <div className="menu-suggestions">
            <div className="suggestions-header">
                <h2>Top 3 Menu Suggestions</h2>
                <div className="goal-info">
                    <span className="goal-icon">{getGoalIcon(fitnessGoal)}</span>
                    <span className="goal-text">{getGoalDescription(fitnessGoal)}</span>
                </div>
            </div>
            <div className="suggestions-grid">
                {suggestions.map((item, index) => (
                    <div key={index} className="suggestion-card">
                        <div className="card-header">
                            <h3>{item.name}</h3>
                            <span className="rank">#{index + 1}</span>
                        </div>
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
                ))}
            </div>
            
            {runnerUps && runnerUps.length > 0 && (
                <div className="runner-ups-section">
                    <h3>🏃‍♂️ Runner-Ups</h3>
                    <div className="runner-ups-grid">
                        {runnerUps.map((item, index) => (
                            <div key={index} className="runner-up-card">
                                <div className="card-header">
                                    <h4>{item.name}</h4>
                                    <span className="rank">#{suggestions.length + index + 1}</span>
                                </div>
                                <p className="description">{item.description}</p>
                                <div className="nutrition-info compact">
                                    <div className="nutrition-item">
                                        <span className="label">🔥</span>
                                        <span className="value">{item.calories}</span>
                                    </div>
                                    <div className="nutrition-item highlight">
                                        <span className="label">💪</span>
                                        <span className="value">{item.protein_g}g</span>
                                    </div>
                                    <div className="nutrition-item">
                                        <span className="label">🍞</span>
                                        <span className="value">{item.carbs_g}g</span>
                                    </div>
                                    <div className="nutrition-item">
                                        <span className="label">🥑</span>
                                        <span className="value">{item.fat_g}g</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MenuSuggestions;