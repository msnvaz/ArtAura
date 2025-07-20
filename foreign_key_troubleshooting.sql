-- Alternative approaches to handle the foreign key constraint

-- Option 1: Create table without foreign key first (use the main SQL file)
-- Then add foreign key constraint afterward if needed

-- First, check what tables exist:
SHOW TABLES;

-- Check the structure of the artists table:
DESCRIBE artists;

-- Option 2: Add foreign key constraint after table creation (if artists table exists)
-- Uncomment and run this ONLY if artists table exists with artist_id column:

-- ALTER TABLE artist_exhibitions 
-- ADD CONSTRAINT fk_artist_exhibitions_artist_id 
-- FOREIGN KEY (artist_id) REFERENCES artists(artist_id) ON DELETE CASCADE;

-- Option 3: If artists table doesn't exist or uses different column name, 
-- check your existing user/artist tables:
-- Common alternatives might be:
-- SHOW COLUMNS FROM users WHERE Field LIKE '%id%';
-- SHOW COLUMNS FROM artist_profiles WHERE Field LIKE '%id%';

-- Option 4: If you want to proceed without foreign key constraint for now:
-- The table will work fine without the foreign key - it just won't enforce referential integrity
-- You can add it later when you confirm the correct table and column names

-- Option 5: Common artist table variations to check:
-- SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE 
-- FROM INFORMATION_SCHEMA.COLUMNS 
-- WHERE TABLE_SCHEMA = 'artaura_db' 
-- AND COLUMN_NAME LIKE '%artist%' 
-- OR COLUMN_NAME LIKE '%user%';

-- For now, the table will work without the foreign key constraint.
-- The application logic will ensure data integrity.
