import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage.jsx';
import HubPage from './HubPage.jsx';
import RestaurantPage from './RestaurantPage.jsx'; // Import the new component

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/hub" element={<HubPage />} />
        {/* NEW ROUTE: Note the :restaurantId parameter */}
        <Route path="/restaurant/:restaurantId" element={<RestaurantPage />} /> 
      </Routes>
    </Router>
  </React.StrictMode>
);
