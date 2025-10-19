# Challenge Creation - Debug & Fix Guide

## Problem Summary
When attempting to create a new challenge via the Create Challenge form, the backend returns a **500 Internal Server Error**.

## Changes Made

### 1. Fixed Datetime Format Handling
**File**: `ChallengeDAOImpl.java` - `insertChallenge()` method

**Issue**: Frontend sends datetime in ISO format with 'T' separator (e.g., `2025-10-20T09:00`), but MySQL expects space separator (e.g., `2025-10-20 09:00:00`).

**Fix**: Added datetime conversion in `insertChallenge()`:
```java
// Format datetime strings - replace 'T' with space for MySQL
String publishDateTime = challenge.getPublishDateTime();
String deadlineDateTime = challenge.getDeadlineDateTime();

if (publishDateTime != null && publishDateTime.contains("T")) {
    publishDateTime = publishDateTime.replace("T", " ");
}
if (deadlineDateTime != null && deadlineDateTime.contains("T")) {
    deadlineDateTime = deadlineDateTime.replace("T", " ");
}
```

### 2. Added Error Handling & Debug Logging
**File**: `ChallengeController.java` - `createChallenge()` method

**Added**: Comprehensive try-catch block with debug logging:
```java
try {
    System.out.println("Received challenge creation request:");
    System.out.println("Title: " + challengeDTO.getTitle());
    System.out.println("Category: " + challengeDTO.getCategory());
    System.out.println("Publish DateTime: " + challengeDTO.getPublishDateTime());
    System.out.println("Deadline DateTime: " + challengeDTO.getDeadlineDateTime());
    System.out.println("Max Participants: " + challengeDTO.getMaxParticipants());
    System.out.println("Request Sponsorship: " + challengeDTO.isRequestSponsorship());
    
    String token = authHeader.replace("Bearer ", "");
    Long moderatorId = jwtUtil.extractUserId(token);
    System.out.println("Moderator ID: " + moderatorId);
    
    challengeService.createChallenge(challengeDTO, moderatorId.toString());
    return ResponseEntity.ok("Challenge created successfully");
} catch (Exception e) {
    System.err.println("Error creating challenge: " + e.getMessage());
    e.printStackTrace();
    return ResponseEntity.status(500).body("Error creating challenge: " + e.getMessage());
}
```

### 3. Added Debug Logging to DAO
**File**: `ChallengeDAOImpl.java` - `insertChallenge()` method

**Added**: Debug logs to track datetime conversion and insertion:
```java
System.out.println("Inserting challenge with datetime values:");
System.out.println("Publish: " + publishDateTime);
System.out.println("Deadline: " + deadlineDateTime);

// ... after insert ...
System.out.println("Challenge inserted successfully!");
```

## Testing Steps

### 1. Verify Backend is Running
Check the Spring Boot terminal output for:
```
Started ArtauraApplication in X.XXX seconds
Tomcat started on port(s): 8081 (http)
```

### 2. Test Challenge Creation
1. Open the Create Challenge form in your browser (localhost:5173)
2. Fill in all required fields:
   - **Title**: Test Challenge
   - **Category**: Select any category
   - **Publish Date**: Any future date
   - **Publish Time**: Any time
   - **Deadline Date**: Date after publish date
   - **Deadline Time**: Any time
   - **Description**: Test description
   - **Max Participants**: 100
   - **Rewards**: Test rewards
   - **Request Sponsorship**: Check or uncheck

3. Submit the form

### 3. Check Backend Console Output
Look for these debug logs in the Spring Boot terminal:
```
Received challenge creation request:
Title: Test Challenge
Category: [category]
Publish DateTime: 2025-10-20T09:00
Deadline DateTime: 2025-10-25T17:00
Max Participants: 100
Request Sponsorship: false
Moderator ID: [your-moderator-id]
Inserting challenge with datetime values:
Publish: 2025-10-20 09:00
Deadline: 2025-10-25 17:00
Challenge inserted successfully!
```

### 4. Check Browser Console
Should see:
```
Challenge created successfully!
```

### 5. Verify in Database
Connect to your database and check:
```sql
SELECT * FROM challenges ORDER BY challenge_id DESC LIMIT 1;
```

You should see your newly created challenge with:
- Correct datetime values (in MySQL format: YYYY-MM-DD HH:MM:SS)
- `likes_weight = 34`
- `comments_weight = 33`
- `share_weight = 33`
- `status = 'active'` (if request_sponsorship = 0) or `'draft'` (if request_sponsorship = 1)

## Common Errors & Solutions

### Error: "Incorrect datetime value"
**Cause**: Datetime format mismatch
**Solution**: Already fixed in `ChallengeDAOImpl.java` - converts 'T' to space

### Error: "Foreign key constraint fails (moderator_id)"
**Cause**: Moderator ID doesn't exist in moderators table
**Solution**: 
1. Check your JWT token is valid
2. Verify moderator exists: `SELECT * FROM moderators WHERE moderator_id = [your-id]`
3. If not, create moderator record or log in with valid moderator account

### Error: "Column 'publish_date_time' cannot be null"
**Cause**: Frontend didn't send datetime values
**Solution**: Check frontend form has values in date/time fields before submitting

### Error: 403 Forbidden
**Cause**: Authentication/authorization issue
**Solution**: 
1. Check JWT token exists in localStorage
2. Verify token is not expired
3. Check SecurityConfig allows POST /api/challenges for MODERATOR role

## Fixed Marks Scoring System

**Current Implementation**:
- Each **Like** = **+10 marks**
- Each **Dislike** = **-5 marks**  
- **Minimum Score** = **0** (no negative scores)

**Formula**:
```
Final Score = MAX(0, (Total Likes × 10) - (Total Dislikes × 5))
```

**Database Columns (Temporary)**:
- `likes_weight = 34` (default - will be removed)
- `comments_weight = 33` (default - will be removed)
- `share_weight = 33` (default - will be removed)

These weight columns still exist in the database but are NOT used in calculations. They will be removed after confirming the system works correctly.

## Next Steps After Testing

1. ✅ Confirm challenge creation works
2. ✅ Verify challenge appears in challenge list
3. ✅ Check database has correct values
4. 🔄 Execute SQL migration to remove weight columns:
   ```sql
   ALTER TABLE challenges
   DROP COLUMN likes_weight,
   DROP COLUMN comments_weight,
   DROP COLUMN share_weight;
   ```
5. 🔄 Remove weight column references from `ChallengeDAOImpl.java`
6. 🔄 Update documentation

## Files Modified

### Backend:
1. `ChallengeController.java` - Added error handling & debug logging
2. `ChallengeDAOImpl.java` - Added datetime formatting & debug logging
3. `ChallengeDTO.java` - Removed scoringCriteria field
4. `ChallengeListDTO.java` - Removed scoringCriteria field
5. `ChallengeRowMapper.java` - Removed scoringCriteria mapping

### Frontend:
1. `CreateChallenge.jsx` - Removed scoring criteria sliders, added fixed marks info
2. `ChallengeList.jsx` - Updated to show fixed marks instead of weights

### Documentation:
1. `FIXED_MARKS_SCORING_SYSTEM.md`
2. `QUICK_START_FIXED_MARKS.md`
3. `REMOVE_WEIGHT_COLUMNS_GUIDE.md`
4. Multiple other documentation files

## Support
If you encounter any issues, check:
1. Backend console logs for detailed error messages
2. Browser console for frontend errors
3. Database connection is active
4. JWT token is valid and not expired
5. Moderator account exists in database
