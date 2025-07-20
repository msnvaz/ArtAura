import React from 'react';
import { Globe } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';

const CurrencySelector = ({ className = "" }) => {
  const { currency, setCurrency, exchangeRate } = useCurrency();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex bg-white border rounded-lg overflow-hidden" style={{borderColor: '#FFE4D6'}}>
        <button
          onClick={() => setCurrency('LKR')}
          className={`px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1 ${
            currency === 'LKR' 
              ? 'text-white' 
              : 'hover:bg-gray-50'
          }`}
          style={{
            backgroundColor: currency === 'LKR' ? '#5D3A00' : 'transparent',
            color: currency === 'LKR' ? 'white' : '#5D3A00'
          }}
        >
          <span className="font-semibold">LKR</span>
        </button>
        <button
          onClick={() => setCurrency('USD')}
          className={`px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1 ${
            currency === 'USD' 
              ? 'text-white' 
              : 'hover:bg-gray-50'
          }`}
          style={{
            backgroundColor: currency === 'USD' ? '#5D3A00' : 'transparent',
            color: currency === 'USD' ? 'white' : '#5D3A00'
          }}
        >
          <span className="font-semibold">USD</span>
        </button>
      </div>
    </div>
  );
};

export default CurrencySelector;
