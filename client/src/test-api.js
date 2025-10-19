import axios from 'axios';

// Test environment variables and API connectivity
console.log('🧪 Environment Test');
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('NODE_ENV:', import.meta.env.NODE_ENV);
console.log('DEV:', import.meta.env.DEV);

const API_URL = import.meta.env.VITE_API_URL;

// Test API calls
const testAPI = async () => {
    console.log('🚀 Testing API calls...');

    try {
        console.log('📋 Testing shops endpoint...');
        const shopsResponse = await axios.get(`${API_URL}/api/shop/all`);
        console.log('✅ Shops response:', shopsResponse.data);
        console.log('✅ Shops count:', Array.isArray(shopsResponse.data) ? shopsResponse.data.length : 'Not array');

        console.log('📦 Testing products endpoint...');
        const productsResponse = await axios.get(`${API_URL}/api/products`);
        console.log('✅ Products response:', productsResponse.data);
        console.log('✅ Products count:', Array.isArray(productsResponse.data) ? productsResponse.data.length : 'Not array');

    } catch (error) {
        console.error('❌ API Test failed:', error);
        console.error('❌ Error details:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
        });
    }
};

// Run test when module loads
testAPI();

export default testAPI;
