# Shop Orders Implementation Guide

## Overview
This document explains the complete implementation of the shop orders system where artists can purchase products from shops, and shops can view and manage their orders filtered by `shop_id`.

## Database Setup

### Step 1: Create the Table
Run the SQL script located at: `shop_orders_table.sql`

```bash
# Connect to your MySQL database and run:
mysql -u your_username -p your_database < shop_orders_table.sql
```

Or manually execute the SQL in your database client.

### Table Structure: `shop_orders`
- **order_id** (Primary Key, Auto Increment)
- **order_number** (Unique, e.g., #ORD-2025-120)
- **shop_id** (Foreign Key → shops table)
- **artist_id** (Foreign Key → users table)
- **Customer Information**: name, email, phone, delivery_address
- **Order Details**: order_items (JSON), total_amount, currency
- **Status**: pending, processing, shipped, delivered, cancelled
- **Shipping**: tracking_number, shipped_date, delivered_date
- **Feedback**: rating (1-5), review_text
- **Notes**: order_notes
- **Timestamps**: created_at, updated_at

### Dummy Data
The SQL script includes:
- **10 orders for shop_id = 15** (your logged-in shop)
- **2 orders for shop_id = 16** (for testing multi-shop filtering)

## Backend Implementation

### 1. DTO Layer
**File**: `ShopOrderDTO.java`
- Located at: `server/artaura/src/main/java/com/artaura/artaura/dto/order/`
- Uses Lombok @Data annotation
- Contains all fields from database table
- Includes constructors for easy object creation

### 2. DAO Layer
**Interface**: `ShopOrderDAO.java`
- `findByShopId(Long shopId)` - Get all orders for a specific shop
- `findById(Long orderId)` - Get single order
- `findAll()` - Get all orders (admin)
- `save(ShopOrderDTO)` - Create new order
- `update(Long, ShopOrderDTO)` - Update order
- `deleteById(Long)` - Delete order

**Implementation**: `ShopOrderDAOImpl.java`
- Uses JdbcTemplate for database operations
- Includes logging for debugging
- Custom RowMapper for ResultSet → DTO conversion
- Handles nullable fields properly (rating)

### 3. Service Layer
**Interface**: `ShopOrderService.java`
- Business logic layer between Controller and DAO

**Implementation**: `ShopOrderServiceImpl.java`
- Delegates to DAO
- Adds additional logging
- Handles exceptions and error messages

### 4. Controller Layer
**File**: `ShopOrderController.java`
- **Base URL**: `/api/shop/orders`
- **CORS**: Enabled for `http://localhost:5173`

#### Endpoints:

1. **GET /api/shop/orders?shopId={id}**
   - Get all orders for a specific shop
   - Example: `/api/shop/orders?shopId=15`
   - Returns: List of ShopOrderDTO

2. **GET /api/shop/orders/{orderId}**
   - Get a single order by ID
   - Example: `/api/shop/orders/1`
   - Returns: ShopOrderDTO or 404

3. **GET /api/shop/orders/all**
   - Get all orders (admin only)
   - Returns: List of all ShopOrderDTO

4. **POST /api/shop/orders**
   - Create a new order
   - Body: ShopOrderDTO (JSON)
   - Returns: Success message

5. **PUT /api/shop/orders/{orderId}**
   - Update an existing order
   - Body: ShopOrderDTO (JSON)
   - Returns: Success message

6. **DELETE /api/shop/orders/{orderId}**
   - Delete an order
   - Returns: Success message

## Frontend Integration

### Current Status
The `Orders.jsx` page currently uses hardcoded dummy data.

### Next Step: Update Frontend
You need to modify `Orders.jsx` to fetch data from the backend:

```javascript
// At the top of Orders.jsx
const API_URL = import.meta.env.VITE_API_URL;

// Replace the hardcoded orders array with state
const [orders, setOrders] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

// Add useEffect to fetch orders
useEffect(() => {
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const shopId = localStorage.getItem("shopId");

      if (!shopId) {
        throw new Error("Shop ID not found. Please log in again.");
      }

      const response = await fetch(`${API_URL}/api/shop/orders?shopId=${shopId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      
      // Transform the data to match your frontend format
      const transformedOrders = data.map(order => ({
        id: order.orderNumber,
        customer: order.customerName,
        email: order.customerEmail,
        phone: order.customerPhone,
        items: JSON.parse(order.orderItems).map(item => item.name),
        total: `${order.currency} ${order.totalAmount.toLocaleString()}`,
        status: order.status,
        date: new Date(order.orderDate).toISOString().split('T')[0],
        address: order.deliveryAddress,
        rating: order.rating,
        trackingNumber: order.trackingNumber,
        notes: order.orderNotes
      }));

      setOrders(transformedOrders);
      setError(null);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  fetchOrders();
}, []);
```

## Testing Steps

### 1. Database Setup
```sql
-- Verify table was created
DESCRIBE shop_orders;

-- Check dummy data for shop_id = 15
SELECT * FROM shop_orders WHERE shop_id = 15 ORDER BY order_date DESC;

-- Verify 10 orders exist for shop 15
SELECT COUNT(*) FROM shop_orders WHERE shop_id = 15;
```

### 2. Backend API Testing
Use Postman or curl to test endpoints:

```bash
# Get orders for shop 15
curl -X GET "http://localhost:8081/api/shop/orders?shopId=15" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get a single order
curl -X GET "http://localhost:8081/api/shop/orders/1" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Expected Response:
# {
#   "orderId": 1,
#   "orderNumber": "#ORD-2025-120",
#   "shopId": 15,
#   "customerName": "Priyanka Wijesinghe",
#   "totalAmount": 18750.00,
#   "status": "delivered",
#   ...
# }
```

### 3. Frontend Testing
1. **Login as shop with shopId = 15**
2. **Navigate to Orders page** (`/shop/orders`)
3. **Verify**:
   - 10 orders are displayed
   - All orders belong to shop 15
   - Filtering by status works
   - Search functionality works
   - Order details modal displays correctly

### 4. Multi-Shop Testing
1. **Login as shop with shopId = 16**
2. **Navigate to Orders page**
3. **Verify**: Only 2 orders are displayed (for shop 16)

## Data Flow

```
┌─────────────────┐
│   Frontend      │
│   Orders.jsx    │
└────────┬────────┘
         │
         │ GET /api/shop/orders?shopId=15
         ▼
┌─────────────────────┐
│ ShopOrderController │
└────────┬────────────┘
         │
         ▼
┌──────────────────────┐
│ ShopOrderService     │
└────────┬─────────────┘
         │
         ▼
┌──────────────────┐
│ ShopOrderDAO     │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   Database       │
│  shop_orders     │
└──────────────────┘
```

## Order Items JSON Format

Orders are stored with items as JSON strings in the `order_items` column:

```json
[
  {
    "productId": 1,
    "name": "Premium Acrylic Paint Set 24 Colors",
    "quantity": 1,
    "price": 12500
  },
  {
    "productId": 2,
    "name": "Professional Canvas Board Set",
    "quantity": 1,
    "price": 6250
  }
]
```

When fetching on frontend, parse this JSON to display individual items.

## Status Workflow

1. **pending** → Order created, awaiting payment confirmation
2. **processing** → Payment confirmed, preparing to ship
3. **shipped** → Order dispatched with tracking number
4. **delivered** → Order received by customer (can add rating)
5. **cancelled** → Order cancelled before shipping

## Important Notes

### Foreign Keys
The SQL script includes foreign key constraints to `shops` and `users` tables. If these constraints fail during table creation:
- Either remove the FK constraints temporarily
- Or ensure you have matching records in `shops` and `users` tables

### Shop ID Consistency
- Make sure `localStorage.shopId` is set correctly on login
- The same `shopId` used for products should be used for orders
- Test with multiple shop IDs to verify isolation

### Order Number Generation
For production, you'll want to generate unique order numbers. Example:
```java
String orderNumber = String.format("#ORD-%d-%05d", 
    Year.now().getValue(), 
    nextSequenceNumber);
```

## Next Steps

1. ✅ **Run the SQL script** to create table and insert dummy data
2. ✅ **Backend is complete** - DTO, DAO, Service, Controller all created
3. ⏳ **Update frontend** - Modify Orders.jsx to fetch from API
4. ⏳ **Test** - Login and verify orders display correctly
5. **Future Enhancement**: Implement artist-side "Place Order" functionality

## Files Created

### Backend
- `server/artaura/src/main/java/com/artaura/artaura/dto/order/ShopOrderDTO.java`
- `server/artaura/src/main/java/com/artaura/artaura/dao/ShopOrderDAO.java`
- `server/artaura/src/main/java/com/artaura/artaura/dao/Impl/ShopOrderDAOImpl.java`
- `server/artaura/src/main/java/com/artaura/artaura/service/ShopOrderService.java`
- `server/artaura/src/main/java/com/artaura/artaura/service/ShopOrderServiceImpl.java`
- `server/artaura/src/main/java/com/artaura/artaura/controller/ShopOrderController.java`

### Database
- `shop_orders_table.sql`

### Documentation
- This README file

## Troubleshooting

### Problem: No orders showing up
- Check browser console for API errors
- Verify `shopId` in localStorage: `localStorage.getItem('shopId')`
- Check backend logs for SQL errors
- Verify database has data: `SELECT * FROM shop_orders WHERE shop_id = 15;`

### Problem: 500 Server Error
- Check application logs for stack trace
- Verify database connection is working
- Check if table exists and has correct column names

### Problem: Empty order_items array on frontend
- Verify JSON parsing: `JSON.parse(order.orderItems)`
- Check database - items should be valid JSON string

## Support
If you encounter issues, check:
1. Backend logs (console output)
2. Frontend console (browser DevTools)
3. Network tab (check API requests/responses)
4. Database (verify data exists and structure is correct)
