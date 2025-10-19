# Complete Analytics Setup Guide

## What You Need to Do

### Step 1: Run the SQL Script

Open your MySQL client and run this file:
```
d:\Artaura\ArtAura\fresh_shop19_test_data.sql
```

Or copy this command in MySQL:

```sql
USE artaura_db;

-- Clear old shop 19 data (optional)
DELETE FROM shop_orders WHERE shop_id = 19;

-- Insert 15 new orders
INSERT INTO shop_orders (shop_id, artist_id, items, total, status, date) VALUES
(19, 1, 'Premium Acrylic Paint Set 24 Colors, Professional Grade Brushes', 18750.00, 'approved', NOW()),
(19, 2, 'Digital Drawing Tablet Pro, Stylus Pen Set, Tablet Stand', 45600.00, 'approved', DATE_SUB(NOW(), INTERVAL 2 DAY)),
(19, 3, 'Watercolor Paper Pad A3, Fine Art Brushes Set, Palette', 6450.00, 'approved', DATE_SUB(NOW(), INTERVAL 4 DAY)),
(19, 4, 'Oil Painting Starter Kit, Palette Knife Set, Canvas Pack', 22300.00, 'pending', DATE_SUB(NOW(), INTERVAL 6 DAY)),
(19, 5, 'Sketching Pencils Professional Set, Charcoal Sticks, Eraser Set', 8920.00, 'cancelled', DATE_SUB(NOW(), INTERVAL 8 DAY)),
(19, 1, 'Canvas Panels 12x16 Set, Gesso Primer, Varnish Spray', 15400.00, 'approved', DATE_SUB(NOW(), INTERVAL 10 DAY)),
(19, 7, 'Calligraphy Pen Set, Ink Bottles Collection, Practice Paper', 5670.00, 'cancelled', DATE_SUB(NOW(), INTERVAL 12 DAY)),
(19, 2, 'Poster Colors Set 12, Mixing Palette, Brush Cleaner', 3850.00, 'approved', DATE_SUB(NOW(), INTERVAL 14 DAY)),
(19, 9, 'Wood Carving Tools Set, Safety Gloves, Wax Finish', 12500.00, 'pending', DATE_SUB(NOW(), INTERVAL 16 DAY)),
(19, 3, 'Art Portfolio Case A2, Mounting Board Sheets, Fixative Spray', 9340.00, 'approved', DATE_SUB(NOW(), INTERVAL 18 DAY)),
(19, 11, 'Professional Easel, Canvas Rolls, Stretcher Bars', 22000.00, 'approved', DATE_SUB(NOW(), INTERVAL 20 DAY)),
(19, 2, 'Soft Pastels Set 48, Pastel Paper Pad, Fixative', 7800.00, 'approved', DATE_SUB(NOW(), INTERVAL 22 DAY)),
(19, 12, 'Spray Paint Set 12 Colors, Protective Mask, Drop Cloth', 4560.00, 'approved', DATE_SUB(NOW(), INTERVAL 24 DAY)),
(19, 1, 'Sculpture Clay 5kg, Modeling Tools, Wire Armature', 11200.00, 'approved', DATE_SUB(NOW(), INTERVAL 26 DAY)),
(19, 13, 'Printmaking Kit, Lino Blocks, Brayer Roller', 6750.00, 'pending', DATE_SUB(NOW(), INTERVAL 28 DAY));
```

### Step 2: Verify the Data

Run this query to confirm:

```sql
SELECT 
    COALESCE(SUM(total), 0) as totalRevenue,
    COUNT(*) as totalOrders,
    COUNT(DISTINCT artist_id) as totalCustomers
FROM shop_orders
WHERE shop_id = 19 AND status = 'approved'
AND date >= DATE_SUB(NOW(), INTERVAL 30 DAY);
```

**Expected Result:**
- Total Revenue: Rs. 144,950
- Total Orders: 10
- Total Customers: 6

### Step 3: Refresh the Analytics Page

1. Open the Analytics page in your browser
2. The default period is already set to "**Last 30 days**" ✅
3. Hard refresh: **Ctrl + Shift + R**

### Step 4: What You'll See

**Statistics Cards:**
- 💰 **Total Revenue:** Rs. 144,950
- 🛒 **Total Orders:** 10
- 👥 **Customers:** 6

**Sales Chart:**
- Will show bars for the past months with data

**Top Products:**
- Will show your top 5 products

---

## Data Breakdown

### ✅ Approved Orders (10 orders - COUNTED in analytics):

| Days Ago | Artist | Amount | Date |
|----------|--------|--------|------|
| Today | 1 | Rs. 18,750 | Oct 18 |
| 2 days | 2 | Rs. 45,600 | Oct 16 |
| 4 days | 3 | Rs. 6,450 | Oct 14 |
| 10 days | 1 | Rs. 15,400 | Oct 8 |
| 14 days | 2 | Rs. 3,850 | Oct 4 |
| 18 days | 3 | Rs. 9,340 | Sep 30 |
| 20 days | 11 | Rs. 22,000 | Sep 28 |
| 22 days | 2 | Rs. 7,800 | Sep 26 |
| 24 days | 12 | Rs. 4,560 | Sep 24 |
| 26 days | 1 | Rs. 11,200 | Sep 22 |

**Total:** Rs. 144,950  
**Unique Artists:** 6 (IDs: 1, 2, 3, 11, 12)

### ⏳ Pending Orders (3 orders - NOT counted):

| Days Ago | Artist | Amount |
|----------|--------|--------|
| 6 days | 4 | Rs. 22,300 |
| 16 days | 9 | Rs. 12,500 |
| 28 days | 13 | Rs. 6,750 |

### ❌ Cancelled Orders (2 orders - NOT counted):

| Days Ago | Artist | Amount |
|----------|--------|--------|
| 8 days | 5 | Rs. 8,920 |
| 12 days | 7 | Rs. 5,670 |

---

## Summary

✅ **Default Period:** Already set to "Last 30 days"  
✅ **Backend Logic:** Correct - SUM(total), COUNT(*), COUNT(DISTINCT artist_id)  
✅ **Test Data:** Created with dates within last 30 days  
✅ **Expected Results:** Rs. 144,950 | 10 orders | 6 customers

**Just run the SQL script and refresh your browser!** 🎯
