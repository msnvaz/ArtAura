-- First, check what buyers and artists exist in your database
SELECT buyer_id, first_name, last_name, email FROM buyers ORDER BY buyer_id LIMIT 10;
SELECT artist_id, first_name, last_name, email FROM artists ORDER BY artist_id LIMIT 10;

-- Once you have the actual IDs, use them in the INSERT statements below
-- Replace the buyer_id and artist_id values with real ones from your database

-- Sample orders with placeholder IDs (REPLACE WITH ACTUAL IDs)
INSERT INTO orders (buyer_id, artist_id, title, description, budget, preferred_size, preferred_medium, deadline_date, status) VALUES
-- Replace buyer_id=1 and artist_id=1 with actual IDs from your database
(1, 1, 'Custom Portrait', 'I need a custom portrait of my family for our anniversary', 5000.00, '24x36 inches', 'Oil on Canvas', DATE_ADD(CURDATE(), INTERVAL 30 DAY), 'PENDING'),
(1, 1, 'Abstract Art Piece', 'Looking for a colorful abstract piece for my living room', 3000.00, '18x24 inches', 'Acrylic', DATE_ADD(CURDATE(), INTERVAL 45 DAY), 'PENDING'),
(1, 1, 'Landscape Painting', 'Need a painting of a specific mountain view', 4000.00, '20x30 inches', 'Watercolor', DATE_ADD(CURDATE(), INTERVAL 60 DAY), 'ACCEPTED');

-- Alternative: Create sample data only if users exist
-- This safer approach creates orders only if both buyer and artist exist
INSERT INTO orders (buyer_id, artist_id, title, description, budget, preferred_size, preferred_medium, deadline_date, status)
SELECT 
    b.buyer_id,
    a.artist_id,
    'Custom Portrait',
    'I need a custom portrait of my family for our anniversary',
    5000.00,
    '24x36 inches',
    'Oil on Canvas',
    DATE_ADD(CURDATE(), INTERVAL 30 DAY),
    'PENDING'
FROM buyers b
CROSS JOIN artists a
WHERE b.buyer_id = (SELECT MIN(buyer_id) FROM buyers)
  AND a.artist_id = (SELECT MIN(artist_id) FROM artists)
LIMIT 1;

INSERT INTO orders (buyer_id, artist_id, title, description, budget, preferred_size, preferred_medium, deadline_date, status)
SELECT 
    b.buyer_id,
    a.artist_id,
    'Abstract Art Piece',
    'Looking for a colorful abstract piece for my living room',
    3000.00,
    '18x24 inches',
    'Acrylic',
    DATE_ADD(CURDATE(), INTERVAL 45 DAY),
    'PENDING'
FROM buyers b
CROSS JOIN artists a
WHERE b.buyer_id = (SELECT MIN(buyer_id) FROM buyers)
  AND a.artist_id = (SELECT MIN(artist_id) FROM artists)
LIMIT 1;