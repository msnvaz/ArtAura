-- Test data for Analytics page
-- This script inserts sample shop_orders and updates product sales for testing

-- First, let's assume you have shop_id = 1 and some products already in the database
-- Update product sales data
UPDATE products 
SET sales = 89, price = 2850
WHERE shop_id = 1 AND name LIKE '%Paint%' 
LIMIT 1;

UPDATE products 
SET sales = 67, price = 3200
WHERE shop_id = 1 AND name LIKE '%Brush%' 
LIMIT 1;

UPDATE products 
SET sales = 156, price = 1250
WHERE shop_id = 1 AND name LIKE '%Canvas%' 
LIMIT 1;

-- Insert sample shop orders for the last 6 months
-- Orders for June 2025
INSERT INTO shop_orders (order_number, shop_id, artist_id, customer_name, customer_email, customer_phone, 
                        delivery_address, order_items, total_amount, status, order_date)
VALUES 
  ('#ORD-2025-135', 1, 1, 'Kasun Wijesinghe', 'kasun@example.com', '0771234567', 
   '123 Main St, Colombo', '[{"productId": 1, "name": "Paint Set", "quantity": 2, "price": 2425}]', 
   4850.00, 'shipped', '2025-06-22 10:30:00'),
   
  ('#ORD-2025-136', 1, 1, 'Nayani Fernando', 'nayani@example.com', '0772345678',
   '456 Lake Rd, Kandy', '[{"productId": 2, "name": "Brush Set", "quantity": 1, "price": 2890}]',
   2890.00, 'processing', '2025-06-22 14:20:00'),
   
  ('#ORD-2025-137', 1, 1, 'Rajith Perera', 'rajith@example.com', '0773456789',
   '789 Beach Rd, Galle', '[{"productId": 3, "name": "Canvas", "quantity": 5, "price": 1450}]',
   7250.00, 'pending', '2025-06-21 09:15:00'),
   
  ('#ORD-2025-138', 1, 1, 'Sanduni Rajapakse', 'sanduni@example.com', '0774567890',
   '321 Hill St, Nuwara Eliya', '[{"productId": 4, "name": "Easel", "quantity": 1, "price": 1890}]',
   1890.00, 'delivered', '2025-06-21 16:45:00');

-- Orders for May 2025
INSERT INTO shop_orders (order_number, shop_id, artist_id, customer_name, customer_email, customer_phone, 
                        delivery_address, order_items, total_amount, status, order_date)
VALUES 
  ('#ORD-2025-120', 1, 1, 'Dilshan Silva', 'dilshan@example.com', '0775678901',
   '555 Market St, Colombo', '[{"productId": 1, "name": "Paint Set", "quantity": 3, "price": 2850}]',
   8550.00, 'delivered', '2025-05-28 11:20:00'),
   
  ('#ORD-2025-121', 1, 1, 'Chamari Peris', 'chamari@example.com', '0776789012',
   '888 Garden Rd, Matara', '[{"productId": 2, "name": "Brush Set", "quantity": 2, "price": 3200}]',
   6400.00, 'delivered', '2025-05-25 15:30:00'),
   
  ('#ORD-2025-122', 1, 1, 'Tharindu Bandara', 'tharindu@example.com', '0777890123',
   '999 Temple Rd, Kandy', '[{"productId": 3, "name": "Canvas", "quantity": 4, "price": 1250}]',
   5000.00, 'delivered', '2025-05-20 10:10:00');

-- Orders for April 2025
INSERT INTO shop_orders (order_number, shop_id, artist_id, customer_name, customer_email, customer_phone, 
                        delivery_address, order_items, total_amount, status, order_date)
VALUES 
  ('#ORD-2025-105', 1, 1, 'Anusha Wickrama', 'anusha@example.com', '0778901234',
   '111 Station Rd, Gampaha', '[{"productId": 1, "name": "Paint Set", "quantity": 2, "price": 2850}]',
   5700.00, 'delivered', '2025-04-28 09:45:00'),
   
  ('#ORD-2025-106', 1, 1, 'Ruwan Jayasena', 'ruwan@example.com', '0779012345',
   '222 Fort Rd, Colombo', '[{"productId": 3, "name": "Canvas", "quantity": 3, "price": 1250}]',
   3750.00, 'delivered', '2025-04-22 13:20:00');

-- Orders for March 2025
INSERT INTO shop_orders (order_number, shop_id, artist_id, customer_name, customer_email, customer_phone, 
                        delivery_address, order_items, total_amount, status, order_date)
VALUES 
  ('#ORD-2025-090', 1, 1, 'Ishara Kumari', 'ishara@example.com', '0770123456',
   '333 Lake View, Kandy', '[{"productId": 1, "name": "Paint Set", "quantity": 4, "price": 2850}]',
   11400.00, 'delivered', '2025-03-25 10:30:00'),
   
  ('#ORD-2025-091', 1, 1, 'Lasith Malinga', 'lasith@example.com', '0771234560',
   '444 Beach Rd, Negombo', '[{"productId": 2, "name": "Brush Set", "quantity": 2, "price": 3200}]',
   6400.00, 'delivered', '2025-03-20 14:15:00'),
   
  ('#ORD-2025-092', 1, 1, 'Samantha De Silva', 'samantha@example.com', '0772345601',
   '555 Hill St, Badulla', '[{"productId": 3, "name": "Canvas", "quantity": 5, "price": 1250}]',
   6250.00, 'delivered', '2025-03-15 11:00:00');

-- Orders for February 2025
INSERT INTO shop_orders (order_number, shop_id, artist_id, customer_name, customer_email, customer_phone, 
                        delivery_address, order_items, total_amount, status, order_date)
VALUES 
  ('#ORD-2025-075', 1, 1, 'Priya Ranasinghe', 'priya@example.com', '0773456012',
   '666 Main St, Colombo', '[{"productId": 1, "name": "Paint Set", "quantity": 3, "price": 2850}]',
   8550.00, 'delivered', '2025-02-25 09:30:00'),
   
  ('#ORD-2025-076', 1, 1, 'Nimesh Fernando', 'nimesh@example.com', '0774567023',
   '777 Sea Rd, Galle', '[{"productId": 2, "name": "Brush Set", "quantity": 1, "price": 3200}]',
   3200.00, 'delivered', '2025-02-20 15:45:00');

-- Orders for January 2025
INSERT INTO shop_orders (order_number, shop_id, artist_id, customer_name, customer_email, customer_phone, 
                        delivery_address, order_items, total_amount, status, order_date)
VALUES 
  ('#ORD-2025-060', 1, 1, 'Dulani Perera', 'dulani@example.com', '0775678034',
   '888 Garden Rd, Kandy', '[{"productId": 1, "name": "Paint Set", "quantity": 2, "price": 2850}]',
   5700.00, 'delivered', '2025-01-28 10:20:00'),
   
  ('#ORD-2025-061', 1, 1, 'Kamal Silva', 'kamal@example.com', '0776789045',
   '999 Temple Rd, Anuradhapura', '[{"productId": 3, "name": "Canvas", "quantity": 4, "price": 1250}]',
   5000.00, 'delivered', '2025-01-22 13:10:00');

-- Verify the data
SELECT 
    DATE_FORMAT(order_date, '%b') as month,
    COUNT(*) as orders,
    SUM(total_amount) as revenue,
    COUNT(DISTINCT customer_name) as customers
FROM shop_orders
WHERE shop_id = 1
GROUP BY MONTH(order_date), DATE_FORMAT(order_date, '%b')
ORDER BY MONTH(order_date);
