import React from "react";
import Logo from "../assets/footer-logo.jpg";

const Footer = () => {
  return (
    <footer className="bg-[#1C0E09] text-white w-full border-t border-[#7f5539]/10">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-row items-center justify-center gap-4 text-xs">
        {/* Logo and Brand */}
        <div className="flex items-center gap-2">
          <img
            src={Logo}
            alt="ArtAura Logo"
            className="h-7 w-auto object-contain"
          />
          <span className="font-bold text-sm tracking-wide">
            <span className="text-white">ART</span>
            <span className="ml-1 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-yellow-400 to-yellow-300">
              AURA
            </span>
          </span>
        </div>
        {/* Copyright */}
        <div className="text-gray-400 text-xs text-center">
          ©2025 ArtAura. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
