# Dashboard Backend Implementation

## Overview
Backend implementation for the Shop Dashboard statistics using the `shop_orders` and `products` tables.

## Created Files

### 1. DTO (Data Transfer Object)
**File:** `DashboardStatsDTO.java`
**Location:** `dto/dashboard/`
**Purpose:** Contains all dashboard statistics data
**Fields:**
- `totalRevenue` - Total revenue from all approved orders
- `revenueChange` - Percentage change compared to last month
- `productsInStock` - Count of products with stock > 0
- `stockChange` - Percentage change in stock
- `monthlyOrders` - Count of approved orders in current month
- `ordersChange` - Percentage change compared to last month
- `todayOrders` - Count of today's approved orders
- `todayRevenue` - Today's total revenue
- `todayNewCustomers` - Count of distinct customers today

### 2. DAO Interface
**File:** `DashboardDAO.java`
**Location:** `dao/`
**Purpose:** Interface for database operations
**Methods:**
- `getDashboardStats(Long shopId)` - Get all statistics
- `getTotalRevenue(Long shopId)` - Get total revenue
- `getMonthlyOrdersCount(Long shopId)` - Get current month orders
- `getProductsInStockCount(Long shopId)` - Get products in stock
- `getTodayOrdersCount(Long shopId)` - Get today's orders
- `getTodayRevenue(Long shopId)` - Get today's revenue
- `getTodayNewCustomersCount(Long shopId)` - Get today's new customers

### 3. DAO Implementation
**File:** `DashboardDAOImpl.java`
**Location:** `dao/impl/`
**Purpose:** Database queries implementation using JdbcTemplate
**Key Features:**
- Queries `shop_orders` table filtered by `shop_id` and `status='approved'`
- Queries `products` table for stock count
- Calculates percentage changes (current month vs last month)
- Uses proper SQL date functions (YEAR, MONTH, CURDATE)
- Comprehensive logging for debugging

**SQL Queries:**
```sql
-- Total Revenue
SELECT COALESCE(SUM(total), 0) 
FROM shop_orders 
WHERE shop_id = ? AND status = 'approved'

-- Monthly Orders Count
SELECT COUNT(*) 
FROM shop_orders 
WHERE shop_id = ? 
AND status = 'approved' 
AND YEAR(date) = YEAR(CURDATE()) 
AND MONTH(date) = MONTH(CURDATE())

-- Products in Stock
SELECT COUNT(*) 
FROM products 
WHERE shop_id = ? AND stock > 0

-- Today's Orders
SELECT COUNT(*) 
FROM shop_orders 
WHERE shop_id = ? 
AND status = 'approved' 
AND DATE(date) = CURDATE()

-- Today's Revenue
SELECT COALESCE(SUM(total), 0) 
FROM shop_orders 
WHERE shop_id = ? 
AND status = 'approved' 
AND DATE(date) = CURDATE()

-- Today's New Customers
SELECT COUNT(DISTINCT artist_id) 
FROM shop_orders 
WHERE shop_id = ? 
AND DATE(date) = CURDATE()
```

### 4. Service Interface
**File:** `DashboardService.java`
**Location:** `service/`
**Purpose:** Service layer interface

### 5. Service Implementation
**File:** `DashboardServiceImpl.java`
**Location:** `service/impl/`
**Purpose:** Business logic layer with error handling

### 6. Controller
**File:** `DashboardController.java`
**Location:** `controller/`
**Purpose:** REST API endpoint
**Endpoint:** `GET /api/shop/dashboard/stats?shopId={id}`
**Response Format:**
```json
{
  "totalRevenue": 325000.00,
  "revenueChange": "+12.5%",
  "productsInStock": 847,
  "stockChange": "+0.0%",
  "monthlyOrders": 156,
  "ordersChange": "+15.3%",
  "todayOrders": 12,
  "todayRevenue": 28500.00,
  "todayNewCustomers": 3
}
```

## Database Requirements

### Tables Used:
1. **shop_orders**
   - Columns: `order_id`, `shop_id`, `artist_id`, `items`, `total`, `status`, `date`
   - Status values: 'pending', 'approved', 'cancelled'
   - Only 'approved' status counted

2. **products**
   - Columns: `product_id`, `shop_id`, `stock`, etc.
   - Only products with `stock > 0` counted

## How It Works

1. **Total Revenue:**
   - Sums all `total` values from `shop_orders`
   - Filters: `shop_id` and `status='approved'`

2. **Monthly Orders:**
   - Counts orders in current month
   - Filters: `shop_id`, `status='approved'`, current YEAR and MONTH

3. **Products in Stock:**
   - Counts products with `stock > 0`
   - Filters: `shop_id`

4. **Percentage Changes:**
   - Compares current month with previous month
   - Formula: `((current - previous) / previous) * 100`
   - Returns formatted string with + or - sign

5. **Today's Statistics:**
   - Filters by `DATE(date) = CURDATE()`
   - Calculates orders, revenue, and distinct customers

## API Usage

### Request:
```http
GET http://localhost:8081/api/shop/dashboard/stats?shopId=19
Authorization: Bearer {token}
```

### Success Response (200 OK):
```json
{
  "totalRevenue": 325000.00,
  "revenueChange": "+12.5%",
  "productsInStock": 847,
  "stockChange": "+0.0%",
  "monthlyOrders": 156,
  "ordersChange": "+15.3%",
  "todayOrders": 12,
  "todayRevenue": 28500.00,
  "todayNewCustomers": 3
}
```

### Error Response (400/500):
```json
{
  "message": "Shop ID is required"
}
```

## Logging
All operations include comprehensive logging:
- Shop ID parameter
- SQL queries executed
- Results from each query
- Error stack traces if any issues occur

## Next Steps for Frontend

Update `Dashboard.jsx` to:
1. Fetch data from `/api/shop/dashboard/stats?shopId={shopId}`
2. Use `shopId` from localStorage
3. Replace hardcoded values with API data
4. Show loading/error states
5. Update stats cards dynamically

Example fetch code:
```javascript
const fetchDashboardStats = async () => {
  const token = localStorage.getItem("token");
  const shopId = localStorage.getItem("shopId");
  
  const response = await fetch(
    `${API_URL}/api/shop/dashboard/stats?shopId=${shopId}`,
    {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    }
  );
  
  const data = await response.json();
  // Update state with data
};
```

## Testing

1. Restart Spring Boot backend
2. Check logs for any startup errors
3. Test endpoint with Postman or browser
4. Verify SQL queries return correct data
5. Check percentage calculations are accurate

## Notes

- All queries use `COALESCE` to avoid NULL values
- Date comparisons use MySQL date functions
- Percentage changes handle division by zero
- Logging helps debug any data issues
- Only 'approved' status orders are counted
- Shop ID is required parameter
