-- First, let's check the posts table structure
SHOW TABLES LIKE 'posts';
DESCRIBE posts;

-- Create likes table for posts (without foreign key initially)
CREATE TABLE IF NOT EXISTS post_likes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    post_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    user_type ENUM('BUYER', 'ARTIST') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_post_like (post_id, user_id, user_type)
);

-- Create comments table for posts (without foreign key constraints initially)
CREATE TABLE IF NOT EXISTS post_comments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    post_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    user_type ENUM('BUYER', 'ARTIST') NOT NULL,
    comment_text TEXT NOT NULL,
    parent_comment_id BIGINT NULL, -- For replies
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_user ON post_likes(user_id, user_type);
CREATE INDEX IF NOT EXISTS idx_post_comments_post_id ON post_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_parent ON post_comments(parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_user ON post_comments(user_id, user_type);

-- Try to add foreign key constraints (these might fail if posts table structure is different)
-- If these fail, the tables will still work, just without referential integrity

-- Attempt to add foreign key for post_likes
-- ALTER TABLE post_likes ADD CONSTRAINT fk_post_likes_post_id 
-- FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE;

-- Attempt to add foreign key for post_comments  
-- ALTER TABLE post_comments ADD CONSTRAINT fk_post_comments_post_id
-- FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE;

-- Show table structures
DESCRIBE post_likes;
DESCRIBE post_comments;

-- Show what posts table looks like (if it exists)
SELECT 'Posts table structure:' as info;
DESCRIBE posts;
