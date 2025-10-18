-- Run this in your MySQL client to see what the backend will fetch
-- Replace ? with actual shop_id = 19

USE artaura_db;

-- This is what the backend runs (with ? replaced by 19)
SELECT 
    COALESCE(SUM(total), 0) as totalRevenue,
    COUNT(*) as totalOrders,
    COUNT(DISTINCT artist_id) as totalCustomers,
    COALESCE(AVG(total), 0) as avgOrderValue
FROM shop_orders
WHERE shop_id = 19 AND status = 'approved'
AND date >= DATE_SUB(NOW(), INTERVAL 30 DAY);

-- Show the actual rows that match
SELECT 
    order_id,
    shop_id,
    artist_id,
    total,
    status,
    date
FROM shop_orders
WHERE shop_id = 19 AND status = 'approved'
AND date >= DATE_SUB(NOW(), INTERVAL 30 DAY)
ORDER BY date DESC;

-- Check ALL orders for shop 19 (any status, any date)
SELECT 
    COUNT(*) as total_count,
    SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved_count,
    SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_count,
    SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_count
FROM shop_orders
WHERE shop_id = 19;
