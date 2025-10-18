# Analytics Backend Implementation

## Overview
This document describes the backend implementation for the Shop Analytics page, which fetches real data from the `shop_orders` and `products` tables.

## Architecture

### 1. **AnalyticsDTO.java** (Data Transfer Object)
Location: `server/artaura/src/main/java/com/artaura/artaura/dto/analytics/`

**Purpose**: Defines the structure of analytics data returned to the frontend.

**Nested Classes**:
- `MetricsSummary`: Contains total revenue, orders, customers, average order value, and their percentage changes
- `SalesDataPoint`: Monthly sales data (revenue, orders, customers)
- `TopProduct`: Top selling products with growth metrics
- `RecentOrder`: Recent order information

### 2. **AnalyticsDAO.java** (Interface)
Location: `server/artaura/src/main/java/com/artaura/artaura/dao/`

**Purpose**: Defines data access methods for analytics.

**Methods**:
- `getMetricsSummary(Long shopId, String period)`: Get summary metrics
- `getSalesData(Long shopId, String period)`: Get sales data points
- `getTopProducts(Long shopId, int limit)`: Get top selling products
- `getRecentOrders(Long shopId, int limit)`: Get recent orders

### 3. **AnalyticsDAOImpl.java** (Implementation)
Location: `server/artaura/src/main/java/com/artaura/artaura/dao/Impl/`

**Purpose**: Implements the DAO interface with actual database queries.

**Key Features**:

#### Metrics Summary
```sql
SELECT 
    COALESCE(SUM(total_amount), 0) as totalRevenue,
    COUNT(*) as totalOrders,
    COUNT(DISTINCT customer_name) as totalCustomers,
    COALESCE(AVG(total_amount), 0) as avgOrderValue
FROM shop_orders
WHERE shop_id = ? AND status != 'cancelled'
```

#### Sales Data (Monthly Aggregation)
```sql
SELECT 
    DATE_FORMAT(order_date, '%b') as month,
    COALESCE(SUM(total_amount), 0) as revenue,
    COUNT(*) as orders,
    COUNT(DISTINCT customer_name) as customers
FROM shop_orders
WHERE shop_id = ? AND status != 'cancelled'
AND order_date >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
GROUP BY MONTH(order_date), DATE_FORMAT(order_date, '%b')
ORDER BY MONTH(order_date)
```

#### Top Products
```sql
SELECT 
    p.id,
    p.name,
    p.category,
    COALESCE(p.sales, 0) as sales,
    COALESCE(p.sales * p.price, 0) as revenue
FROM products p
WHERE p.shop_id = ?
ORDER BY p.sales DESC, revenue DESC
LIMIT ?
```

#### Recent Orders
```sql
SELECT 
    order_number,
    customer_name,
    total_amount,
    status,
    order_date,
    order_items
FROM shop_orders
WHERE shop_id = ?
ORDER BY order_date DESC
LIMIT ?
```

**Helper Methods**:
- `getDateCondition(period)`: Returns SQL date filter based on period (7days, 30days, 90days, 12months)
- `calculateChanges()`: Compares current period with previous period to calculate percentage changes
- `calculatePercentageChange()`: Calculates percentage change between two values
- `calculateProductGrowth()`: Compares product sales between last 30 days and previous 30 days
- `countItemsInJson()`: Counts items in order_items JSON field

### 4. **AnalyticsService.java** (Interface)
Location: `server/artaura/src/main/java/com/artaura/artaura/service/`

**Purpose**: Defines business logic interface.

**Methods**:
- `getAnalytics(Long shopId, String period)`: Returns complete analytics data

### 5. **AnalyticsServiceImpl.java** (Implementation)
Location: `server/artaura/src/main/java/com/artaura/artaura/service/`

**Purpose**: Orchestrates DAO calls and assembles complete analytics response.

**Flow**:
1. Get metrics summary from DAO
2. Get sales data from DAO
3. Get top 5 products from DAO
4. Get last 10 recent orders from DAO
5. Assemble all data into AnalyticsDTO
6. Handle exceptions with proper logging

### 6. **AnalyticsController.java** (REST Controller)
Location: `server/artaura/src/main/java/com/artaura/artaura/controller/`

**Purpose**: Exposes REST API endpoint for analytics.

**Endpoint**:
```
GET /api/shop/analytics?shopId={shopId}&period={period}
```

**Parameters**:
- `shopId` (required): The shop ID to get analytics for
- `period` (optional, default: "30days"): Time period for analytics
  - Valid values: `7days`, `30days`, `90days`, `12months`

**Response**: Complete analytics data in JSON format

**Error Handling**:
- 400 Bad Request: Invalid shopId or period
- 500 Internal Server Error: Database or server errors

**CORS**: Enabled for `http://localhost:5173` and `http://localhost:5174`

## Frontend Integration

Update the `Analytics.jsx` to fetch data from the backend:

```javascript
const API_URL = import.meta.env.VITE_API_URL;

useEffect(() => {
  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token");
      const shopId = localStorage.getItem("shopId");
      
      const response = await fetch(
        `${API_URL}/api/shop/analytics?shopId=${shopId}&period=${selectedPeriod}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch analytics");
      }

      const data = await response.json();
      
      // Update state with real data
      setMetricsSummary(data.metricsSummary);
      setSalesData(data.salesData);
      setTopProducts(data.topProducts);
      setRecentOrders(data.recentOrders);
      
    } catch (err) {
      console.error("Error fetching analytics:", err);
    }
  };

  fetchAnalytics();
}, [selectedPeriod]);
```

## Database Schema Requirements

### shop_orders Table
Required columns:
- `order_id` (BIGINT, PRIMARY KEY)
- `order_number` (VARCHAR)
- `shop_id` (BIGINT)
- `customer_name` (VARCHAR)
- `customer_email` (VARCHAR)
- `total_amount` (DECIMAL)
- `status` (ENUM: pending, processing, shipped, delivered, cancelled)
- `order_date` (TIMESTAMP)
- `order_items` (TEXT - JSON format)

### products Table
Required columns:
- `id` (BIGINT, PRIMARY KEY)
- `shop_id` (BIGINT)
- `name` (VARCHAR)
- `category` (VARCHAR)
- `price` (DOUBLE)
- `sales` (INT)

## Features

### 1. **Period-based Analytics**
- Support for 4 different time periods (7 days, 30 days, 90 days, 12 months)
- Automatic date filtering in SQL queries
- Comparison with previous period for trend analysis

### 2. **Metrics Calculation**
- **Total Revenue**: Sum of all non-cancelled orders
- **Total Orders**: Count of all non-cancelled orders
- **Total Customers**: Distinct customer count
- **Average Order Value**: Revenue / Orders

### 3. **Percentage Changes**
- Compares current period with equal previous period
- Shows growth/decline trends
- Formatted as "+12.5%" or "-3.2%"

### 4. **Sales Data Visualization**
- Monthly aggregation of sales data
- Includes revenue, orders, and customers per month
- Supports both 6-month and 12-month views

### 5. **Top Products Analysis**
- Ranks products by sales volume
- Calculates revenue (sales × price)
- Shows growth percentage (last 30 days vs previous 30 days)
- Limits to top 5 products

### 6. **Recent Orders**
- Shows last 10 orders
- Includes order number, customer, amount, status, date
- Counts items in each order from JSON field

## Performance Considerations

1. **Indexed Columns**: Ensure indexes on:
   - `shop_orders.shop_id`
   - `shop_orders.order_date`
   - `shop_orders.status`
   - `products.shop_id`
   - `products.sales`

2. **Query Optimization**:
   - Uses `COALESCE` to handle NULL values
   - Filters out cancelled orders
   - Uses date range filtering for better performance
   - Limits result sets (TOP 5 products, last 10 orders)

3. **Caching Opportunities**:
   - Consider caching analytics data for 15-30 minutes
   - Invalidate cache when new orders are created

## Testing

### Test with Sample Data
```sql
-- Insert test orders
INSERT INTO shop_orders (order_number, shop_id, customer_name, customer_email, 
                        total_amount, status, order_date, order_items)
VALUES 
  ('#ORD-001', 1, 'John Doe', 'john@example.com', 5000.00, 'delivered', NOW() - INTERVAL 5 DAY, 
   '[{"productId": 1, "quantity": 2}]'),
  ('#ORD-002', 1, 'Jane Smith', 'jane@example.com', 3000.00, 'shipped', NOW() - INTERVAL 10 DAY,
   '[{"productId": 2, "quantity": 1}]');

-- Update product sales
UPDATE products SET sales = 50, price = 2500 WHERE id = 1;
UPDATE products SET sales = 30, price = 3000 WHERE id = 2;
```

### API Testing
```bash
# Test analytics endpoint
curl -X GET "http://localhost:8081/api/shop/analytics?shopId=1&period=30days" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Deployment Checklist

- [ ] All Java files compiled without errors
- [ ] Database tables exist with required columns
- [ ] Sample data inserted for testing
- [ ] Frontend updated to use new API endpoint
- [ ] CORS configuration matches frontend URL
- [ ] Environment variables configured (VITE_API_URL)
- [ ] JWT authentication working
- [ ] Error handling tested
- [ ] Performance tested with larger datasets

## Next Steps

1. Update `Analytics.jsx` to fetch from backend API
2. Add loading states and error handling in frontend
3. Insert test data into database
4. Test all period options (7days, 30days, 90days, 12months)
5. Verify all metrics calculations
6. Test with multiple shops to ensure data isolation

## API Response Example

```json
{
  "metricsSummary": {
    "totalRevenue": 485000.00,
    "totalOrders": 125,
    "totalCustomers": 98,
    "avgOrderValue": 3880.00,
    "revenueChange": "+12.5%",
    "ordersChange": "+8.3%",
    "customersChange": "+15.7%",
    "avgOrderValueChange": "-2.1%"
  },
  "salesData": [
    {"month": "Jan", "revenue": 485000, "orders": 125, "customers": 98},
    {"month": "Feb", "revenue": 532000, "orders": 142, "customers": 112}
  ],
  "topProducts": [
    {
      "id": 1,
      "name": "Watercolor Paint Set",
      "sales": 89,
      "revenue": 253650.00,
      "growth": 15.2,
      "category": "Paints"
    }
  ],
  "recentOrders": [
    {
      "id": "#ORD-2025-135",
      "customer": "Kasun Wijesinghe",
      "amount": 4850.00,
      "status": "shipped",
      "date": "2025-07-22",
      "items": 3
    }
  ]
}
```
