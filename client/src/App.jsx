import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './styles/main.css';


// Pages
import Competitions from './pages/Competitions';
import Marketplace from './pages/Marketplace';

import SalesAnalytics from './pages/shop/Analytics';
import Catalog from './pages/shop/Catalog';
import ShopOrders from './pages/shop/Orders';
import RewardSystem from './pages/shop/Rewards';
import Dashboard from './pages/shop/dashboard';

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


// function App() {
//   // const location = useLocation();
//   // const isAdminRoute = location.pathname === '/admin';

//   return (
//     <div className="App d-flex flex-column min-vh-100 w-100">
//       {/* {!isAdminRoute && <Header />} */}
//       <main className="flex-grow-1 w-100">
//         <Routes>
//           {/* <Route path="/" element={<Home />} />
//           <Route path="/home" element={<Home />} */}
//           <Route path="/marketplace" element={<Marketplace />} />
//           <Route path="/competitions" element={<Competitions />} />
//           <Route path="/login" element={<Login />} />
//           {/* <Route path="/admin" element={<AdminDashboard />} /> */}
//         </Routes>
//       </main>
//       {/* {!isAdminRoute && <Footer />} */}
//     </div>
//   );
// }

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/register/shop" element={<ShopRegisterPage />} />
        <Route path="/community" element={<CommunityPage />} />
        
          
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/competitions" element={<Competitions />} />

          <Route path="/shop/dashboard" element={<Dashboard />} />
          <Route path="/shop/orders" element={<ShopOrders/>}/>
          <Route path="/shop/rewards" element={<RewardSystem />} />
          <Route path="/shop/analytics" element={<SalesAnalytics />} />
          <Route path="/shop/catalog" element={<Catalog/>}/>


          <Route path="/uploadartwork" element={<UploadArtWork />} />
          <Route path="/artworks/:id" element={<ArtworkDetail />} />
          <Route path="/artist/artistdashboard" element={<ArtistDashboard />} /> 
          <Route path="/artist/artistportfolio" element={<ArtistPortfolio />} />

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
