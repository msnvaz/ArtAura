-- Create orders table for custom artwork orders
CREATE TABLE orders (
    order_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    buyer_id BIGINT NOT NULL,
    artist_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    reference_image_url VARCHAR(500),
    budget DECIMAL(10, 2),
    preferred_size VARCHAR(100),
    preferred_medium VARCHAR(100),
    deadline_date DATE,
    status ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'IN_PROGRESS', 'COMPLETED', 'DELIVERED') DEFAULT 'PENDING',
    artist_estimated_days INT,
    artist_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    accepted_at TIMESTAMP NULL,
    rejected_at TIMESTAMP NULL,
    
    -- Foreign key constraints
    FOREIGN KEY (buyer_id) REFERENCES buyers(buyer_id) ON DELETE CASCADE,
    FOREIGN KEY (artist_id) REFERENCES artists(artist_id) ON DELETE CASCADE,
    
    -- Indexes for better performance
    INDEX idx_orders_buyer_id (buyer_id),
    INDEX idx_orders_artist_id (artist_id),
    INDEX idx_orders_status (status),
    INDEX idx_orders_created_at (created_at)
);

-- Create order_messages table for communication between buyer and artist
CREATE TABLE order_messages (
    message_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    sender_id BIGINT NOT NULL,
    sender_type ENUM('BUYER', 'ARTIST') NOT NULL,
    message TEXT NOT NULL,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key constraints
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_order_messages_order_id (order_id),
    INDEX idx_order_messages_created_at (created_at)
);

-- Insert some sample data for testing (only if buyers and artists exist)
-- First, let's check if we have any buyers and artists
-- You should replace these IDs with actual IDs from your buyers and artists tables

-- To find actual IDs, run these queries first:
-- SELECT buyer_id, first_name, last_name FROM buyers LIMIT 5;
-- SELECT artist_id, first_name, last_name FROM artists LIMIT 5;

-- Example insert statements (uncomment and modify with real IDs):
-- INSERT INTO orders (buyer_id, artist_id, title, description, budget, preferred_size, preferred_medium, deadline_date, status) VALUES
-- (1, 1, 'Custom Portrait', 'I need a custom portrait of my family for our anniversary', 5000.00, '24x36 inches', 'Oil on Canvas', DATE_ADD(CURDATE(), INTERVAL 30 DAY), 'PENDING'),
-- (2, 1, 'Abstract Art Piece', 'Looking for a colorful abstract piece for my living room', 3000.00, '18x24 inches', 'Acrylic', DATE_ADD(CURDATE(), INTERVAL 45 DAY), 'PENDING'),
-- (1, 2, 'Landscape Painting', 'Need a painting of a specific mountain view', 4000.00, '20x30 inches', 'Watercolor', DATE_ADD(CURDATE(), INTERVAL 60 DAY), 'ACCEPTED');
