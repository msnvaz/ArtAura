import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { token } = useAuth();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("artaura_cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("artaura_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Fetch cart items from backend and persist in context
  const fetchCartFromBackend = async () => {
    if (!token) return;
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
      const response = await axios.get(`${apiUrl}/api/cart/items`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data) {
        // Map artworkId to id for consistency
        const mapped = response.data.map((item) => ({
          ...item,
          id: item.id || item.artworkId,
        }));
        setCartItems(mapped);
      }
    } catch (err) {
      // Optionally handle error (e.g. show toast)
    }
  };

  // Fetch cart from backend when token changes (e.g. after login or refresh)
  useEffect(() => {
    if (token) {
      fetchCartFromBackend();
    }
  }, [token]);

  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      const productId = product.id || product.artworkId;
      const existingItem = prevItems.find(
        (item) => (item.id || item.artworkId) === productId
      );

      if (existingItem) {
        return prevItems.map((item) =>
          (item.id || item.artworkId) === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevItems, { ...product, id: productId, quantity }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    isCartOpen,
    toggleCart,
    setIsCartOpen,
    fetchCartFromBackend, // <-- Expose to consumers
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
