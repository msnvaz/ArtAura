import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './styles/main.css';

import Marketplace from './pages/Marketplace';
import Competitions from './pages/Competitions';
import Login from './pages/login';
import ArtistDashboard from './pages/Artist/ArtistDashboard';
import ArtistPortfolio from './pages/Artist/ArtistPortfolio';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/competitions" element={<Competitions />} />
          <Route path="/artist-dashboard" element={<ArtistDashboard />} />
          <Route path="/artist-dashboard/portfolio" element={<ArtistPortfolio />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;