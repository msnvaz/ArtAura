-- Check actual shop_orders table structure in your database

-- 1. Show all tables that might be orders-related
SHOW TABLES LIKE '%order%';

-- 2. Describe the shop_orders table structure
DESCRIBE shop_orders;

-- 3. Show exact column names for shop_orders
SELECT COLUMN_NAME, DATA_TYPE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'shop_orders' 
AND TABLE_SCHEMA = DATABASE()
ORDER BY ORDINAL_POSITION;

-- 4. Check if there's any data
SELECT COUNT(*) as total_rows FROM shop_orders;

-- 5. Show a sample row to see actual column names
SELECT * FROM shop_orders LIMIT 1;
