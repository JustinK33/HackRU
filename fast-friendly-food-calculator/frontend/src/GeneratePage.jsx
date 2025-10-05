import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from './contexts/UserContext';
import { getMenuSuggestions } from './utils/api';
import MenuSuggestions from './components/MenuSuggestions';
import Confetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize';
import './HubPage.css'; // Reusing HubPage styles for consistent layout
import './GeneratePage.css'; // Minimal styles for the new Goal Box
import macraveLogo from './assets/macrave.png';

const GeneratePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useUser();
    const { restaurantName } = useParams();
    const { width, height } = useWindowSize();

    const [suggestions, setSuggestions] = useState([]);
    const [runnerUps, setRunnerUps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showConfetti, setShowConfetti] = useState(false);
    const [confettiOpacity, setConfettiOpacity] = useState(1);
    
    const selectedCategory = location.state?.selectedCategory || 'All'; 

    const getGoalIcon = (goal) => {
        switch (goal) {
            case 'cutting': return '✂️';
            case 'bulking': return '💪';
            case 'keto': return '🥦';
            default: return '🎯';
        }
    };
    
    const goalDisplay = `${user.fitnessGoal.charAt(0).toUpperCase() + user.fitnessGoal.slice(1)}`;

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (!restaurantName || !user.fitnessGoal) {
                setError('Missing restaurant or user goal.');
                setLoading(false);
                return;
            }

            setLoading(true);
            setError('');
            
            try {
                const data = await getMenuSuggestions(restaurantName, user.fitnessGoal, selectedCategory);
                setSuggestions(data.suggestions || []);
                setRunnerUps(data.runner_ups || []);
                setShowConfetti(true);
            } catch (err) {
                console.error('Error fetching suggestions:', err);
                setError('Failed to generate menu suggestions. Check API server.');
            } finally {
                setLoading(false);
            }
        };

        fetchSuggestions();
    }, [restaurantName, user.fitnessGoal, selectedCategory]);

    // This useEffect hook will handle the confetti fade-out
    useEffect(() => {
        if (showConfetti) {
            // After 2 seconds, start fading out
            const fadeTimer = setTimeout(() => {
                setConfettiOpacity(0);
            }, 2000);

            // After the fade-out, remove the component from the DOM
            const removeTimer = setTimeout(() => {
                setShowConfetti(false);
                setConfettiOpacity(1); // Reset for the next time
            }, 3000); // 1 second for the fade-out animation + 2 seconds delay

            return () => {
                clearTimeout(fadeTimer);
                clearTimeout(removeTimer);
            };
        }
    }, [showConfetti]);

    if (loading) {
        return <div className="loading-container"><div className="loading-spinner"></div><p>Generating Suggestions...</p></div>;
    }

    return (
        <div className="hub-container">
            {showConfetti && (
                <Confetti 
                    width={width} 
                    height={height} 
                    style={{ opacity: confettiOpacity, transition: 'opacity 1s ease-out' }} 
                />
            )}
            {/* Header - Same as HubPage */}
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
                
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {/* Box with Goal Info */}
                <div className="goal-info-box">
                    <h2 className="goal-text-display">
                        Your fitness goal is: 
                        <span className="goal-value">
                            {goalDisplay} {getGoalIcon(user.fitnessGoal)}
                        </span>
                    </h2>
                    {selectedCategory !== 'All' && (
                        <p className="category-filter-note">
                            Based on your selection in the **{restaurantName}** menu, filtering for **{selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}** items.
                        </p>
                    )}
                </div>

                {/* Menu Suggestions Container */}
                {suggestions.length > 0 ? (
                    <div className="suggestions-section">
                        <MenuSuggestions 
                            suggestions={suggestions} 
                            runnerUps={runnerUps}
                            fitnessGoal={user.fitnessGoal} 
                        />
                    </div>
                ) : (
                    !error && <p className="no-items-message">No top suggestions found for this criteria.</p>
                )}
            </main>
        </div>
    );
};

export default GeneratePage;