-- Add test orders for Shop 19 Analytics
-- This will populate the analytics dashboard with sample data

USE artaura_db;

-- First, let's check if Shop 19 exists
SELECT * FROM shops WHERE shop_id = 19 LIMIT 1;

-- Delete any existing test data for Shop 19 (optional - uncomment if needed)
-- DELETE FROM shop_orders WHERE shop_id = 19;

-- Insert sample orders for the last 30 days
-- These orders will show up in the analytics dashboard

-- Order 1 - Today
INSERT INTO shop_orders (shop_id, artist_id, items, total, status, date)
VALUES (
    19,
    1,
    '[{"productId":101,"name":"Abstract Painting","quantity":1,"price":5000}]',
    5000.00,
    'approved',
    NOW()
);

-- Order 2 - 3 days ago
INSERT INTO shop_orders (shop_id, artist_id, items, total, status, date)
VALUES (
    19,
    2,
    '[{"productId":102,"name":"Ceramic Vase","quantity":2,"price":3000}]',
    6000.00,
    'approved',
    DATE_SUB(NOW(), INTERVAL 3 DAY)
);

-- Order 3 - 5 days ago
INSERT INTO shop_orders (shop_id, artist_id, items, total, status, date)
VALUES (
    19,
    1,
    '[{"productId":103,"name":"Watercolor Set","quantity":1,"price":2500}]',
    2500.00,
    'approved',
    DATE_SUB(NOW(), INTERVAL 5 DAY)
);

-- Order 4 - 7 days ago
INSERT INTO shop_orders (shop_id, artist_id, items, total, status, date)
VALUES (
    19,
    3,
    '[{"productId":104,"name":"Sculpture","quantity":1,"price":8000}]',
    8000.00,
    'approved',
    DATE_SUB(NOW(), INTERVAL 7 DAY)
);

-- Order 5 - 10 days ago
INSERT INTO shop_orders (shop_id, artist_id, items, total, status, date)
VALUES (
    19,
    2,
    '[{"productId":105,"name":"Canvas Frame","quantity":3,"price":1500}]',
    4500.00,
    'approved',
    DATE_SUB(NOW(), INTERVAL 10 DAY)
);

-- Order 6 - 15 days ago
INSERT INTO shop_orders (shop_id, artist_id, items, total, status, date)
VALUES (
    19,
    4,
    '[{"productId":106,"name":"Oil Painting","quantity":1,"price":12000}]',
    12000.00,
    'approved',
    DATE_SUB(NOW(), INTERVAL 15 DAY)
);

-- Order 7 - 20 days ago
INSERT INTO shop_orders (shop_id, artist_id, items, total, status, date)
VALUES (
    19,
    1,
    '[{"productId":107,"name":"Sketch Book","quantity":5,"price":500}]',
    2500.00,
    'approved',
    DATE_SUB(NOW(), INTERVAL 20 DAY)
);

-- Order 8 - 25 days ago
INSERT INTO shop_orders (shop_id, artist_id, items, total, status, date)
VALUES (
    19,
    3,
    '[{"productId":108,"name":"Acrylic Paints","quantity":2,"price":3500}]',
    7000.00,
    'approved',
    DATE_SUB(NOW(), INTERVAL 25 DAY)
);

-- Order 9 - 28 days ago (pending status)
INSERT INTO shop_orders (shop_id, artist_id, items, total, status, date)
VALUES (
    19,
    2,
    '[{"productId":109,"name":"Art Supplies Kit","quantity":1,"price":4000}]',
    4000.00,
    'pending',
    DATE_SUB(NOW(), INTERVAL 28 DAY)
);

-- Order 10 - 30 days ago (cancelled - won't show in analytics)
INSERT INTO shop_orders (shop_id, artist_id, items, total, status, date)
VALUES (
    19,
    4,
    '[{"productId":110,"name":"Cancelled Order","quantity":1,"price":1000}]',
    1000.00,
    'cancelled',
    DATE_SUB(NOW(), INTERVAL 30 DAY)
);

-- Verify the inserted data
SELECT 
    order_id,
    shop_id,
    artist_id,
    total,
    status,
    date
FROM shop_orders 
WHERE shop_id = 19 
ORDER BY date DESC;

-- Check total revenue for Shop 19 (only approved orders)
SELECT 
    COUNT(*) as total_orders,
    COUNT(DISTINCT artist_id) as unique_customers,
    SUM(total) as total_revenue,
    AVG(total) as avg_order_value
FROM shop_orders 
WHERE shop_id = 19 AND status = 'approved';

-- Expected Results:
-- Total Orders: 8 (only approved orders)
-- Unique Customers: 4 (artist_ids: 1, 2, 3, 4)
-- Total Revenue: Rs. 47,500
-- Avg Order Value: Rs. 5,937.50
