-- Drop existing tables if they exist (to start fresh)
DROP TABLE IF EXISTS post_comments;
DROP TABLE IF EXISTS post_likes;

-- Create likes table for posts
CREATE TABLE post_likes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    post_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    user_type ENUM('BUYER', 'ARTIST') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_post_like (post_id, user_id, user_type)
);

-- Create comments table for posts
CREATE TABLE post_comments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    post_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    user_type ENUM('BUYER', 'ARTIST') NOT NULL,
    comment_text TEXT NOT NULL,
    parent_comment_id BIGINT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Add indexes for better performance
CREATE INDEX idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX idx_post_likes_user ON post_likes(user_id, user_type);
CREATE INDEX idx_post_comments_post_id ON post_comments(post_id);
CREATE INDEX idx_post_comments_parent ON post_comments(parent_comment_id);
CREATE INDEX idx_post_comments_user ON post_comments(user_id, user_type);

-- Show table structures
DESCRIBE post_likes;
DESCRIBE post_comments;

-- Show sample data (will be empty initially)
SELECT 'post_likes data:' as info;
SELECT * FROM post_likes LIMIT 5;

SELECT 'post_comments data:' as info;
SELECT * FROM post_comments LIMIT 5;
