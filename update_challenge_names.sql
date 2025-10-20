-- Update existing challenges to have the correct names you want
-- First, let's see what challenges currently exist
SELECT id, title, status, deadline_date_time FROM challenges;

-- Option 1: Update existing challenges with your desired names
-- Assuming you have at least 5 challenges in your database, update them

-- Update first 5 challenges to match your requirements
UPDATE challenges SET title = 'August Art Challenge', status = 'completed' WHERE id = 1;
UPDATE challenges SET title = 'Portfolio Art Challenge', status = 'completed' WHERE id = 2;
UPDATE challenges SET title = 'Art Aura challenge', status = 'completed' WHERE id = 3;
UPDATE challenges SET title = 'July Art final week challenge', status = 'completed' WHERE id = 4;
UPDATE challenges SET title = 'A4 Art Challenge', status = 'completed' WHERE id = 5;

-- Verify the changes
SELECT id, title, status, deadline_date_time FROM challenges WHERE status = 'completed';
