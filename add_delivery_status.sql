-- Add delivery_status column to commission_requests if it doesn't exist
ALTER TABLE commission_requests 
ADD COLUMN IF NOT EXISTS delivery_status VARCHAR(50) DEFAULT 'not_requested';

-- Add delivery_status column to AW_orders if it doesn't exist  
ALTER TABLE AW_orders 
ADD COLUMN IF NOT EXISTS delivery_status VARCHAR(50) DEFAULT 'not_requested';

-- Update existing records to have default values
UPDATE commission_requests SET delivery_status = 'not_requested' WHERE delivery_status IS NULL;
UPDATE AW_orders SET delivery_status = 'not_requested' WHERE delivery_status IS NULL;

-- Show the table structures to verify
DESCRIBE commission_requests;
DESCRIBE AW_orders;
