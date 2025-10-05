import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './contexts/UserContext';
import LoginPage from './pages/LoginPage';
import HubPage from './HubPage';
import RestaurantInfo from './RestaurantInfo'; // Assumed location based on debug (in src root)
import GeneratePage from './GeneratePage'; // NEW IMPORT (in src root)
import NutritionPage from './NutritionPage';
import './App.css';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useUser();
  
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" replace />;
};

// Public Route component (redirect to hub if already logged in)
const PublicRoute = ({ children }) => {
  const { user, isLoading } = useUser();
  
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }
  
  return user ? <Navigate to="/hub" replace /> : children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } 
      />
      <Route 
        path="/hub" 
        element={
          <ProtectedRoute>
            <HubPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/restaurant/:restaurantName" 
        element={
          <ProtectedRoute>
            <RestaurantInfo />
          </ProtectedRoute>
        } 
      />
      {/* NEW ROUTE for the suggestion generation page */}
      <Route 
        path="/generate/:restaurantName" 
        element={
          <ProtectedRoute>
            <GeneratePage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/nutrition" 
        element={
          <ProtectedRoute>
            <NutritionPage />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default function App() {
  return (
    <UserProvider>
      <Router>
        <div className="App">
          <AppRoutes />
        </div>
      </Router>
    </UserProvider>
  );
}
