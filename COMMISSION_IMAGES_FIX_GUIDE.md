# Commission Request Images - Troubleshooting Guide

## Problem
Commission request reference images are not displaying in the Artist Portfolio.

## Root Cause
The `commission_reference_images` table likely doesn't exist in your database, or it exists but has no data.

## Solution Steps

### Step 1: Create the Missing Table
Run the SQL script `create_commission_reference_images_table.sql` in your database:

```sql
-- Execute this in your phpMyAdmin or MySQL client
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
```

### Step 2: Verify Table Creation
Check if the table was created successfully:

```sql
SHOW TABLES LIKE 'commission_reference_images';
```

### Step 3: Check Existing Data
See if there are any reference images already stored:

```sql
SELECT * FROM commission_reference_images;
```

### Step 4: Test with Sample Data (Optional)
Add some test images to existing commission requests:

```sql
-- Replace commission_request_id with actual IDs from your commission_requests table
INSERT INTO commission_reference_images (commission_request_id, image_url, uploaded_at) VALUES
(7, '/art1.jpeg', NOW()),
(7, '/art2.jpeg', NOW()),
(9, '/heritage.jpeg', NOW());
```

### Step 5: Debug in Browser Console
After fixing the database:

1. Open your Artist Portfolio page
2. Open Browser DevTools (F12)
3. Go to the Console tab
4. Look for these debug messages:
   - `📦 Commission Requests Data:` - Shows all commission request data
   - `📸 Reference Images Check:` - Shows which requests have images
   - `✅ Image loaded successfully:` - Confirms images are loading
   - `❌ Failed to load image:` - Shows if images fail to load

### Step 6: Check Backend Response
You can also check the API response directly:

1. Open DevTools Network tab
2. Refresh the Artist Portfolio page
3. Find the request to `/api/commission-requests/artist`
4. Click on it and check the Response tab
5. Look for the `referenceImages` field in each commission request object

Example expected response:
```json
{
  "success": true,
  "data": [
    {
      "id": 7,
      "title": "Portrait of a Family",
      "referenceImages": [
        "/uploads/commissions/image1.jpg",
        "/uploads/commissions/image2.jpg"
      ],
      ...
    }
  ]
}
```

## Code Changes Made

### 1. Frontend - Added Debug Logging
File: `client/src/pages/Artist/ArtistPortfolio.jsx`

Added console logs to track:
- What data is received from the API
- Which requests have reference images
- Image loading success/failure

### 2. Frontend - Improved Image Display
File: `client/src/pages/Artist/ArtistPortfolio.jsx`

Changes:
- Shows a placeholder icon when no images exist
- Falls back to a default image if loading fails
- Added border styling to images
- Better error handling with console logs

### 3. Database - Created Table Script
File: `create_commission_reference_images_table.sql`

Created SQL script to:
- Create the missing table
- Add proper foreign key constraints
- Set up indexes for performance

## How the System Works

### Commission Request Creation Flow:
1. **Buyer submits request** via `CommissionRequestModal.jsx`
2. **Images are uploaded** to server (stored in `/uploads/` folder)
3. **Commission request is saved** to `commission_requests` table
4. **Image URLs are saved** to `commission_reference_images` table (one row per image)

### Artist Viewing Flow:
1. **Artist opens portfolio** (`ArtistPortfolio.jsx`)
2. **Frontend calls** `/api/commission-requests/artist` API
3. **Backend fetches** commission requests from `commission_requests` table
4. **For each request**, backend queries `commission_reference_images` table
5. **Images are appended** to the response as `referenceImages` array
6. **Frontend displays** the first image as a thumbnail

## Common Issues & Fixes

### Issue 1: Images show but then disappear
**Cause:** Image files don't exist in the `/uploads/` folder or path is wrong
**Fix:** 
- Check if files exist in `server/uploads/commissions/`
- Verify image paths in database match actual file locations

### Issue 2: Table exists but images still don't show
**Cause:** No data in `commission_reference_images` table
**Fix:** 
- Check if images were saved when commission was created
- Verify the `saveReferenceImages` method is being called
- Add test data manually using SQL

### Issue 3: "Foreign key constraint fails" error
**Cause:** Commission request ID doesn't exist
**Fix:**
```sql
-- Check existing commission request IDs
SELECT id FROM commission_requests;

-- Use valid IDs when inserting test data
```

### Issue 4: Images show in database but not in frontend
**Cause:** Backend not fetching images properly
**Fix:**
- Check browser console for API response
- Verify `CommissionRequestDAOImpl.java` is correctly querying the table
- Restart backend server

## Testing Checklist

- [ ] `commission_reference_images` table created
- [ ] Table has proper foreign key to `commission_requests`
- [ ] Browser console shows commission requests with `referenceImages` array
- [ ] Images display in Artist Portfolio (or placeholder icon shows)
- [ ] Console logs show "✅ Image loaded successfully" or placeholder is shown
- [ ] No JavaScript errors in console

## Next Steps

After fixing the database table:
1. Create a new commission request with images from the buyer side
2. Check if images are saved to `commission_reference_images` table
3. View the request in Artist Portfolio to confirm images display
4. If issues persist, check the console logs for specific error messages

## File Locations

- **SQL Script:** `create_commission_reference_images_table.sql`
- **Frontend Component:** `client/src/pages/Artist/ArtistPortfolio.jsx`
- **Backend DAO:** `server/artaura/src/main/java/com/artaura/artaura/dao/CommissionRequestDAOImpl.java`
- **Upload Directory:** `server/uploads/commissions/`

## Contact Points for Further Debugging

If images still don't show after these steps:
1. Check if commission request modal allows image uploads
2. Verify image upload service is working
3. Check server logs for upload errors
4. Verify file permissions on uploads folder
