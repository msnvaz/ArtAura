import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/main.css';

import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import Competitions from './pages/Competitions';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/competitions" element={<Competitions />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;