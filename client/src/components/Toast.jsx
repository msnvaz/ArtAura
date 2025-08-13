import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Trash2, Plus, Edit3 } from 'lucide-react';

const Toast = ({ message, type, isVisible, onClose, duration = 2500 }) => {
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  useEffect(() => {
    if (isVisible) {
      // Auto close after duration
      const timer = setTimeout(() => {
        setIsAnimatingOut(true);
        // Wait for animation to complete before actually closing
        setTimeout(() => {
          onClose();
          setIsAnimatingOut(false);
        }, 200);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, duration]);

  if (!isVisible) return null;

  const getToastConfig = () => {
    switch (type) {
      case 'success':
        return {
          bgColor: 'bg-gradient-to-r from-green-500 to-green-600',
          icon: <CheckCircle className="w-4 h-4 text-white" />,
          borderColor: 'border-green-500'
        };
      case 'error':
        return {
          bgColor: 'bg-gradient-to-r from-red-400 to-red-600',
          icon: <AlertCircle className="w-4 h-4 text-white" />,
          borderColor: 'border-red-500'
        };
      case 'delete':
        return {
          bgColor: 'bg-gradient-to-r from-red-500 to-red-700',
          icon: <Trash2 className="w-4 h-4 text-white" />,
          borderColor: 'border-red-600'
        };
      case 'create':
        return {
          bgColor: 'bg-gradient-to-r from-green-500 to-green-600',
          icon: <Plus className="w-4 h-4 text-white" />,
          borderColor: 'border-green-500'
        };
      case 'update':
        return {
          bgColor: 'bg-gradient-to-r from-blue-400 to-blue-600',
          icon: <Edit3 className="w-4 h-4 text-white" />,
          borderColor: 'border-blue-500'
        };
      default:
        return {
          bgColor: 'bg-gradient-to-r from-gray-400 to-gray-600',
          icon: <CheckCircle className="w-4 h-4 text-white" />,
          borderColor: 'border-gray-500'
        };
    }
  };

  const config = getToastConfig();

  return (
    <div className={`fixed top-4 right-4 z-[70] transition-all duration-200 ${
      isAnimatingOut ? 'animate-slide-out opacity-0' : 'animate-slide-in opacity-100'
    }`}>
      <div className={`${config.bgColor} ${config.borderColor} border shadow-lg rounded-lg p-3 max-w-xs w-full transform transition-all duration-200`}>
        <div className="flex items-center space-x-2">
          <div className="flex-shrink-0">
            {config.icon}
          </div>
          <div className="flex-1">
            <p className="text-white font-medium text-xs leading-tight">
              {message}
            </p>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-2 w-full bg-white/20 rounded-full h-0.5 overflow-hidden">
          <div 
            className="h-full bg-white rounded-full"
            style={{ 
              animation: `progress ${duration}ms linear forwards` 
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes slide-out {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
        
        @keyframes progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.2s ease-out;
        }
        
        .animate-slide-out {
          animation: slide-out 0.2s ease-in;
        }
      `}</style>
    </div>
  );
};

export default Toast;