import React from "react";
import { Facebook, X, Instagram, Palette } from "lucide-react";
import Logo from "../assets/footer-logo.jpg";

const FooterLarge = () => {
  return (
    <footer className="bg-[#1C0E09] text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Logo and Social Media */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <span className="ml-3 text-xl font-bold">
                <span className="text-white">ART</span>
                <span className="block text-sm font-normal text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-yellow-400 to-yellow-300">
                  AURA
                </span>
              </span>
              <img
                src={Logo}
                alt="ArtAura Logo"
                className="ml-3 h-10 w-auto object-contain"
              />
            </div>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-colors duration-200"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-600 transition-colors duration-200"
                aria-label="X"
              >
                <X className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-pink-500 transition-colors duration-200"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
          {/* Links Columns */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Premium Gallery
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Art Protection
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Commissions
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Prints & Merch
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Guidelines
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Tutorials
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Copyright Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Help Center
                  </a>
                </li>
              </ul>
            </div>
          </div>
          {/* CTA Section */}
          <div className="lg:col-span-1">
            <div className="text-sm text-gray-400 mb-4">
              Become part of{" "}
              <span className="text-yellow-300 font-medium">ArtAura</span> —
              where artists showcase portfolios, join exhibitions, and explore
              creative careers.
            </div>
            <div className="space-y-3">
              <button className="w-full bg-gradient-to-r from-orange-400 via-yellow-400 to-yellow-300 text-gray-900 font-medium py-2.5 px-4 rounded-lg hover:from-orange-500 hover:to-yellow-400 transition-colors duration-200">
                Become an Artist
              </button>
              <button className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200">
                View Upcoming Exhibitions
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <div>©2025 ArtAura. All rights reserved.</div>
            <div className="mt-4 md:mt-0 text-center">
              Empowering{" "}
              <span className="text-yellow-400 font-medium">creativity</span>,
              connecting{" "}
              <span className="text-orange-400 font-medium">visionaries</span>.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterLarge;
