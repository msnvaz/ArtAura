-- Create commission_requests_new table for commission functionality
-- (keeping existing commission_requests table unchanged)
CREATE TABLE commission_requests_new (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    artist_id BIGINT NOT NULL,
    buyer_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    title VARCHAR(255) NOT NULL,
    artwork_type VARCHAR(100),
    style VARCHAR(100),
    dimensions VARCHAR(100),
    budget DECIMAL(10,2),
    deadline DATE,
    additional_notes TEXT,
    urgency VARCHAR(50) DEFAULT 'normal',
    status VARCHAR(50) DEFAULT 'pending',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_artist_id (artist_id),
    INDEX idx_buyer_id (buyer_id),
    INDEX idx_status (status)
);

-- Create commission_reference_images table
CREATE TABLE IF NOT EXISTS commission_reference_images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    commission_request_id BIGINT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (commission_request_id) REFERENCES commission_requests_new(id) ON DELETE CASCADE,
    INDEX idx_commission_request_id (commission_request_id)
);
