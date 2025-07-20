import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { ArtProvider } from "./context/ArtContext"; // ✅ Import the provider
import { AuthProvider } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";
import { CartProvider } from "./context/CartContext"; // ✅ Import CartProvider
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <ArtProvider>
        {" "}
        {/* ✅ Wrap App with ArtProvider */}
        <UserProvider>
          {" "}
          {/* ✅ Wrap App with UserProvider */}
          <CartProvider>
            {" "}
            {/* ✅ Wrap App with CartProvider */}
            <App />
          </CartProvider>
        </UserProvider>
      </ArtProvider>
    </AuthProvider>
  </StrictMode>
);
