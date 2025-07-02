import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { ArtProvider } from './context/ArtContext'; // ✅ Import the provider

import { UserProvider } from './context/UserContext';
import './index.css'; 


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ArtProvider>         {/* ✅ Wrap App with ArtProvider */}
      <UserProvider>      {/* ✅ Wrap App with UserProvider */}
        <App />
      </UserProvider>
    </ArtProvider>
  </StrictMode>
);

