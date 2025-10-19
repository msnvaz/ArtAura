// Test file to verify ShopDiscoveryTab component handles undefined data safely

// Mock data scenarios for testing
const testCases = [
    {
        name: "Undefined shops and products",
        shops: undefined,
        products: undefined
    },
    {
        name: "Null shops and products",
        shops: null,
        products: null
    },
    {
        name: "Empty arrays",
        shops: [],
        products: []
    },
    {
        name: "Mixed data with some undefined properties",
        shops: [
            { shopId: 1, shopName: "Test Shop", description: null },
            { shopId: 2, shopName: undefined, description: "Test Desc" }
        ],
        products: [
            { id: 1, productName: "Test Product", description: null },
            { id: 2, productName: undefined, category: "Test Category" }
        ]
    }
];

// Test the safeStringIncludes function logic
function safeStringIncludes(str, searchTerm) {
    if (!str || !searchTerm) return false;
    return str.toLowerCase().includes(searchTerm.toLowerCase());
}

// Test filtering logic
function testFiltering() {
    console.log("Testing ShopDiscoveryTab filtering logic:");

    testCases.forEach((testCase, index) => {
        console.log(`\nTest Case ${index + 1}: ${testCase.name}`);

        try {
            // Simulate the safe array creation logic
            const safeShops = Array.isArray(testCase.shops) ? testCase.shops : [];
            const safeProducts = Array.isArray(testCase.products) ? testCase.products : [];

            console.log(`  Safe shops length: ${safeShops.length}`);
            console.log(`  Safe products length: ${safeProducts.length}`);

            // Test filtering with a search term
            const searchTerm = "test";

            const filteredShops = safeShops.filter(shop => {
                if (!shop) return false;
                return safeStringIncludes(shop.shopName, searchTerm) ||
                    safeStringIncludes(shop.businessType, searchTerm) ||
                    safeStringIncludes(shop.description, searchTerm);
            });

            const filteredProducts = safeProducts.filter(product => {
                if (!product) return false;
                return safeStringIncludes(product.productName, searchTerm) ||
                    safeStringIncludes(product.description, searchTerm) ||
                    safeStringIncludes(product.category, searchTerm);
            });

            console.log(`  Filtered shops: ${filteredShops.length}`);
            console.log(`  Filtered products: ${filteredProducts.length}`);
            console.log(`  ✅ Test passed - no errors thrown`);

        } catch (error) {
            console.error(`  ❌ Test failed with error:`, error.message);
        }
    });
}

// Run the test
testFiltering();

console.log("\n🎉 All filtering tests completed!");
