-- Add scoring criteria columns to challenges table
-- These columns store the weight percentages for challenge scoring
-- Total should always equal 100%

ALTER TABLE challenges
ADD COLUMN likes_weight INT DEFAULT 34 NOT NULL,
ADD COLUMN comments_weight INT DEFAULT 33 NOT NULL,
ADD COLUMN share_weight INT DEFAULT 33 NOT NULL;

-- Add a check constraint to ensure total is 100 (optional but recommended)
ALTER TABLE challenges
ADD CONSTRAINT chk_scoring_total 
CHECK (likes_weight + comments_weight + share_weight = 100);

-- Update existing challenges to have default scoring criteria
UPDATE challenges 
SET likes_weight = 34, 
    comments_weight = 33, 
    share_weight = 33
WHERE likes_weight IS NULL;
