-- ========================================
-- FIXED MARKS SCORING SYSTEM
-- ========================================
-- Remove weight columns as scoring is now fixed:
-- Each Like = +10 marks
-- Each Dislike = -5 marks
-- ========================================

-- Step 1: Check if columns exist before dropping
SELECT COLUMN_NAME 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'artaura_db' 
  AND TABLE_NAME = 'challenges' 
  AND COLUMN_NAME IN ('likes_weight', 'dislike_weight', 'comments_weight', 'share_weight');

-- Step 2: Drop likes_weight column if it exists
ALTER TABLE `challenges` 
DROP COLUMN IF EXISTS `likes_weight`;

-- Step 3: Drop dislike_weight column if it exists
ALTER TABLE `challenges` 
DROP COLUMN IF EXISTS `dislike_weight`;

-- Step 4: Drop comments_weight column if it exists (if not already dropped)
ALTER TABLE `challenges` 
DROP COLUMN IF EXISTS `comments_weight`;

-- Step 5: Drop share_weight column if it exists (if not already dropped)
ALTER TABLE `challenges` 
DROP COLUMN IF EXISTS `share_weight`;

-- Verify the columns are removed
DESCRIBE challenges;

-- ========================================
-- FIXED SCORING SYSTEM DOCUMENTATION
-- ========================================
-- 
-- NEW SCORING CALCULATION:
-- -------------------------
-- Score = MAX(0, (Total Likes × 10) - (Total Dislikes × 5))
-- 
-- IMPORTANT: Minimum score is 0 (no negative scores allowed)
--
-- EXAMPLES:
-- -------------------------
-- Submission 1: 50 likes, 10 dislikes
-- Score = (50 × 10) - (10 × 5) = 500 - 50 = 450 marks ✓
--
-- Submission 2: 30 likes, 5 dislikes
-- Score = (30 × 10) - (5 × 5) = 300 - 25 = 275 marks ✓
--
-- Submission 3: 100 likes, 0 dislikes
-- Score = (100 × 10) - (0 × 5) = 1000 - 0 = 1000 marks ✓
--
-- Submission 4: 20 likes, 50 dislikes
-- Score = MAX(0, (20 × 10) - (50 × 5)) = MAX(0, -50) = 0 marks ✓ (capped at 0)
--
-- Submission 5: 0 likes, 100 dislikes
-- Score = MAX(0, (0 × 10) - (100 × 5)) = MAX(0, -500) = 0 marks ✓ (capped at 0)
--
-- ========================================
