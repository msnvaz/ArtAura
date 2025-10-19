-- Fix challenges table schema - add missing request_sponsorship column
-- This script adds the missing column to existing challenges table

-- Check if the column exists and add it if it doesn't
SET @exist := (SELECT COUNT(*) FROM information_schema.COLUMNS 
WHERE table_name = 'challenges' 
AND table_schema = DATABASE() 
AND column_name = 'request_sponsorship');

SET @sqlstmt := IF(@exist > 0, 'SELECT ''Column request_sponsorship already exists''', 
'ALTER TABLE challenges ADD COLUMN request_sponsorship BOOLEAN DEFAULT FALSE');

PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Verify the column was added
DESCRIBE challenges;
