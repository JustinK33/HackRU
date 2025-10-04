import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, register } = useUser();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    confirmPassword: '',
    fitnessGoal: 'cutting',
    age: 25,
    weight: 150
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!isLogin) {
        // Registration validation
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return;
        }
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters');
          return;
        }
        if (!formData.name.trim()) {
          setError('Name is required');
          return;
        }
        if (!formData.username.trim()) {
          setError('Username is required');
          return;
        }

        // Register new user
        const userData = {
          name: formData.name.trim(),
          username: formData.username.trim(),
          password: formData.password,
          fitnessGoal: formData.fitnessGoal,
          age: parseInt(formData.age),
          weight: parseInt(formData.weight),
          preferences: {
            favoriteRestaurants: [],
            dietaryRestrictions: []
          }
        };

        await register(userData);
      } else {
        // Login existing user
        if (!formData.username.trim()) {
          setError('Username is required');
          return;
        }
        if (!formData.password) {
          setError('Password is required');
          return;
        }

        await login(formData.username.trim(), formData.password);
      }

      navigate('/hub');
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="logo">Macrave</h1>
          <p className="tagline">Fast food that fits your goals</p>
        </div>

        <div className="auth-toggle">
          <button 
            className={isLogin ? 'active' : ''} 
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button 
            className={!isLogin ? 'active' : ''} 
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message">{error}</div>}
          
          {!isLogin && (
            <div className="input-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required={!isLogin}
                placeholder="Enter your full name"
              />
            </div>
          )}

          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              placeholder="Enter your username"
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="Enter your password"
            />
          </div>

          {!isLogin && (
            <>
              <div className="input-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required={!isLogin}
                  placeholder="Confirm your password"
                />
              </div>

              <div className="input-group">
                <label htmlFor="fitnessGoal">Fitness Goal</label>
                <select
                  id="fitnessGoal"
                  name="fitnessGoal"
                  value={formData.fitnessGoal}
                  onChange={handleInputChange}
                >
                  <option value="cutting">Cutting ✂️</option>
                  <option value="bulking">Bulking 💪</option>
                  <option value="keto">Keto 🥦</option>
                </select>
              </div>

              <div className="metrics-row">
                <div className="input-group">
                  <label htmlFor="age">Age: {formData.age}</label>
                  <input
                    type="range"
                    id="age"
                    name="age"
                    min="16"
                    max="80"
                    value={formData.age}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="weight">Weight (lbs): {formData.weight}</label>
                  <input
                    type="range"
                    id="weight"
                    name="weight"
                    min="80"
                    max="300"
                    value={formData.weight}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </>
          )}

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? 'Processing...' : (isLogin ? 'Login' : 'Create Account')}
          </button>
        </form>

        <div className="demo-login">
          <p>Want to try it out?</p>
          <button 
            className="demo-btn"
            onClick={async () => {
              try {
                setIsLoading(true);
                // Create demo user if it doesn't exist
                const demoUserData = {
                  name: 'Demo User',
                  username: 'demo',
                  password: 'demo123',
                  fitnessGoal: 'cutting',
                  age: 25,
                  weight: 150,
                  preferences: { favoriteRestaurants: [], dietaryRestrictions: [] }
                };
                
                try {
                  await register(demoUserData);
                } catch (error) {
                  // If demo user already exists, just login
                  await login('demo', 'demo123');
                }
                
                navigate('/hub');
              } catch (error) {
                setError('Failed to create demo user');
              } finally {
                setIsLoading(false);
              }
            }}
            disabled={isLoading}
          >
            Continue as Demo User
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
