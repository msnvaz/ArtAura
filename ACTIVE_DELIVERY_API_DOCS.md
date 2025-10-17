# Active Delivery Requests API Documentation

## Overview
New API endpoints have been added to view active delivery requests that have delivery_status "accepted" or "outForDelivery" from both AW_orders and commission_requests tables.

## New API Endpoints

### 1. Get All Active Delivery Requests
**Endpoint:** `GET /api/delivery-partner/requests/active`

**Description:** Retrieves all active delivery requests from both AW_orders and commission_requests tables.

**Response Format:**
```json
{
  "requests": [
    {
      "id": 10,
      "requestType": "artwork_order",
      "buyerId": 1,
      "buyerName": "pawani2002 Kumari2002",
      "buyerEmail": "pawanibuyer@gmail.com",
      "buyerPhone": "0741748684",
      "shippingAddress": "pinnalandawatta, bathamburaya, rambukkana, 71100, Sri Lanka",
      "deliveryStatus": "outForDelivery",
      "orderDate": "2025-08-26T23:22:35",
      "artworkTitle": "Sample Artwork",
      "artworkType": "Artwork",
      "totalAmount": 800.00,
      "artistId": 11,
      "artistName": "Artist Name"
    }
  ],
  "success": true,
  "count": 5
}
```

### 2. Get Active Artwork Order Delivery Requests
**Endpoint:** `GET /api/delivery-partner/requests/active/artworks`

**Description:** Retrieves active delivery requests from AW_orders table only.

### 3. Get Active Commission Delivery Requests  
**Endpoint:** `GET /api/delivery-partner/requests/active/commissions`

**Description:** Retrieves active delivery requests from commission_requests table only.

**Additional Commission Fields:**
```json
{
  "commissionStyle": "oil-painting",
  "deadline": "2025-10-10",
  "additionalNotes": "A ceramic sculpture of our dog.",
  "urgency": "low",
  "artworkDimensions": "12x16"
}
```

## Database Schema

### Delivery Status Values
Both tables use the same enum for delivery_status:
```sql
enum('pending','accepted','outForDelivery','delivered','N/A')
```

**Active Status:** 'accepted' OR 'outForDelivery'

### Sample Data
Based on current database content, these requests would be returned as active:

**AW_orders:**
- Order 10: outForDelivery
- Order 11: accepted
- Order 13: accepted

**commission_requests:**
- Commission 7: accepted
- Commission 9: outForDelivery  
- Commission 10: outForDelivery

## Implementation Details

### DAO Layer
- Added `getAllActiveDeliveryRequests()` method
- Added `getActiveArtworkOrderDeliveryRequests()` method  
- Added `getActiveCommissionDeliveryRequests()` method

### Service Layer
- Added corresponding service methods with error handling

### Controller Layer
- Added REST endpoints with proper HTTP response handling
- Consistent response format with existing endpoints

## Usage in Frontend

The React components can use these endpoints to display active deliveries:

```javascript
// Get all active deliveries
const response = await fetch('/api/delivery-partner/requests/active');
const data = await response.json();

// Filter by type if needed
const artworkOrders = await fetch('/api/delivery-partner/requests/active/artworks');
const commissions = await fetch('/api/delivery-partner/requests/active/commissions');
```

This aligns with the existing pattern used in the `ActiveDeliveries.jsx` and `DeliveryRequestsList.jsx` components.