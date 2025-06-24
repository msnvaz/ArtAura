import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/main.css';

// Pages
import Marketplace from './pages/Marketplace';
import Competitions from './pages/Competitions';
import Login from './components/auth/login';
import ArtistDashboard from './pages/ArtistDashBoard'; 
import ArtworkDetail from './pages/ArtworkDetail';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/competitions" element={<Competitions />} />
          <Route path="/dashboard" element={<ArtistDashboard />} /> 
          <Route path="/artworks/:id" element={<ArtworkDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
