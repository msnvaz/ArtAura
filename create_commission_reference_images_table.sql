-- Create commission_reference_images table for storing commission request reference images
-- This table stores multiple reference images that buyers can upload when requesting a commission

CREATE TABLE IF NOT EXISTS commission_reference_images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    commission_request_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_commission_request 
        FOREIGN KEY (commission_request_id) 
        REFERENCES commission_requests(id) 
        ON DELETE CASCADE,
    INDEX idx_commission_request_id (commission_request_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Optional: Add some sample data for testing
-- Uncomment the lines below if you want to test with sample images
/*
INSERT INTO commission_reference_images (commission_request_id, image_url, uploaded_at) VALUES
(7, '/uploads/commissions/sample1.jpg', NOW()),
(7, '/uploads/commissions/sample2.jpg', NOW()),
(9, '/uploads/commissions/sample3.jpg', NOW());
*/
