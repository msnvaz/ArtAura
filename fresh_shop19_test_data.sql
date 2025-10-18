-- Fresh Test Data for Shop 19 Analytics - Last 30 Days
-- Current date: October 18, 2025
-- Run this to populate shop_orders table with recent data

USE artaura_db;

-- Clear old shop 19 data (optional)
-- DELETE FROM shop_orders WHERE shop_id = 19;

-- 15 orders spread across last 30 days
-- 10 approved, 3 pending, 2 cancelled

INSERT INTO shop_orders (shop_id, artist_id, items, total, status, date) VALUES
(19, 1, 'Premium Acrylic Paint Set 24 Colors, Professional Grade Brushes', 18750.00, 'approved', NOW()),
(19, 2, 'Digital Drawing Tablet Pro, Stylus Pen Set, Tablet Stand', 45600.00, 'approved', DATE_SUB(NOW(), INTERVAL 2 DAY)),
(19, 3, 'Watercolor Paper Pad A3, Fine Art Brushes Set, Palette', 6450.00, 'approved', DATE_SUB(NOW(), INTERVAL 4 DAY)),
(19, 4, 'Oil Painting Starter Kit, Palette Knife Set, Canvas Pack', 22300.00, 'pending', DATE_SUB(NOW(), INTERVAL 6 DAY)),
(19, 5, 'Sketching Pencils Professional Set, Charcoal Sticks, Eraser Set', 8920.00, 'cancelled', DATE_SUB(NOW(), INTERVAL 8 DAY)),
(19, 1, 'Canvas Panels 12x16 Set, Gesso Primer, Varnish Spray', 15400.00, 'approved', DATE_SUB(NOW(), INTERVAL 10 DAY)),
(19, 7, 'Calligraphy Pen Set, Ink Bottles Collection, Practice Paper', 5670.00, 'cancelled', DATE_SUB(NOW(), INTERVAL 12 DAY)),
(19, 2, 'Poster Colors Set 12, Mixing Palette, Brush Cleaner', 3850.00, 'approved', DATE_SUB(NOW(), INTERVAL 14 DAY)),
(19, 9, 'Wood Carving Tools Set, Safety Gloves, Wax Finish', 12500.00, 'pending', DATE_SUB(NOW(), INTERVAL 16 DAY)),
(19, 3, 'Art Portfolio Case A2, Mounting Board Sheets, Fixative Spray', 9340.00, 'approved', DATE_SUB(NOW(), INTERVAL 18 DAY)),
(19, 11, 'Professional Easel, Canvas Rolls, Stretcher Bars', 22000.00, 'approved', DATE_SUB(NOW(), INTERVAL 20 DAY)),
(19, 2, 'Soft Pastels Set 48, Pastel Paper Pad, Fixative', 7800.00, 'approved', DATE_SUB(NOW(), INTERVAL 22 DAY)),
(19, 12, 'Spray Paint Set 12 Colors, Protective Mask, Drop Cloth', 4560.00, 'approved', DATE_SUB(NOW(), INTERVAL 24 DAY)),
(19, 1, 'Sculpture Clay 5kg, Modeling Tools, Wire Armature', 11200.00, 'approved', DATE_SUB(NOW(), INTERVAL 26 DAY)),
(19, 13, 'Printmaking Kit, Lino Blocks, Brayer Roller', 6750.00, 'pending', DATE_SUB(NOW(), INTERVAL 28 DAY));

-- Verify
SELECT 
    COALESCE(SUM(total), 0) as totalRevenue,
    COUNT(*) as totalOrders,
    COUNT(DISTINCT artist_id) as totalCustomers
FROM shop_orders
WHERE shop_id = 19 AND status = 'approved'
AND date >= DATE_SUB(NOW(), INTERVAL 30 DAY);

-- Expected: Rs. 144,950 | 10 orders | 6 customers
