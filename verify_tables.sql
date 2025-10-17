-- Verify the interaction tables exist and have data
SHOW TABLES LIKE 'post_%';

-- Check table structures
DESCRIBE post_likes;
DESCRIBE post_comments;

-- Check if there's any data
SELECT COUNT(*) as likes_count FROM post_likes;
SELECT COUNT(*) as comments_count FROM post_comments;

-- Show sample data
SELECT 'Recent Likes:' as info;
SELECT * FROM post_likes ORDER BY created_at DESC LIMIT 5;

SELECT 'Recent Comments:' as info;
SELECT * FROM post_comments ORDER BY created_at DESC LIMIT 5;

-- Test specific post data (replace 1 with an actual post_id from your posts table)
SELECT 'Comments for post_id 1:' as info;
SELECT pc.*, 
       CASE 
           WHEN pc.user_type = 'ARTIST' THEN CONCAT(a.first_name, ' ', a.last_name)
           WHEN pc.user_type = 'BUYER' THEN CONCAT(b.first_name, ' ', b.last_name)
       END as user_name
FROM post_comments pc
LEFT JOIN artists a ON pc.user_id = a.artist_id AND pc.user_type = 'ARTIST'
LEFT JOIN buyers b ON pc.user_id = b.buyer_id AND pc.user_type = 'BUYER'
WHERE pc.post_id = 1
ORDER BY pc.created_at ASC;
