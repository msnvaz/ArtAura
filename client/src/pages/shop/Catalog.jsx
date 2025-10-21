import React, { useState, useEffect } from 'react';

import Navbar from '../../components/Navbar'; // Changed import
import Toast from '../../components/Toast';
import { useToast } from '../../hooks/useToast';

import {
  Search,
  Plus,
  Filter,
  Edit3,
  Trash2,
  Eye,
  Package,
  AlertTriangle,
  CheckCircle,
  X,
  Upload,
  Camera
} from 'lucide-react';

const CatalogManagement = () => {
  const { toast, showToast, hideToast } = useToast();

  // Get API URL from environment variable
  const API_URL = import.meta.env.VITE_API_URL;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageModalType, setImageModalType] = useState('add');
  const [productToDelete, setProductToDelete] = useState(null);
  const [productToEdit, setProductToEdit] = useState(null);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const categories = ['all', 'Paints', 'Canvas', 'Brushes', 'Equipment', 'Drawing'];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'in-stock':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#E8F5E8] text-[#2D5016] border border-[#4ADE80]">
            <CheckCircle className="w-3 h-3 mr-1" />
            In Stock
          </span>
        );
      case 'low-stock':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#FFE4D6] text-[#5D3A00] border border-[#D87C5A]">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Low Stock
          </span>
        );
      case 'out-of-stock':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-300">
            <Package className="w-3 h-3 mr-1" />
            Out of Stock
          </span>
        );
      default:
        return null;
    }
  };

  const [newProduct, setNewProduct] = useState({
    name: '',
    sku: '',
    category: 'Paints',
    price: '',
    stock: '',
    status: 'in-stock',
    image: '/src/assets/catalog.jpeg'
  });

  const getStatus = (stock) => {
    if (stock === 0) return 'out-of-stock';
    if (stock <= 10) return 'low-stock';
    return 'in-stock';
  };

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

  // Image upload functions
  const openImageModal = (type) => {
    setImageModalType(type);
    setShowImageModal(true);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showToast("❌ Please select a valid image file", "error", 3000);
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast("❌ Image size must be less than 5MB", "error", 3000);
      return;
    }

    try {
      setUploadingImage(true);
      showToast("⏳ Uploading image...", "info", 2000);

      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/upload/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        showToast(`❌ ${error.error || "Failed to upload image"}`, "error", 3000);
        return;
      }

      const data = await response.json();
      console.log('📸 Upload response:', data);
      
      // Use relative path for database storage (works on any computer)
      const imagePath = data.imageUrl;
      console.log('💾 Image path to save:', imagePath);

      if (imageModalType === 'add') {
        setNewProduct(prev => {
          const updated = { ...prev, image: imagePath };
          console.log('📝 Updated newProduct:', updated);
          return updated;
        });
      } else if (imageModalType === 'edit') {
        setProductToEdit(prev => {
          const updated = { ...prev, image: imagePath };
          console.log('✏️ Updated productToEdit:', updated);
          return updated;
        });
      }

      setShowImageModal(false);
      showToast("✅ Image uploaded successfully!", "success", 2000);

    } catch (error) {
      console.error('Error uploading image:', error);
      showToast("❌ Failed to upload image. Please try again.", "error", 3000);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageUrl = (url) => {
    // Support both local paths and full URLs
    const imageUrl = url.startsWith('http') ? url : url;
    
    if (imageModalType === 'add') {
      setNewProduct(prev => ({ ...prev, image: imageUrl }));
    } else if (imageModalType === 'edit') {
      setProductToEdit(prev => ({ ...prev, image: imageUrl }));
    }
    setShowImageModal(false);
    showToast("✅ Image URL added successfully!", "success", 2000);
  };

  // Fetch products from backend
  const fetchProducts = async (showSuccessMessage = false) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const shopId = localStorage.getItem("shopId");

      if (!shopId) {
        throw new Error("Shop ID not found. Please log in again.");
      }

      const response = await fetch(`${API_URL}/api/products?shopId=${shopId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      setProducts(data);
      setError(null);

      // Show success message only when manually refreshing
      if (showSuccessMessage && data.length > 0) {
        showToast("📦 Products refreshed successfully!", "success", 2000);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products");
      showToast("❌ Failed to load products. Please try again.", "error", 4000);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products on component mount (without success message)
  useEffect(() => {
    fetchProducts(false);
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    console.log('🚀 handleAddProduct called');
    console.log('📸 Current newProduct state:', newProduct);

    const token = localStorage.getItem("token");
    const shopId = localStorage.getItem("shopId");

    if (!token) {
      showToast("❌ You must be logged in to add a product.", "error", 3000);
      return;
    }

    if (!shopId) {
      showToast("❌ Shop ID not found. Please log in again.", "error", 3000);
      return;
    }

    // Validation checks
    if (!newProduct.name.trim()) {
      showToast("❌ Product name is required", "error", 3000);
      return;
    }

    if (newProduct.name.trim().length < 3) {
      showToast("❌ Product name must be at least 3 characters", "error", 3000);
      return;
    }

    if (newProduct.name.trim().length > 100) {
      showToast("❌ Product name must not exceed 100 characters", "error", 3000);
      return;
    }

    if (!newProduct.sku.trim()) {
      showToast("❌ SKU is required", "error", 3000);
      return;
    }

    if (newProduct.sku.trim().length < 2) {
      showToast("❌ SKU must be at least 2 characters", "error", 3000);
      return;
    }

    // Check for duplicate SKU
    const duplicateSku = products.find(p => p.sku.toLowerCase() === newProduct.sku.trim().toLowerCase());
    if (duplicateSku) {
      showToast("❌ A product with this SKU already exists", "error", 3000);
      return;
    }

    if (!newProduct.category || newProduct.category === 'all') {
      showToast("❌ Please select a valid category", "error", 3000);
      return;
    }

    if (!newProduct.price || parseFloat(newProduct.price) <= 0) {
      showToast("❌ Price must be greater than 0", "error", 3000);
      return;
    }

    if (parseFloat(newProduct.price) > 1000000) {
      showToast("❌ Price cannot exceed Rs. 1,000,000", "error", 3000);
      return;
    }

    if (!newProduct.stock || parseInt(newProduct.stock) < 0) {
      showToast("❌ Stock must be 0 or greater", "error", 3000);
      return;
    }

    if (parseInt(newProduct.stock) > 100000) {
      showToast("❌ Stock cannot exceed 100,000 units", "error", 3000);
      return;
    }

    // Validate image path
    if (!newProduct.image || newProduct.image === '/src/assets/catalog.jpeg') {
      console.warn('⚠️ No custom image uploaded, using default');
    }

    try {
      const productData = {
        shopId: parseInt(shopId),
        name: newProduct.name,
        sku: newProduct.sku,
        category: newProduct.category,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
        status: getStatus(parseInt(newProduct.stock)),
        image: newProduct.image || '/src/assets/catalog.jpeg',
        rating: 0.0,
        sales: 0
      };

      console.log('📦 Product data to send:', productData);
      console.log('🖼️ Image path being sent:', productData.image);

      const response = await fetch(`${API_URL}/api/products/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        const error = await response.json();
        console.error('❌ Error response:', error);
        showToast(`❌ ${error.message || "Failed to add product"}`, "error", 2000);
        return;
      }

      const result = await response.text();
      console.log('✅ Success response:', result);
      showToast(`✨ Product "${newProduct.name}" created successfully!`, "create", 2500);

      // Reset form and close modal
      setNewProduct({
        name: "",
        sku: "",
        category: "Paints",
        price: "",
        stock: "",
        status: "in-stock",
        image: "/src/assets/catalog.jpeg"
      });

      setShowAddModal(false);
      fetchProducts();
    } catch (err) {
      console.error("Error while adding product:", err);
      showToast("❌ Server error. Please try again later.", "error", 4000);
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const shopId = localStorage.getItem("shopId");

    if (!token) {
      showToast("❌ You must be logged in to edit a product.", "error", 3000);
      return;
    }

    if (!shopId) {
      showToast("❌ Shop ID not found. Please log in again.", "error", 3000);
      return;
    }

    // Validation checks
    if (!productToEdit.name.trim()) {
      showToast("❌ Product name is required", "error", 3000);
      return;
    }

    if (productToEdit.name.trim().length < 3) {
      showToast("❌ Product name must be at least 3 characters", "error", 3000);
      return;
    }

    if (productToEdit.name.trim().length > 100) {
      showToast("❌ Product name must not exceed 100 characters", "error", 3000);
      return;
    }

    if (!productToEdit.sku.trim()) {
      showToast("❌ SKU is required", "error", 3000);
      return;
    }

    if (productToEdit.sku.trim().length < 2) {
      showToast("❌ SKU must be at least 2 characters", "error", 3000);
      return;
    }

    // Check for duplicate SKU (excluding current product)
    const duplicateSku = products.find(p => 
      p.sku.toLowerCase() === productToEdit.sku.trim().toLowerCase() && p.id !== productToEdit.id
    );
    if (duplicateSku) {
      showToast("❌ A product with this SKU already exists", "error", 3000);
      return;
    }

    if (!productToEdit.category || productToEdit.category === 'all') {
      showToast("❌ Please select a valid category", "error", 3000);
      return;
    }

    if (!productToEdit.price || parseFloat(productToEdit.price) <= 0) {
      showToast("❌ Price must be greater than 0", "error", 3000);
      return;
    }

    if (parseFloat(productToEdit.price) > 1000000) {
      showToast("❌ Price cannot exceed Rs. 1,000,000", "error", 3000);
      return;
    }

    if (!productToEdit.stock || parseInt(productToEdit.stock) < 0) {
      showToast("❌ Stock must be 0 or greater", "error", 3000);
      return;
    }

    if (parseInt(productToEdit.stock) > 100000) {
      showToast("❌ Stock cannot exceed 100,000 units", "error", 3000);
      return;
    }

    if (productToEdit.sales && parseInt(productToEdit.sales) < 0) {
      showToast("❌ Sales cannot be negative", "error", 3000);
      return;
    }

    try {
      const productData = {
        shopId: parseInt(shopId),
        name: productToEdit.name,
        sku: productToEdit.sku,
        category: productToEdit.category,
        price: parseFloat(productToEdit.price),
        stock: parseInt(productToEdit.stock),
        status: getStatus(parseInt(productToEdit.stock)),
        image: productToEdit.image,
        rating: parseFloat(productToEdit.rating) || 0.0,
        sales: parseInt(productToEdit.sales) || 0
      };

      const response = await fetch(`${API_URL}/api/products/update/${productToEdit.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const error = await response.json();
        showToast(`❌ ${error.message || "Failed to update product"}`, "error", 2000);
        return;
      }

      showToast(`🔄 Product "${productToEdit.name}" updated successfully!`, "update", 2500);

      setShowEditModal(false);
      setProductToEdit(null);
      fetchProducts();
    } catch (err) {
      console.error("Error while updating product:", err);
      showToast("❌ Server error. Please try again later.", "error", 4000);
    }
  };

  const handleDeleteProduct = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      showToast("❌ You must be logged in to delete a product.", "error", 3000);
      return;
    }

    try {
      const productName = productToDelete.name;

      const response = await fetch(`${API_URL}/api/products/delete/${productToDelete.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // Handle both JSON and plain text error responses
        const contentType = response.headers.get("content-type");
        let errorMessage = "Failed to delete product";
        
        try {
          if (contentType && contentType.includes("application/json")) {
            const error = await response.json();
            errorMessage = error.message || errorMessage;
          } else {
            // Backend returns plain text for RuntimeException
            const errorText = await response.text();
            errorMessage = errorText || errorMessage;
          }
        } catch (parseError) {
          console.error("Error parsing error response:", parseError);
          // If parsing fails completely, use default message
        }
        
        showToast(`❌ ${errorMessage}`, "error", 3000);
        return;
      }

      showToast(`🗑️ Product "${productName}" deleted successfully!`, "delete", 2500);

      setShowDeleteModal(false);
      setProductToDelete(null);
      fetchProducts();
    } catch (err) {
      console.error("Error while deleting product:", err);
      showToast("❌ Server error. Please try again later.", "error", 4000);
    }
  };

  const openEditModal = (product) => {
    setProductToEdit({ ...product });
    setShowEditModal(true);
  };

  const openDeleteModal = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (

    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Toast Notification - Auto closes, no manual close button */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
        duration={toast.duration}
      />

      {/* Main Content Container */}
      <div className="pt-4 px-0 sm:px-1 lg:px-2 max-w-full mx-0">
        {/* Header Section */}
        <div className="mb-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-3">
            {/* Search and Filter Section */}
            <div className="flex items-center gap-3 w-full max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#D87C5A] w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-[#FFE4D6] hover:border-[#D87C5A] focus:border-[#D87C5A] focus:ring-0 outline-none rounded-lg text-sm"
                />
              </div>

              {/* Category Filter */}
              <div className="relative w-36">
                <Filter className="absolute left-2 top-1/2 -translate-y-1/2 text-[#D87C5A] w-4 h-4 pointer-events-none" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-8 pr-2 py-2 border border-[#FFE4D6] hover:border-[#D87C5A] focus:border-[#D87C5A] focus:ring-0 outline-none rounded-lg text-sm appearance-none"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Refresh Button */}
              <button
                onClick={() => fetchProducts(true)} // Show success message when manually refreshing
                className="bg-white border border-[#FFE4D6] text-[#5D3A00] px-4 py-3 rounded-xl font-semibold hover:bg-[#FFF5E1] hover:border-[#D87C5A] transition-all duration-300 flex items-center gap-2"
              >
                <Package className="w-4 h-4" />
                Refresh
              </button>

              {/* Add Product Button */}
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-gradient-to-r from-[#D87C5A] to-[#5D3A00] text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <Plus className="w-4 h-4 inline mr-2" />
                Add Product
              </button>
            </div>
          </div>
        </div>

        {/* Loading state */}
        {loading && (

          <div className="bg-white rounded-2xl shadow-xl p-6 border border-[#FFE4D6] text-center animate-fade-in">

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#FFE4D6] rounded-full flex items-center justify-center mb-4 animate-pulse">
                <Package className="w-8 h-8 text-[#D87C5A]" />
              </div>
              <h3 className="text-xl font-bold text-[#5D3A00] mb-2">Loading products...</h3>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (

          <div className="bg-white rounded-2xl shadow-xl p-6 border border-red-200 text-center animate-fade-in">

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Package className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-red-600 mb-2">Error Loading Products</h3>
              <p className="text-red-500 text-sm mb-4">{error}</p>
              <button
                onClick={fetchProducts}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && (

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mb-4">

            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-lg border border-[#FFE4D6] overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 group animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'both' }}
              >
                <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                  <img
                    src={getImageUrl(product.image)}
                    alt={product.name}
                    className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2">
                    {getStatusBadge(product.status)}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                <div className="p-3">
                  <h3 className="font-bold text-[#5D3A00] text-base mb-1 line-clamp-2 group-hover:text-[#D87C5A] transition-colors duration-300">
                    {product.name}
                  </h3>
                  <div className="text-xs text-[#5D3A00]/70 space-y-0.5">
                    <p className="font-mono bg-[#FFF5E1] px-1.5 py-0.5 rounded inline-block">SKU: {product.sku}</p>
                    <p>Category: <span className="font-semibold">{product.category}</span></p>
                    <p>{product.sales} sold</p>
                  </div>

                  <div className="flex items-center justify-between mt-3 mb-2">
                    <span className="text-lg font-bold text-[#D87C5A]">
                      Rs.{product.price}
                    </span>
                    <span className="text-xs text-[#5D3A00]/70 bg-[#FFE4D6] px-2 py-0.5 rounded-full font-semibold">
                      Stock: {product.stock}
                    </span>
                  </div>

                  <div className="flex justify-start items-center gap-2 mt-3">
                    <button
                      onClick={() => setSelectedProduct(product)}

                      className="w-fit bg-[#D87C5A] text-white py-1.5 px-2 rounded-lg hover:bg-[#c06949] text-xs font-semibold shadow hover:shadow-md transition-all duration-300 flex items-center space-x-1"
                    >

                      <Eye className="w-3 h-3" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => openEditModal(product)}

                      className="w-fit bg-[#FFF5E1] text-[#5D3A00] py-1.5 px-2 rounded-lg hover:bg-[#FFE4D6] text-xs font-semibold shadow hover:shadow-md transition-all duration-300 flex items-center space-x-1"
                    >

                      <Edit3 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => openDeleteModal(product)}

                      className="w-fit bg-red-100 text-red-600 py-1.5 px-2 rounded-lg hover:bg-red-200 text-xs font-semibold shadow hover:shadow-md transition-all duration-300 flex items-center space-x-1"
                    >

                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No products found */}
        {!loading && !error && filteredProducts.length === 0 && (

          <div className="bg-white rounded-2xl shadow-xl p-6 border border-[#FFE4D6] text-center animate-fade-in">

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#FFE4D6] rounded-full flex items-center justify-center mb-4">
                <Package className="w-8 h-8 text-[#D87C5A]" />
              </div>
              <h3 className="text-xl font-bold text-[#5D3A00] mb-2">No products found</h3>
              <p className="text-[#5D3A00]/70 text-sm">Try adjusting your search terms or filters</p>
            </div>
          </div>
        )}

        {/* Product Details Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-[#FFE4D6] p-6">
                <h2 className="text-2xl font-bold text-[#5D3A00]">Product Details</h2>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="text-[#5D3A00] hover:text-[#D87C5A] transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <img
                      src={getImageUrl(selectedProduct.image)}
                      alt={selectedProduct.name}
                      className="w-full md:w-48 h-48 object-cover rounded-xl border border-[#FFE4D6]"
                    />
                  </div>

                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-[#5D3A00] mb-2">{selectedProduct.name}</h3>
                      <div className="mb-3">{getStatusBadge(selectedProduct.status)}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-[#5D3A00]/70 font-semibold">SKU</p>
                        <p className="text-[#5D3A00] font-mono bg-[#FFF5E1] px-2 py-1 rounded">{selectedProduct.sku}</p>
                      </div>
                      <div>
                        <p className="text-[#5D3A00]/70 font-semibold">Category</p>
                        <p className="text-[#5D3A00]">{selectedProduct.category}</p>
                      </div>
                      <div>
                        <p className="text-[#5D3A00]/70 font-semibold">Price</p>
                        <p className="text-[#D87C5A] font-bold text-lg">Rs. {selectedProduct.price}</p>
                      </div>
                      <div>
                        <p className="text-[#5D3A00]/70 font-semibold">Stock</p>
                        <p className="text-[#5D3A00]">{selectedProduct.stock} units</p>
                      </div>
                      <div>
                        <p className="text-[#5D3A00]/70 font-semibold">Sales</p>
                        <p className="text-[#5D3A00]">{selectedProduct.sales} sold</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Product Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-[#FFE4D6] p-6">
                <h2 className="text-2xl font-bold text-[#5D3A00]">Add New Product</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-[#5D3A00] hover:text-[#D87C5A] transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleAddProduct} className="p-6 space-y-4">
                {/* Product Image Section */}
                <div>
                  <label className="block text-sm font-semibold text-[#5D3A00] mb-2">Product Image</label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 border-2 border-dashed border-[#FFE4D6] rounded-lg flex items-center justify-center overflow-hidden">
                      {newProduct.image ? (
                        <img
                          src={getImageUrl(newProduct.image)}
                          alt="Product preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Camera className="w-8 h-8 text-[#D87C5A]" />
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => openImageModal('add')}
                      className="bg-[#FFE4D6] text-[#5D3A00] px-4 py-2 rounded-lg hover:bg-[#D87C5A] hover:text-white transition-colors flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Add Image
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#5D3A00] mb-2">Product Name</label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full border border-[#FFE4D6] px-3 py-2 rounded-lg focus:border-[#D87C5A] focus:ring-0 outline-none"
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#5D3A00] mb-2">SKU</label>
                  <input
                    type="text"
                    value={newProduct.sku}
                    onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                    className="w-full border border-[#FFE4D6] px-3 py-2 rounded-lg focus:border-[#D87C5A] focus:ring-0 outline-none"
                    placeholder="Enter SKU"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#5D3A00] mb-2">Category</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full border border-[#FFE4D6] px-3 py-2 rounded-lg focus:border-[#D87C5A] focus:ring-0 outline-none"
                  >
                    {categories.filter(cat => cat !== 'all').map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#5D3A00] mb-2">Price</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      className="w-full border border-[#FFE4D6] px-3 py-2 rounded-lg focus:border-[#D87C5A] focus:ring-0 outline-none"
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#5D3A00] mb-2">Stock</label>
                    <input
                      type="number"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                      className="w-full border border-[#FFE4D6] px-3 py-2 rounded-lg focus:border-[#D87C5A] focus:ring-0 outline-none"
                      placeholder="0"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 border border-[#FFE4D6] text-[#5D3A00] px-4 py-2 rounded-lg hover:bg-[#FFF5E1] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-[#D87C5A] to-[#5D3A00] text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
                  >
                    Add Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Product Modal */}
        {showEditModal && productToEdit && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-[#FFE4D6] p-6">
                <h2 className="text-2xl font-bold text-[#5D3A00]">Edit Product</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-[#5D3A00] hover:text-[#D87C5A] transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleEditProduct} className="p-6 space-y-4">
                {/* Product Image Section */}
                <div>
                  <label className="block text-sm font-semibold text-[#5D3A00] mb-2">Product Image</label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 border-2 border-dashed border-[#FFE4D6] rounded-lg flex items-center justify-center overflow-hidden">
                      {productToEdit.image ? (
                        <img
                          src={getImageUrl(productToEdit.image)}
                          alt="Product preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Camera className="w-8 h-8 text-[#D87C5A]" />
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => openImageModal('edit')}
                      className="bg-[#FFE4D6] text-[#5D3A00] px-4 py-2 rounded-lg hover:bg-[#D87C5A] hover:text-white transition-colors flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Change Image
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#5D3A00] mb-2">Product Name</label>
                  <input
                    type="text"
                    value={productToEdit.name}
                    onChange={(e) => setProductToEdit({ ...productToEdit, name: e.target.value })}
                    className="w-full border border-[#FFE4D6] px-3 py-2 rounded-lg focus:border-[#D87C5A] focus:ring-0 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#5D3A00] mb-2">SKU</label>
                  <input
                    type="text"
                    value={productToEdit.sku}
                    onChange={(e) => setProductToEdit({ ...productToEdit, sku: e.target.value })}
                    className="w-full border border-[#FFE4D6] px-3 py-2 rounded-lg focus:border-[#D87C5A] focus:ring-0 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#5D3A00] mb-2">Category</label>
                  <select
                    value={productToEdit.category}
                    onChange={(e) => setProductToEdit({ ...productToEdit, category: e.target.value })}
                    className="w-full border border-[#FFE4D6] px-3 py-2 rounded-lg focus:border-[#D87C5A] focus:ring-0 outline-none"
                  >
                    {categories.filter(cat => cat !== 'all').map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#5D3A00] mb-2">Price</label>
                    <input
                      type="number"
                      step="0.01"
                      value={productToEdit.price}
                      onChange={(e) => setProductToEdit({ ...productToEdit, price: e.target.value })}
                      className="w-full border border-[#FFE4D6] px-3 py-2 rounded-lg focus:border-[#D87C5A] focus:ring-0 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#5D3A00] mb-2">Stock</label>
                    <input
                      type="number"
                      value={productToEdit.stock}
                      onChange={(e) => setProductToEdit({ ...productToEdit, stock: e.target.value })}
                      className="w-full border border-[#FFE4D6] px-3 py-2 rounded-lg focus:border-[#D87C5A] focus:ring-0 outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#5D3A00] mb-2">Sales</label>
                  <input
                    type="number"
                    value={productToEdit.sales}
                    onChange={(e) => setProductToEdit({ ...productToEdit, sales: e.target.value })}
                    className="w-full border border-[#FFE4D6] px-3 py-2 rounded-lg focus:border-[#D87C5A] focus:ring-0 outline-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 border border-[#FFE4D6] text-[#5D3A00] px-4 py-2 rounded-lg hover:bg-[#FFF5E1] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-[#D87C5A] to-[#5D3A00] text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
                  >
                    Update Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Image Upload Modal */}
        {showImageModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
              <div className="flex justify-between items-center border-b border-[#FFE4D6] p-6">
                <h2 className="text-2xl font-bold text-[#5D3A00]">Add Product Image</h2>
                <button
                  onClick={() => setShowImageModal(false)}
                  className="text-[#5D3A00] hover:text-[#D87C5A] transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Upload from Device */}
                <div>
                  <h3 className="text-lg font-semibold text-[#5D3A00] mb-3">Upload from Device</h3>
                  <label className="block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                    <div className={`border-2 border-dashed border-[#FFE4D6] rounded-lg p-8 text-center transition-colors cursor-pointer ${
                      uploadingImage ? 'opacity-50 cursor-not-allowed' : 'hover:border-[#D87C5A]'
                    }`}>
                      <Upload className={`w-12 h-12 text-[#D87C5A] mx-auto mb-4 ${uploadingImage ? 'animate-pulse' : ''}`} />
                      <p className="text-[#5D3A00] font-medium">
                        {uploadingImage ? 'Uploading...' : 'Click to upload an image'}
                      </p>
                      <p className="text-sm text-[#5D3A00]/70 mt-1">PNG, JPG, GIF supported (Max 5MB)</p>
                    </div>
                  </label>
                </div>

                {/* URL Input */}
                <div>
                  <h3 className="text-lg font-semibold text-[#5D3A00] mb-3">Or Enter Image URL</h3>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      className="flex-1 border border-[#FFE4D6] px-3 py-2 rounded-lg focus:border-[#D87C5A] focus:ring-0 outline-none"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleImageUrl(e.target.value);
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        const input = e.target.previousElementSibling;
                        handleImageUrl(input.value);
                      }}
                      className="bg-[#D87C5A] text-white px-4 py-2 rounded-lg hover:bg-[#c06949] transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Default Images */}
                <div>
                  <h3 className="text-lg font-semibold text-[#5D3A00] mb-3">Choose Default Image</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {/*
                      Add your default image paths here
                    */}
                    {['/src/assets/catalog.jpeg', '/src/assets/catalog2.jpeg', '/src/assets/catalog3.png', '/src/assets/catalog4.jpg', '/src/assets/catalog5.jpg', '/src/assets/catalog6.jpeg'].map((imagePath, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleImageUrl(imagePath)}
                        className="aspect-square border-2 border-[#FFE4D6] rounded-lg overflow-hidden hover:border-[#D87C5A] transition-colors"
                      >
                        <img
                          src={imagePath}
                          alt={`Default ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowImageModal(false)}
                    className="flex-1 border border-[#FFE4D6] text-[#5D3A00] px-4 py-2 rounded-lg hover:bg-[#FFF5E1] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && productToDelete && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-red-600" />
                </div>

                <h2 className="text-2xl font-bold text-[#5D3A00] mb-2">Delete Product</h2>
                <p className="text-[#5D3A00]/70 mb-6">
                  Are you sure you want to delete "<span className="font-semibold">{productToDelete.name}</span>"? This action cannot be undone.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 border border-[#FFE4D6] text-[#5D3A00] px-4 py-2 rounded-lg hover:bg-[#FFF5E1] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteProduct}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <style>{`
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `}</style>
      </div>
    </div>
  );
};

export default CatalogManagement;