-- Insert the 5 completed challenges you want to see in the Winners dropdown
-- Make sure to adjust the moderator_id to match an existing moderator in your system

INSERT INTO challenges (
    title,
    description,
    category,
    deadline_date_time,
    publish_date_time,
    max_participants,
    rewards,
    request_sponsorship,
    status,
    moderator_id
) VALUES 
(
    'August Art Challenge',
    'Monthly art challenge for August featuring various art styles and techniques',
    'Mixed Media',
    '2024-08-31 23:59:59',
    '2024-08-01 00:00:00',
    100,
    'LKR 50000',
    FALSE,
    'completed',
    1  -- Change this to your actual moderator ID
),
(
    'Portfolio Art Challenge',
    'Showcase your best portfolio pieces and artistic journey',
    'Portfolio',
    '2024-09-15 23:59:59',
    '2024-08-15 00:00:00',
    75,
    'LKR 30000',
    FALSE,
    'completed',
    1  -- Change this to your actual moderator ID
),
(
    'Art Aura challenge',
    'Express the aura and emotion through your artwork',
    'Contemporary Art',
    '2024-10-01 23:59:59',
    '2024-09-01 00:00:00',
    150,
    'LKR 75000',
    TRUE,
    'completed',
    1  -- Change this to your actual moderator ID
),
(
    'July Art final week challenge',
    'Final week challenge for July with special themes',
    'Theme-based',
    '2024-07-28 23:59:59',
    '2024-07-21 00:00:00',
    50,
    'LKR 20000',
    FALSE,
    'completed',
    1  -- Change this to your actual moderator ID
),
(
    'A4 Art Challenge',
    'Create stunning artwork on A4 size canvas',
    'Traditional Art',
    '2024-09-30 23:59:59',
    '2024-09-01 00:00:00',
    80,
    'LKR 40000',
    FALSE,
    'completed',
    1  -- Change this to your actual moderator ID
);

-- Verify the insert
SELECT id, title, status, deadline_date_time 
FROM challenges 
WHERE title IN (
    'August Art Challenge',
    'Portfolio Art Challenge',
    'Art Aura challenge',
    'July Art final week challenge',
    'A4 Art Challenge'
)
ORDER BY deadline_date_time DESC;
