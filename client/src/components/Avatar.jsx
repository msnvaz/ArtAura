import React from "react";

export const Avatar = ({ children, className = "" }) => (
  <div className={`w-10 h-10 rounded-full overflow-hidden bg-gray-200 ${className}`}>
    {children}
  </div>
);

export const AvatarImage = ({ src, alt = "" }) => (
  <img src={src} alt={alt} className="w-full h-full object-cover" />
);

export const AvatarFallback = ({ children }) => (
  <div className="w-full h-full flex items-center justify-center text-sm text-gray-700">
    {children}
  </div>
);