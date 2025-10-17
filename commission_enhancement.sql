-- Add columns for artist's deadline and rejection reason to commission_requests table

ALTER TABLE commission_requests 
ADD COLUMN artist_deadline DATE DEFAULT NULL COMMENT 'Artist proposed deadline for the commission',
ADD COLUMN rejection_reason TEXT DEFAULT NULL COMMENT 'Reason provided by artist for rejecting the commission',
ADD COLUMN response_date DATETIME DEFAULT NULL COMMENT 'Date when artist responded to the commission request';
