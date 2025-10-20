-- SQL Script to Update Challenges Table
-- Remove: comments_weight, share_weight
-- Add: dislike_weight
-- Keep: likes_weight

-- Step 1: Add the new dislike_weight column
ALTER TABLE `challenges` 
ADD COLUMN `dislike_weight` INT(11) NOT NULL DEFAULT 33 AFTER `likes_weight`;

-- Step 2: Remove comments_weight column
ALTER TABLE `challenges` 
DROP COLUMN `comments_weight`;

-- Step 3: Remove share_weight column
ALTER TABLE `challenges` 
DROP COLUMN `share_weight`;

-- Step 4: Update existing records to set default weights (Likes: 50%, Dislikes: 50%)
UPDATE `challenges` 
SET `likes_weight` = 50, 
    `dislike_weight` = 50;

-- Step 5: Verify the changes
SELECT id, title, likes_weight, dislike_weight, status 
FROM `challenges` 
ORDER BY id;

-- Final Table Structure should be:
-- id, title, category, publish_date_time, deadline_date_time, description,
-- max_participants, rewards, request_sponsorship, status, moderator_id,
-- created_at, likes_weight, dislike_weight
