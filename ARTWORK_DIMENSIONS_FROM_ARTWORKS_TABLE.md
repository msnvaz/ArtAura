# Artwork Dimensions Fetched from Artworks Table

## Summary
Updated the delivery request system to fetch artwork dimensions from the `artworks` table's `size` column instead of using placeholder data.

## Changes Made

### File: `DeliveryRequestDAOImpl.java`
**Location**: `server/artaura/src/main/java/com/artaura/artaura/dao/Impl/DeliveryRequestDAOImpl.java`

#### 1. Updated Row Mapper for Artwork Orders
- **Lines ~22-55**: Added handling for `artwork_size` field in the `artworkOrderRowMapper`
- Added try-catch block to safely set artwork dimensions from the database:
```java
// Handle artwork dimensions/size from artworks table
try {
    dto.setArtworkDimensions(rs.getString("artwork_size"));
} catch (Exception e) {
    dto.setArtworkDimensions(null);
}
```

#### 2. Updated SQL Query: `getPendingArtworkOrderDeliveryRequests()`
- **Lines ~140-168**: Added JOIN with `artworks` table
- Added `aw.size AS artwork_size` to SELECT statement
- Added `LEFT JOIN artworks aw ON aoi.artwork_id = aw.artwork_id`

**Before:**
```sql
SELECT 
    ao.id, ao.buyer_id, ..., aoi.title AS artwork_title,
    aoi.artist_id, CONCAT(a.first_name, ' ', a.last_name) AS artist_name
FROM AW_orders ao
LEFT JOIN AW_order_items aoi ON ao.id = aoi.order_id
LEFT JOIN artists a ON aoi.artist_id = a.artist_id
WHERE ao.delivery_status = 'pending'
```

**After:**
```sql
SELECT 
    ao.id, ao.buyer_id, ..., aoi.title AS artwork_title,
    aoi.artist_id, CONCAT(a.first_name, ' ', a.last_name) AS artist_name,
    aw.size AS artwork_size
FROM AW_orders ao
LEFT JOIN AW_order_items aoi ON ao.id = aoi.order_id
LEFT JOIN artists a ON aoi.artist_id = a.artist_id
LEFT JOIN artworks aw ON aoi.artwork_id = aw.artwork_id
WHERE ao.delivery_status = 'pending'
```

#### 3. Updated SQL Query: `getActiveArtworkOrderDeliveryRequests()`
- **Lines ~389-417**: Added JOIN with `artworks` table
- Added `aw.size AS artwork_size` to SELECT statement
- Added `LEFT JOIN artworks aw ON aoi.artwork_id = aw.artwork_id`

#### 4. Updated SQL Query: `getDeliveredArtworkOrderDeliveryRequests()`
- **Lines ~477-503**: Added JOIN with `artworks` table
- Added `aw.size AS artwork_size` to SELECT statement
- Added `LEFT JOIN artworks aw ON aoi.artwork_id = aw.artwork_id`

#### 5. Updated SQL Query: `getDeliveryRequestById()` - Artwork Orders
- **Lines ~238-264**: Added JOIN with `artworks` table for individual artwork order lookup
- Added `aw.size AS artwork_size` to SELECT statement
- Added `LEFT JOIN artworks aw ON aoi.artwork_id = aw.artwork_id`

## Database Schema Reference

### Tables Involved:
1. **`artworks`** - Contains the `size` column with artwork dimensions
2. **`AW_order_items`** - Contains `artwork_id` foreign key linking to `artworks.artwork_id`
3. **`AW_orders`** - Contains order information
4. **`commission_requests`** - Already has `dimensions` column (unchanged)

### Join Relationship:
```
AW_orders 
  → AW_order_items (via order_id)
    → artworks (via artwork_id) ← NEW JOIN
```

## Frontend Impact

### File: `DeliveryRequestsList.jsx`
The frontend already handles the artwork dimensions correctly:

For **Artwork Orders** (lines 103-107):
```javascript
artwork: {
  title: order.artwork_title || `Artwork Order #${order.id}`,
  type: order.artwork_type || 'Artwork',
  size: order.artwork_dimensions || order.dimensions || 'N/A',  // Now gets actual size from artworks table
  weight: 'TBD',
  fragile: true,
  value: `Rs ${order.total_amount || 0}`
}
```

For **Commission Requests** (lines 151-155):
```javascript
artwork: {
  title: commission.title || `Commission #${commission.id}`,
  type: commission.artwork_type || 'Commission',
  size: commission.dimensions || 'N/A',  // Uses commission_requests.dimensions
  weight: 'TBD',
  fragile: true,
  value: `Rs ${commission.budget || 0}`
}
```

## Benefits
✅ **Accurate Data**: Artwork dimensions now come from the actual artwork record
✅ **Consistency**: All artwork orders will display the correct size from the artworks table
✅ **No Breaking Changes**: Fallback handling ensures backward compatibility
✅ **Commission Requests Unchanged**: Still uses `commission_requests.dimensions` column

## Testing Recommendations

1. **Test Pending Deliveries**: Verify dimensions display correctly for pending artwork orders
2. **Test Active Deliveries**: Check dimensions for accepted/in-transit orders
3. **Test Delivered History**: Confirm dimensions show in delivery history
4. **Test Individual Lookup**: Verify `getDeliveryRequestById()` returns correct dimensions
5. **Test Commission Orders**: Ensure commission dimensions still work (should be unchanged)

## Notes
- Commission requests continue to use the `dimensions` column from the `commission_requests` table (no change needed)
- The LEFT JOIN ensures that even if an artwork record is missing, the query won't fail
- The frontend has fallback handling (`order.artwork_dimensions || order.dimensions || 'N/A'`) for safety

## Date
Updated: January 19, 2025
