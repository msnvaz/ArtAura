# Analytics Status Filter Update

## Changes Made

### Updated Backend Query Logic

**Previous Logic:** Counted all orders except cancelled (`status != 'cancelled'`)
- This included: pending, approved orders

**New Logic:** Only counts approved orders (`status = 'approved'`)
- This includes: ONLY approved orders
- Excludes: pending, cancelled orders

---

## Files Modified

### 1. `AnalyticsDAOImpl.java` - 3 SQL Query Updates

#### Change 1: `getMetricsSummary()` method
```java
// BEFORE:
WHERE shop_id = ? AND status != 'cancelled'

// AFTER:
WHERE shop_id = ? AND status = 'approved'
```

#### Change 2: `getSalesData()` method (both queries)
```java
// BEFORE:
WHERE shop_id = ? AND status != 'cancelled'

// AFTER:
WHERE shop_id = ? AND status = 'approved'
```

#### Change 3: `calculateChanges()` method
```java
// BEFORE:
WHERE shop_id = ? AND status != 'cancelled'

// AFTER:
WHERE shop_id = ? AND status = 'approved'
```

---

## Impact on Analytics

### Statistics Cards:
- **Total Revenue:** Now sums ONLY `total` where `status = 'approved'`
- **Total Orders:** Now counts ONLY orders where `status = 'approved'`
- **Customers:** Counts unique `artist_id` from approved orders only
- **Avg Order Value:** Average of approved orders only

### Sales Overview Chart:
- Shows revenue/orders/customers from approved orders only
- Excludes pending and cancelled orders

### Top Products:
- Calculates sales based on approved orders only

---

## Test Data Expected Results

After running `add_shop19_orders.sql`, the analytics should show:

**With the test data:**
- **8 approved orders** (Orders 1-8)
- **1 pending order** (Order 9) - NOT counted
- **1 cancelled order** (Order 10) - NOT counted

### Expected Analytics Values:
```
Total Revenue: Rs. 47,500 (sum of approved orders only)
Total Orders: 8 (approved orders only)
Customers: 4 (unique artist_ids: 1, 2, 3, 4)
Avg Order Value: Rs. 5,937.50 (47,500 / 8)
```

---

## SQL to Verify

Run this in your database to check approved orders:

```sql
-- Check approved orders for Shop 19
SELECT 
    order_id,
    total,
    status,
    date
FROM shop_orders 
WHERE shop_id = 19 AND status = 'approved'
ORDER BY date DESC;

-- Check totals
SELECT 
    COUNT(*) as total_approved_orders,
    SUM(total) as total_revenue,
    AVG(total) as avg_order_value
FROM shop_orders 
WHERE shop_id = 19 AND status = 'approved';
```

---

## Next Steps

1. **Restart Backend Server** (if not already done):
   ```powershell
   cd d:\Artaura\ArtAura\server\artaura
   .\mvnw.cmd spring-boot:run -DskipTests
   ```

2. **Add Test Data** (if shop 19 has no approved orders):
   ```sql
   source D:/Artaura/ArtAura/add_shop19_orders.sql
   ```

3. **Refresh Analytics Page**:
   - Hard refresh: `Ctrl + Shift + R`
   - Check that only approved orders are counted

4. **Verify Results**:
   - Statistics cards show approved order totals
   - Sales chart displays approved orders by month
   - No pending or cancelled orders in calculations

---

## Status Filter Behavior

| Order Status | Counted in Analytics? |
|--------------|----------------------|
| `approved`   | ✅ YES               |
| `pending`    | ❌ NO                |
| `cancelled`  | ❌ NO                |

---

**Summary:** The analytics now accurately reflects only completed (approved) orders, giving you the true revenue and order metrics for your shop! 🎉

**Updated:** 2025-10-18
