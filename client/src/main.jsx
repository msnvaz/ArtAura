import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { ArtProvider } from './context/ArtContext'; // ✅ Import the provider

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ArtProvider>         {/* ✅ Wrap App with ArtProvider */}
      <App />
    </ArtProvider>
  </StrictMode>
);

