import React, { useState } from "react";
import { X, Plus, Minus, ShoppingCart, Trash2 } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../common/ConfirmModal";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const CartSidebar = () => {
  const {
    cartItems,
    isCartOpen,
    toggleCart,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    getCartItemsCount,
  } = useCart();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper to get a valid cart item id
  const getCartItemId = (item) => item.id ?? item.artwork_id ?? item.artworkId;

  // Update quantity and sync with backend
  const handleUpdateQuantity = async (id, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveClick(id);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
      await axios.put(
        `${apiUrl}/api/cart/update`,
        {
          artworkId: id,
          quantity: newQuantity,
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      // Fetch latest cart from backend after update
      const refreshed = await axios.get(`${apiUrl}/api/cart/items`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (refreshed.data) {
        const mapped = refreshed.data.map(item => ({ ...item, id: item.artwork_id }));
        updateQuantity(id, newQuantity); // update local state for immediate feedback
        // Replace all cart items with backend response for accuracy
        if (typeof window !== 'undefined') {
          // If you have setCartItems in context, use it here
          if (typeof window.setCartItems === 'function') {
            window.setCartItems(mapped);
          }
        }
      }
    } catch (err) {
      setError("Failed to update quantity");
      console.error("Error updating quantity:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = () => {
    toggleCart();
    navigate("/cart");
  };

  const handleRemoveClick = (id) => {
    const validId = id ?? null;
    if (!validId) {
      setError("No item selected for removal.");
      return;
    }
    setItemToRemove(validId);
    setModalOpen(true);
  };

  const handleConfirmRemove = async () => {
    console.log("handleConfirmRemove called, itemToRemove:", itemToRemove);
    if (!itemToRemove) {
      setError("No item selected for removal.");
      console.error("No item selected for removal.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
      console.log(
        "Sending DELETE request to:",
        `${apiUrl}/api/cart/items/${itemToRemove}`
      );
      const response = await axios.delete(
        `${apiUrl}/api/cart/items/${itemToRemove}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      console.log("Backend response:", response);
      removeFromCart(itemToRemove);
      setModalOpen(false);
      setItemToRemove(null);
    } catch (err) {
      setError("Failed to remove item from cart");
      console.error("Error removing item from cart:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRemove = () => {
    setModalOpen(false);
    setItemToRemove(null);
  };

  // Fetch cart items from backend when sidebar opens
  React.useEffect(() => {
    if (!isCartOpen) return;
    const fetchCartItems = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
        const response = await axios.get(`${apiUrl}/api/cart/items`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (response.data) {
          // If you want to replace local cart, update context here
          // setCartItems(response.data.map(item => ({ ...item, id: item.artwork_id })));
        }
      } catch (err) {
        setError("Failed to load cart items");
      } finally {
        setLoading(false);
      }
    };
    fetchCartItems();
  }, [isCartOpen, token]);

  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={toggleCart}
      />

      {/* Cart Sidebar */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#FFE4D6]">
          <h2 className="text-xl font-bold text-[#7f5539] flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Shopping Cart ({getCartItemsCount()})
          </h2>
          <button
            onClick={toggleCart}
            className="p-2 hover:bg-[#FFF5E1] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[#7f5539]" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-[#FFD95A] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#7f5539] mb-2">
                Your cart is empty
              </h3>
              <p className="text-[#7f5539]/70">
                Add some art supplies to get started!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <div
                  key={getCartItemId(item) ?? index}
                  className="flex gap-4 p-4 bg-[#FFF5E1] rounded-lg border border-[#FFE4D6]"
                >
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#7f5539] text-sm mb-1">
                      {item.title}
                    </h4>
                    <p className="text-xs text-[#7f5539]/70 mb-2">
                      {item.artist_name}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(
                              getCartItemId(item),
                              item.quantity - 1
                            )
                          }
                          className="p-1 hover:bg-[#FFD95A] rounded transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-medium text-[#7f5539] min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(
                              getCartItemId(item),
                              item.quantity + 1
                            )
                          }
                          className="p-1 hover:bg-[#FFD95A] rounded transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#D87C5A]">
                          LKR {(item.price * item.quantity).toLocaleString()}
                        </span>
                        <button
                          onClick={() => handleRemoveClick(getCartItemId(item))}
                          className="p-1 hover:bg-red-100 hover:text-red-600 rounded transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-[#FFE4D6] p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-[#7f5539]">
                Total:
              </span>
              <span className="text-xl font-bold text-[#D87C5A]">
                LKR {getCartTotal().toLocaleString()}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-[#D87C5A] hover:bg-[#7f5539] text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
      <ConfirmModal
        open={modalOpen}
        title="Remove Item"
        message="Are you sure you want to remove this item from your cart?"
        onConfirm={handleConfirmRemove}
        onCancel={handleCancelRemove}
      />
    </>
  );
};

export default CartSidebar;
