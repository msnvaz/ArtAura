-- Insert test data specifically for shop_id = 19
-- Run this in your MySQL database

-- First, verify shop 19 exists
SELECT * FROM shops WHERE shop_id = 19;

-- Clear any existing test data for shop 19 (optional, comment out if you want to keep existing data)
-- DELETE FROM shop_orders WHERE shop_id = 19 AND order_number LIKE 'TEST-%';

-- Insert orders for shop 19 (current month - last 30 days)
INSERT INTO shop_orders 
(order_number, shop_id, artist_id, customer_name, customer_email, customer_phone, delivery_address, order_items, total_amount, status, order_date)
VALUES 
-- Recent orders (last 7 days)
('TEST-ORD-001', 19, 1, 'Kasun Perera', 'kasun@email.com', '0771234567', '123 Galle Road, Colombo 03', '[{"productId":101,"name":"Canvas Painting","quantity":1,"price":2500}]', 2500.00, 'delivered', DATE_SUB(NOW(), INTERVAL 2 DAY)),
('TEST-ORD-002', 19, 1, 'Nimali Silva', 'nimali@email.com', '0771234568', '456 Kandy Road, Kandy', '[{"productId":102,"name":"Art Print","quantity":2,"price":1500}]', 3000.00, 'processing', DATE_SUB(NOW(), INTERVAL 4 DAY)),
('TEST-ORD-003', 19, 1, 'Ravi Fernando', 'ravi@email.com', '0771234569', '789 Main Street, Galle', '[{"productId":103,"name":"Sculpture","quantity":1,"price":5000}]', 5000.00, 'shipped', DATE_SUB(NOW(), INTERVAL 6 DAY)),

-- Orders from 8-30 days ago
('TEST-ORD-004', 19, 1, 'Shalini Wickrama', 'shalini@email.com', '0771234570', '321 Temple Road, Jaffna', '[{"productId":101,"name":"Canvas Painting","quantity":2,"price":2500}]', 5000.00, 'delivered', DATE_SUB(NOW(), INTERVAL 12 DAY)),
('TEST-ORD-005', 19, 1, 'Kasun Perera', 'kasun@email.com', '0771234567', '123 Galle Road, Colombo 03', '[{"productId":104,"name":"Watercolor Set","quantity":1,"price":3500}]', 3500.00, 'delivered', DATE_SUB(NOW(), INTERVAL 18 DAY)),
('TEST-ORD-006', 19, 1, 'Dilshan Kumar', 'dilshan@email.com', '0771234571', '555 Beach Road, Negombo', '[{"productId":102,"name":"Art Print","quantity":3,"price":1500}]', 4500.00, 'delivered', DATE_SUB(NOW(), INTERVAL 25 DAY)),

-- Orders from previous period (31-60 days ago) - for comparison
('TEST-ORD-007', 19, 1, 'Achala Mendis', 'achala@email.com', '0771234572', '888 Lake Road, Nuwara Eliya', '[{"productId":101,"name":"Canvas Painting","quantity":1,"price":2500}]', 2500.00, 'delivered', DATE_SUB(NOW(), INTERVAL 35 DAY)),
('TEST-ORD-008', 19, 1, 'Prasanna Dias', 'prasanna@email.com', '0771234573', '999 Hill Street, Badulla', '[{"productId":103,"name":"Sculpture","quantity":1,"price":5000}]', 5000.00, 'delivered', DATE_SUB(NOW(), INTERVAL 45 DAY)),
('TEST-ORD-009', 19, 1, 'Nimali Silva', 'nimali@email.com', '0771234568', '456 Kandy Road, Kandy', '[{"productId":105,"name":"Oil Painting","quantity":1,"price":7500}]', 7500.00, 'delivered', DATE_SUB(NOW(), INTERVAL 55 DAY));

-- Verify the data was inserted
SELECT 
    order_number,
    customer_name,
    total_amount,
    status,
    order_date,
    DATEDIFF(NOW(), order_date) as days_ago
FROM shop_orders 
WHERE shop_id = 19
ORDER BY order_date DESC;

-- Check the totals
SELECT 
    COUNT(*) as total_orders,
    SUM(total_amount) as total_revenue,
    COUNT(DISTINCT customer_name) as total_customers,
    AVG(total_amount) as avg_order_value
FROM shop_orders 
WHERE shop_id = 19 
AND status != 'cancelled'
AND order_date >= DATE_SUB(NOW(), INTERVAL 30 DAY);

-- If you also need to add/update products for shop 19
-- First check if products exist
SELECT * FROM products WHERE shop_id = 19 LIMIT 5;

-- If products don't exist or need updating, run this:
-- (Adjust product IDs and names based on your actual products table)
/*
INSERT INTO products (shop_id, name, category, price, sales, stock)
VALUES 
(19, 'Canvas Painting', 'Paintings', 2500, 4, 15),
(19, 'Art Print', 'Prints', 1500, 5, 25),
(19, 'Sculpture', 'Sculptures', 5000, 2, 5),
(19, 'Watercolor Set', 'Art Supplies', 3500, 1, 10),
(19, 'Oil Painting', 'Paintings', 7500, 1, 3)
ON DUPLICATE KEY UPDATE
sales = sales + VALUES(sales);
*/
