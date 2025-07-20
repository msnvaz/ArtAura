-- Step-by-step troubleshooting for foreign key constraint

-- Step 1: Check if artists table exists
SHOW TABLES LIKE '%artist%';

-- Step 2: Check all tables to see what user/artist tables you have
SHOW TABLES;

-- Step 3: If artists table exists, check its structure
DESCRIBE artists;

-- Step 4: Check for any user-related tables that might contain artist data
SHOW TABLES LIKE '%user%';
DESCRIBE users;

-- Step 5: Check all columns that might be related to artist identification
SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_KEY
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'artaura_db' 
AND (COLUMN_NAME LIKE '%artist%' OR COLUMN_NAME LIKE '%user%' OR COLUMN_NAME LIKE '%id%');

-- Step 6: Alternative approach - Check what foreign keys already exist in your database
SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    CONSTRAINT_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE CONSTRAINT_SCHEMA = 'artaura_db'
AND REFERENCED_TABLE_NAME IS NOT NULL;

-- Common solutions based on findings:

-- Solution A: If your user table is called 'users' with 'user_id'
-- ALTER TABLE artist_exhibitions 
-- ADD CONSTRAINT fk_artist_exhibitions_user_id 
-- FOREIGN KEY (artist_id) REFERENCES users(user_id) ON DELETE CASCADE;

-- Solution B: If your artist table is called 'artist_profiles' with 'artist_id'
-- ALTER TABLE artist_exhibitions 
-- ADD CONSTRAINT fk_artist_exhibitions_artist_id 
-- FOREIGN KEY (artist_id) REFERENCES artist_profiles(artist_id) ON DELETE CASCADE;

-- Solution C: If your artist table uses 'id' instead of 'artist_id'
-- ALTER TABLE artist_exhibitions 
-- ADD CONSTRAINT fk_artist_exhibitions_artist_id 
-- FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE;

-- Solution D: If you don't need the foreign key constraint right now
-- Just skip it - the table will work fine without it
-- The application will ensure data integrity
