# Challenge Status System - Draft & Publish Feature

## Overview
All challenges are created as **"draft"** status and must be **published** by the moderator to become visible to artists.

## Status Flow

```
CREATE CHALLENGE
       ↓
   📝 DRAFT (not visible to artists)
       ↓
   [Moderator clicks "Publish"]
       ↓
   ✅ ACTIVE (visible in artist feed)
       ↓
   [Deadline passes]
       ↓
   🏁 COMPLETED
```

## Status Definitions

### 1. **DRAFT** (Initial Status)
- **Created by**: Moderator
- **Visibility**: Only moderators can see
- **Purpose**: Moderator can review/edit before publishing
- **Artist Feed**: Not displayed
- **Actions Available**: Edit, Delete, Publish

### 2. **ACTIVE** (Published Status)
- **Changed by**: Moderator clicks "Publish" button
- **Visibility**: All artists can see
- **Purpose**: Challenge is live and accepting submissions
- **Artist Feed**: Displayed to all artists
- **Actions Available**: Edit, Delete, View Submissions

### 3. **COMPLETED** (Auto-Updated)
- **Changed by**: System (when deadline passes)
- **Visibility**: All users can see
- **Purpose**: Challenge has ended
- **Artist Feed**: Shown in "Past Challenges"
- **Actions Available**: View Winners, View Submissions

## Request Sponsorship Checkbox

**Separate from status** - This is for future shop sponsorship feature:
- Checkbox value stored in frontend
- When sponsorship feature is implemented, will track:
  - `sponsorship_request = 0`: No sponsorship needed
  - `sponsorship_request = 1`: Needs shop sponsorship
- Currently has no effect on status

## Backend Changes Made

### 1. **ChallengeDAOImpl.java** - `insertChallenge()`
```java
// All new challenges start as "draft"
String status = "draft";

// ... insert challenge with status = "draft"
```

### 2. **ChallengeDAO.java** - Added interface method
```java
void publishChallenge(int challengeId);  // New method
```

### 3. **ChallengeDAOImpl.java** - Added implementation
```java
@Override
public void publishChallenge(int challengeId) {
    // Change status from 'draft' to 'active'
    String sql = "UPDATE challenges SET status = 'active' WHERE id = ? AND status = 'draft'";
    int rowsAffected = jdbcTemplate.update(sql, challengeId);
    
    if (rowsAffected == 0) {
        throw new IllegalStateException("Challenge not found or already published");
    }
    
    System.out.println("Challenge " + challengeId + " published!");
}
```

### 4. **ChallengeService.java** - Need to add
```java
public void publishChallenge(int challengeId) {
    challengeDAO.publishChallenge(challengeId);
}
```

### 5. **ChallengeController.java** - Need to add
```java
@PutMapping("/{id}/publish")
public ResponseEntity<String> publishChallenge(@PathVariable int id) {
    try {
        challengeService.publishChallenge(id);
        return ResponseEntity.ok("Challenge published successfully!");
    } catch (IllegalStateException e) {
        return ResponseEntity.status(400).body(e.getMessage());
    } catch (Exception e) {
        return ResponseEntity.status(500).body("Error publishing challenge: " + e.getMessage());
    }
}
```

## Frontend Changes Needed

### 1. **ChallengeList.jsx** - Add Publish Button

Show publish button for draft challenges:

```jsx
{challenge.status === 'draft' && (
  <button
    onClick={() => handlePublish(challenge.id)}
    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
  >
    📢 Publish Challenge
  </button>
)}
```

### 2. **ChallengeList.jsx** - Add Publish Handler

```jsx
const handlePublish = async (challengeId) => {
  try {
    const token = localStorage.getItem('token');
    await axios.put(
      `http://localhost:8081/api/challenges/${challengeId}/publish`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    alert('Challenge published successfully!');
    fetchChallenges(); // Refresh list
  } catch (error) {
    console.error('Error publishing challenge:', error);
    alert('Failed to publish challenge');
  }
};
```

### 3. **ChallengeList.jsx** - Add Status Badge

Display status clearly:

```jsx
<span className={`px-3 py-1 rounded text-sm font-semibold ${
  challenge.status === 'draft' ? 'bg-yellow-200 text-yellow-800' :
  challenge.status === 'active' ? 'bg-green-200 text-green-800' :
  'bg-gray-200 text-gray-800'
}`}>
  {challenge.status === 'draft' && '📝 Draft'}
  {challenge.status === 'active' && '✅ Active'}
  {challenge.status === 'completed' && '🏁 Completed'}
</span>
```

### 4. **CreateChallenge.jsx** - Update Success Message

```jsx
// After successful creation
alert('Challenge created as DRAFT! Go to Challenge List to publish it.');
```

## API Endpoints

### Create Challenge (Already Working)
```
POST /api/challenges
Body: { title, category, publishDateTime, deadlineDateTime, ... }
Response: "Challenge created successfully"
Status: Creates as "draft"
```

### Publish Challenge (NEW)
```
PUT /api/challenges/{id}/publish
Response: "Challenge published successfully!"
Effect: Changes status from "draft" to "active"
```

### Get All Challenges (Already Working)
```
GET /api/challenges
Response: List of all challenges (draft, active, completed)
Filter in frontend: Show draft challenges only to moderators
```

## Artist Feed Filter

Artists should only see **ACTIVE** challenges:

```jsx
// In Artist dashboard
const activeChallenges = challenges.filter(c => c.status === 'active');
```

## Moderator Dashboard Filter Options

Show tabs:
- **All Challenges**
- **Drafts** (status = 'draft')
- **Active** (status = 'active')
- **Completed** (status = 'completed')

## Testing Steps

1. ✅ **Create Challenge**
   - Fill form and submit
   - Check database: `SELECT * FROM challenges ORDER BY id DESC LIMIT 1;`
   - Verify: `status = 'draft'`

2. ✅ **View in Moderator List**
   - Should see challenge with "Draft" badge
   - Should see "Publish" button

3. ✅ **Publish Challenge**
   - Click "Publish" button
   - Check database: `SELECT status FROM challenges WHERE id = X;`
   - Verify: `status = 'active'`

4. ✅ **View in Artist Feed**
   - Challenge now visible to artists
   - Draft challenges not visible

5. ✅ **Deadline Passes**
   - System auto-updates to `status = 'completed'`

## Summary

**Key Changes:**
1. ✅ All challenges created as **"draft"**
2. ✅ Backend `publishChallenge()` method added
3. ⏳ Need to add controller endpoint
4. ⏳ Need to add frontend publish button
5. ⏳ Need to filter artist feed (active only)

**Next Steps:**
1. Manually add `publishChallenge()` method to `ChallengeService.java`
2. Add publish endpoint to `ChallengeController.java`
3. Update `ChallengeList.jsx` with publish button
4. Add status badges to UI
5. Test complete flow

**Request Sponsorship:**
- Checkbox exists but has no database column yet
- Will be implemented later when shop sponsorship feature is added
- For now, it doesn't affect challenge status
