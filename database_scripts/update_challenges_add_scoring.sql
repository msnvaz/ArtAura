-- ========================================
-- Add Scoring Criteria to Challenges Table
-- Database: artaura_db
-- Host: mysql-artaura.alwaysdata.net
-- ========================================

-- Step 1: Add the three scoring criteria columns
ALTER TABLE `challenges`
ADD COLUMN `likes_weight` INT NOT NULL DEFAULT 34 COMMENT 'Weight percentage for likes in scoring',
ADD COLUMN `comments_weight` INT NOT NULL DEFAULT 33 COMMENT 'Weight percentage for comments in scoring',
ADD COLUMN `share_weight` INT NOT NULL DEFAULT 33 COMMENT 'Weight percentage for shares in scoring';

-- Step 2: Add a check constraint to ensure total equals 100%
-- Note: MariaDB 10.2.1+ supports CHECK constraints
ALTER TABLE `challenges`
ADD CONSTRAINT `chk_scoring_total_100` 
CHECK (`likes_weight` + `comments_weight` + `share_weight` = 100);

-- Step 3: Update all existing challenges with default scoring criteria
UPDATE `challenges` 
SET `likes_weight` = 34, 
    `comments_weight` = 33, 
    `share_weight` = 33
WHERE `likes_weight` IS NULL OR `likes_weight` = 0;

-- Step 4: Verify the changes
SELECT 
    id, 
    title, 
    likes_weight, 
    comments_weight, 
    share_weight,
    (likes_weight + comments_weight + share_weight) as total
FROM `challenges`
ORDER BY id DESC
LIMIT 5;

-- Expected output: All rows should have total = 100

-- ========================================
-- Rollback Script (if needed)
-- ========================================
-- ALTER TABLE `challenges` DROP CONSTRAINT `chk_scoring_total_100`;
-- ALTER TABLE `challenges` DROP COLUMN `likes_weight`;
-- ALTER TABLE `challenges` DROP COLUMN `comments_weight`;
-- ALTER TABLE `challenges` DROP COLUMN `share_weight`;
