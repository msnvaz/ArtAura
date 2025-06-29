import React, { useState } from 'react';
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
  Heart,
  Sparkles
} from 'lucide-react';

const CatalogManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const products = [
    {
      id: 1,
      name: 'Watercolor Paint Set - Professional',
      category: 'Paints',
      price: 89.99,
      stock: 45,
      status: 'in-stock',
      image: 'https://images.pexels.com/photos/1647962/pexels-photo-1647962.jpeg?auto=compress&cs=tinysrgb&w=400',
      sku: 'WCP-001',
      rating: 4.8,
      sales: 156
    },
    {
      id: 2,
      name: 'Canvas Stretched 16x20 Pack',
      category: 'Canvas',
      price: 34.50,
      stock: 8,
      status: 'low-stock',
      image: 'https://images.pexels.com/photos/1145720/pexels-photo-1145720.jpeg?auto=compress&cs=tinysrgb&w=400',
      sku: 'CNV-016',
      rating: 4.6,
      sales: 89
    },
    {
      id: 3,
      name: 'Acrylic Paint Tubes Set',
      category: 'Paints',
      price: 67.99,
      stock: 0,
      status: 'out-of-stock',
      image: 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=400',
      sku: 'ACP-012',
      rating: 4.9,
      sales: 234
    },
    {
      id: 4,
      name: 'Professional Brush Set',
      category: 'Brushes',
      price: 124.99,
      stock: 23,
      status: 'in-stock',
      image: 'https://images.pexels.com/photos/1053692/pexels-photo-1053692.jpeg?auto=compress&cs=tinysrgb&w=400',
      sku: 'BRS-005',
      rating: 4.7,
      sales: 178
    },
    {
      id: 5,
      name: 'Easel Desktop Adjustable',
      category: 'Equipment',
      price: 156.00,
      stock: 12,
      status: 'in-stock',
      image: 'https://images.pexels.com/photos/1839919/pexels-photo-1839919.jpeg?auto=compress&cs=tinysrgb&w=400',
      sku: 'ESL-003',
      rating: 4.5,
      sales: 67
    },
    {
      id: 6,
      name: 'Charcoal Drawing Set',
      category: 'Drawing',
      price: 28.75,
      stock: 67,
      status: 'in-stock',
      image: 'https://images.pexels.com/photos/1053687/pexels-photo-1053687.jpeg?auto=compress&cs=tinysrgb&w=400',
      sku: 'CHR-008',
      rating: 4.4,
      sales: 123
    }
  ];

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

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 bg-[white] min-h-screen p-6 animate-fade-in">
      {/* Header Section */}
      <div className="rounded-2xl shadow-xl p-6 border border-[#FFE4D6] bg-gradient-to-r from-[#FFF5E1]  via-[#FFD95A]/30 to-[#FFE4D6] relative overflow-hidden animate-fade-in">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD95A]/20 rounded-full -translate-y-16 translate-x-16 animate-pulse"></div>
        <div className="relative">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#5D3A00] to-[#D87C5A] bg-clip-text text-transparent flex items-center gap-2">
                <Package className="w-6 h-6 text-[#D87C5A] animate-bounce-slow" />
                Art Supply Catalog
              </h1>
              <p className="text-[#5D3A00] mt-2 ">Manage your inventory and product listings</p>
            </div>
            <button className="bg-gradient-to-r from-[#D87C5A] to-[#5D3A00] text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
              <Plus className="w-4 h-4 inline mr-2" />
              Add Product
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl shadow-xl p-4 border border-[#FFE4D6]">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5D3A00]/60 w-4 h-4" />
            <input
              type="text"
              placeholder="Search products by name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 border border-[#FFE4D6] rounded-xl focus:ring-2 focus:ring-[#D87C5A] focus:border-[#D87C5A] bg-[#FFF5E1] shadow text-[#5D3A00] font-medium placeholder-[#5D3A00]/60 text-sm"
            />
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-[#D87C5A]" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-[#FFE4D6] rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#D87C5A] focus:border-[#D87C5A] bg-white shadow text-[#5D3A00] font-medium text-sm"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product, index) => (
          <div 
            key={product.id} 
            className="bg-white rounded-2xl shadow-xl border border-[#FFE4D6] overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-105 group animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'both' }}
          >
            <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute top-3 right-3">
                <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-300 hover:scale-110">
                  <Heart className="w-4 h-4 text-[#D87C5A]" />
                </button>
              </div>
              <div className="absolute top-3 left-3">
                {getStatusBadge(product.status)}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            <div className="p-5">
              <div className="mb-4">
                <h3 className="font-bold text-[#5D3A00] text-lg mb-2 line-clamp-2 group-hover:text-[#D87C5A] transition-colors duration-300" >
                  {product.name}
                </h3>
                <div className="flex items-center space-x-1 mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-[#FFD95A] fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm text-[#5D3A00]/70 font-medium">({product.rating})</span>
                </div>
                <div className="space-y-1 text-sm text-[#5D3A00]/70">
                  <p className="font-mono bg-[#FFF5E1] px-2 py-1 rounded inline-block">SKU: {product.sku}</p>
                  <p>Category: <span className="font-semibold">{product.category}</span></p>
                  <p>{product.sales} sold</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-5">
                <span className="text-2xl font-bold text-[#D87C5A]">
                  ${product.price}
                </span>
                <span className="text-sm text-[#5D3A00]/70 bg-[#FFE4D6] px-3 py-1 rounded-full font-semibold">
                  Stock: {product.stock}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button className="flex-1 bg-[#FFF5E1] text-[#5D3A00] py-2.5 px-3 rounded-xl hover:bg-[#FFE4D6] transition-all duration-300 flex items-center justify-center space-x-2 font-semibold text-sm shadow hover:shadow-md transform hover:scale-105">
                  <Eye className="w-4 h-4" />
                  <span>View</span>
                </button>
                <button className="flex-1 bg-[#D87C5A] text-white py-2.5 px-3 rounded-xl hover:bg-[#c06949] transition-all duration-300 flex items-center justify-center space-x-2 font-semibold text-sm shadow hover:shadow-md transform hover:scale-105">
                  <Edit3 className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 hover:scale-110 shadow hover:shadow-md">
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
            <h3 className="text-xl font-bold text-[#5D3A00] mb-2">No products found</h3>
            <p className="text-[#5D3A00]/70 text-sm">Try adjusting your search terms or filters</p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default CatalogManagement;