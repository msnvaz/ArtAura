import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import "./styles/main.css";

// Pages
import Marketplace from "./pages/Marketplace";
import Competitions from "./pages/Competitions";

import Dashboard from "./pages/shop/Dashboard";
import ShopOrders from "./pages/shop/Orders";
import Sponsorships from "./pages/shop/Sponsorships";
import SalesAnalytics from "./pages/shop/Analytics";
import Catalog from "./pages/shop/Catalog";
import Profile from "./pages/shop/Profile";

import Login from "./components/auth/login";
import UploadArtWork from "./pages/Artist/UploadArtWork";
import ArtworkDetail from "./pages/Artist/ArtWorkDetail";
import ArtistDashboard from "./pages/Artist/ArtistDashboard";
import ArtistPortfolio from "./pages/Artist/ArtistPortfolio";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Signup from "./components/auth/signup2";
import ShopRegisterPage from "./components/auth/shopSignup";
import CommunityPage from "./pages/CommunityPage";

// Moderator Pages
import ModeratorDashboard from "./pages/Moderator/ModeratorDashboard";
import CreateChallenge from "./pages/Moderator/CreateChallenge";
import VerifyExhibitions from "./pages/Moderator/VerifyExhibitions";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import FooterLarge from "./components/FooterLarge";

// Page transition wrapper component using CSS animations
const PageTransition = ({ children }) => {
  return <div className="page-transition-wrapper">{children}</div>;
};

const AppContent = () => {
  const location = useLocation();
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <PageTransition>
              <Login />
            </PageTransition>
          }
        />
        <Route
          path="/signup"
          element={
            <PageTransition>
              <Signup />
            </PageTransition>
          }
        />
        <Route
          path="/register/shop"
          element={
            <PageTransition>
              <ShopRegisterPage />
            </PageTransition>
          }
        />
        <Route
          path="/community"
          element={
            <PageTransition>
              <CommunityPage />
            </PageTransition>
          }
        />
        <Route
          path="/marketplace"
          element={
            <PageTransition>
              <Marketplace />
            </PageTransition>
          }
        />
        <Route
          path="/competitions"
          element={
            <PageTransition>
              <Competitions />
            </PageTransition>
          }
        />
        <Route
          path="/shop/dashboard"
          element={
            <PageTransition>
              <Dashboard />
            </PageTransition>
          }
        />
        <Route
          path="/shop/orders"
          element={
            <PageTransition>
              <ShopOrders />
            </PageTransition>
          }
        />
        <Route
          path="/shop/sponsorships"
          element={
            <PageTransition>
              <Sponsorships />
            </PageTransition>
          }
        />
        <Route
          path="/shop/analytics"
          element={
            <PageTransition>
              <SalesAnalytics />
            </PageTransition>
          }
        />
        <Route
          path="/shop/catalog"
          element={
            <PageTransition>
              <Catalog />
            </PageTransition>
          }
        />
        <Route
          path="/shop/profile"
          element={
            <PageTransition>
              <Profile />
            </PageTransition>
          }
        />
        <Route
          path="/uploadartwork"
          element={
            <PageTransition>
              <UploadArtWork />
            </PageTransition>
          }
        />
        <Route
          path="/artworks/:id"
          element={
            <PageTransition>
              <ArtworkDetail />
            </PageTransition>
          }
        />
        <Route
          path="/artist/artistdashboard"
          element={
            <PageTransition>
              <ArtistDashboard />
            </PageTransition>
          }
        />
        <Route
          path="/artist/artistportfolio"
          element={
            <PageTransition>
              <ArtistPortfolio />
            </PageTransition>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <PageTransition>
              <AdminDashboard />
            </PageTransition>
          }
        />
        <Route
          path="/ModeratorDashboard"
          element={
            <PageTransition>
              <ModeratorDashboard />
            </PageTransition>
          }
        />
        <Route
          path="/createChallenge"
          element={
            <PageTransition>
              <CreateChallenge />
            </PageTransition>
          }
        />
        <Route
          path="/verifyExhibitions"
          element={
            <PageTransition>
              <VerifyExhibitions />
            </PageTransition>
          }
        />
      </Routes>
      {location.pathname === "/" ? <FooterLarge /> : <Footer />}
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
