-- Quick check: Does shop 19 have any orders at all?
USE artaura_db;

SELECT 'Total shop_orders records:' as info, COUNT(*) as count FROM shop_orders;

SELECT 'Shop 19 orders (any status):' as info, COUNT(*) as count 
FROM shop_orders WHERE shop_id = 19;

SELECT 'Shop 19 APPROVED orders:' as info, COUNT(*) as count 
FROM shop_orders WHERE shop_id = 19 AND status = 'approved';

-- Show all shop 19 orders
SELECT order_id, shop_id, artist_id, total, status, date 
FROM shop_orders 
WHERE shop_id = 19 
ORDER BY date DESC;

-- The exact query that AnalyticsDAOImpl uses
SELECT 
    COALESCE(SUM(total), 0) as totalRevenue, 
    COUNT(*) as totalOrders, 
    COUNT(DISTINCT artist_id) as totalCustomers,
    COALESCE(AVG(total), 0) as avgOrderValue 
FROM shop_orders 
WHERE shop_id = 19 AND status = 'approved' 
AND date >= DATE_SUB(NOW(), INTERVAL 30 DAY);
