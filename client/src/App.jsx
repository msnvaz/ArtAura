import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/main.css';

// Pages
import Marketplace from './pages/Marketplace';
import Competitions from './pages/Competitions';
import Login from './components/auth/login';
import UploadArtWork from './pages/Artist/UploadArtWork';
import ArtworkDetail from './pages/Artist/ArtWorkDetail';
import ArtistDashboard from './pages/Artist/ArtistDashBoard';
import ArtistPortfolio from './pages/Artist/ArtistPortfolio';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/competitions" element={<Competitions />} />
          <Route path="/uploadartwork" element={<UploadArtWork />} />
          <Route path="/artworks/:id" element={<ArtworkDetail />} />
          <Route path="/artistdashboard" element={<ArtistDashboard />} /> 
          <Route path="/artist/artistportfolio" element={<ArtistPortfolio />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;

