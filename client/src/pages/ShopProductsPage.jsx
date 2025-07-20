import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  ShoppingCart,
  Heart,
  Star,
  Eye,
  Grid,
  List,
  SlidersHorizontal,
} from "lucide-react";
import Navbar from "../components/common/Navbar";
import { useCart } from "../context/CartContext";
import CartSidebar from "../components/cart/CartSidebar";

const ShopProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);

  const { addToCart, toggleCart } = useCart();

  // Mock data for products
  const mockProducts = [
    {
      id: 1,
      name: "Professional Acrylic Paint Set",
      price: 2850.0,
      originalPrice: 3800.0,
      category: "Painting Supplies",
      shopName: "Colombo Art Centre",
      shopLogo: "https://randomuser.me/api/portraits/men/1.jpg",
      image: "/paintSet.jpeg", // public image
      rating: 4.8,
      reviews: 124,
      description:
        "High-quality acrylic paints perfect for professional artists and beginners alike.",
      inStock: true,
      stockCount: 15,
      tags: ["acrylic", "painting", "professional"],
      discount: 25,
    },
    {
      id: 2,
      name: "Digital Drawing Tablet",
      price: 45000.0,
      originalPrice: 60000.0,
      category: "Digital Art Tools",
      shopName: "TechArt Lanka",
      shopLogo: "https://randomuser.me/api/portraits/women/2.jpg",
      image: "/drawingTablet.jpeg", // public image
      rating: 4.9,
      reviews: 87,
      description:
        "Professional drawing tablet with pressure sensitivity and wireless connectivity.",
      inStock: true,
      stockCount: 8,
      tags: ["digital", "tablet", "drawing"],
      discount: 25,
    },
    {
      id: 3,
      name: "Canvas Stretched Frame Set",
      price: 1380.0,
      originalPrice: null,
      category: "Canvas & Paper",
      shopName: "Kandy Canvas Corner",
      shopLogo: "https://randomuser.me/api/portraits/men/3.jpg",
      image: "/canvasFrame.jpeg", // public image
      rating: 4.6,
      reviews: 56,
      description:
        "Pre-stretched canvas frames in various sizes for all your painting needs.",
      inStock: true,
      stockCount: 23,
      tags: ["canvas", "frame", "painting"],
      discount: 0,
    },
    {
      id: 4,
      name: "Watercolor Brush Set",
      price: 1050.0,
      originalPrice: 1500.0,
      category: "Brushes & Tools",
      shopName: "Galle Brush Masters",
      shopLogo: "https://randomuser.me/api/portraits/women/4.jpg",
      image: "/galleFort.jpeg", // public image
      rating: 4.7,
      reviews: 92,
      description:
        "Premium watercolor brushes made from natural bristles for smooth strokes.",
      inStock: false,
      stockCount: 0,
      tags: ["watercolor", "brushes", "painting"],
      discount: 30,
    },
    {
      id: 5,
      name: "Heritage Art Poster",
      price: 2200.0,
      originalPrice: 3000.0,
      category: "Art Prints",
      shopName: "Heritage Gallery",
      shopLogo: "https://randomuser.me/api/portraits/men/5.jpg",
      image: "/poster.jpeg", // public image
      rating: 4.5,
      reviews: 41,
      description:
        "A beautiful poster print inspired by Sri Lankan heritage and culture. Perfect for home or studio décor.",
      inStock: true,
      stockCount: 12,
      tags: ["poster", "heritage", "print"],
      discount: 27,
    },
  ];

  const categories = [
    "All Categories",
    "Painting Supplies",
    "Digital Art Tools",
    "Canvas & Paper",
    "Brushes & Tools",
    "Sculpture Supplies",
    "Art Books & Education",
    "Craft Materials",
    "Professional Equipment",
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter and search functionality
  useEffect(() => {
    let filtered = products;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          product.shopName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== "all" && selectedCategory !== "All Categories") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Price range filter
    if (priceRange.min) {
      filtered = filtered.filter(
        (product) => product.price >= parseFloat(priceRange.min)
      );
    }
    if (priceRange.max) {
      filtered = filtered.filter(
        (product) => product.price <= parseFloat(priceRange.max)
      );
    }

    // Only show in-stock products
    filtered = filtered.filter((product) => product.inStock);

    // Sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
      default:
        filtered.sort((a, b) => b.id - a.id);
        break;
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, priceRange, sortBy]);

  const handleAddToCart = (productId) => {
    const product = products.find((p) => p.id === productId);
    if (product && product.inStock) {
      addToCart(product);
      toggleCart(); // Open cart sidebar
    }
  };

  const handleAddToWishlist = (productId) => {
    console.log(`Adding product ${productId} to wishlist`);
    // Add wishlist logic here
  };

  const ProductCard = ({ product }) => (
    <div className="bg-white rounded-xl shadow-md border border-[#FFD95A] overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        {product.discount > 0 && (
          <span className="absolute top-2 left-2 bg-[#D87C5A] text-white px-2 py-1 rounded-full text-xs font-bold">
            -{product.discount}%
          </span>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Out of Stock</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <img
            src={product.shopLogo}
            alt={product.shopName}
            className="w-6 h-6 rounded-full"
          />
          <span className="text-xs text-[#7f5539]/70">{product.shopName}</span>
        </div>

        <h3 className="font-semibold text-[#7f5539] mb-2 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-sm text-[#7f5539]/70 mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-current text-[#FFD95A]" />
            <span className="text-sm font-medium text-[#7f5539]">
              {product.rating}
            </span>
          </div>
          <span className="text-xs text-[#7f5539]/70">
            ({product.reviews} reviews)
          </span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-[#D87C5A]">
              LKR {product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-[#7f5539]/50 line-through">
                LKR {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          {product.inStock && (
            <span className="text-xs text-green-600">
              In Stock ({product.stockCount})
            </span>
          )}
        </div>

        <button
          onClick={() => handleAddToCart(product.id)}
          disabled={!product.inStock}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
            product.inStock
              ? "bg-[#D87C5A] hover:bg-[#7f5539] text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          <ShoppingCart className="w-4 h-4 inline mr-2" />
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFF5E1]">
      <Navbar />
      <CartSidebar />

      <div className="pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#7f5539] mb-2">
              Art Supply Shop
            </h1>
            <p className="text-[#7f5539]/70">
              Discover amazing art supplies from verified shops
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-md border border-[#FFD95A] p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7f5539]/50 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products, shops, or categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-[#FFD95A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD95A] text-[#7f5539]"
                />
              </div>

              {/* Filters Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-[#FFD95A] hover:bg-[#D87C5A] text-[#7f5539] rounded-lg transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>

              {/* View Mode */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg ${
                    viewMode === "grid"
                      ? "bg-[#D87C5A] text-white"
                      : "bg-[#FFD95A] text-[#7f5539]"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg ${
                    viewMode === "list"
                      ? "bg-[#D87C5A] text-white"
                      : "bg-[#FFD95A] text-[#7f5539]"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Extended Filters */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-[#FFD95A] grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#7f5539] mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-[#FFD95A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD95A] text-[#7f5539]"
                  >
                    {categories.map((category) => (
                      <option
                        key={category}
                        value={category === "All Categories" ? "all" : category}
                      >
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#7f5539] mb-2">
                    Price Range
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) =>
                        setPriceRange((prev) => ({
                          ...prev,
                          min: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-[#FFD95A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD95A] text-[#7f5539]"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) =>
                        setPriceRange((prev) => ({
                          ...prev,
                          max: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-[#FFD95A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD95A] text-[#7f5539]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#7f5539] mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-[#FFD95A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD95A] text-[#7f5539]"
                  >
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Results Info */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-[#7f5539]/70">
              Showing {filteredProducts.length} of {products.length} products
            </p>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D87C5A]"></div>
            </div>
          ) : (
            <div
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
              }`}
            >
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <div className="text-[#7f5539]/50 mb-4">
                <Search className="w-16 h-16 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  No products found
                </h3>
                <p>Try adjusting your search or filters</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopProductsPage;
