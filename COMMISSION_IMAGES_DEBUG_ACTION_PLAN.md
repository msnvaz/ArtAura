# Commission Images Issue - Action Plan

## ✅ What We Know
1. **Table exists:** `commission_reference_images` is in your database
2. **Data exists:** You have 6 image records for commission requests #10, #11, #12, #14
3. **Image paths:** Stored as `/uploads/1755491789006_cloudeArchitectureAWS.png` format

## 🔍 Debugging Steps

### Step 1: Run the Database Check Query
Run this SQL to verify which artist owns the requests with images:

```sql
-- Check which artist owns the commission requests that have images
SELECT 
    cr.id as commission_id,
    cr.artist_id,
    CONCAT(a.first_name, ' ', a.last_name) as artist_name,
    cr.title,
    cr.status,
    COUNT(cri.id) as image_count,
    GROUP_CONCAT(cri.image_url SEPARATOR ', ') as image_paths
FROM 
    commission_requests cr
LEFT JOIN 
    artists a ON cr.artist_id = a.artist_id
LEFT JOIN 
    commission_reference_images cri ON cr.id = cri.commission_request_id
WHERE 
    cr.id IN (10, 11, 12, 14)
GROUP BY 
    cr.id, cr.artist_id, a.first_name, a.last_name, cr.title, cr.status
ORDER BY 
    cr.id;
```

**Important:** Make note of the `artist_id` values. You must be logged in as the artist who owns these requests to see them!

### Step 2: Check Image Files Actually Exist
Navigate to your uploads folder and verify the files exist:

**Path:** `c:\Users\Nima's TUF\Desktop\ArtAura2\server\uploads\`

Look for these files:
- `1755491789006_cloudeArchitectureAWS.png`
- `1755491789020_Screenshot 2025-07-14 23372.png`
- `1760615699222_bg1.jpg`
- `1760679467667_bg1.jpg`
- `1760681087872_bg4.jpg`

❌ If files don't exist → Images can't display (upload issue)
✅ If files exist → Continue to Step 3

### Step 3: Use the Debug Test Page

1. **Open the debug page:**
   - Navigate to: `http://localhost:5173/commission-images-debug.html`
   - Or open: `client/commission-images-debug.html` directly in browser

2. **What to check:**
   - **Test 1:** Shows if images can be loaded directly from paths
   - **Test 2:** Click "Fetch Commission Requests" to see API response
   - **Test 3:** Verifies URL resolver is working correctly

3. **Look for:**
   - Green borders ✅ = Image loaded successfully
   - Red borders ❌ = Image failed to load
   - Console output shows detailed debugging info

### Step 4: Check Browser Console in Artist Portfolio

1. Open Artist Portfolio page
2. Press F12 to open DevTools
3. Go to Console tab
4. Look for these messages:

```
📦 Commission Requests Data: [array of requests]
📸 Reference Images Check: [image status for each request]
✅ Image loaded successfully: /uploads/...
```

**Common Issues:**

| What You See | Problem | Solution |
|--------------|---------|----------|
| No commission requests in array | You're logged in as wrong artist | Login as artist who owns requests #10, #11, #12, or #14 |
| Commission requests but no referenceImages field | Backend not fetching images | Check backend logs |
| referenceImages is empty array | No images in database for YOUR requests | That's normal if your artist doesn't have requests with images |
| ❌ Image failed to load | File doesn't exist or path wrong | Check files exist in uploads folder |

### Step 5: Check Network Tab

1. In DevTools, go to Network tab
2. Refresh the Artist Portfolio page
3. Find request to: `/api/commission-requests/artist`
4. Click on it and check **Response** tab

**Expected response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 10,
      "title": "Some Title",
      "referenceImages": [
        "/uploads/1755491789006_cloudeArchitectureAWS.png",
        "/uploads/1755491789020_Screenshot 2025-07-14 23372.png"
      ],
      ...
    }
  ]
}
```

**If you see:**
- `referenceImages: []` → Commission has no images (expected if it's a different request)
- `referenceImages: null` → Backend issue fetching images
- No `referenceImages` field → Backend not including the field

## 🎯 Most Likely Issues

### Issue #1: Wrong Artist Account (90% likelihood)
**Problem:** You're logged in as an artist who doesn't own the commission requests that have images.

**Check:** Run Step 1 query to see which artist_id owns requests #10, #11, #12, #14

**Solution:** Login as the correct artist, or create a new commission request with images for your current artist account.

### Issue #2: Image Files Don't Exist (5% likelihood)
**Problem:** Image paths in database but files not uploaded to server.

**Check:** Step 2 - verify files exist

**Solution:** Re-upload images or fix the upload functionality.

### Issue #3: Backend Not Running (3% likelihood)
**Problem:** Frontend can't connect to backend API.

**Check:** Step 5 - Network tab shows 404 or connection errors

**Solution:** Start backend server:
```powershell
cd server/artaura
./mvnw spring-boot:run
```

### Issue #4: CORS or Auth Issue (2% likelihood)
**Problem:** API blocks the request.

**Check:** Step 5 - Network tab shows 401 or 403 errors

**Solution:** Check auth token in localStorage and verify CORS settings.

## 🔧 Quick Fixes

### Fix #1: Test with a Different Commission Request
Create a new commission request with images as the currently logged-in artist:

1. Login as buyer
2. Find your artist in artists page
3. Request commission
4. Upload reference images
5. Submit request
6. Login back as artist
7. Check if images now show

### Fix #2: Add Test Images to Your Existing Requests
If you're logged in as artist_id 11, add test images to requests #7 or #9:

```sql
INSERT INTO commission_reference_images (commission_request_id, image_url, uploaded_at) VALUES
(7, '/art1.jpeg', NOW()),
(7, '/art2.jpeg', NOW()),
(9, '/heritage.jpeg', NOW());
```

These use public folder images that definitely exist!

### Fix #3: Check Vite Dev Server
Make sure Vite is serving the /uploads folder correctly:

Check `vite.config.js` for static file serving configuration.

## 📋 Debugging Checklist

- [ ] Ran Step 1 query - know which artist owns the requests with images
- [ ] Checked I'm logged in as the correct artist
- [ ] Verified image files exist in `server/uploads/` folder
- [ ] Opened debug test page - saw results
- [ ] Checked browser console - saw debug messages
- [ ] Checked Network tab - saw API response
- [ ] Confirmed `referenceImages` field exists in API response
- [ ] Confirmed images load in Test 1 of debug page
- [ ] If all above pass but still not working - check CSS/rendering issues

## 🆘 Still Not Working?

If you've completed all steps and images still don't show:

1. **Take screenshot of:**
   - Database query result from Step 1
   - Debug page Test 1 results
   - Browser console output
   - Network tab API response

2. **Check:**
   - What user are you logged in as? (userId in localStorage)
   - What artist_id does that user have?
   - Do any of the commission requests belong to that artist?

3. **Report back with:**
   - Screenshots from above
   - Console error messages
   - Which artist_id you're logged in as
   - Which commission_request_ids have images (from database)

## Files Created for Debugging

1. `check_commission_artist_match.sql` - Query to check artist ownership
2. `commission-images-debug.html` - Interactive debug test page
3. `COMMISSION_IMAGES_DEBUG_ACTION_PLAN.md` - This file

Good luck! 🎨
