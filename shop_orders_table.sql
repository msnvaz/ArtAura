-- Create shop_orders table
CREATE TABLE IF NOT EXISTS shop_orders (
    order_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    shop_id BIGINT NOT NULL,
    artist_id BIGINT NOT NULL,
    
    -- Customer Information
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    delivery_address TEXT NOT NULL,
    
    -- Order Details
    order_items TEXT NOT NULL, -- JSON array of items: [{"productId": 1, "name": "Paint Set", "quantity": 2, "price": 1500}]
    total_amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'Rs.',
    
    -- Order Status
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Shipping Information
    tracking_number VARCHAR(100),
    shipped_date TIMESTAMP NULL,
    delivered_date TIMESTAMP NULL,
    
    -- Rating and Feedback
    rating INT CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    
    -- Additional Notes
    order_notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Keys (optional - add if you have users/shops/artists tables with proper constraints)
    FOREIGN KEY (shop_id) REFERENCES shops(shop_id) ON DELETE CASCADE,
    FOREIGN KEY (artist_id) REFERENCES users(user_id) ON DELETE CASCADE,
    
    -- Indexes for better query performance
    INDEX idx_shop_id (shop_id),
    INDEX idx_artist_id (artist_id),
    INDEX idx_status (status),
    INDEX idx_order_date (order_date)
);

-- Insert dummy data for shop_orders (Shop ID 15 - your logged-in shop)
INSERT INTO shop_orders (
    order_number, shop_id, artist_id, customer_name, customer_email, customer_phone, 
    delivery_address, order_items, total_amount, status, order_date, 
    tracking_number, rating, order_notes
) VALUES 
-- Orders for Shop ID 15
(
    '#ORD-2025-120', 15, 1, 'Priyanka Wijesinghe', 'priyanka.w@gmail.com', '+94 71 234 5678',
    '47/3, Reid Avenue, Colombo 07',
    '[{"productId": 1, "name": "Premium Acrylic Paint Set 24 Colors", "quantity": 1, "price": 12500}, {"productId": 2, "name": "Professional Canvas Board Set", "quantity": 1, "price": 6250}]',
    18750.00, 'delivered', '2025-07-20 10:30:00',
    'SL-TRK-120-AP', 5, 'Customer very satisfied with product quality'
),
(
    '#ORD-2025-121', 15, 2, 'Mahesh Gunasekara', 'mahesh.g@yahoo.com', '+94 77 345 6789',
    '89, Battaramulla Road, Battaramulla',
    '[{"productId": 3, "name": "Digital Drawing Tablet Pro", "quantity": 1, "price": 38500}, {"productId": 4, "name": "Stylus Pen Set", "quantity": 1, "price": 4500}, {"productId": 5, "name": "Tablet Stand", "quantity": 1, "price": 2600}]',
    45600.00, 'shipped', '2025-07-21 09:15:00',
    'SL-TRK-121-DT', NULL, 'Express delivery requested - shipped via courier'
),
(
    '#ORD-2025-122', 15, 3, 'Shalini Rajapakse', 'shalini.r@hotmail.com', '+94 76 456 7890',
    '156/B, Peradeniya Road, Kandy',
    '[{"productId": 6, "name": "Watercolor Paper Pad A3", "quantity": 1, "price": 3800}, {"productId": 7, "name": "Fine Art Brushes Set", "quantity": 1, "price": 2650}]',
    6450.00, 'processing', '2025-07-21 14:20:00',
    NULL, NULL, 'Waiting for stock confirmation from supplier'
),
(
    '#ORD-2025-123', 15, 4, 'Dinesh Perera', 'dinesh.perera@outlook.com', '+94 70 567 8901',
    '234, Galle Road, Mount Lavinia',
    '[{"productId": 8, "name": "Oil Painting Starter Kit", "quantity": 1, "price": 15400}, {"productId": 9, "name": "Palette Knife Set", "quantity": 1, "price": 3200}, {"productId": 10, "name": "Canvas Stretcher Bars", "quantity": 1, "price": 3700}]',
    22300.00, 'pending', '2025-07-21 11:45:00',
    NULL, NULL, 'Payment verification in progress'
),
(
    '#ORD-2025-124', 15, 5, 'Anusha Fernando', 'anusha.f@gmail.com', '+94 75 678 9012',
    '78/A, Main Street, Negombo',
    '[{"productId": 11, "name": "Sketching Pencils Professional Set", "quantity": 1, "price": 3100}, {"productId": 12, "name": "Blending Stumps", "quantity": 1, "price": 1100}]',
    4200.00, 'cancelled', '2025-07-20 16:30:00',
    NULL, NULL, 'Customer found cheaper alternative elsewhere'
),
(
    '#ORD-2025-125', 15, 6, 'Sampath Wickramasinghe', 'sampath.w@gmail.com', '+94 72 789 0123',
    '123/C, Colombo Road, Gampaha',
    '[{"productId": 13, "name": "Calligraphy Pen Set Premium", "quantity": 1, "price": 8500}, {"productId": 14, "name": "Ink Bottles Assorted", "quantity": 1, "price": 2200}, {"productId": 15, "name": "Practice Paper", "quantity": 1, "price": 1150}]',
    11850.00, 'delivered', '2025-07-19 08:00:00',
    'SL-TRK-125-CP', 4, 'Delivered successfully to Gampaha office'
),
(
    '#ORD-2025-126', 15, 7, 'Kavitha Jayawardena', 'kavitha.j@yahoo.com', '+94 78 890 1234',
    '67, Hospital Road, Kalutara',
    '[{"productId": 16, "name": "Marker Set Professional 60 Colors", "quantity": 1, "price": 13500}, {"productId": 17, "name": "Marker Paper Pad", "quantity": 1, "price": 2400}]',
    15900.00, 'shipped', '2025-07-21 12:10:00',
    'SL-TRK-126-MK', NULL, 'Standard shipping to Kalutara - expected delivery tomorrow'
),
(
    '#ORD-2025-127', 15, 8, 'Roshan Silva', 'roshan.silva@gmail.com', '+94 71 901 2345',
    '145, Queen Street, Kandy',
    '[{"productId": 18, "name": "Easel Table Adjustable", "quantity": 1, "price": 22000}, {"productId": 19, "name": "Paint Palette Large", "quantity": 1, "price": 3800}, {"productId": 20, "name": "Brush Cleaner Solution", "quantity": 1, "price": 2600}]',
    28400.00, 'processing', '2025-07-21 15:45:00',
    NULL, NULL, 'Large item - arranging special delivery vehicle'
),
(
    '#ORD-2025-128', 15, 9, 'Malini Ranasinghe', 'malini.r@hotmail.com', '+94 77 012 3456',
    '89/1, Lake Road, Nuwara Eliya',
    '[{"productId": 21, "name": "Pastels Set Soft 48 Colors", "quantity": 1, "price": 7500}, {"productId": 22, "name": "Pastel Paper Textured", "quantity": 1, "price": 2250}]',
    9750.00, 'delivered', '2025-07-18 07:30:00',
    'SL-TRK-128-PS', 5, 'Special delivery to Nuwara Eliya - customer very happy'
),
(
    '#ORD-2025-129', 15, 10, 'Chamara Bandara', 'chamara.b@outlook.com', '+94 76 123 4567',
    '234/A, Matara Road, Galle',
    '[{"productId": 23, "name": "Graphic Design Kit Complete", "quantity": 1, "price": 25000}, {"productId": 24, "name": "Cutting Mat A2", "quantity": 1, "price": 3700}, {"productId": 25, "name": "Precision Rulers Set", "quantity": 1, "price": 2500}]',
    31200.00, 'pending', '2025-07-21 13:20:00',
    NULL, NULL, 'Awaiting credit card payment confirmation'
),

-- Orders for Shop ID 16 (different shop for testing)
(
    '#ORD-2025-201', 16, 11, 'Tharaka Perera', 'tharaka.p@gmail.com', '+94 71 111 2222',
    '45, Park Street, Colombo 02',
    '[{"productId": 30, "name": "Watercolor Set Professional", "quantity": 1, "price": 8500}]',
    8500.00, 'delivered', '2025-07-19 09:00:00',
    'SL-TRK-201-WC', 5, 'Fast delivery, excellent service'
),
(
    '#ORD-2025-202', 16, 12, 'Nadeesha Silva', 'nadeesha.s@yahoo.com', '+94 77 222 3333',
    '78, Temple Road, Kandy',
    '[{"productId": 31, "name": "Oil Paint Set", "quantity": 1, "price": 12000}]',
    12000.00, 'processing', '2025-07-21 10:30:00',
    NULL, NULL, 'Processing order'
);

-- Verify the data
SELECT * FROM shop_orders WHERE shop_id = 15 ORDER BY order_date DESC;
