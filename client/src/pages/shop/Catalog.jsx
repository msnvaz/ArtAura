import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';

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
  Star,
  X
} from 'lucide-react';

const CatalogManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [productToEdit, setProductToEdit] = useState(null);

  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Camel Watercolor Paint Set - Professional 24 Colors',
      category: 'Watercolor Paints',
      price: 2850.00,
      stock: 45,
      status: 'in-stock',
      image: '/src/assets/catalog.jpeg',
      sku: 'CWP-2024-001',
      rating: 4.8,
      sales: 156
    },
    {
      id: 2,
      name: 'Canvas Stretched A3 Pack of 6 - Sri Lankan Made',
      category: 'Canvas & Surfaces',
      price: 1250.00,
      stock: 8,
      status: 'low-stock',
      image: '/src/assets/catalog2.jpeg',
      sku: 'CNV-A3-006',
      rating: 4.6,
      sales: 89
    },
    {
      id: 3,
      name: 'Fevicryl Acrylic Paint Tubes Set - 12 Colors',
      category: 'Acrylic Paints',
      price: 1890.00,
      stock: 0,
      status: 'out-of-stock',
      image: '/src/assets/catalog3.png',
      sku: 'FEV-ACR-012',
      rating: 4.9,
      sales: 234
    },
    {
      id: 4,
      name: 'Synthetic Hair Brush Set - Professional Grade',
      category: 'Brushes',
      price: 3200.00,
      stock: 23,
      status: 'in-stock',
      image: '/src/assets/catalog4.jpg',
      sku: 'SYN-BRS-PRO',
      rating: 4.7,
      sales: 178
    },
    {
      id: 5,
      name: 'Table Easel Wooden - Adjustable Height',
      category: 'Easels & Equipment',
      price: 4850.00,
      stock: 12,
      status: 'in-stock',
      image: '/src/assets/catalog5.jpg',
      sku: 'WD-ESL-TAB',
      rating: 4.5,
      sales: 67
    },
    {
      id: 6,
      name: 'Charcoal Drawing Set with Blending Tools',
      category: 'Drawing Supplies',
      price: 750.00,
      stock: 67,
      status: 'in-stock',
      image: '/src/assets/catalog6.jpeg',
      sku: 'CHR-SET-BLD',
      rating: 4.4,
      sales: 123
    },
   
  ]);

  const categories = [
    'all', 
    'Watercolor Paints', 
    'Acrylic Paints', 
    'Oil Paints',
    'Canvas & Surfaces', 
    'Brushes', 
    'Easels & Equipment', 
    'Drawing Supplies',
    'Pens & Markers',
    'Papers',
    'Pastels',
    'Calligraphy',
    'Tools & Accessories'
  ];

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
    category: 'Watercolor Paints',
    price: '',
    stock: '',
    rating: 4.0,
    sales: 0
  });

  const getStatus = (stock) => {
    if (stock === 0) return 'out-of-stock';
    if (stock <= 10) return 'low-stock';
    return 'in-stock';
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    const product = {
      id: products.length + 1,
      ...newProduct,
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock),
      status: getStatus(parseInt(newProduct.stock)),
      image: '/src/assets/catalog.jpeg' // Default image
    };
    setProducts([...products, product]);
    setNewProduct({ name: '', category: 'Watercolor Paints', price: '', stock: '', sku: '', rating: 4.0, sales: 0 });
    setShowAddModal(false);
  };

   const handleEditProduct = (e) => {
    e.preventDefault();
    const updatedProducts = products.map(p => 
      p.id === productToEdit.id 
        ? { ...productToEdit, status: getStatus(productToEdit.stock) }
        : p
    );
    setProducts(updatedProducts);
    setShowEditModal(false);
    setProductToEdit(null);
  };

  const handleDeleteProduct = () => {
    setProducts(products.filter(p => p.id !== productToDelete.id));
    setShowDeleteModal(false);
    setProductToDelete(null);
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
    <div className="flex">
      <Sidebar />
    <div className="ml-20 md:ml-64 flex-1 space-y-6 bg-white min-h-screen p-6 animate-fade-in">
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
      <div className="flex items-center gap-3 w-full max-w-md">
      <div className="relative flex-1 ">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#D87C5A] w-4 h-4" />
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-[#FFE4D6] hover:border-[#D87C5A] focus:border-[#D87C5A]  focus:ring-0 outline-none   rounded-lg text-sm"
        />
      </div>

      {/* Category Filter */}
      <div className="relative w-36">
         <Filter className="absolute left-2 top-1/2 -translate-y-1/2 text-[#D87C5A] w-4 h-4 pointer-events-none" />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full pl-8 pr-2 py-2 border border-[#FFE4D6]  hover:border-[#D87C5A] focus:border-[#D87C5A] focus:ring-0 outline-none   rounded-lg text-sm appearance-none"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category === 'all' ? 'All Categories' : category}
            </option>
          ))}
        </select>
      </div>
      </div>

       {/* Add Product Button */}
      <button 
        onClick={() => setShowAddModal(true)}
        className="bg-gradient-to-r from-[#D87C5A] to-[#5D3A00] text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
        <Plus className="w-4 h-4 inline mr-2" />
        Add Product
      </button>
    </div>

      

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <div 
              key={product.id} 
              className="bg-white rounded-xl shadow-lg border border-[#FFE4D6] overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 group animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'both' }}
            >
              <div className="relative h-36 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
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
                <div className="flex items-center space-x-1 mb-1">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-[#FFD95A] fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-xs text-[#5D3A00]/70 font-medium">({product.rating})</span>
                </div>
                <div className="text-xs text-[#5D3A00]/70 space-y-0.5">
                  <p className="font-mono bg-[#FFF5E1] px-1.5 py-0.5 rounded inline-block">SKU: {product.sku}</p>
                  <p>Category: <span className="font-semibold">{product.category}</span></p>
                  <p>{product.sales} sold</p>
                </div>

                <div className="flex items-center justify-between mt-3 mb-2">
                  <span className="text-lg font-bold text-[#D87C5A]">
                    Rs. {product.price.toLocaleString()}
                  </span>
                  <span className="text-xs text-[#5D3A00]/70 bg-[#FFE4D6] px-2 py-0.5 rounded-full font-semibold">
                    Stock: {product.stock}
                  </span>
                </div>

                <div className="flex justify-start items-center gap-2 mt-3">
                  <button 
                    onClick={() => setSelectedProduct(product)} 
                    className="w-fit bg-[#D87C5A] text-white py-1.5 px-2 rounded-lg hover:bg-[#c06949] text-xs font-semibold shadow hover:shadow-md transition-all duration-300 flex items-center space-x-1">
                    <Eye className="w-3 h-3" />
                    <span>View</span>
                  </button>
                  <button 
                    onClick={() => openEditModal(product)}
                    className="w-fit bg-[#FFF5E1] text-[#5D3A00] py-1.5 px-2 rounded-lg hover:bg-[#FFE4D6] text-xs font-semibold shadow hover:shadow-md transition-all duration-300 flex items-center space-x-1">
                    <Edit3 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                  <button 
                    onClick={() => openDeleteModal(product)}
                    className="w-fit bg-red-100 text-red-600 py-1.5 px-2 rounded-lg hover:bg-red-200 text-xs font-semibold shadow hover:shadow-md transition-all duration-300 flex items-center space-x-1">
                    <Trash2 className="w-4 h-4" />       
                  </button>
                </div>
              </div>
            </div> 
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-12 border border-[#FFE4D6] text-center animate-fade-in">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#FFE4D6] rounded-full flex items-center justify-center mb-4">
                <Package className="w-8 h-8 text-[#D87C5A]" />
              </div>
              <h3 className="text-xl font-bold text-[#5D3A00] mb-2">No art supplies found</h3>
              <p className="text-[#5D3A00]/70 text-sm">Try adjusting your search terms or filters</p>
            </div>
          </div>
        )}

        
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
                      src={selectedProduct.image} 
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
                        <p className="text-[#D87C5A] font-bold text-lg">Rs. {selectedProduct.price.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[#5D3A00]/70 font-semibold">Stock</p>
                        <p className="text-[#5D3A00]">{selectedProduct.stock} units</p>
                      </div>
                      <div>
                        <p className="text-[#5D3A00]/70 font-semibold">Rating</p>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-[#FFD95A] fill-current" />
                          <span className="text-[#5D3A00]">{selectedProduct.rating}</span>
                        </div>
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
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
              <div className="flex justify-between items-center border-b border-[#FFE4D6] p-6">
                <h2 className="text-2xl font-bold text-[#5D3A00]">Add New Art Supply</h2>
                <button 
                  onClick={() => setShowAddModal(false)} 
                  className="text-[#5D3A00] hover:text-[#D87C5A] transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleAddProduct} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#5D3A00] mb-2">Product Name</label>
                  <input 
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full border border-[#FFE4D6] px-3 py-2 rounded-lg focus:border-[#D87C5A] focus:ring-0 outline-none"
                    placeholder="Enter art supply name"
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
                    placeholder="Enter SKU code"
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
                    <label className="block text-sm font-semibold text-[#5D3A00] mb-2">Price (LKR)</label>
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
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
              <div className="flex justify-between items-center border-b border-[#FFE4D6] p-6">
                <h2 className="text-2xl font-bold text-[#5D3A00]">Edit Art Supply</h2>
                <button 
                  onClick={() => setShowEditModal(false)} 
                  className="text-[#5D3A00] hover:text-[#D87C5A] transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleEditProduct} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#5D3A00] mb-2">Product Name</label>
                  <input 
                    type="text"
                    value={productToEdit.name}
                    onChange={(e) => setProductToEdit({...productToEdit, name: e.target.value})}
                    className="w-full border border-[#FFE4D6] px-3 py-2 rounded-lg focus:border-[#D87C5A] focus:ring-0 outline-none"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-[#5D3A00] mb-2">SKU</label>
                  <input 
                    type="text"
                    value={productToEdit.sku}
                    onChange={(e) => setProductToEdit({...productToEdit, sku: e.target.value})}
                    className="w-full border border-[#FFE4D6] px-3 py-2 rounded-lg focus:border-[#D87C5A] focus:ring-0 outline-none"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-[#5D3A00] mb-2">Category</label>
                  <select 
                    value={productToEdit.category}
                    onChange={(e) => setProductToEdit({...productToEdit, category: e.target.value})}
                    className="w-full border border-[#FFE4D6] px-3 py-2 rounded-lg focus:border-[#D87C5A] focus:ring-0 outline-none"
                  >
                    {categories.filter(cat => cat !== 'all').map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#5D3A00] mb-2">Price (LKR)</label>
                    <input 
                      type="number"
                      step="0.01"
                      value={productToEdit.price}
                      onChange={(e) => setProductToEdit({...productToEdit, price: parseFloat(e.target.value)})}
                      className="w-full border border-[#FFE4D6] px-3 py-2 rounded-lg focus:border-[#D87C5A] focus:ring-0 outline-none"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-[#5D3A00] mb-2">Stock</label>
                    <input 
                      type="number"
                      value={productToEdit.stock}
                      onChange={(e) => setProductToEdit({...productToEdit, stock: parseInt(e.target.value)})}
                      className="w-full border border-[#FFE4D6] px-3 py-2 rounded-lg focus:border-[#D87C5A] focus:ring-0 outline-none"
                      required
                    />
                  </div>
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

        {/* Delete Confirmation Modal */}
        {showDeleteModal && productToDelete && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-red-600" />
                </div>
                
                <h2 className="text-2xl font-bold text-[#5D3A00] mb-2">Delete Art Supply</h2>
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

        <style jsx>{`
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