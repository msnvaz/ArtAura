import { createContext, useContext, useState } from 'react';

const ArtContext = createContext();

export const ArtProvider = ({ children }) => {
  const [artworks, setArtworks] = useState([]);

  const uploadArtwork = (artwork) => {
    setArtworks((prev) => [artwork, ...prev]);
  };

  return (
    <ArtContext.Provider value={{ artworks, uploadArtwork }}>
      {children}
    </ArtContext.Provider>
  );
};

export const useArt = () => useContext(ArtContext);
