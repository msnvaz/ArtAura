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
import Signup from './components/auth/signup2';
import ShopRegisterPage from './components/auth/shopSignup';
import CommunityPage from './pages/CommunityPage';

// Components
//import Header from './components/Header';
import Footer from './components/common/Footer';

// Contexts


function App() {
  return (
    <Router>
      {/* <div className="App d-flex flex-column min-vh-100 w-100"> */}
        {/* <Header /> */}
    {/* <main className="flex-grow-1 w-100"> */}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/competitions" element={<Competitions />} />
          <Route path="/uploadartwork" element={<UploadArtWork />} />
          <Route path="/artworks/:id" element={<ArtworkDetail />} />
          <Route path="/artist/artistdashboard" element={<ArtistDashboard />} /> 
          <Route path="/artist/artistportfolio" element={<ArtistPortfolio />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/register/shop" element={<ShopRegisterPage />} />
          <Route path="/community" element={<CommunityPage />} />

        </Routes>
        {/* </main> */}
      <Footer />

       {/* </div> */}
    </Router>
  );
}

export default App;

