import React, { createContext, useContext, useState, useEffect } from "react";

// 🔐 Create context
const AuthContext = createContext();

// 📦 Provider
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: null,
    role: null,
    userId: null,
  });
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const userId = localStorage.getItem("userId");

    if (token && role && userId) {
      setAuth({ token, role, userId });
    }
    setAuthLoading(false);
  }, []);

  const login = (token, role, userId) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("userId", userId);
    setAuth({ token, role, userId });

    console.log("✅ User logged in:", { role, userId });
    // Note: For shops, userId IS the shop_id from the database
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    // Clear shop-related data to prevent showing previous user's data
    localStorage.removeItem("shopId");
    localStorage.removeItem("shopData"); // Clear any cached shop data
    localStorage.removeItem("ownerName");
    localStorage.removeItem("shopName");

    setAuth({ token: null, role: null, userId: null });
    console.log("✅ User has been logged out and all data cleared.");
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Always define hook **outside** the component
export const useAuth = () => {
  return useContext(AuthContext);
};
