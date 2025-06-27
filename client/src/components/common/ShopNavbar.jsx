import React, { useState } from "react";
import { 
  Search, 
  Bell, 
  LogIn, 
  LogOut, 
  Menu, 
  X, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  Gift, 
  Image, 
  Trophy,
  ChevronDown,
  Store
} from "lucide-react";

const Navbar = ({ onToggleSidebar }) => {
  const [isSignedIn, setIsSignedIn] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleAuthClick = () => setIsSignedIn(!isSignedIn);

  const navigationItems = [
    {
      label: "Dashboard",
      icon: Store,
      href: "/dashboard",
      isActive: true
    },
    {
      label: "Products",
      icon: Package,
      href: "/products",
      dropdown: [
        { label: "Product Catalog", href: "/products/catalog" },
        { label: "Add Product", href: "/products/add" },
        { label: "Categories", href: "/products/categories" },
        { label: "Inventory", href: "/products/inventory" }
      ]
    },
    {
      label: "Orders",
      icon: ShoppingCart,
      href: "/orders",
      badge: "12"
    },
    {
      label: "Sales",
      icon: TrendingUp,
      href: "/sales",
      dropdown: [
        { label: "Analytics", href: "/sales/analytics" },
        { label: "Reports", href: "/sales/reports" },
        { label: "Revenue", href: "/sales/revenue" }
      ]
    },
    {
      label: "Rewards",
      icon: Gift,
      href: "/rewards"
    },
    {
      label: "Exhibitions",
      icon: Image,
      href: "/exhibitions"
    },
    {
      label: "Challenges",
      icon: Trophy,
      href: "/challenges",
      badge: "3"
    }
  ];

  const handleDropdownToggle = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  return (
    <>
      <nav className="bg-white border-b border-gray-200 fixed top-0 w-full z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16 items-center">
            {/* Left: Logo + Sidebar Toggle */}
            <div className="flex items-center space-x-4">
              <button
                onClick={onToggleSidebar}
                className="hidden md:flex text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Store className="h-5 w-5 text-white" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold text-gray-900">Shop Dashboard</h1>
                  <p className="text-xs text-gray-500">Manage your store</p>
                </div>
              </div>
            </div>

            {/* Middle: Navigation Links (Desktop) */}
            <div className="hidden lg:flex items-center space-x-1">
              {navigationItems.map((item, index) => (
                <div key={index} className="relative">
                  <button
                    onClick={() => item.dropdown ? handleDropdownToggle(index) : null}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      item.isActive
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full min-w-[20px] h-5 flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                    {item.dropdown && <ChevronDown className="w-3 h-3 ml-1" />}
                  </button>

                  {/* Dropdown Menu */}
                  {item.dropdown && activeDropdown === index && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                      {item.dropdown.map((dropdownItem, dropdownIndex) => (
                        <a
                          key={dropdownIndex}
                          href={dropdownItem.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                        >
                          {dropdownItem.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Right: Search + Actions */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="hidden md:flex relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="search"
                  placeholder="Search products, orders..."
                  className="pl-10 pr-4 py-2 w-64 bg-gray-50 text-sm text-gray-900 border border-gray-200 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Notifications */}
              <button className="relative text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Profile */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">JD</span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">John Doe</p>
                  <p className="text-xs text-gray-500">Store Owner</p>
                </div>
              </div>

              {/* Auth Button */}
              <button
                onClick={handleAuthClick}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isSignedIn
                    ? "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                }`}
              >
                {isSignedIn ? <LogOut className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
                <span className="hidden sm:inline">
                  {isSignedIn ? "Sign Out" : "Sign In"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div 
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg max-h-[calc(100vh-4rem)] overflow-y-auto">
            {/* Mobile Search */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="search"
                  placeholder="Search products, orders..."
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="py-2">
              {navigationItems.map((item, index) => (
                <div key={index}>
                  <a
                    href={item.href}
                    className={`flex items-center justify-between px-4 py-3 text-base font-medium transition-colors ${
                      item.isActive
                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-500"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-[24px] h-6 flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </a>
                  
                  {/* Mobile Dropdown Items */}
                  {item.dropdown && (
                    <div className="bg-gray-50">
                      {item.dropdown.map((dropdownItem, dropdownIndex) => (
                        <a
                          key={dropdownIndex}
                          href={dropdownItem.href}
                          className="block px-12 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        >
                          {dropdownItem.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile Auth */}
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={handleAuthClick}
                className={`w-full flex justify-center items-center gap-2 px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                  isSignedIn
                    ? "bg-red-50 text-red-700 border border-red-200"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {isSignedIn ? <LogOut className="h-5 w-5" /> : <LogIn className="h-5 w-5" />}
                {isSignedIn ? "Sign Out" : "Sign In"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dropdown Overlay */}
      {activeDropdown !== null && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => setActiveDropdown(null)}
        />
      )}
    </>
  );
};

export default Navbar;