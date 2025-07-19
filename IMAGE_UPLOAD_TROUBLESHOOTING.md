# Profile Image Upload - Troubleshooting Guide

## Issues to Check:

### 1. Database Setup
**IMPORTANT: Make sure you run this SQL in your database:**

```sql
-- Add the required columns if they don't exist
ALTER TABLE artists 
ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS cover_image_url VARCHAR(500);

-- Check if columns exist
DESCRIBE artists;
```

### 2. Directory Structure
Make sure these directories exist:
- `ArtAura/uploads/profiles/` - This is where uploaded images will be stored

### 3. Backend Testing Steps:

1. **Start the Spring Boot server**:
   ```bash
   cd "C:\Users\Nima's TUF\Desktop\ArtAura\server\artaura"
   mvn spring-boot:run
   ```

2. **Check the console logs** when starting the server. Look for:
   - "Static resources being served from: file:C:\Users\Nima's TUF\Desktop\ArtAura\uploads\"
   - Any error messages

3. **Test the avatar upload**:
   - When you upload an avatar, check the console for detailed logs
   - Look for the generated filename and file path

### 4. Frontend Testing Steps:

1. **Check browser console** when uploading:
   - Look for any JavaScript errors
   - Check the network tab for the upload request
   - Verify the response from the server

2. **Check browser network tab**:
   - Ensure the request is sent to `/api/artist/profile/{userId}/avatar`
   - Check if the response contains `imageUrl`

### 5. Common Issues and Solutions:

#### Issue: "No static resource found"
- **Cause**: Static resource configuration is not pointing to the correct directory
- **Solution**: Check that the uploads directory exists and has the correct permissions

#### Issue: Image uploads but doesn't display
- **Cause**: Image URL path is incorrect or browser is caching old images
- **Solution**: Check the exact URL being returned and add cache-busting parameters

#### Issue: File not found errors
- **Cause**: Spring Boot working directory is different from expected
- **Solution**: Use absolute paths (which we've implemented)

### 6. Debug URLs to Test:

After uploading an image, try accessing it directly:
- `http://localhost:8081/uploads/profiles/11_avatar_1234567890.jpg`

If this doesn't work, the static resource serving is not configured correctly.

### 7. Verification Steps:

1. Upload an avatar through the frontend
2. Check if the file appears in `ArtAura/uploads/profiles/`
3. Try accessing the image URL directly in browser
4. Check if the database is updated with the new image URL
5. Refresh the profile page to see if the new image loads

### 8. Database Query to Check Updates:

```sql
SELECT artist_id, first_name, last_name, avatar_url, cover_image_url 
FROM artists 
WHERE artist_id = YOUR_ARTIST_ID;
```
