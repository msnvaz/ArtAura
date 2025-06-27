import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/main.css';

import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import Competitions from './pages/Competitions';
import Dashboard from './pages/shop/dashboard';
import ShopOrders from './pages/shop/Orders';
import RewardSystem from './pages/shop/Rewards';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/competitions" element={<Competitions />} />
          <Route path="/shop/dashboard" element={<Dashboard />} />
          <Route path="/shop/orders" element={<ShopOrders/>}/>
          <Route path="/shop/rewards" element={<RewardSystem />} />


        </Routes>
      </div>
    </Router>
  );
}

export default App;