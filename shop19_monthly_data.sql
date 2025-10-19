-- Test Data for Shop 19 - Monthly Distribution
-- Orders spread across 6 months (May - October 2025)
-- Each month has multiple orders with different statuses

USE artaura_db;

-- Clear existing shop 19 data
DELETE FROM shop_orders WHERE shop_id = 19;

-- ========================================
-- OCTOBER 2025 (6 approved orders)
-- ========================================
INSERT INTO shop_orders (shop_id, artist_id, items, total, status, date) VALUES
(19, 1, 'Premium Acrylic Paint Set 24 Colors', 18750.00, 'approved', '2025-10-18 10:30:00'),
(19, 2, 'Digital Drawing Tablet Pro', 45600.00, 'approved', '2025-10-16 14:20:00'),
(19, 3, 'Watercolor Paper Pad A3', 6450.00, 'approved', '2025-10-14 09:15:00'),
(19, 4, 'Oil Painting Starter Kit', 22300.00, 'pending', '2025-10-12 11:45:00'),
(19, 1, 'Canvas Panels 12x16 Set', 15400.00, 'approved', '2025-10-10 16:30:00'),
(19, 5, 'Sketching Pencils Professional', 8920.00, 'cancelled', '2025-10-08 13:10:00'),
(19, 2, 'Poster Colors Set 12', 3850.00, 'approved', '2025-10-05 10:20:00'),
(19, 6, 'Professional Easel', 22000.00, 'approved', '2025-10-02 15:45:00');

-- ========================================
-- SEPTEMBER 2025 (8 approved orders)
-- ========================================
INSERT INTO shop_orders (shop_id, artist_id, items, total, status, date) VALUES
(19, 3, 'Art Portfolio Case A2', 9340.00, 'approved', '2025-09-28 12:30:00'),
(19, 7, 'Calligraphy Pen Set', 5670.00, 'cancelled', '2025-09-26 09:50:00'),
(19, 2, 'Soft Pastels Set 48', 7800.00, 'approved', '2025-09-24 14:15:00'),
(19, 8, 'Spray Paint Set 12', 4560.00, 'approved', '2025-09-22 11:20:00'),
(19, 1, 'Sculpture Clay 5kg', 11200.00, 'approved', '2025-09-20 16:40:00'),
(19, 9, 'Wood Carving Tools Set', 12500.00, 'pending', '2025-09-18 10:05:00'),
(19, 3, 'Printmaking Kit', 6750.00, 'approved', '2025-09-15 13:25:00'),
(19, 10, 'Airbrush Kit Complete', 28900.00, 'approved', '2025-09-12 15:30:00'),
(19, 2, 'Charcoal Sticks Set', 4200.00, 'approved', '2025-09-08 09:45:00'),
(19, 11, 'Oil Paint Set 24', 16500.00, 'approved', '2025-09-05 11:15:00');

-- ========================================
-- AUGUST 2025 (7 approved orders)
-- ========================================
INSERT INTO shop_orders (shop_id, artist_id, items, total, status, date) VALUES
(19, 1, 'Canvas Stretcher Bars', 8900.00, 'approved', '2025-08-29 14:20:00'),
(19, 12, 'Gouache Paint Set', 9800.00, 'approved', '2025-08-26 10:30:00'),
(19, 3, 'Marker Set 72 Colors', 15600.00, 'approved', '2025-08-22 16:45:00'),
(19, 13, 'Ink Drawing Pens Set', 7200.00, 'approved', '2025-08-18 12:10:00'),
(19, 2, 'Resin Art Kit', 19500.00, 'approved', '2025-08-15 09:25:00'),
(19, 14, 'Ceramic Tools Set', 34000.00, 'pending', '2025-08-12 15:50:00'),
(19, 1, 'Drawing Board A2', 6500.00, 'approved', '2025-08-08 11:30:00'),
(19, 15, 'Fabric Paint Set', 5800.00, 'approved', '2025-08-03 14:15:00');

-- ========================================
-- JULY 2025 (6 approved orders)
-- ========================================
INSERT INTO shop_orders (shop_id, artist_id, items, total, status, date) VALUES
(19, 3, 'Glass Paint Set', 8700.00, 'approved', '2025-07-28 10:40:00'),
(19, 2, 'Mosaic Tiles Assorted', 12400.00, 'approved', '2025-07-24 13:20:00'),
(19, 16, 'Leather Craft Tools', 18900.00, 'approved', '2025-07-20 15:35:00'),
(19, 1, 'Wood Burning Tool Kit', 9200.00, 'approved', '2025-07-16 09:50:00'),
(19, 17, 'Jewelry Making Supplies', 14500.00, 'cancelled', '2025-07-12 11:25:00'),
(19, 2, 'Stained Glass Supplies', 21300.00, 'approved', '2025-07-08 14:45:00'),
(19, 18, 'Embroidery Threads Set', 6900.00, 'approved', '2025-07-03 10:15:00');

-- ========================================
-- JUNE 2025 (5 approved orders)
-- ========================================
INSERT INTO shop_orders (shop_id, artist_id, items, total, status, date) VALUES
(19, 3, 'Batik Wax and Dyes', 7800.00, 'approved', '2025-06-26 12:30:00'),
(19, 19, 'Screen Printing Kit', 16700.00, 'approved', '2025-06-22 15:20:00'),
(19, 1, 'Pottery Clay 10kg', 13400.00, 'approved', '2025-06-18 10:45:00'),
(19, 20, 'Macrame Cord Bundle', 8900.00, 'approved', '2025-06-14 14:10:00'),
(19, 2, 'Sumi Ink Set', 11200.00, 'approved', '2025-06-10 09:35:00'),
(19, 21, 'Polymer Clay Set', 9500.00, 'pending', '2025-06-05 16:50:00');

-- ========================================
-- MAY 2025 (5 approved orders)
-- ========================================
INSERT INTO shop_orders (shop_id, artist_id, items, total, status, date) VALUES
(19, 3, 'Tempera Paint Set', 7600.00, 'approved', '2025-05-28 11:20:00'),
(19, 22, 'Airbrush Stencils Set', 5400.00, 'approved', '2025-05-22 13:40:00'),
(19, 1, 'Portfolio Storage Case', 12800.00, 'approved', '2025-05-16 10:05:00'),
(19, 23, 'Palette Knives Professional', 8900.00, 'approved', '2025-05-10 15:25:00'),
(19, 2, 'Mixed Media Paper Pad', 6700.00, 'approved', '2025-05-03 09:50:00');

-- Verification queries
SELECT '=== MONTHLY SUMMARY ===' as info;

SELECT 
    DATE_FORMAT(date, '%b %Y') as month,
    COUNT(*) as total_orders,
    SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
    SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
    SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled,
    COALESCE(SUM(CASE WHEN status = 'approved' THEN total ELSE 0 END), 0) as revenue
FROM shop_orders
WHERE shop_id = 19
GROUP BY DATE_FORMAT(date, '%Y-%m'), DATE_FORMAT(date, '%b %Y')
ORDER BY DATE_FORMAT(date, '%Y-%m') DESC;

SELECT '=== EXPECTED ANALYTICS (Last 30 days) ===' as info;

SELECT 
    COALESCE(SUM(total), 0) as totalRevenue,
    COUNT(*) as totalOrders,
    COUNT(DISTINCT artist_id) as totalCustomers
FROM shop_orders
WHERE shop_id = 19 AND status = 'approved'
AND date >= DATE_SUB(NOW(), INTERVAL 30 DAY);

/*
EXPECTED RESULTS:

MONTHLY SUMMARY:
Oct 2025: 6 approved | Rs. 112,050
Sep 2025: 8 approved | Rs. 89,250  
Aug 2025: 7 approved | Rs. 73,300
Jul 2025: 6 approved | Rs. 77,400
Jun 2025: 5 approved | Rs. 58,000
May 2025: 5 approved | Rs. 41,400

Last 30 days: Rs. 112,050 | 6 orders | 6 customers
*/
