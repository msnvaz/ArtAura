-- Verify Shop 19 Analytics Data
-- Run this to check if the statistics cards should be showing data

USE artaura_db;

-- 1. Check if Shop 19 exists
SELECT 'Shop 19 exists:' as check_name, COUNT(*) as result 
FROM shops WHERE shop_id = 19;

-- 2. Check total number of orders for Shop 19
SELECT 'Total orders for Shop 19:' as check_name, COUNT(*) as result 
FROM shop_orders WHERE shop_id = 19;

-- 3. Check approved orders for Shop 19
SELECT 'Approved orders for Shop 19:' as check_name, COUNT(*) as result 
FROM shop_orders WHERE shop_id = 19 AND status = 'approved';

-- 4. Check Total Revenue from approved orders
SELECT 'Total Revenue (approved):' as check_name, COALESCE(SUM(total), 0) as result 
FROM shop_orders WHERE shop_id = 19 AND status = 'approved';

-- 5. Check Customer Count (distinct artists)
SELECT 'Customer Count (distinct artists):' as check_name, COUNT(DISTINCT artist_id) as result 
FROM shop_orders WHERE shop_id = 19 AND status = 'approved';

-- 6. Show all orders for Shop 19 with details
SELECT 
    order_id,
    artist_id,
    total,
    status,
    DATE_FORMAT(date, '%Y-%m-%d %H:%i:%s') as order_date
FROM shop_orders 
WHERE shop_id = 19 
ORDER BY date DESC;

-- 7. Expected results for the analytics cards (based on test data)
SELECT 
    'Expected Total Revenue:' as metric,
    '47,500' as value,
    '8 approved orders @ Rs. 47,500 total' as note
UNION ALL
SELECT 
    'Expected Total Orders:' as metric,
    '8' as value,
    'Only approved orders counted' as note
UNION ALL
SELECT 
    'Expected Customer Count:' as metric,
    '4' as value,
    'Distinct artist_ids: 1, 2, 3, 4' as note;
