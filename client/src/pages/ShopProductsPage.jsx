import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Filter,
  ShoppingCart,
  Star,
  Eye,
  Grid,
  List,
  SlidersHorizontal,
} from "lucide-react";
import Navbar from "../components/common/Navbar";
import { useCart } from "../context/CartContext";
import CartSidebar from "../components/cart/CartSidebar";
import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";
import axios from "axios";
import ArtworkDetailsModal from "../components/modals/ArtworkDetailsModal";

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

  // New filter states
  const [selectedMediums, setSelectedMediums] = useState([]); // array of strings
  const [sizeQuery, setSizeQuery] = useState(""); // free text includes match

  // Details modal state
  const [showDetails, setShowDetails] = useState(false);
  const [activeArtwork, setActiveArtwork] = useState(null);

  const { addToCart, toggleCart } = useCart();
  const { toast, showToast, hideToast } = useToast();

  // Categories for filtering
  const categories = [
    "All Categories",
    "Paintings",
    "Sculptures",
    "Digital Art",
    "Photography",
    "Drawings",
    "Mixed Media",
    "Prints",
  ];

  useEffect(() => {
    // Fetch artworks from backend
    const fetchArtworks = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
        const response = await axios.get(`${apiUrl}/api/artworks/available`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setProducts(response.data || []);
        setFilteredProducts(response.data || []);
      } catch (err) {
        setProducts([]);
        setFilteredProducts([]);
        // Optionally set an error state here
      } finally {
        setLoading(false);
      }
    };
    fetchArtworks();
  }, []);

  // Derive dynamic filter options from data
  const mediumOptions = useMemo(() => {
    const set = new Set(
      (products || [])
        .map((p) => p.medium)
        .filter((m) => m && String(m).trim().length > 0)
    );
    return Array.from(set).sort();
  }, [products]);

  // Filter and search functionality
  useEffect(() => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((product) => {
        const s = searchTerm.toLowerCase();
        return (
          (product.title && product.title.toLowerCase().includes(s)) ||
          (product.description &&
            product.description.toLowerCase().includes(s)) ||
          (product.artistName && product.artistName.toLowerCase().includes(s))
        );
      });
    }

    // Category filter
    if (selectedCategory !== "all" && selectedCategory !== "All Categories") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Mediums (multi-select)
    if (selectedMediums.length > 0) {
      filtered = filtered.filter((p) => selectedMediums.includes(p.medium));
    }

    // Size query (substring match)
    if (sizeQuery.trim()) {
      const sq = sizeQuery.trim().toLowerCase();
      filtered = filtered.filter((p) =>
        p.size ? String(p.size).toLowerCase().includes(sq) : false
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

    // Sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price-high":
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "newest":
      default:
        filtered.sort((a, b) => (b.artworkId || 0) - (a.artworkId || 0));
        break;
    }

    setFilteredProducts(filtered);
  }, [
    products,
    searchTerm,
    selectedCategory,
    priceRange,
    sortBy,
    selectedMediums,
    sizeQuery,
  ]);

  const handleAddToCart = async (productId, quantity = 1) => {
    const product = products.find(
      (p) => p.id === productId || p.artworkId === productId
    );
    if (!product) {
      showToast("Product not found.", "error");
      return;
    }
    if (product.inStock === false || product.stock === 0) {
      showToast("This product is out of stock.", "error");
      return;
    }
    const token = localStorage.getItem("token");
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
    try {
      await axios.post(
        `${apiUrl}/api/cart/add`,
        {
          artworkId: product.id || product.artworkId,
          quantity,
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      addToCart({ ...product, quantity }); // update local cart
      toggleCart(); // Open cart sidebar
      showToast("Added to cart!", "success");
    } catch (err) {
      showToast(
        "Failed to add to cart. Please check your login and try again.",
        "error"
      );
      console.error("Failed to add to cart", err);
    }
  };

  const handleAddToWishlist = (productId) => {
    console.log(`Adding product ${productId} to wishlist`);
    // Add wishlist logic here
  };

  const openDetails = (artwork) => {
    setActiveArtwork(artwork);
    setShowDetails(true);
  };
  const closeDetails = () => {
    setShowDetails(false);
    // Do not clear immediately to keep unmount smooth
    setTimeout(() => setActiveArtwork(null), 200);
  };

  // Small reusable filter sidebar (also used for mobile panel)
  const FilterSidebar = () => {
    const toggleFromArray = (arr, value, setter) => {
      if (arr.includes(value)) setter(arr.filter((v) => v !== value));
      else setter([...arr, value]);
    };

    const clearAll = () => {
      setSelectedCategory("all");
      setSelectedMediums([]);
      setSizeQuery("");
      setPriceRange({ min: "", max: "" });
    };

    return (
      <div className="bg-white rounded-xl shadow-md border border-[#FFD95A] p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-[#7f5539]">Filters</h3>
          <button
            onClick={clearAll}
            className="text-xs text-[#7f5539]/70 hover:text-[#7f5539] underline"
          >
            Clear all
          </button>
        </div>

        {/* Category */}
        <div className="mb-4">
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

        {/* Mediums */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-[#7f5539]">
              Medium
            </label>
          </div>
          <div className="max-h-32 overflow-auto pr-1 space-y-2">
            {mediumOptions.length === 0 ? (
              <p className="text-xs text-[#7f5539]/50">No medium data</p>
            ) : (
              mediumOptions.map((m) => (
                <label
                  key={m}
                  className="flex items-center gap-2 text-sm text-[#7f5539]"
                >
                  <input
                    type="checkbox"
                    checked={selectedMediums.includes(m)}
                    onChange={() =>
                      toggleFromArray(selectedMediums, m, setSelectedMediums)
                    }
                  />
                  <span>{m}</span>
                </label>
              ))
            )}
          </div>
        </div>

        {/* Size */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-[#7f5539] mb-2">
            Size
          </label>
          <input
            type="text"
            placeholder="e.g. 30x40 cm or Large"
            value={sizeQuery}
            onChange={(e) => setSizeQuery(e.target.value)}
            className="w-full px-3 py-2 border border-[#FFD95A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD95A] text-[#7f5539]"
          />
        </div>

        {/* Price */}
        <div className="mb-2">
          <label className="block text-sm font-medium text-[#7f5539] mb-2">
            Price Range
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={priceRange.min}
              onChange={(e) =>
                setPriceRange((prev) => ({ ...prev, min: e.target.value }))
              }
              step={1000}
              className="w-full px-3 py-2 border border-[#FFD95A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD95A] text-[#7f5539]"
            />
            <input
              type="number"
              placeholder="Max"
              value={priceRange.max}
              onChange={(e) =>
                setPriceRange((prev) => ({ ...prev, max: e.target.value }))
              }
              step={1000}
              className="w-full px-3 py-2 border border-[#FFD95A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD95A] text-[#7f5539]"
            />
          </div>
        </div>
      </div>
    );
  };

  const ProductCard = ({ product }) => (
    <div className="bg-white rounded-xl shadow-md border border-[#FFD95A] overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105">
      <div
        className="relative cursor-pointer"
        onClick={() => openDetails(product)}
      >
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-48 object-cover"
        />
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <img
            src={product.artistAvatarUrl}
            alt={product.artistName}
            className="w-6 h-6 rounded-full"
          />
          <span className="text-xs text-[#7f5539]/70">
            {product.artistName}
          </span>
        </div>

        <h3
          className="font-semibold text-[#7f5539] mb-2 line-clamp-2 cursor-pointer"
          onClick={() => openDetails(product)}
        >
          {product.title}
        </h3>
        <p className="text-sm text-[#7f5539]/70 mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Medium, Size, Year */}
        <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
          <div>
            <span className="text-[#7f5539]/50">Medium:</span>
            <span className="text-[#7f5539] ml-1">
              {product.medium || "N/A"}
            </span>
          </div>
          <div>
            <span className="text-[#7f5539]/50">Size:</span>
            <span className="text-[#7f5539] ml-1">{product.size || "N/A"}</span>
          </div>
          <div>
            <span className="text-[#7f5539]/50">Year:</span>
            <span className="text-[#7f5539] ml-1">{product.year || "N/A"}</span>
          </div>
          <div>
            <span className="text-[#7f5539]/50">Category:</span>
            <span className="text-[#7f5539] ml-1">
              {product.category || "N/A"}
            </span>
          </div>
        </div>

        {/* Tags */}
        {product.tags && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {product.tags
                .split(",")
                .slice(0, 3)
                .map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-[#FFD95A]/30 text-[#7f5539] text-xs rounded-full"
                  >
                    {tag.trim()}
                  </span>
                ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-[#D87C5A]">
              LKR {product.price?.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => handleAddToCart(product.artworkId || product.id)}
            className="flex-1 py-2 px-4 rounded-lg font-medium transition-colors bg-[#D87C5A] hover:bg-[#7f5539] text-white"
          >
            <ShoppingCart className="w-4 h-4 inline mr-2" />
            Add to Cart
          </button>
          <button
            onClick={() => openDetails(product)}
            className="px-4 py-2 rounded-lg border border-[#FFD95A] text-[#7f5539] hover:bg-[#FFD95A]/40"
          >
            View
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFF5E1]">
      <Navbar />
      <CartSidebar />
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
        duration={toast.duration}
      />

      <div className="pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-[#7f5539] mb-2">
              Art Works to Sell
            </h1>
            <p className="text-[#7f5539]/70">
              Discover amazing arts
            </p>
          </div>

          {/* Mobile filter toggle */}
          <div className="mb-4 md:hidden">
            <button
              onClick={() => setShowFilters((s) => !s)}
              className="flex items-center gap-2 px-4 py-2 bg-[#FFD95A] hover:bg-[#D87C5A] text-[#7f5539] rounded-lg transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
          </div>

          {/* Layout with left filter sidebar and right content */}
          <div className="flex gap-6">
            {/* Left Sidebar (hidden on mobile) */}
            <aside className="hidden md:block w-64 shrink-0">
              <div className="sticky top-24">
                <FilterSidebar />
              </div>
            </aside>

            {/* Right Content */}
            <main className="flex-1">
              {/* Mobile filters panel */}
              {showFilters && (
                <div className="md:hidden mb-4">
                  <FilterSidebar />
                </div>
              )}

              {/* Search + Sort + View Mode */}
              <div className="bg-white rounded-xl shadow-md border border-[#FFD95A] p-4 mb-6">
                <div className="flex flex-col lg:flex-row gap-4 items-center">
                  {/* Search */}
                  <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7f5539]/50 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search products, shops, or categories..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-[#FFD95A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD95A] text-[#7f5539]"
                    />
                  </div>

                  {/* Sort By */}
                  <div className="w-full lg:w-auto">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full lg:w-56 px-3 py-2 border border-[#FFD95A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD95A] text-[#7f5539]"
                    >
                      <option value="newest">Newest</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                    </select>
                  </div>

                  {/* View Mode */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-lg ${
                        viewMode === "grid"
                          ? "bg[#D87C5A] bg-[#D87C5A] text-white"
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
              </div>

              {/* Results Info */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-[#7f5539]/70">
                  Showing {filteredProducts.length} of {products.length}{" "}
                  products
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
                      ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"
                      : "grid-cols-1"
                  }`}
                >
                  {filteredProducts.map((product, index) => (
                    <ProductCard
                      key={product.artworkId || index}
                      product={product}
                    />
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
            </main>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      <ArtworkDetailsModal
        isOpen={showDetails}
        onClose={closeDetails}
        artwork={activeArtwork}
        onAddToCart={(id, qty) => handleAddToCart(id, qty)}
      />
    </div>
  );
};

export default ShopProductsPage;
