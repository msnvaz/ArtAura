import React, { useState, useEffect } from 'react';
import {
    Store,
    ShoppingBag,
    Star,
    MapPin,
    Phone,
    Mail,
    ExternalLink,
    Search,
    Filter,
    Grid,
    List as ListIcon,
    Eye,
    Heart,
    ShoppingCart,
    Package
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import ProductBuyButton from './ProductBuyButton';
import { Toaster } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

const ShopDiscoveryTab = () => {
    const { token, userId } = useAuth(); // Get authentication token and userId
    const [shops, setShops] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedShop, setSelectedShop] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [filterType, setFilterType] = useState('all'); // 'all', 'shops', 'products'
    const [selectedShopProducts, setSelectedShopProducts] = useState([]);

    // Convert image path to displayable URL
    const getImageUrl = (imagePath) => {
        if (!imagePath) return '/src/assets/catalog.jpeg';
        
        // If it's already a full URL, return as is
        if (imagePath.startsWith('http')) return imagePath;
        
        // If it's an absolute file path (old data), extract filename and create relative URL
        if (imagePath.includes('D:/Artaura') || imagePath.includes('D:\\Artaura')) {
            const filename = imagePath.split(/[/\\]/).pop();
            return `/uploads/products/${filename}`;
        }
        
        // If it's already a relative path starting with /, return as is
        if (imagePath.startsWith('/')) return imagePath;
        
        // If it's just a filename, add the path
        return `/uploads/products/${imagePath}`;
    };

    // Fetch shops and products on component mount
    useEffect(() => {
        console.log('ShopDiscoveryTab mounted, fetching data...');
        fetchShopsAndProducts();
    }, []);

    // Add debugging for state changes
    useEffect(() => {
        console.log('Shops state updated:', shops);
        console.log('Products state updated:', products);
        console.log('Loading state:', loading);
        console.log('Error state:', error);
    }, [shops, products, loading, error]);

    const fetchShopsAndProducts = async () => {
        try {
            setLoading(true);
            console.log('🚀 Starting fetchShopsAndProducts...');
            console.log('API_URL:', API_URL);
            console.log('Token exists:', !!token);
            console.log('Fetching shops from:', `${API_URL}/api/shop/all`);
            console.log('Fetching products from:', `${API_URL}/api/products`);

            // Create headers with authentication
            const headers = {};
            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }

            // For now, test with mock data if API fails
            try {
                // Fetch all shops
                const shopsResponse = await axios.get(`${API_URL}/api/shop/all`, { headers });

                // Fetch all products
                const productsResponse = await axios.get(`${API_URL}/api/products`, { headers });

                console.log('✅ API data loaded:',
                    shopsResponse.data?.length || 0, 'shops,',
                    productsResponse.data?.length || 0, 'products');

                // Handle single shop object or array of shops
                const shopsData = Array.isArray(shopsResponse.data) ? shopsResponse.data : [shopsResponse.data];
                const productsData = productsResponse.data || [];

                console.log('📦 Setting shops data:', shopsData.length, 'shops');
                console.log('📦 Setting products data:', productsData.length, 'products');

                setShops(shopsData);
                setProducts(productsData);

            } catch (apiError) {
                console.error('❌ API calls failed:', apiError);
                console.log('Using mock data for testing...');

                // Mock data for testing
                const mockShops = [
                    {
                        shopId: 1,
                        shopName: "ArtCraft Gallery",
                        description: "Premium art supplies and custom frames",
                        businessType: "Art Supplies",
                        contactNo: "+94 77 123 4567",
                        email: "info@artcraft.lk",
                        status: "active"
                    },
                    {
                        shopId: 2,
                        shopName: "Creative Canvas",
                        description: "Professional painting supplies and workshop materials",
                        businessType: "Art Materials",
                        contactNo: "+94 77 234 5678",
                        email: "hello@creativecanvas.lk",
                        status: "active"
                    },
                    {
                        shopId: 3,
                        shopName: "Digital Art Hub",
                        description: "Digital art equipment and software",
                        businessType: "Digital Art",
                        contactNo: "+94 77 345 6789",
                        email: "support@digitalhub.lk",
                        status: "active"
                    }
                ];

                const mockProducts = [
                    {
                        id: 1,
                        name: "Professional Paint Set",
                        description: "High-quality acrylic paints for professional artists",
                        price: "15000",
                        category: "Paints",
                        shopId: 1
                    },
                    {
                        id: 2,
                        name: "Canvas Boards Pack",
                        description: "Pack of 10 premium canvas boards",
                        price: "8500",
                        category: "Canvas",
                        shopId: 1
                    },
                    {
                        id: 3,
                        name: "Digital Drawing Tablet",
                        description: "Professional graphics tablet for digital art",
                        price: "45000",
                        category: "Digital Equipment",
                        shopId: 3
                    }
                ];

                setShops(mockShops);
                setProducts(mockProducts);
            }

            setError(null);
        } catch (err) {
            console.error('Error in fetchShopsAndProducts:', err);
            setError('Failed to load shops and products');
        } finally {
            setLoading(false);
            console.log('✅ Loading state set to false');
        }
    };

    const fetchShopProducts = async (shopId) => {
        try {
            // Create headers with authentication
            const headers = {};
            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }

            const response = await axios.get(`${API_URL}/api/products?shopId=${shopId}`, { headers });
            setSelectedShopProducts(response.data || []);
        } catch (err) {
            console.error('Error fetching shop products:', err);
            setSelectedShopProducts([]);
        }
    };

    const handleShopClick = (shop) => {
        setSelectedShop(shop);
        fetchShopProducts(shop.shopId);
    };

    const handleBackToShops = () => {
        setSelectedShop(null);
        setSelectedShopProducts([]);
    };

    // Helper function to get shop name for a product
    const getShopNameForProduct = (shopId) => {
        const shop = shops.find(s => s.shopId === shopId);
        return shop ? shop.shopName : 'Unknown Shop';
    };

    // Add safety check for undefined data - MUST be defined before filtering
    const safeShops = Array.isArray(shops) ? shops : [];
    const safeProducts = Array.isArray(products) ? products : [];

    // Helper function to safely search strings
    const safeStringIncludes = (str, searchTerm) => {
        if (!searchTerm || searchTerm.trim() === '') return true; // Show all items when no search term
        if (!str || typeof str !== 'string') return false;
        return str.toLowerCase().includes(searchTerm.toLowerCase());
    };

    // Filter shops and products based on search term and filter type
    let filteredShops = [];
    let filteredProducts = [];

    try {
        filteredShops = safeShops.filter(shop => {
            if (!shop) return false;
            return safeStringIncludes(shop.shopName, searchTerm) ||
                safeStringIncludes(shop.businessType, searchTerm) ||
                safeStringIncludes(shop.description, searchTerm);
        });

        filteredProducts = safeProducts.filter(product => {
            if (!product) return false;
            return safeStringIncludes(product.name, searchTerm) ||
                safeStringIncludes(product.description, searchTerm) ||
                safeStringIncludes(product.category, searchTerm);
        });

        // Log search results only when there's a search term
        if (searchTerm && searchTerm.trim().length > 0) {
            console.log(`🔍 Search "${searchTerm}": ${filteredShops.length} shops, ${filteredProducts.length} products`);
        }
    } catch (filterError) {
        console.error('Error filtering data:', filterError);
        filteredShops = [];
        filteredProducts = [];
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7f5539]"></div>
                <span className="ml-3 text-[#7f5539]">Loading shops and products...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <div className="text-red-500 mb-4">⚠️ {error}</div>
                <button
                    onClick={fetchShopsAndProducts}
                    className="bg-[#7f5539] text-white px-6 py-2 rounded-lg hover:bg-[#6e4c34] transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    // Create safe filtered arrays after filtering
    const safeFilteredShops = Array.isArray(filteredShops) ? filteredShops : [];
    const safeFilteredProducts = Array.isArray(filteredProducts) ? filteredProducts : [];

    // Debug: Log current data counts in development
    if (import.meta.env.DEV) {
        console.log('ShopDiscoveryTab data:', {
            shops: safeShops.length,
            products: safeProducts.length,
            filteredShops: safeFilteredShops.length,
            filteredProducts: safeFilteredProducts.length
        });
    }

    // If a shop is selected, show shop details and products
    if (selectedShop) {
        return (
            <div className="space-y-6">
                {/* Back Button and Shop Header */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <button
                        onClick={handleBackToShops}
                        className="flex items-center text-[#7f5539] hover:text-[#6e4c34] mb-4 transition-colors"
                    >
                        ← Back to Shops
                    </button>

                    <div className="flex items-start space-x-6">
                        <div className="p-4 bg-[#7f5539]/10 rounded-full">
                            <Store className="h-12 w-12 text-[#7f5539]" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-[#7f5539] mb-2">{selectedShop.shopName}</h2>
                            <p className="text-[#7f5539]/70 mb-3">{selectedShop.description}</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center space-x-2">
                                    <Store className="h-4 w-4 text-[#7f5539]/60" />
                                    <span>{selectedShop.businessType}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Phone className="h-4 w-4 text-[#7f5539]/60" />
                                    <span>{selectedShop.contactNo}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Mail className="h-4 w-4 text-[#7f5539]/60" />
                                    <span>{selectedShop.email}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Package className="h-4 w-4 text-[#7f5539]/60" />
                                    <span>{selectedShopProducts.length} Products</span>
                                </div>
                                {(selectedShop.streetAddress || selectedShop.city) && (
                                    <div className="flex items-center space-x-2 col-span-full">
                                        <MapPin className="h-4 w-4 text-[#7f5539]/60" />
                                        <span>
                                            {[selectedShop.streetAddress, selectedShop.city, selectedShop.state, selectedShop.country, selectedShop.zipCode]
                                                .filter(Boolean)
                                                .join(', ')}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Shop Products */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-[#7f5539] mb-6">Products</h3>

                    {selectedShopProducts.length === 0 ? (
                        <div className="text-center py-8">
                            <Package className="h-12 w-12 text-[#7f5539]/30 mx-auto mb-3" />
                            <p className="text-[#7f5539]/60">No products available in this shop yet</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {selectedShopProducts.map((product) => (
                                <div key={product.id} className="bg-[#fdf9f4]/30 rounded-lg p-4 hover:shadow-md transition-shadow">
                                    {product.imageUrl && (
                                        <img
                                            src={product.imageUrl}
                                            alt={product.productName}
                                            className="w-full h-40 object-cover rounded-lg mb-3"
                                        />
                                    )}
                                    <h4 className="font-semibold text-[#7f5539] mb-2">{product.productName}</h4>
                                    <p className="text-[#7f5539]/70 text-sm mb-3 line-clamp-2">{product.description}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[#7f5539] font-medium">LKR {product.price}</span>
                                        <span className="text-xs bg-[#7f5539]/10 text-[#7f5539] px-2 py-1 rounded-full">
                                            {product.category}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Main shop discovery view
    return (
        <div className="space-y-6">
            {/* Toast notifications */}
            <Toaster position="top-right" />
            
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-[#7f5539] mb-2">Shop Discovery</h3>
                        <p className="text-[#7f5539]/70">Discover available shops and their products</p>
                    </div>

                    {/* Stats */}
                    <div className="mt-4 md:mt-0 flex items-center space-x-6 text-sm">
                        <div className="text-center">
                            <div className="text-lg font-bold text-[#7f5539]">{safeShops.length}</div>
                            <div className="text-[#7f5539]/60">Shops</div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg font-bold text-[#7f5539]">{safeProducts.length}</div>
                            <div className="text-[#7f5539]/60">Products</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#7f5539]/60" />
                        <input
                            type="text"
                            placeholder="Search shops and products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-[#7f5539]/20 rounded-lg focus:ring-2 focus:ring-[#7f5539]/20 focus:border-[#7f5539]"
                        />
                    </div>

                    {/* Filter Type */}
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="px-4 py-2 border border-[#7f5539]/20 rounded-lg focus:ring-2 focus:ring-[#7f5539]/20 focus:border-[#7f5539]"
                    >
                        <option value="all">All</option>
                        <option value="shops">Shops Only</option>
                        <option value="products">Products Only</option>
                    </select>

                    {/* View Mode */}
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-colors ${viewMode === 'grid'
                                ? 'bg-[#7f5539] text-white'
                                : 'bg-[#7f5539]/10 text-[#7f5539] hover:bg-[#7f5539]/20'
                                }`}
                        >
                            <Grid className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-colors ${viewMode === 'list'
                                ? 'bg-[#7f5539] text-white'
                                : 'bg-[#7f5539]/10 text-[#7f5539] hover:bg-[#7f5539]/20'
                                }`}
                        >
                            <ListIcon className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Shops Section */}
            {(filterType === 'all' || filterType === 'shops') && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h4 className="text-md font-semibold text-[#7f5539] mb-4">
                        Available Shops ({safeFilteredShops.length})
                    </h4>

                    {safeFilteredShops.length === 0 ? (
                        <div className="text-center py-8">
                            <Store className="h-12 w-12 text-[#7f5539]/30 mx-auto mb-3" />
                            <p className="text-[#7f5539]/60">No shops match your search</p>
                        </div>
                    ) : (
                        <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}`}>
                            {safeFilteredShops.map((shop) => (
                                <div
                                    key={shop.shopId}
                                    className={`bg-white rounded-xl p-6 cursor-pointer transition-all duration-300 border border-[#7f5539]/10
                                        shadow-[0_2px_8px_rgba(127,85,57,0.08)] hover:shadow-[0_8px_30px_rgba(127,85,57,0.2)] 
                                        hover:-translate-y-1 hover:border-[#7f5539]/20
                                        ${viewMode === 'list' ? 'flex items-center space-x-6' : ''}`}
                                    onClick={() => handleShopClick(shop)}
                                >
                                    <div className={`p-4 bg-gradient-to-br from-[#7f5539]/10 to-[#7f5539]/5 rounded-xl 
                                        shadow-inner ${viewMode === 'list' ? 'flex-shrink-0' : 'mx-auto mb-4 w-fit'}`}>
                                        <Store className="h-8 w-8 text-[#7f5539]" />
                                    </div>

                                    <div className={`${viewMode === 'list' ? 'flex-1' : 'text-center'}`}>
                                        <h5 className="font-bold text-[#7f5539] mb-2 text-lg">{shop.shopName}</h5>
                                        <p className="text-[#7f5539]/70 text-sm mb-3 line-clamp-2">{shop.description}</p>

                                        <div className={`${viewMode === 'list' ? 'flex items-center flex-wrap gap-4' : 'space-y-2'} text-xs text-[#7f5539]/60`}>
                                            <div className="flex items-center space-x-2 bg-[#7f5539]/5 px-3 py-1.5 rounded-full">
                                                <Store className="h-3.5 w-3.5 text-[#7f5539]" />
                                                <span className="font-medium">{shop.businessType}</span>
                                            </div>
                                            <div className="flex items-center space-x-2 bg-[#7f5539]/5 px-3 py-1.5 rounded-full">
                                                <Phone className="h-3.5 w-3.5 text-[#7f5539]" />
                                                <span>{shop.contactNo}</span>
                                            </div>
                                            {(shop.streetAddress || shop.city) && (
                                                <div className="flex items-center space-x-2 bg-[#7f5539]/5 px-3 py-1.5 rounded-full">
                                                    <MapPin className="h-3.5 w-3.5 text-[#7f5539]" />
                                                    <span className="line-clamp-1">
                                                        {[shop.streetAddress, shop.city, shop.state, shop.country, shop.zipCode]
                                                            .filter(Boolean)
                                                            .join(', ')}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {viewMode === 'list' && (
                                        <ExternalLink className="h-5 w-5 text-[#7f5539]/60 flex-shrink-0 group-hover:text-[#7f5539]" />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Products Section */}
            {(filterType === 'all' || filterType === 'products') && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h4 className="text-md font-semibold text-[#7f5539] mb-4">
                        Available Products ({safeFilteredProducts.length})
                    </h4>

                    {safeFilteredProducts.length === 0 ? (
                        <div className="text-center py-8">
                            <Package className="h-12 w-12 text-[#7f5539]/30 mx-auto mb-3" />
                            <p className="text-[#7f5539]/60">No products match your search</p>
                        </div>
                    ) : (
                        <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}`}>
                            {safeFilteredProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className={`bg-[#fdf9f4]/30 rounded-lg p-4 hover:shadow-md transition-shadow ${viewMode === 'list' ? 'flex items-center space-x-4' : ''
                                        }`}
                                >
                                    {product.image && (
                                        <img
                                            src={getImageUrl(product.image)}
                                            alt={product.name}
                                            className={`object-contain rounded-lg bg-white ${viewMode === 'list'
                                                ? 'w-16 h-16 flex-shrink-0'
                                                : 'w-full h-40 mb-3 p-2'
                                                }`}
                                        />
                                    )}

                                    <div className={`${viewMode === 'list' ? 'flex-1' : ''} space-y-3`}>
                                        <div>
                                            {/* Shop Name Tag */}
                                            <div className="flex items-center space-x-2 mb-2">
                                                <span className="inline-flex items-center space-x-1 text-xs bg-[#7f5539]/10 text-[#7f5539] px-2.5 py-1 rounded-full border border-[#7f5539]/20">
                                                    <Store className="h-3 w-3" />
                                                    <span className="font-medium">{getShopNameForProduct(product.shopId)}</span>
                                                </span>
                                            </div>
                                            
                                            <h5 className="font-semibold text-[#7f5539] mb-2">{product.name}</h5>
                                            <p className="text-[#7f5539]/70 text-sm mb-2 line-clamp-2">{product.description}</p>

                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-[#7f5539] font-medium">LKR {product.price}</span>
                                                <span className="text-xs bg-[#7f5539]/10 text-[#7f5539] px-2 py-1 rounded-full">
                                                    {product.category}
                                                </span>
                                            </div>

                                            <div className="text-xs text-[#7f5539]/60 mb-2">
                                                Stock: {product.stock || 0} available
                                            </div>
                                        </div>

                                        {/* Buy Button Component */}
                                        <ProductBuyButton 
                                            product={product} 
                                            artistId={userId || null}
                                            onOrderCreated={() => {
                                                // Refresh products after order
                                                fetchShopsAndProducts();
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ShopDiscoveryTab;
