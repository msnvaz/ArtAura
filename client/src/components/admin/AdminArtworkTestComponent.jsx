import React, { useState } from 'react';
import { adminArtworkApi } from '../../services/adminArtworkApi';

const AdminArtworkTestComponent = () => {
  const [testResult, setTestResult] = useState('');
  const [loading, setLoading] = useState(false);

  const checkAuthToken = () => {
    const token = localStorage.getItem('token');
    setTestResult(`Auth Token: ${token ? 'Present' : 'Missing'}\nToken preview: ${token ? token.substring(0, 20) + '...' : 'N/A'}`);
  };

  const testConnection = async () => {
    setLoading(true);
    setTestResult('Testing connection...');
    
    try {
      // Test basic connection
      const response = await adminArtworkApi.getAllArtworks({ page: 0, size: 5 });
      setTestResult(`Success! Found ${response.totalElements} total artworks. First page has ${response.content.length} items.\n\nResponse structure:\n${JSON.stringify(response, null, 2)}`);
      console.log('API Response:', response);
    } catch (error) {
      setTestResult(`Error: ${error.message || 'Failed to connect to backend'}\n\nFull error:\n${JSON.stringify(error.response?.data || error.message, null, 2)}`);
      console.error('API Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const testStatistics = async () => {
    setLoading(true);
    setTestResult('Testing statistics endpoint...');
    
    try {
      const stats = await adminArtworkApi.getArtworkStatistics();
      setTestResult(`Statistics loaded successfully:\n${JSON.stringify(stats, null, 2)}`);
      console.log('Statistics Response:', stats);
    } catch (error) {
      setTestResult(`Statistics Error: ${error.message || 'Failed to load statistics'}\n\nFull error:\n${JSON.stringify(error.response?.data || error.message, null, 2)}`);
      console.error('Statistics Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const testDirectFetch = async () => {
    setLoading(true);
    setTestResult('Testing direct fetch to backend...');
    
    try {
      const response = await fetch('http://localhost:8081/api/admin/artworks?page=0&size=5', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setTestResult(`Direct fetch success!\nStatus: ${response.status}\nData: ${JSON.stringify(data, null, 2)}`);
      } else {
        const errorText = await response.text();
        setTestResult(`Direct fetch failed!\nStatus: ${response.status}\nError: ${errorText}`);
      }
    } catch (error) {
      setTestResult(`Direct fetch error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-yellow-200">
      <h3 className="text-xl font-bold mb-4 text-yellow-800">🧪 Admin Artwork API Test (Development Only)</h3>
      
      <div className="space-y-4">
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={checkAuthToken}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Check Auth Token
          </button>
          
          <button
            onClick={testDirectFetch}
            disabled={loading}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Direct Fetch'}
          </button>
          
          <button
            onClick={testConnection}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Artworks Endpoint'}
          </button>
          
          <button
            onClick={testStatistics}
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Statistics Endpoint'}
          </button>
        </div>
        
        {testResult && (
          <div className="p-4 bg-gray-50 rounded border">
            <pre className="text-sm whitespace-pre-wrap overflow-auto max-h-96">{testResult}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminArtworkTestComponent;
