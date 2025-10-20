-- Commission Reference Images - Database Verification Script
-- Run this script to check the status of your database setup

-- ================================
-- STEP 1: Check if table exists
-- ================================
SELECT 
    TABLE_NAME, 
    TABLE_ROWS, 
    CREATE_TIME 
FROM 
    information_schema.TABLES 
WHERE 
    TABLE_SCHEMA = 'artaura_db' 
    AND TABLE_NAME = 'commission_reference_images';

-- Expected: Should return 1 row if table exists, 0 rows if it doesn't
-- If 0 rows: Run create_commission_reference_images_table.sql first

-- ================================
-- STEP 2: Check table structure
-- ================================
DESCRIBE commission_reference_images;

-- Expected columns:
-- id (BIGINT, PRIMARY KEY, AUTO_INCREMENT)
-- commission_request_id (INT, NOT NULL)
-- image_url (VARCHAR(500), NOT NULL)
-- uploaded_at (TIMESTAMP)

-- ================================
-- STEP 3: Check existing data
-- ================================
SELECT COUNT(*) as total_images FROM commission_reference_images;

SELECT 
    cri.id,
    cri.commission_request_id,
    cri.image_url,
    cri.uploaded_at,
    cr.title as commission_title,
    cr.name as buyer_name
FROM 
    commission_reference_images cri
LEFT JOIN 
    commission_requests cr ON cri.commission_request_id = cr.id
ORDER BY 
    cri.uploaded_at DESC
LIMIT 10;

-- ================================
-- STEP 4: Check commission requests without images
-- ================================
SELECT 
    cr.id,
    cr.title,
    cr.name as buyer_name,
    cr.status,
    cr.submitted_at,
    COUNT(cri.id) as image_count
FROM 
    commission_requests cr
LEFT JOIN 
    commission_reference_images cri ON cr.id = cri.commission_request_id
GROUP BY 
    cr.id, cr.title, cr.name, cr.status, cr.submitted_at
ORDER BY 
    cr.submitted_at DESC;

-- ================================
-- STEP 5: Check foreign key constraints
-- ================================
SELECT 
    CONSTRAINT_NAME,
    TABLE_NAME,
    REFERENCED_TABLE_NAME
FROM 
    information_schema.KEY_COLUMN_USAGE
WHERE 
    TABLE_SCHEMA = 'artaura_db'
    AND TABLE_NAME = 'commission_reference_images'
    AND REFERENCED_TABLE_NAME IS NOT NULL;

-- Expected: Should show foreign key to commission_requests table

-- ================================
-- RESULTS INTERPRETATION
-- ================================
-- 
-- If STEP 1 returns 0 rows:
--   → Table doesn't exist. Run create_commission_reference_images_table.sql
--
-- If STEP 3 shows 0 images:
--   → Table exists but no images stored yet
--   → Either:
--      a) No commission requests have been created with images yet
--      b) Image upload feature isn't working properly
--
-- If STEP 4 shows requests without images (image_count = 0):
--   → These commission requests don't have reference images
--   → This is normal if buyers didn't upload images
--   → A placeholder will be shown in the UI for these
--
-- If STEP 5 returns 0 rows:
--   → Foreign key constraint is missing
--   → Not critical but recommended for data integrity
--   → Recreate table using the provided SQL script
