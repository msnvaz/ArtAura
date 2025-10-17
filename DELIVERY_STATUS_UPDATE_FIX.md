# Delivery Status Update Fix

## Problem
When the "Mark as Picked Up" and "Mark as Delivered" buttons were pressed in the ActiveDeliveries component, the delivery status was not being updated correctly in the database.

## Root Cause
The frontend was using a generic update endpoint but not properly mapping the button actions to the correct backend delivery status values.

## Solution

### Backend Endpoints (Already Working)
The backend already had the correct endpoints:

1. **Mark as Out For Delivery**: 
   - `PUT /api/delivery-status/{orderType}/{orderId}/out-for-delivery`
   - Updates delivery_status to "outForDelivery"

2. **Mark as Delivered**: 
   - `PUT /api/delivery-status/{orderType}/{orderId}/delivered`
   - Updates delivery_status to "delivered"

### Frontend Fix
Updated the `updateDeliveryStatus` function in `ActiveDeliveries.jsx` to:

1. **Properly map button actions to backend status**:
   - "Mark as Picked Up" button (`picked_up` action) → calls the `/out-for-delivery` endpoint → sets DB status to "outForDelivery"
   - "Mark as Delivered" button (`delivered` action) → calls the `/delivered` endpoint → sets DB status to "delivered"

2. **Use the correct API endpoints**:
   - Instead of using the generic comprehensive update endpoint for all actions
   - Use the specific endpoints for picking up and delivering
   - Fall back to comprehensive endpoint for other status updates

3. **Proper status mapping**:
   ```javascript
   // Frontend action → Backend endpoint → Database status
   'picked_up' → '/out-for-delivery' → 'outForDelivery'
   'delivered' → '/delivered' → 'delivered'
   ```

## How It Works Now

### 1. Mark as Picked Up
- User clicks "Mark as Picked Up" button
- Frontend calls: `PUT /api/delivery-status/artwork/123/out-for-delivery`
- Backend updates: `delivery_status = 'outForDelivery'` in database
- Frontend updates UI to show "In Transit" status

### 2. Mark as Delivered
- User clicks "Mark as Delivered" button  
- Frontend calls: `PUT /api/delivery-status/artwork/123/delivered`
- Backend updates: `delivery_status = 'delivered'` in database
- Frontend updates UI and removes from active deliveries list

## Database Status Values
The delivery_status enum in both AW_orders and commission_requests tables:
```sql
enum('pending','accepted','outForDelivery','delivered','N/A')
```

## Testing
To test the fix:
1. Start both backend and frontend servers
2. Navigate to Active Deliveries page
3. Find an active delivery with status "accepted"
4. Click "Mark as Picked Up" → should update to "outForDelivery"
5. Click "Mark as Delivered" → should update to "delivered" and remove from list

## Files Modified
- `client/src/components/delivery/ActiveDeliveries.jsx` - Updated `updateDeliveryStatus` function

## Files Verified (Already Working)
- `DeliveryStatusController.java` - Has correct endpoints
- `DeliveryStatusService.java` - Has `markAsOutForDelivery` and `markAsDelivered` methods
- `DeliveryStatusDAOImpl.java` - Has correct SQL update statements