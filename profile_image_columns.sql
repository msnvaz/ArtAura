-- ===============================================
-- Add Profile Picture and Cover Photo Columns
-- Run these queries in phpMyAdmin or your MySQL client
-- ===============================================

-- Add avatar_url and cover_image_url columns to artists table if they don't exist
ALTER TABLE artists 
ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS cover_image_url VARCHAR(500);

-- Update existing records to have default image paths (optional)
UPDATE artists 
SET avatar_url = NULL, cover_image_url = NULL 
WHERE avatar_url IS NULL OR cover_image_url IS NULL;

-- Verify the columns were added
DESCRIBE artists;
