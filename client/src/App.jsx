import { useState, useEffect } from "react";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";
import "./styles/main.css";

// Pages
import Competitions from "./pages/Competitions";
import Marketplace from "./pages/Marketplace";
import UserOrders from "./pages/UserOrders";
import UserProfile from "./pages/Profile/UserProfile";

import Dashboard from "./pages/shop/Dashboard";
import ShopOrders from "./pages/shop/Orders";
import Sponsorships from "./pages/shop/Sponsorships";
import SalesAnalytics from "./pages/shop/Analytics";
import Catalog from "./pages/shop/Catalog";
import Profile from "./pages/shop/Profile";

import Login from "./components/auth/login";
import ShopRegisterPage from "./components/auth/shopSignup";
import Signup from "./components/auth/signup2";
import ArtworkDetail from "./pages/Artist/ArtWorkDetail";
import ArtistDashboard from "./pages/Artist/ArtistDashboard";
import ArtistPortfolio from "./pages/Artist/ArtistPortfolio";
import UploadArtWork from "./pages/Artist/UploadArtWork";
import CommunityPage from "./pages/CommunityPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ShopProductsPage from "./pages/ShopProductsPage";
import ArtistsPage from "./pages/ArtistsPage";
import ChallengesPage from "./pages/ChallengesPage";
import ChallengeSubmissionPage from "./pages/ChallengeSubmissionPage";
import ChallengeSubmissionsPage from "./pages/ChallengeSubmissionsPage";
import MyPosts from "./pages/MyPosts";

// Cart and Checkout Pages
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import PaymentPage from "./pages/PaymentPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";

// Moderator Pages
import ChallengeList from "./pages/Moderator/ChallengeList";
import CreateChallenge from "./pages/Moderator/CreateChallenge";
import ModeratorDashboard from "./pages/Moderator/ModeratorDashboard";
import ModeratorExhibition from "./pages/Moderator/ModeratorExhibition";
import ScoringCriteria from "./pages/Moderator/ScoringCriteria";
import VerifyExhibition from "./pages/Moderator/VerifyExhibition";
import WinnerSelection from "./pages/Moderator/WinnerSelection";

// Components
import Footer from "./components/Footer";
import FooterLarge from "./components/FooterLarge";
import Layout from "./components/moderator/layout";

// Page transition wrapper component using CSS animations
const PageTransition = ({ children }) => <div className="page-transition-wrapper">{children}</div>;

function AppWrapper() {
  const location = useLocation();
  const isLargeFooter = location.pathname === "/" || location.pathname === "/signup";

  return (
    <>
      <Routes>
        <Route path="/" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />
        <Route path="/register/shop" element={<PageTransition><ShopRegisterPage /></PageTransition>} />
        <Route path="/community" element={<PageTransition><CommunityPage /></PageTransition>} />
        <Route path="/marketplace" element={<PageTransition><Marketplace /></PageTransition>} />
        <Route path="/competitions" element={<PageTransition><Competitions /></PageTransition>} />
        <Route path="/shop-products" element={<PageTransition><ShopProductsPage /></PageTransition>} />
        <Route path="/artists" element={<PageTransition><ArtistsPage /></PageTransition>} />
        <Route path="/public-challenges" element={<PageTransition><ChallengesPage /></PageTransition>} />
        <Route path="/challenge-submission/:challengeId" element={<PageTransition><ChallengeSubmissionPage /></PageTransition>} />
        <Route path="/my-posts" element={<PageTransition><MyPosts /></PageTransition>} />
        <Route path="/challenge-submissions" element={<PageTransition><ChallengeSubmissionsPage /></PageTransition>} />
        <Route path="/challenge-submissions/:challengeId" element={<PageTransition><ChallengeSubmissionsPage /></PageTransition>} />
        <Route path="/orders" element={<PageTransition><UserOrders /></PageTransition>} />
        <Route path="/profile" element={<PageTransition><UserProfile /></PageTransition>} />
        <Route path="/cart" element={<PageTransition><CartPage /></PageTransition>} />
        <Route path="/checkout" element={<PageTransition><CheckoutPage /></PageTransition>} />
        <Route path="/payment" element={<PageTransition><PaymentPage /></PageTransition>} />
        <Route path="/order-confirmation" element={<PageTransition><OrderConfirmationPage /></PageTransition>} />
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
        <Route path="/moderatordashboard" element={<Layout><ModeratorDashboard /></Layout>} />
        <Route path="/challenges" element={<Layout><ChallengeList /></Layout>} />
        <Route path="/create-challenge" element={<Layout><CreateChallenge /></Layout>} />
        <Route path="/exhibition" element={<Layout><ModeratorExhibition /></Layout>} />
        <Route path="/winner-selection" element={<Layout><WinnerSelection /></Layout>} />
        <Route path="/verify-exhibition" element={<Layout><VerifyExhibition /></Layout>} />
        <Route path="/scoring-criteria" element={<Layout><ScoringCriteria /></Layout>} />
      </Routes>
      {isLargeFooter ? <FooterLarge /> : <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
