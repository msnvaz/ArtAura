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

    // Fetch shopId using userId after login and store in localStorage
    if (userId && token) {
      fetch(`${import.meta.env.VITE_API_URL}/api/shop/profile/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then(res => res.json())
        .then(data => {
          if (data && data.shopId) {
            localStorage.setItem("shopId", data.shopId);
          }
        })
        .catch(err => {
          console.error("Failed to fetch shopId after login:", err);
        });
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    setAuth({ token: null, role: null, userId: null });
    console.log("User has been logged out.");
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
