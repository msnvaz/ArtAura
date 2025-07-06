import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState('LKR'); // Default to LKR
  const [exchangeRate, setExchangeRate] = useState(320); // Default rate: 1 USD = 320 LKR

  // Fetch current exchange rate (in a real app, this would be from an API)
  useEffect(() => {
    // Simulated API call - in production, use a real exchange rate API
    const fetchExchangeRate = async () => {
      try {
        // For now, using a simulated rate. In production, use:
        // const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        // const data = await response.json();
        // setExchangeRate(data.rates.LKR);
        
        // Simulated current rate (updates periodically)
        const simulatedRate = 320 + Math.random() * 10 - 5; // 315-325 range
        setExchangeRate(Math.round(simulatedRate * 100) / 100);
      } catch (error) {
        console.error('Failed to fetch exchange rate:', error);
        // Fallback to default rate
        setExchangeRate(320);
      }
    };

    fetchExchangeRate();
    
    // Update rate every 5 minutes
    const interval = setInterval(fetchExchangeRate, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const convertPrice = (price, fromCurrency = 'USD', toCurrency = currency) => {
    if (typeof price === 'string') {
      price = parseFloat(price.replace(/[$,]/g, ''));
    }
    
    if (fromCurrency === toCurrency) return price;
    
    if (fromCurrency === 'USD' && toCurrency === 'LKR') {
      return price * exchangeRate;
    } else if (fromCurrency === 'LKR' && toCurrency === 'USD') {
      return price / exchangeRate;
    }
    
    return price;
  };

  const formatPrice = (price, fromCurrency = 'USD', showSymbol = true) => {
    const convertedPrice = convertPrice(price, fromCurrency, currency);
    const formattedNumber = convertedPrice.toLocaleString('en-US', {
      minimumFractionDigits: currency === 'LKR' ? 0 : 2,
      maximumFractionDigits: currency === 'LKR' ? 0 : 2
    });
    
    if (!showSymbol) return formattedNumber;
    
    return currency === 'USD' ? `$${formattedNumber}` : `LKR ${formattedNumber}`;
  };

  const getCurrencySymbol = () => {
    return currency === 'USD' ? '$' : 'LKR';
  };

  const value = {
    currency,
    setCurrency,
    exchangeRate,
    convertPrice,
    formatPrice,
    getCurrencySymbol
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};
