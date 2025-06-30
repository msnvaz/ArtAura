import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/main.css';


// Pages
import Marketplace from './pages/Marketplace';
import Competitions from './pages/Competitions';

import Dashboard from './pages/shop/dashboard';
import ShopOrders from './pages/shop/Orders';
import RewardSystem from './pages/shop/Rewards';

import Login from './components/auth/login';
import UploadArtWork from './pages/Artist/UploadArtWork';
import ArtworkDetail from './pages/Artist/ArtWorkDetail';
import ArtistDashboard from './pages/Artist/ArtistDashBoard';
import ArtistPortfolio from './pages/Artist/ArtistPortfolio';
import Signup from './components/auth/signup2';
import ShopRegisterPage from './components/auth/shopSignup';
import CommunityPage from './pages/CommunityPage';

// Components
import Header from './components/Header';
import Footer from './components/Footer';


function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname === '/admin';

  return (
    <div className="App d-flex flex-column min-vh-100 w-100">
      {!isAdminRoute && <Header />}
      <main className="flex-grow-1 w-100">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/competitions" element={<Competitions />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      {/* <div className="App d-flex flex-column min-vh-100 w-100"> */}
        {/* <Header /> */}
    {/* <main className="flex-grow-1 w-100"> */}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/competitions" element={<Competitions />} />

          <Route path="/shop/dashboard" element={<Dashboard />} />
          <Route path="/shop/orders" element={<ShopOrders/>}/>
          <Route path="/shop/rewards" element={<RewardSystem />} />


          <Route path="/uploadartwork" element={<UploadArtWork />} />
          <Route path="/artworks/:id" element={<ArtworkDetail />} />
          <Route path="/artist/artistdashboard" element={<ArtistDashboard />} /> 
          <Route path="/artist/artistportfolio" element={<ArtistPortfolio />} />


        </Routes>
        {/* </main> */}
      <Footer />

       {/* </div> */}
    </Router>
  );
}

export default App;

