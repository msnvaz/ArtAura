// Test the error response structure
// You can run this in the browser console to see the exact error structure

const testArtworkDeletion = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8081/api/artworks/27', {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.log('Status:', response.status);
            console.log('Status Text:', response.statusText);
            console.log('Error Body:', errorText);
            console.log('Error Body Type:', typeof errorText);
        }
    } catch (error) {
        console.error('Network error:', error);
    }
};

// Uncomment the line below to test
// testArtworkDeletion();
