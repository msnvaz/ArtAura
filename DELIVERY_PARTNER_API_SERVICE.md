# Delivery Partner API Service

## Overview
This document describes the delivery partner API service that centralizes all delivery-related API calls and removes hardcoded URLs from the frontend components.

## Changes Made

### 1. Created Delivery Partner Service
**File:** `client/src/services/deliveryPartnerApi.js`

This service provides a centralized way to interact with delivery partner APIs:

- **getActiveDeliveries()** - Fetches active delivery requests for the delivery partner
- **getPendingDeliveries()** - Fetches pending deliveries (fallback API)
- **markOutForDelivery(orderType, orderId)** - Updates delivery status to 'Out for Delivery'
- **markDelivered(orderType, orderId)** - Updates delivery status to 'Delivered'
- **updateDeliveryStatusComprehensive(updateData)** - Updates delivery status with comprehensive data
- **updateDeliveryStatus(delivery, newStatus)** - Generic method to update delivery status

### 2. Updated ActiveDeliveries Component
**File:** `client/src/components/delivery/ActiveDeliveries.jsx`

Removed all hardcoded URLs and replaced them with service calls:

**Before:**
```javascript
const response = await axios.get('http://localhost:8081/api/delivery-partner/requests/active', {
  headers: { Authorization: `Bearer ${token}` },
});
```

**After:**
```javascript
const response = await deliveryPartnerApi.getActiveDeliveries();
```

### 3. Benefits

✅ **No Hardcoded URLs** - All API endpoints are centralized in the service
✅ **Uses Environment Variables** - Base URL is configured via `VITE_API_URL` in `.env` file
✅ **Automatic Authentication** - The `axiosInstance` automatically adds the auth token
✅ **Consistent Error Handling** - All errors are handled consistently through the service
✅ **Easy to Maintain** - Changes to API endpoints only need to be updated in one place
✅ **Better Testing** - Services can be easily mocked for testing

## Configuration

The API base URL is configured in the `.env` file:

```properties
VITE_API_URL=http://localhost:8081
```

To change the backend server URL (e.g., for production):
1. Update the `VITE_API_URL` in `.env` file
2. Restart the Vite development server

## Usage Example

```javascript
import deliveryPartnerApi from '../../services/deliveryPartnerApi';

// Fetch active deliveries
const response = await deliveryPartnerApi.getActiveDeliveries();

// Update delivery status
await deliveryPartnerApi.updateDeliveryStatus(delivery, 'delivered');

// Mark as out for delivery
await deliveryPartnerApi.markOutForDelivery('artwork', orderId);
```

## API Endpoints Used

| Service Method | HTTP Method | Endpoint |
|---------------|-------------|----------|
| getActiveDeliveries() | GET | `/api/delivery-partner/requests/active` |
| getPendingDeliveries() | GET | `/api/delivery-status/pending` |
| markOutForDelivery() | PUT | `/api/delivery-status/{type}/{id}/out-for-delivery` |
| markDelivered() | PUT | `/api/delivery-status/{type}/{id}/delivered` |
| updateDeliveryStatusComprehensive() | PUT | `/api/delivery-status/update-comprehensive` |

## Notes

- The service uses the shared `axiosInstance` which automatically handles:
  - Base URL configuration
  - Authentication headers
  - Response/error interceptors
  - Consistent error handling

- All API calls now go through the centralized service layer, making it easier to:
  - Add logging
  - Implement caching
  - Handle retries
  - Monitor API performance
