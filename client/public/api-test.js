// Test API connectivity from frontend
const API_URL = 'http://localhost:8081';

console.log('🧪 Testing API connectivity...');

// Test shops endpoint
fetch(`${API_URL}/api/shop/all`)
    .then(response => {
        console.log('📋 Shops API Status:', response.status);
        return response.json();
    })
    .then(data => {
        console.log('📋 Shops API Response:', data);
        console.log('📋 Shops count:', Array.isArray(data) ? data.length : 'Not an array');
    })
    .catch(error => {
        console.error('❌ Shops API Error:', error);
    });

// Test products endpoint
fetch(`${API_URL}/api/products`)
    .then(response => {
        console.log('📦 Products API Status:', response.status);
        return response.json();
    })
    .then(data => {
        console.log('📦 Products API Response:', data);
        console.log('📦 Products count:', Array.isArray(data) ? data.length : 'Not an array');
    })
    .catch(error => {
        console.error('❌ Products API Error:', error);
    });

console.log('🏁 API tests initiated...');
