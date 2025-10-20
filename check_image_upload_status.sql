-- =====================================================
-- COMMISSION IMAGE UPLOAD - VERIFICATION QUERIES
-- =====================================================
-- Run these queries to check if images are being saved
-- when buyers create commission requests

-- =====================================================
-- 1. CHECK RECENT COMMISSION REQUESTS WITH IMAGE COUNTS
-- =====================================================
SELECT 
    cr.id as commission_id,
    cr.title,
    cr.name as buyer_name,
    cr.artist_id,
    cr.status,
    cr.submitted_at,
    COUNT(cri.id) as image_count,
    GROUP_CONCAT(cri.image_url SEPARATOR '\n') as image_paths
FROM commission_requests cr
LEFT JOIN commission_reference_images cri ON cr.id = cri.commission_request_id
GROUP BY cr.id, cr.title, cr.name, cr.artist_id, cr.status, cr.submitted_at
ORDER BY cr.submitted_at DESC
LIMIT 10;

-- Expected: Should show image_count > 0 for commissions with uploaded images
-- If image_count = 0 for all: Images not being saved to database

-- =====================================================
-- 2. CHECK IMAGE UPLOAD TIMELINE
-- =====================================================
SELECT 
    DATE(uploaded_at) as upload_date,
    COUNT(*) as images_uploaded
FROM commission_reference_images
GROUP BY DATE(uploaded_at)
ORDER BY upload_date DESC;

-- Expected: Should show dates when images were uploaded
-- If empty: No images have ever been saved
-- If only old dates: New uploads aren't working

-- =====================================================
-- 3. FIND MOST RECENT IMAGE UPLOADS
-- =====================================================
SELECT 
    cri.id,
    cri.commission_request_id,
    cr.title as commission_title,
    cri.image_url,
    cri.uploaded_at,
    TIMESTAMPDIFF(HOUR, cri.uploaded_at, NOW()) as hours_ago
FROM commission_reference_images cri
JOIN commission_requests cr ON cri.commission_request_id = cr.id
ORDER BY cri.uploaded_at DESC
LIMIT 5;

-- Expected: Recent uploads should show
-- Check hours_ago - if all are old (>24 hours), new uploads failing

-- =====================================================
-- 4. CHECK COMMISSIONS BY DATE WITH IMAGE STATUS
-- =====================================================
SELECT 
    DATE(cr.submitted_at) as date,
    COUNT(*) as total_commissions,
    SUM(CASE WHEN cri.id IS NOT NULL THEN 1 ELSE 0 END) as commissions_with_images,
    SUM(CASE WHEN cri.id IS NULL THEN 1 ELSE 0 END) as commissions_without_images
FROM commission_requests cr
LEFT JOIN commission_reference_images cri ON cr.id = cri.commission_request_id
WHERE cr.submitted_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY DATE(cr.submitted_at)
ORDER BY date DESC;

-- Expected: Should show mix of commissions with/without images
-- If all commissions_without_images: Upload feature not working

-- =====================================================
-- 5. TEST: CREATE NEW COMMISSION AND CHECK
-- =====================================================
-- After creating a new commission request in the UI:
-- 1. Get the latest commission request ID
SELECT id, title, submitted_at 
FROM commission_requests 
ORDER BY id DESC 
LIMIT 1;

-- 2. Check if it has images (replace 999 with actual ID from above)
SELECT * 
FROM commission_reference_images 
WHERE commission_request_id = 999;

-- Expected: Should see rows if images were uploaded
-- If empty: Images not being saved for new commissions

-- =====================================================
-- 6. CHECK FOR TODAY'S ACTIVITY
-- =====================================================
-- Commissions created today
SELECT 
    cr.id,
    cr.title,
    cr.submitted_at,
    COUNT(cri.id) as image_count
FROM commission_requests cr
LEFT JOIN commission_reference_images cri ON cr.id = cri.commission_request_id
WHERE DATE(cr.submitted_at) = CURDATE()
GROUP BY cr.id, cr.title, cr.submitted_at
ORDER BY cr.submitted_at DESC;

-- Images uploaded today
SELECT COUNT(*) as images_uploaded_today
FROM commission_reference_images
WHERE DATE(uploaded_at) = CURDATE();

-- =====================================================
-- 7. COMPREHENSIVE STATUS CHECK
-- =====================================================
SELECT 
    'Total Commissions' as metric,
    COUNT(*) as value
FROM commission_requests

UNION ALL

SELECT 
    'Commissions with Images' as metric,
    COUNT(DISTINCT commission_request_id) as value
FROM commission_reference_images

UNION ALL

SELECT 
    'Total Reference Images' as metric,
    COUNT(*) as value
FROM commission_reference_images

UNION ALL

SELECT 
    'Commissions in Last 7 Days' as metric,
    COUNT(*) as value
FROM commission_requests
WHERE submitted_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)

UNION ALL

SELECT 
    'Images Uploaded in Last 7 Days' as metric,
    COUNT(*) as value
FROM commission_reference_images
WHERE uploaded_at >= DATE_SUB(NOW(), INTERVAL 7 DAY);

-- =====================================================
-- INTERPRETATION GUIDE
-- =====================================================

/*
SCENARIO 1: No Images in Database
- Total Reference Images = 0
- Action: Test upload feature manually, check backend logs

SCENARIO 2: Old Images Only
- Images Uploaded in Last 7 Days = 0
- But Total Reference Images > 0
- Action: Recent uploads are failing, check upload endpoint

SCENARIO 3: Some Commissions Have Images
- This is normal - not all buyers upload images
- Action: Test with a commission that should have images

SCENARIO 4: All Working
- Recent commissions have images
- Images uploaded today > 0
- Action: Everything is working correctly!

*/

-- =====================================================
-- QUICK TEST: Add Test Image for Existing Commission
-- =====================================================
-- If you want to test the view functionality without creating new commission:
-- Uncomment and modify the commission_request_id below

/*
INSERT INTO commission_reference_images 
(commission_request_id, image_url, uploaded_at) 
VALUES 
(7, '/art1.jpeg', NOW()),
(7, '/art2.jpeg', NOW());

-- Then check:
SELECT * FROM commission_reference_images WHERE commission_request_id = 7;
*/
