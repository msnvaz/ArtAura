-- Verify database structure and data for shop 19

-- 1. Check if shop_orders table exists
SHOW TABLES LIKE 'shop_orders';

-- 2. Check shop_orders table structure
DESCRIBE shop_orders;

-- 3. Check if there are ANY orders for shop_id 19
SELECT COUNT(*) as total_orders_shop19 
FROM shop_orders 
WHERE shop_id = 19;

-- 4. Check all orders for shop 19
SELECT 
    order_id,
    order_number,
    shop_id,
    customer_name,
    total_amount,
    status,
    order_date,
    order_items
FROM shop_orders 
WHERE shop_id = 19
ORDER BY order_date DESC;

-- 5. Check products table for shop 19
SELECT COUNT(*) as total_products_shop19 
FROM products 
WHERE shop_id = 19;

-- 6. Check products details for shop 19
SELECT 
    id,
    name,
    category,
    price,
    sales,
    stock
FROM products 
WHERE shop_id = 19
ORDER BY sales DESC
LIMIT 10;

-- 7. Check if products table has the required columns
DESCRIBE products;

-- 8. Check all shops in the database
SELECT shop_id, shop_name 
FROM shops
ORDER BY shop_id;
