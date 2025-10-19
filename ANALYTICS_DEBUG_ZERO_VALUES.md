# Analytics Debug Guide

## Issue: Statistics Cards Showing 0

### Possible Causes:

1. **No Data in Database**
   - Shop 19 has no orders in the `shop_orders` table
   - Solution: Run the SQL script to add test data

2. **Backend Not Returning Data**
   - Server is running but query returns empty results
   - Check backend logs for errors

3. **Frontend Not Reading Response**
   - Data is returned but not parsed correctly
   - Check browser console for errors

---

## How to Fix:

### Step 1: Add Test Data to Database

1. Open your MySQL client (phpMyAdmin, MySQL Workbench, or command line)
2. Run the script: `add_shop19_orders.sql`

**OR use command line:**
```bash
mysql -h mysql-artaura.alwaysdata.net -u artaura_db -p artaura_db < D:\Artaura\ArtAura\add_shop19_orders.sql
```

### Step 2: Verify Backend Response

Open your browser's **Developer Tools** (F12):

1. Go to **Network** tab
2. Refresh the Analytics page
3. Find the request: `analytics?shopId=19&period=30days`
4. Check the **Response** tab

**Expected Response:**
```json
{
  "metricsSummary": {
    "totalRevenue": 51500,
    "totalOrders": 9,
    "totalCustomers": 4,
    "avgOrderValue": 5722.22,
    "revenueChange": "+0.0%",
    "ordersChange": "+0.0%",
    "customersChange": "+0.0%",
    "avgOrderValueChange": "+0.0%"
  },
  "salesData": [...],
  "topProducts": [...],
  "recentOrders": [...]
}
```

**If you see all zeros:**
```json
{
  "metricsSummary": {
    "totalRevenue": 0,
    "totalOrders": 0,
    "totalCustomers": 0,
    "avgOrderValue": 0,
    ...
  }
}
```
This means **no data in database** for Shop 19.

### Step 3: Check Browser Console

In **Console** tab, look for:

**Good (No Errors):**
```
Loading analytics...
```

**Bad (Errors):**
```
GET http://localhost:8081/api/shop/analytics?shopId=19&period=30days 500 (Internal Server Error)
Error fetching analytics: Failed to fetch analytics data
```

If you see 500 error, check backend terminal for SQL errors.

---

## Quick Test Queries

Run these in MySQL to check if data exists:

```sql
-- Check if Shop 19 exists
SELECT * FROM shops WHERE shop_id = 19;

-- Check orders for Shop 19
SELECT 
    COUNT(*) as total_orders,
    SUM(total) as total_revenue
FROM shop_orders 
WHERE shop_id = 19 AND status != 'cancelled';

-- If result is 0, run the add_shop19_orders.sql script
```

---

## After Adding Data

1. **DO NOT** restart the backend server (already running)
2. **Refresh** the Analytics page in browser (Ctrl + Shift + R)
3. Statistics cards should now show:
   - Total Revenue: Rs. 51,500
   - Total Orders: 9
   - Customers: 4
   - Avg Order Value: Rs. 5,722

---

## Still Showing 0?

### Check These:

1. **Correct Shop ID?**
   - Open browser console
   - Type: `localStorage.getItem('shopId')`
   - Should return: `"19"`
   - If not, login again or manually set: `localStorage.setItem('shopId', '19')`

2. **Backend Server Running?**
   - Check: `netstat -ano | findstr ":8081.*LISTENING"`
   - Should show process listening on port 8081

3. **Database Connection?**
   - Check backend logs for connection errors
   - Verify .env file has correct database credentials

4. **Time Period?**
   - The test data is for the last 30 days
   - Make sure "Last 30 days" is selected in dropdown
   - Try changing to "Last 90 days" to see if data appears

---

## Expected Behavior After Fix

**Statistics Cards:**
- Total Revenue: Rs. 51,500
- Total Orders: 9
- Customers: 4 (unique artist_ids)
- Avg Order Value: Rs. 5,722

**Sales Overview Chart:**
- Bars showing order distribution across months
- Hover tooltips with values

**Top Products:**
- List of products from the orders
- Revenue and sales count per product

---

**Next Step:** Run the `add_shop19_orders.sql` script in your database!
