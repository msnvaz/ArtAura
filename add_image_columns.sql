-- ===============================================
-- IMPORTANT: RUN THESE COMMANDS IN YOUR DATABASE
-- ===============================================

-- First, check if the columns exist
DESCRIBE artists;

-- Add the columns if they don't exist
ALTER TABLE artists 
ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS cover_image_url VARCHAR(500);

-- Verify the columns were added
DESCRIBE artists;

-- Optional: Check current data
SELECT artist_id, first_name, last_name, email, avatar_url, cover_image_url FROM artists LIMIT 5;
