-- Test script to verify artwork deletion logic
-- This script shows how to check for foreign key constraints before deletion

-- Check if artwork ID 27 exists in order items
SELECT COUNT(*) as order_items_count 
FROM AW_order_items 
WHERE artwork_id = 27;

-- Check if artwork ID 27 exists
SELECT COUNT(*) as artwork_exists 
FROM artworks 
WHERE artwork_id = 27;

-- Show which artworks are referenced in orders
SELECT DISTINCT a.artwork_id, a.title, COUNT(oi.id) as order_count
FROM artworks a
LEFT JOIN AW_order_items oi ON a.artwork_id = oi.artwork_id
GROUP BY a.artwork_id, a.title
HAVING COUNT(oi.id) > 0;

-- Show artworks that can be safely deleted (not in any orders)
SELECT a.artwork_id, a.title
FROM artworks a
LEFT JOIN AW_order_items oi ON a.artwork_id = oi.artwork_id
WHERE oi.artwork_id IS NULL;
