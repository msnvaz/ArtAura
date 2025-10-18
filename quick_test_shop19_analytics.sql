-- Quick test data for shopId=19 Analytics
-- Run this to quickly populate data for testing

-- Insert some recent orders for shop 19
INSERT INTO shop_orders (order_number, shop_id, artist_id, customer_name, customer_email, customer_phone, 
                        delivery_address, order_items, total_amount, status, order_date)
VALUES 
  -- This month
  ('#ORD-2025-201', 19, 1, 'Test Customer 1', 'test1@example.com', '0771111111', 
   '123 Test St', '[{"productId": 1, "quantity": 2, "price": 2500}]', 
   5000.00, 'delivered', NOW() - INTERVAL 2 DAY),
   
  ('#ORD-2025-202', 19, 1, 'Test Customer 2', 'test2@example.com', '0772222222',
   '456 Test Rd', '[{"productId": 2, "quantity": 1, "price": 3000}]',
   3000.00, 'shipped', NOW() - INTERVAL 5 DAY),
   
  ('#ORD-2025-203', 19, 1, 'Test Customer 3', 'test3@example.com', '0773333333',
   '789 Test Ave', '[{"productId": 3, "quantity": 3, "price": 1500}]',
   4500.00, 'processing', NOW() - INTERVAL 10 DAY),
   
  -- Last month
  ('#ORD-2025-204', 19, 1, 'Test Customer 4', 'test4@example.com', '0774444444',
   '321 Test Ln', '[{"productId": 1, "quantity": 1, "price": 2500}]',
   2500.00, 'delivered', NOW() - INTERVAL 35 DAY),
   
  ('#ORD-2025-205', 19, 1, 'Test Customer 5', 'test5@example.com', '0775555555',
   '654 Test Blvd', '[{"productId": 2, "quantity": 2, "price": 3000}]',
   6000.00, 'delivered', NOW() - INTERVAL 40 DAY);

-- Update some products for shop 19 (if they exist)
UPDATE products 
SET sales = 25, price = 2500
WHERE shop_id = 19
LIMIT 1;

UPDATE products 
SET sales = 15, price = 3000
WHERE shop_id = 19 AND id > (SELECT MIN(id) FROM (SELECT id FROM products WHERE shop_id = 19) as t)
LIMIT 1;

-- Verify the data was inserted
SELECT 
    COUNT(*) as total_orders,
    SUM(total_amount) as total_revenue,
    COUNT(DISTINCT customer_name) as unique_customers
FROM shop_orders
WHERE shop_id = 19;

SELECT * FROM shop_orders WHERE shop_id = 19 ORDER BY order_date DESC LIMIT 10;
