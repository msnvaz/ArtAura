-- Update existing shop_orders dates to be within last 30 days
-- This will make them appear in the "Last 30 days" analytics view

USE artaura_db;

-- Update order 1 - Today
UPDATE shop_orders 
SET date = NOW() 
WHERE order_id = 1;

-- Update order 2 - 3 days ago
UPDATE shop_orders 
SET date = DATE_SUB(NOW(), INTERVAL 3 DAY) 
WHERE order_id = 2;

-- Update order 3 - 5 days ago
UPDATE shop_orders 
SET date = DATE_SUB(NOW(), INTERVAL 5 DAY) 
WHERE order_id = 3;

-- Update order 5 - 7 days ago (cancelled, but update date anyway)
UPDATE shop_orders 
SET date = DATE_SUB(NOW(), INTERVAL 7 DAY) 
WHERE order_id = 5;

-- Update order 7 - 10 days ago (cancelled)
UPDATE shop_orders 
SET date = DATE_SUB(NOW(), INTERVAL 10 DAY) 
WHERE order_id = 7;

-- Update order 11 - 15 days ago
UPDATE shop_orders 
SET date = DATE_SUB(NOW(), INTERVAL 15 DAY) 
WHERE order_id = 11;

-- Verify the changes
SELECT 
    order_id,
    shop_id,
    artist_id,
    total,
    status,
    date,
    DATEDIFF(NOW(), date) as days_ago
FROM shop_orders
WHERE shop_id = 19
ORDER BY date DESC;

-- Now check if analytics will work
SELECT 
    COALESCE(SUM(total), 0) as totalRevenue,
    COUNT(*) as totalOrders,
    COUNT(DISTINCT artist_id) as totalCustomers
FROM shop_orders
WHERE shop_id = 19 AND status = 'approved'
AND date >= DATE_SUB(NOW(), INTERVAL 30 DAY);

-- Expected Result:
-- totalRevenue: 46750.00 (Orders 1, 2, 3, 11 = 18750 + 45600 + 6450 + 22000)
-- totalOrders: 4
-- totalCustomers: 4 (artist_id: 1, 2, 3, 11)
