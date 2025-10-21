-- Commission Images - Database Cleanup and Management
-- Use these queries to manage commission reference images

-- =====================================================
-- 1. SEE ALL COMMISSION IMAGES IN DATABASE
-- =====================================================
SELECT 
    cri.id,
    cri.commission_request_id,
    cr.title as commission_title,
    cri.image_url,
    cri.uploaded_at
FROM commission_reference_images cri
LEFT JOIN commission_requests cr ON cri.commission_request_id = cr.id
ORDER BY cri.uploaded_at DESC;

-- =====================================================
-- 2. OPTION A: DELETE SPECIFIC MISSING IMAGE
-- =====================================================
-- Replace the image_url with the one that's missing
DELETE FROM commission_reference_images 
WHERE image_url = '/uploads/1760987696277_280286088_428904982395075_3571787847131953099_n.webp';

-- =====================================================
-- 3. OPTION B: DELETE ALL IMAGES FOR A COMMISSION
-- =====================================================
-- Replace 29 with the commission_request_id
DELETE FROM commission_reference_images 
WHERE commission_request_id = 29;

-- =====================================================
-- 4. OPTION C: UPDATE IMAGE PATH TO EXISTING FILE
-- =====================================================
-- Replace with images that exist in your public folder
UPDATE commission_reference_images 
SET image_url = '/art1.jpeg' 
WHERE commission_request_id = 29;

-- Or update specific image
UPDATE commission_reference_images 
SET image_url = '/art2.jpeg' 
WHERE id = 24;

-- =====================================================
-- 5. ADD TEST IMAGES (Use public folder images)
-- =====================================================
-- These images definitely exist in your client/public folder
INSERT INTO commission_reference_images (commission_request_id, image_url, uploaded_at) VALUES
(7, '/art1.jpeg', NOW()),
(7, '/art2.jpeg', NOW()),
(9, '/heritage.jpeg', NOW()),
(10, '/art1.jpeg', NOW()),
(11, '/art2.jpeg', NOW());

-- =====================================================
-- 6. CREATE BACKUP BEFORE DELETING
-- =====================================================
-- Always create a backup first!
CREATE TABLE commission_reference_images_backup_20251021 AS 
SELECT * FROM commission_reference_images;

-- Verify backup was created
SELECT COUNT(*) as backup_count FROM commission_reference_images_backup_20251021;

-- =====================================================
-- 7. RESTORE FROM BACKUP (if needed)
-- =====================================================
-- If you made a mistake, restore from backup:
DELETE FROM commission_reference_images;

INSERT INTO commission_reference_images 
SELECT * FROM commission_reference_images_backup_20251021;

-- =====================================================
-- 8. VIEW COMMISSIONS WITH IMAGE COUNTS
-- =====================================================
-- See which commissions have how many images
SELECT 
    cr.id,
    cr.title,
    cr.artist_id,
    cr.status,
    COUNT(cri.id) as image_count,
    GROUP_CONCAT(cri.image_url SEPARATOR ', ') as image_paths
FROM commission_requests cr
LEFT JOIN commission_reference_images cri ON cr.id = cri.commission_request_id
GROUP BY cr.id, cr.title, cr.artist_id, cr.status
HAVING image_count > 0
ORDER BY cr.id DESC;

-- =====================================================
-- 9. FIND COMMISSIONS WITHOUT IMAGES
-- =====================================================
-- Commissions that have no reference images at all
SELECT 
    cr.id,
    cr.title,
    cr.name as buyer_name,
    cr.status,
    cr.submitted_at
FROM commission_requests cr
LEFT JOIN commission_reference_images cri ON cr.id = cri.commission_request_id
WHERE cri.id IS NULL
ORDER BY cr.submitted_at DESC;

-- =====================================================
-- 10. DELETE ALL IMAGES (Nuclear Option - Be Careful!)
-- =====================================================
-- ⚠️ WARNING: This deletes ALL image records!
-- Make sure you have a backup first (see #6)

-- Uncomment only if you're absolutely sure:
-- DELETE FROM commission_reference_images;

-- =====================================================
-- RECOMMENDED SOLUTION FOR YOUR CASE
-- =====================================================
-- Since the file 1760987696277_280286088_428904982395075_3571787847131953099_n.webp 
-- doesn't exist, you have two options:

-- Option A: Delete that specific record
DELETE FROM commission_reference_images 
WHERE image_url LIKE '%1760987696277_280286088%';

-- Option B: Replace with a test image that exists
UPDATE commission_reference_images 
SET image_url = '/art2.jpeg' 
WHERE image_url LIKE '%1760987696277_280286088%';

-- Then verify the change:
SELECT * FROM commission_reference_images WHERE commission_request_id = 29;
