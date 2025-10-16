import React, { useState } from "react";
import {
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import ConfirmModal from "../components/common/ConfirmModal";

const CartPage = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    getCartItemsCount,
    clearCart,
  } = useCart();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);

  const subtotal = getCartTotal();
  const shipping = subtotal > 5000 ? 0 : 800;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const handleContinueShopping = () => {
    navigate("/shop-products");
  };

  const handleRemoveClick = (id) => {
    setItemToRemove(id);
    setModalOpen(true);
  };

  const handleConfirmRemove = () => {
    removeFromCart(itemToRemove);
    setModalOpen(false);
    setItemToRemove(null);
  };

  const handleCancelRemove = () => {
    setModalOpen(false);
    setItemToRemove(null);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#FFF5E1]">
        <Navbar />
        <div className="pt-20 pb-10">
          <div className="max-w-4xl mx-auto px-4 text-center py-20">
            <ShoppingCart className="w-24 h-24 text-[#FFD95A] mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-[#7f5539] mb-4">
              Your cart is empty
            </h1>
            <p className="text-[#7f5539]/70 mb-8">
              Looks like you haven't added any art supplies yet.
            </p>
            <button
              onClick={handleContinueShopping}
              className="bg-[#D87C5A] hover:bg-[#7f5539] text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF5E1]">
      <Navbar />
      <ConfirmModal
        open={modalOpen}
        title="Remove Item"
        message="Are you sure you want to remove this item from your cart?"
        onConfirm={handleConfirmRemove}
        onCancel={handleCancelRemove}
      />
      <div className="pt-20 pb-10">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#7f5539] mb-2">
              Shopping Cart
            </h1>
            <p className="text-[#7f5539]/70">
              {getCartItemsCount()} items in your cart
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md border border-[#FFD95A] overflow-hidden">
                <div className="p-6 border-b border-[#FFE4D6]">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-[#7f5539]">
                      Cart Items
                    </h2>
                    <button
                      onClick={clearCart}
                      className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                    >
                      Clear Cart
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-[#FFE4D6]">
                  {cartItems.map((item) => (
                    <div key={item.artwork_id} className="p-6">
                      <div className="flex gap-4">
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-24 h-24 object-cover rounded-lg border border-[#FFE4D6]"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold text-[#7f5539] mb-1">
                                {item.title}
                              </h3>
                              <div className="flex items-center gap-2 mb-1">
                                <img
                                  src={item.artist_image}
                                  alt={item.artist_name}
                                  className="w-6 h-6 rounded-full border border-[#FFD95A]"
                                />
                                <span className="text-sm text-[#7f5539]/80 font-medium">
                                  {item.artist_name}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => handleRemoveClick(item.artwork_id)}
                              className="p-2 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="font-medium text-[#7f5539] min-w-[40px] text-center bg-[#FFD95A]/30 px-3 py-1 rounded-lg">
                                Qty: {item.quantity}
                              </span>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-[#D87C5A]">
                                LKR{" "}
                                {(item.price * item.quantity).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleContinueShopping}
                className="mt-6 text-[#7f5539] hover:text-[#D87C5A] font-medium transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Continue Shopping
              </button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md border border-[#FFD95A] p-6 sticky top-6">
                <h2 className="text-xl font-semibold text-[#7f5539] mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-[#7f5539]">
                      Subtotal ({getCartItemsCount()} items)
                    </span>
                    <span className="font-medium text-[#7f5539]">
                      LKR {subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7f5539]">Shipping</span>
                    <span className="font-medium text-[#7f5539]">
                      {shipping === 0 ? "To be decided" : `LKR ${shipping.toLocaleString()}`}
                    </span>
                  </div>
                  {/* Meaningful info instead of tax and free shipping */}
                  <div className="flex items-center gap-2 text-[#7f5539]/80 text-sm">
                    <span>Need help? <a href="/contact" className="underline text-[#D87C5A]">Contact support</a></span>
                  </div>
                  <div className="flex items-center gap-2 text-[#7f5539]/80 text-sm">
                    <span>Estimated delivery will be provided at checkout.</span>
                  </div>
                  <hr className="border-[#FFE4D6]" />
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold text-[#7f5539]">Total</span>
                    <span className="font-bold text-[#D87C5A]">
                      LKR {total.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-[#D87C5A] hover:bg-[#7f5539] text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
