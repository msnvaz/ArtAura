# Analytics Statistics Cards - Troubleshooting & Fix Guide

## Issue
The statistics cards (Total Revenue, Total Orders, Customers) are showing zeros or incorrect values.

## Root Cause Analysis
The backend code is **CORRECT** and properly queries the database:
- ✅ Filters by `shop_id` and `status = 'approved'`
- ✅ Calculates Total Revenue: `SUM(total)`
- ✅ Counts Total Orders: `COUNT(*)`
- ✅ Counts Customers: `COUNT(DISTINCT artist_id)`

**The most likely issue is:** The test data hasn't been inserted into the database yet.

## Solution Steps

### Step 1: Verify Current Database State

Run the verification SQL script to check if data exists:

```sql
-- Open your MySQL client and run:
SOURCE d:/Artaura/ArtAura/verify_shop19_analytics.sql;
```

Or manually run these queries:

```sql
USE artaura_db;

-- Check approved orders count
SELECT COUNT(*) FROM shop_orders WHERE shop_id = 19 AND status = 'approved';

-- Check total revenue
SELECT SUM(total) FROM shop_orders WHERE shop_id = 19 AND status = 'approved';

-- Check customer count
SELECT COUNT(DISTINCT artist_id) FROM shop_orders WHERE shop_id = 19 AND status = 'approved';
```

**If these queries return 0 or NULL**, proceed to Step 2.

### Step 2: Insert Test Data

Run the test data SQL script:

```sql
SOURCE d:/Artaura/ArtAura/add_shop19_orders.sql;
```

Or you can run it using MySQL Workbench or command line:

```bash
# PowerShell
mysql -h mysql-artaura.alwaysdata.net -u artaura -p artaura_db < "d:\Artaura\ArtAura\add_shop19_orders.sql"
```

**This will insert 10 orders:**
- 8 approved orders (will show in analytics)
- 1 pending order (excluded from analytics)
- 1 cancelled order (excluded from analytics)

### Step 3: Restart Backend Server

The backend code has been updated with the correct status filter logic. Restart the server to ensure all changes are loaded:

1. **Stop the current server:**
   - Press `Ctrl+C` in the terminal running the Spring Boot app
   - Or kill the process on port 8081

2. **Start the server:**
   ```powershell
   cd d:\Artaura\ArtAura\server\artaura
   .\mvnw.cmd spring-boot:run -DskipTests
   ```

3. **Wait for:** "Started ArtauraApplication in X seconds"

### Step 4: Test the API Endpoint

Once the server is running, test the analytics endpoint:

```powershell
# Using curl or your browser
curl http://localhost:8081/api/shop/analytics?shopId=19&period=30days
```

**Expected Response:**
```json
{
  "metricsSummary": {
    "totalRevenue": 47500.00,
    "totalOrders": 8,
    "totalCustomers": 4,
    "avgOrderValue": 5937.50,
    "revenueChange": "+0.0%",
    "ordersChange": "+0.0%",
    "customersChange": "+0.0%",
    "avgOrderValueChange": "+0.0%"
  },
  "salesData": [...],
  "topProducts": [...]
}
```

### Step 5: Refresh the Frontend

1. Open the browser and navigate to the Analytics page
2. **Hard refresh:** `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
3. The statistics cards should now display:
   - **Total Revenue:** Rs. 47,500
   - **Total Orders:** 8
   - **Customers:** 4

## What the Backend Does (Technical Details)

### SQL Query in AnalyticsDAOImpl.getMetricsSummary()

```java
String sql = "SELECT " +
        "COALESCE(SUM(total), 0) as totalRevenue, " +
        "COUNT(*) as totalOrders, " +
        "COUNT(DISTINCT artist_id) as totalCustomers, " +
        "COALESCE(AVG(total), 0) as avgOrderValue " +
        "FROM shop_orders " +
        "WHERE shop_id = ? AND status = 'approved' " + dateCondition;
```

**Key Points:**
- ✅ Only counts orders with `status = 'approved'`
- ✅ Sums the `total` column for revenue
- ✅ Counts all matching orders for total orders
- ✅ Counts distinct `artist_id` values for customer count
- ✅ Filters by the logged-in shop's `shop_id`
- ✅ Applies date filter based on selected period (7days, 30days, 90days, 12months)

### Test Data Breakdown

**8 Approved Orders** (counted in analytics):
1. Today - Rs. 5,000 (Artist 1)
2. 3 days ago - Rs. 6,000 (Artist 2)
3. 5 days ago - Rs. 2,500 (Artist 1)
4. 7 days ago - Rs. 8,000 (Artist 3)
5. 10 days ago - Rs. 4,500 (Artist 2)
6. 15 days ago - Rs. 12,000 (Artist 4)
7. 20 days ago - Rs. 2,500 (Artist 1)
8. 25 days ago - Rs. 7,000 (Artist 3)

**Total:** Rs. 47,500  
**Distinct Artists:** 4 (Artist IDs: 1, 2, 3, 4)  
**Average Order Value:** Rs. 5,937.50

**1 Pending Order** (not counted):
- 28 days ago - Rs. 4,000 (Artist 2)

**1 Cancelled Order** (not counted):
- 30 days ago - Rs. 3,500 (Artist 3)

## Troubleshooting

### Issue: Still showing zeros after data insertion

**Solution:**
1. Verify the data was actually inserted:
   ```sql
   SELECT * FROM shop_orders WHERE shop_id = 19 LIMIT 10;
   ```
2. Check the backend logs for errors
3. Verify the `shopId` in localStorage matches 19:
   ```javascript
   // Browser console
   localStorage.getItem('shopId')
   ```

### Issue: Backend returns 500 error

**Solution:**
1. Check backend logs for SQL errors
2. Verify database connection is working
3. Ensure the `shop_orders` table exists with correct schema

### Issue: Frontend shows old data

**Solution:**
1. Clear browser cache
2. Hard refresh: `Ctrl + Shift + R`
3. Check browser console for errors (F12)
4. Verify API call is being made to the correct endpoint

## Files Modified/Created

1. ✅ **AnalyticsDAOImpl.java** - Backend SQL queries (already correct)
2. ✅ **Analytics.jsx** - Frontend removed Avg Order Value card
3. ✅ **add_shop19_orders.sql** - Test data script (ready to run)
4. ✅ **verify_shop19_analytics.sql** - Verification queries (new file)
5. ✅ **ANALYTICS_STATISTICS_FIX.md** - This guide (new file)

## Expected Result

After completing all steps, the Analytics page should display:

**Statistics Cards:**
- 📊 Total Revenue: **Rs. 47,500** (with trend indicator)
- 🛒 Total Orders: **8** (with trend indicator)
- 👥 Customers: **4** (with trend indicator)

**Sales Overview Chart:**
- Shows monthly revenue/orders/customers based on selected metric
- Displays bars for months with data

**Top Products:**
- Shows top 5 products by sales from the products table

---

**Status:** Backend code is correct. Need to insert test data and restart server.
