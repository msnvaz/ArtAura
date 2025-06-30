import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/main.css';

// Components
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import Competitions from './pages/Competitions';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';

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
      <App />
    </Router>
  );
}

export default AppWrapper;