import React from "react";
import Navbar from "../components/common/Navbar";
import CartSidebar from "../components/cart/CartSidebar";

function Marketplace() {
  return (
    <div className="min-h-screen bg-[#FFF5E1]">
      <Navbar />
      <CartSidebar />

      <div className="pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#7f5539] mb-2 text-center">
              Art Marketplace
            </h2>
            <p className="text-center text-[#7f5539]/70">
              Browse and purchase amazing artworks from our community of artists
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <select className="px-3 py-2 border border-[#FFD95A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD95A] text-[#7f5539]">
              <option>All Categories</option>
              <option>Digital Art</option>
              <option>Paintings</option>
              <option>Photography</option>
              <option>Sculptures</option>
            </select>
            <select className="px-3 py-2 border border-[#FFD95A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD95A] text-[#7f5539]">
              <option>Price: All</option>
              <option>Under $100</option>
              <option>$100 - $500</option>
              <option>$500 - $1000</option>
              <option>Over $1000</option>
            </select>
            <input
              type="text"
              className="px-3 py-2 border border-[#FFD95A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD95A] text-[#7f5539]"
              placeholder="Search artworks..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sample art cards */}
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="bg-white rounded-xl shadow-md border border-[#FFD95A] overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <div className="h-64 bg-gray-100 flex items-center justify-content-center">
                  <span className="text-[#7f5539]/50">Art Image {item}</span>
                </div>
                <div className="p-6">
                  <h5 className="font-bold text-[#7f5539] text-lg mb-2">
                    Artwork Title {item}
                  </h5>
                  <p className="text-[#7f5539]/70 mb-4">By Artist Name</p>
                  <div className="flex justify-between items-center">
                    <strong className="text-[#D87C5A] text-xl">
                      ${(Math.random() * 500 + 50).toFixed(0)}
                    </strong>
                    <button className="bg-[#D87C5A] hover:bg-[#7f5539] text-white px-4 py-2 rounded-lg font-medium transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Marketplace;
