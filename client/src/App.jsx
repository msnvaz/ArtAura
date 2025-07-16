import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './styles/main.css';

// Pages
import Competitions from './pages/Competitions';
import Marketplace from './pages/Marketplace';

import Dashboard from './pages/shop/Dashboard';
import ShopOrders from './pages/shop/Orders';
import Sponsorships from './pages/shop/Sponsorships';
import SalesAnalytics from './pages/shop/Analytics';
import Catalog from './pages/shop/Catalog';
import ShopOrders from './pages/shop/Orders';
import RewardSystem from './pages/shop/Rewards';
import Dashboard from './pages/shop/dashboard';
import Profile from './pages/shop/Profile';

import Login from './components/auth/login';
import ShopRegisterPage from './components/auth/shopSignup';
import Signup from './components/auth/signup2';
import ArtworkDetail from './pages/Artist/ArtWorkDetail';
import ArtistDashboard from './pages/Artist/ArtistDashboard';
import ArtistPortfolio from './pages/Artist/ArtistPortfolio';
import UploadArtWork from './pages/Artist/UploadArtWork';
import CommunityPage from './pages/CommunityPage';
import AdminDashboard from './pages/admin/AdminDashboard';

// Moderator Pages
import ChallengeList from './pages/Moderator/ChallengeList';
import CreateChallenge from './pages/Moderator/CreateChallenge';
import ModeratorDashboard from './pages/Moderator/ModeratorDashboard';
import ModeratorExhibition from './pages/Moderator/ModeratorExhibition';
import ScoringCriteria from './pages/Moderator/ScoringCriteria';
import VerifyExhibition from './pages/Moderator/VerifyExhibition';
import WinnerSelection from './pages/Moderator/WinnerSelection';


// Components
import Footer from './components/Footer';
import Layout from './components/moderator/layout'; // <-- Add this import for Layout

// Page transition wrapper component using CSS animations
const PageTransition = ({ children }) => {
  return (
    <div className="page-transition-wrapper">
      {children}
    </div>
  );
};

function App() {
  return (
    <Router>

      <Routes>
        <Route path="/" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />
        <Route path="/register/shop" element={<PageTransition><ShopRegisterPage /></PageTransition>} />
        <Route path="/community" element={<PageTransition><CommunityPage /></PageTransition>} />
        
        <Route path="/marketplace" element={<PageTransition><Marketplace /></PageTransition>} />
        <Route path="/competitions" element={<PageTransition><Competitions /></PageTransition>} />

        <Route path="/shop/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
        <Route path="/shop/orders" element={<PageTransition><ShopOrders /></PageTransition>} />
        <Route path="/shop/sponsorships" element={<PageTransition><Sponsorships /></PageTransition>} />
        <Route path="/shop/analytics" element={<PageTransition><SalesAnalytics /></PageTransition>} />
        <Route path="/shop/catalog" element={<PageTransition><Catalog /></PageTransition>} />
        <Route path="/shop/profile" element={<PageTransition><Profile /></PageTransition>} />

        <Route path="/uploadartwork" element={<PageTransition><UploadArtWork /></PageTransition>} />
        <Route path="/artworks/:id" element={<PageTransition><ArtworkDetail /></PageTransition>} />
        <Route path="/artist/artistdashboard" element={<PageTransition><ArtistDashboard /></PageTransition>} /> 
        <Route path="/artist/artistportfolio" element={<PageTransition><ArtistPortfolio /></PageTransition>} />

          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          {/* <Route path="/artist/dashboard" element={<ArtistDashboard />} /> */}
          {/* <Route path="/moderator/dashboard" element={<ModeratorDashboard />} /> */}
          {/* <Route path="/buyer/dashboard" element={<BuyerDashboard />} /> */}

        {/* Moderator Routes */}
        <Route path="/moderatordashboard" element={<Layout><ModeratorDashboard /></Layout>} />
        <Route path="/challenges" element={<Layout><ChallengeList /></Layout>} />
        <Route path="/create-challenge" element={<Layout><CreateChallenge /></Layout>} />
        <Route path="/exhibition" element={<Layout><ModeratorExhibition /></Layout>} />
        <Route path="/winner-selection" element={<Layout><WinnerSelection /></Layout>} />
        <Route path="/verify-exhibition" element={<Layout><VerifyExhibition /></Layout>} />
        <Route path="/scoring-criteria" element={<Layout><ScoringCriteria /></Layout>} />

        {/* Add more routes as needed */}


      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
