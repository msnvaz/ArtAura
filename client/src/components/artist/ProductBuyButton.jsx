import React, { useState } from 'react';
import { ShoppingCart, Package, Check, X } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

const ProductBuyButton = ({ product, artistId, onOrderCreated }) => {
    const { token } = useAuth(); // Get JWT token for authentication
    const [quantity, setQuantity] = useState(1);
    const [isOrdering, setIsOrdering] = useState(false);

    console.log('🎯 ProductBuyButton rendered:', { product, artistId, hasCallback: !!onOrderCreated });

    const handleBuyProduct = async () => {
        console.log('🛒 Buy button clicked!', { artistId, product, quantity });
        
        if (!artistId) {
            console.error('❌ No artist ID!');
            toast.error('Please login to buy products');
            return;
        }

        if (product.stock < quantity) {
            toast.error(`Only ${product.stock} items available in stock`);
            return;
        }

        try {
            setIsOrdering(true);

            const orderData = {
                productId: product.id,
                quantity: quantity,
                artistId: artistId
            };

            console.log('🛒 Placing order:', orderData);

            const response = await axios.post(
                `${API_URL}/api/artist-orders/create`,
                orderData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                toast.success('Order placed successfully!');
                setQuantity(1);
                
                // Notify parent component
                if (onOrderCreated) {
                    onOrderCreated(response.data.orderId);
                }
            } else {
                toast.error(response.data.message || 'Failed to place order');
            }

        } catch (error) {
            console.error('❌ Error placing order:', error);
            const errorMessage = error.response?.data?.message || 'Failed to place order';
            toast.error(errorMessage);
        } finally {
            setIsOrdering(false);
        }
    };

    return (
        <div className="space-y-3">
            {/* Quantity Selector */}
            <div className="flex items-center space-x-3">
                <label className="text-sm font-medium text-[#7f5539]">Quantity:</label>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 py-1 bg-[#7f5539]/10 text-[#7f5539] rounded-lg hover:bg-[#7f5539]/20 transition-colors"
                        disabled={isOrdering}
                    >
                        -
                    </button>
                    <input
                        type="number"
                        min="1"
                        max={product.stock}
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                        className="w-16 text-center px-2 py-1 border border-[#7f5539]/20 rounded-lg focus:ring-2 focus:ring-[#7f5539]/20"
                        disabled={isOrdering}
                    />
                    <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="px-3 py-1 bg-[#7f5539]/10 text-[#7f5539] rounded-lg hover:bg-[#7f5539]/20 transition-colors"
                        disabled={isOrdering}
                    >
                        +
                    </button>
                </div>
                <span className="text-sm text-[#7f5539]/60">
                    ({product.stock} available)
                </span>
            </div>

            {/* Total Price */}
            <div className="flex items-center justify-between py-2 border-t border-[#7f5539]/10">
                <span className="text-sm font-medium text-[#7f5539]">Total:</span>
                <span className="text-lg font-bold text-[#7f5539]">
                    LKR {(product.price * quantity).toFixed(2)}
                </span>
            </div>

            {/* Buy Button */}
            <button
                onClick={handleBuyProduct}
                disabled={isOrdering || product.stock === 0}
                className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                    product.stock === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-[#7f5539] text-white hover:bg-[#6e4c34]'
                }`}
            >
                {isOrdering ? (
                    <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Placing Order...</span>
                    </>
                ) : product.stock === 0 ? (
                    <>
                        <X className="h-4 w-4" />
                        <span>Out of Stock</span>
                    </>
                ) : (
                    <>
                        <ShoppingCart className="h-4 w-4" />
                        <span>Buy Now</span>
                    </>
                )}
            </button>

            {product.stock > 0 && product.stock <= 10 && (
                <p className="text-xs text-orange-600 text-center">
                    ⚠️ Only {product.stock} items left!
                </p>
            )}
        </div>
    );
};

export default ProductBuyButton;
