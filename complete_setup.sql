-- Complete database setup and verification script
-- Run this in your MySQL database

-- Step 1: Check if tables exist
SELECT 'Checking existing tables...' as step;
SHOW TABLES LIKE 'post_%';

-- Step 2: Create tables if they don't exist
CREATE TABLE IF NOT EXISTS post_likes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    post_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    user_type ENUM('BUYER', 'ARTIST') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_post_like (post_id, user_id, user_type)
);

CREATE TABLE IF NOT EXISTS post_comments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    post_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    user_type ENUM('BUYER', 'ARTIST') NOT NULL,
    comment_text TEXT NOT NULL,
    parent_comment_id BIGINT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Step 3: Add indexes
CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_user ON post_likes(user_id, user_type);
CREATE INDEX IF NOT EXISTS idx_post_comments_post_id ON post_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_parent ON post_comments(parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_user ON post_comments(user_id, user_type);

-- Step 4: Verify tables were created
SELECT 'Tables after creation:' as step;
SHOW TABLES LIKE 'post_%';

-- Step 5: Check table structures
SELECT 'post_likes structure:' as step;
DESCRIBE post_likes;

SELECT 'post_comments structure:' as step;
DESCRIBE post_comments;

-- Step 6: Check current data counts
SELECT 'Current data counts:' as step;
SELECT COUNT(*) as likes_count FROM post_likes;
SELECT COUNT(*) as comments_count FROM post_comments;

-- Step 7: Get user IDs for test data
SELECT 'Available users for testing:' as step;
SELECT 'Artists:' as type, artist_id as user_id, CONCAT(first_name, ' ', last_name) as name FROM artists LIMIT 3
UNION ALL
SELECT 'Buyers:' as type, buyer_id as user_id, CONCAT(first_name, ' ', last_name) as name FROM buyers LIMIT 3;

-- Step 8: Check if post 57 exists
SELECT 'Checking post 57:' as step;
SELECT COUNT(*) as post_exists FROM AW_posts WHERE post_id = 57;

-- Step 9: Show existing comments for post 57 (if any)
SELECT 'Existing comments for post 57:' as step;
SELECT pc.*, 
       CASE 
           WHEN pc.user_type = 'ARTIST' THEN CONCAT(a.first_name, ' ', a.last_name)
           WHEN pc.user_type = 'BUYER' THEN CONCAT(b.first_name, ' ', b.last_name)
       END as user_name
FROM post_comments pc
LEFT JOIN artists a ON pc.user_id = a.artist_id AND pc.user_type = 'ARTIST'
LEFT JOIN buyers b ON pc.user_id = b.buyer_id AND pc.user_type = 'BUYER'
WHERE pc.post_id = 57
ORDER BY pc.created_at ASC;
