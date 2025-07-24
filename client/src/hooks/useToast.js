import { useState } from 'react';

export const useToast = () => {
  const [toast, setToast] = useState({
    isVisible: false,
    message: '',
    type: 'success',
    duration: 2500 // Reduced from 4000ms to 2500ms
  });

  const showToast = (message, type = 'success', duration = 2500) => {
    setToast({
      isVisible: true,
      message,
      type,
      duration
    });
  };

  const hideToast = () => {
    setToast(prev => ({
      ...prev,
      isVisible: false
    }));
  };

  return {
    toast,
    showToast,
    hideToast
  };
};