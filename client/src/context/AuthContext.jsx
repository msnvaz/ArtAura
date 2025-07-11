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

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const userId = localStorage.getItem("userId");

    if (token && role && userId) {
      setAuth({ token, role, userId });
    }
  }, []);

  const login = (token, role, userId) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("userId", userId);
    setAuth({ token, role, userId });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    setAuth({ token: null, role: null, userId: null });
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Always define hook **outside** the component
export const useAuth = () => {
  return useContext(AuthContext);
};
