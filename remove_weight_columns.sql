-- ========================================
-- REMOVE WEIGHT COLUMNS FROM CHALLENGES TABLE
-- Fixed Marks Scoring System (No weight columns needed)
-- ========================================

-- Step 1: Remove likes_weight column
ALTER TABLE `challenges` 
DROP COLUMN `likes_weight`;

-- Step 2: Remove comments_weight column
ALTER TABLE `challenges` 
DROP COLUMN `comments_weight`;

-- Step 3: Remove share_weight column
ALTER TABLE `challenges` 
DROP COLUMN `share_weight`;

-- Step 4: Verify the columns are removed
DESCRIBE challenges;

-- Expected output should NOT show:
-- likes_weight, comments_weight, share_weight

-- ========================================
-- VERIFICATION QUERY
-- ========================================
-- Run this to see current table structure
SELECT 
    COLUMN_NAME, 
    DATA_TYPE, 
    IS_NULLABLE, 
    COLUMN_DEFAULT
FROM 
    INFORMATION_SCHEMA.COLUMNS
WHERE 
    TABLE_SCHEMA = 'artaura_db' 
    AND TABLE_NAME = 'challenges'
ORDER BY 
    ORDINAL_POSITION;

-- ========================================
-- FINAL TABLE STRUCTURE (After removal)
-- ========================================
-- Columns should be:
-- id, title, category, publish_date_time, deadline_date_time,
-- description, max_participants, rewards, request_sponsorship,
-- status, moderator_id, created_at
-- ========================================
