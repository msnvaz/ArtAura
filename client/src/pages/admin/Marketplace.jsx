import React, { useState } from 'react';
import { 
  Store, 
  Upload,
  Plus
} from 'lucide-react';

const MarketplaceManagement = () => {
  const [formData, setFormData] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Data submitted successfully!');
    setFormData({});
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{color: '#5D3A00'}}>
          <Store size={24} />
          Add Marketplace Item
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{color: '#5D3A00'}}>Item Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                style={{borderColor: '#FFE4D6', backgroundColor: 'white'}}
                placeholder="Enter item name"
                onChange={(e) => handleInputChange('itemName', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{color: '#5D3A00'}}>Seller</label>
              <select
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                style={{borderColor: '#FFE4D6', backgroundColor: 'white'}}
                onChange={(e) => handleInputChange('seller', e.target.value)}
              >
                <option value="">Select seller</option>
                <option value="alex-johnson">Alex Johnson</option>
                <option value="elena-rodriguez">Elena Rodriguez</option>
                <option value="david-chen">David Chen</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{color: '#5D3A00'}}>Category</label>
              <select
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                style={{borderColor: '#FFE4D6', backgroundColor: 'white'}}
                onChange={(e) => handleInputChange('marketplaceCategory', e.target.value)}
              >
                <option value="">Select category</option>
                <option value="original-art">Original Art</option>
                <option value="prints">Prints</option>
                <option value="digital-downloads">Digital Downloads</option>
                <option value="art-supplies">Art Supplies</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{color: '#5D3A00'}}>Price ($)</label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                style={{borderColor: '#FFE4D6', backgroundColor: 'white'}}
                placeholder="Enter price"
                onChange={(e) => handleInputChange('marketplacePrice', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{color: '#5D3A00'}}>Stock Quantity</label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                style={{borderColor: '#FFE4D6', backgroundColor: 'white'}}
                placeholder="Enter stock quantity"
                onChange={(e) => handleInputChange('stock', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{color: '#5D3A00'}}>Condition</label>
              <select
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                style={{borderColor: '#FFE4D6', backgroundColor: 'white'}}
                onChange={(e) => handleInputChange('condition', e.target.value)}
              >
                <option value="">Select condition</option>
                <option value="new">New</option>
                <option value="like-new">Like New</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
              </select>
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2" style={{color: '#5D3A00'}}>Item Description</label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
              style={{borderColor: '#FFE4D6', backgroundColor: 'white'}}
              placeholder="Enter detailed item description"
              onChange={(e) => handleInputChange('itemDescription', e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2" style={{color: '#5D3A00'}}>Item Images</label>
            <div className="border-2 border-dashed rounded-lg p-8 text-center" style={{borderColor: '#D87C5A', backgroundColor: '#FFE4D6'}}>
              <Upload size={32} className="mx-auto mb-2" style={{color: '#5D3A00'}} />
              <p className="text-sm" style={{color: '#5D3A00'}}>Upload item images (Multiple files allowed)</p>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 rounded-lg font-semibold transition-colors"
            style={{backgroundColor: '#D87C5A', color: 'white'}}
            onMouseOver={(e) => e.target.style.backgroundColor = '#B85A3A'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#D87C5A'}
          >
            Add to Marketplace
          </button>
        </form>
      </div>
    </div>
  );
};

export default MarketplaceManagement;
