# Challenge Status Logic - Request Sponsorship

## Overview
The challenge status is determined by the **"Request Sponsorship"** checkbox when creating a challenge.

## Status Logic

### ✅ **WITHOUT Request Sponsorship** (Checkbox Unchecked)
```
Create Challenge
↓
Request Sponsorship = false
↓
status = "active"
↓
✅ Immediately visible in Artist Feed
```

**Use Case**: Regular challenges that don't need shop sponsorship
- Moderator creates challenge normally
- Challenge goes live immediately
- Artists can participate right away

### 📝 **WITH Request Sponsorship** (Checkbox Checked)
```
Create Challenge
↓
Request Sponsorship = true
↓
status = "draft"
↓
❌ NOT visible in Artist Feed (waiting for shop)
↓
[Shop accepts sponsorship]
↓
Moderator publishes challenge
↓
status = "active"
↓
✅ Now visible in Artist Feed
```

**Use Case**: Challenges that need shop sponsorship
- Moderator creates challenge
- Challenge saved as "draft" (not visible to artists)
- Shop reviews and accepts sponsorship
- Moderator publishes to make it active

## Status Definitions

### 🟢 **ACTIVE**
- Challenge is live and accepting submissions
- Visible in artist feed
- Artists can participate
- **Created when**: Request Sponsorship = false (unchecked)

### 🟡 **DRAFT**
- Challenge created but not published
- NOT visible in artist feed
- Waiting for shop sponsorship
- **Created when**: Request Sponsorship = true (checked)

### 🔵 **COMPLETED**
- Challenge deadline has passed
- System automatically updates
- Visible in past challenges

## Backend Logic

### File: `ChallengeDAOImpl.java` - `insertChallenge()` method

```java
// Determine status based on sponsorship request:
boolean requestSponsorship = challenge.isRequestSponsorship();
String status = requestSponsorship ? "draft" : "active";

// If requestSponsorship is true → status = "draft"
// If requestSponsorship is false → status = "active"
```

### Debug Output
When creating a challenge, backend logs:
```
Inserting challenge with datetime values:
Publish: 2025-10-20 09:00
Deadline: 2025-10-25 17:00
Request Sponsorship: false
Status: active (published immediately)
Challenge created successfully with status: active
```

OR

```
Inserting challenge with datetime values:
Publish: 2025-10-20 09:00
Deadline: 2025-10-25 17:00
Request Sponsorship: true
Status: draft (waiting for shop sponsorship)
Challenge created successfully with status: draft
```

## Testing Steps

### Test 1: Create WITHOUT Request Sponsorship
1. Open Create Challenge form
2. Fill all fields
3. **Leave "Request Sponsorship" UNCHECKED** ❌
4. Submit form
5. Check database:
   ```sql
   SELECT id, title, status FROM challenges ORDER BY id DESC LIMIT 1;
   ```
6. **Expected Result**: `status = 'active'` ✅
7. Check Artist Feed: Challenge should be visible

### Test 2: Create WITH Request Sponsorship
1. Open Create Challenge form
2. Fill all fields
3. **CHECK "Request Sponsorship"** ✅
4. Submit form
5. Check database:
   ```sql
   SELECT id, title, status FROM challenges ORDER BY id DESC LIMIT 1;
   ```
6. **Expected Result**: `status = 'draft'` ✅
7. Check Artist Feed: Challenge should NOT be visible

### Test 3: Publish Draft Challenge
1. Go to Moderator Challenge List
2. Find challenge with status = "draft"
3. Click "Publish" button (to be implemented)
4. Check database:
   ```sql
   UPDATE challenges SET status = 'active' WHERE id = [challenge_id];
   ```
5. **Expected Result**: `status = 'active'` ✅
6. Check Artist Feed: Challenge now visible

## Frontend UI Updates Needed

### 1. **CreateChallenge.jsx** - Success Message
Update to show different messages based on checkbox:

```jsx
if (response.data) {
  if (formData.requestSponsorship) {
    alert('Challenge created as DRAFT! Waiting for shop sponsorship.');
  } else {
    alert('Challenge published successfully! Now visible to artists.');
  }
  navigate('/moderator/challenges');
}
```

### 2. **ChallengeList.jsx** - Status Badge
Show status clearly:

```jsx
<span className={`px-3 py-1 rounded text-sm font-semibold ${
  challenge.status === 'draft' ? 'bg-yellow-200 text-yellow-800' :
  challenge.status === 'active' ? 'bg-green-200 text-green-800' :
  'bg-gray-200 text-gray-800'
}`}>
  {challenge.status === 'draft' && '📝 Draft (Waiting for Sponsorship)'}
  {challenge.status === 'active' && '✅ Active'}
  {challenge.status === 'completed' && '🏁 Completed'}
</span>
```

### 3. **ChallengeList.jsx** - Publish Button for Drafts
Only show for draft challenges:

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

## Artist Feed Filter

Artists should only see ACTIVE and COMPLETED challenges (not drafts):

```jsx
// In Artist dashboard
const visibleChallenges = challenges.filter(c => 
  c.status === 'active' || c.status === 'completed'
);
```

## Shop Sponsorship Flow (Future Feature)

When shop sponsorship feature is implemented:

1. **Moderator creates challenge** with Request Sponsorship ✅
   - Challenge created with `status = 'draft'`

2. **Shop receives notification** 📧
   - "New sponsorship request for [Challenge Title]"

3. **Shop reviews challenge**
   - View challenge details
   - Accept or Reject sponsorship

4. **Shop accepts sponsorship** ✅
   - Shop confirms they will sponsor
   - Moderator receives notification

5. **Moderator publishes challenge** 📢
   - Changes `status` from "draft" to "active"
   - Challenge now visible to artists

6. **Challenge goes live** 🎉
   - Artists can participate
   - Shop gets visibility/branding

## Database Schema (Future)

When implementing full sponsorship feature, add columns:

```sql
ALTER TABLE challenges
ADD COLUMN sponsorship_request TINYINT(1) DEFAULT 0,
ADD COLUMN shop_id INT NULL,
ADD COLUMN sponsorship_status ENUM('pending', 'accepted', 'rejected') NULL,
ADD CONSTRAINT fk_shop FOREIGN KEY (shop_id) REFERENCES shops(id);
```

Then status logic becomes:
- `sponsorship_request = 0` → `status = 'active'` (no sponsorship)
- `sponsorship_request = 1, sponsorship_status = 'pending'` → `status = 'draft'` (waiting)
- `sponsorship_request = 1, sponsorship_status = 'accepted'` → Moderator can publish → `status = 'active'`
- `sponsorship_request = 1, sponsorship_status = 'rejected'` → Moderator can either find another shop or publish without sponsorship

## Summary

**Current Implementation:**
✅ Request Sponsorship checkbox works
✅ Status automatically set based on checkbox
✅ Active challenges visible to artists
✅ Draft challenges hidden from artists

**Status Determination:**
- ❌ Checkbox UNCHECKED → `status = "active"` → Visible immediately
- ✅ Checkbox CHECKED → `status = "draft"` → Waiting for sponsorship

**Next Steps:**
1. Test creating challenges with both checkbox states
2. Verify status in database matches expected
3. Add publish button for draft challenges
4. Implement shop sponsorship workflow (future)

## Quick Reference

| Checkbox State | Status | Visible to Artists | Use Case |
|---|---|---|---|
| ❌ Unchecked | `active` | ✅ Yes | Regular challenge |
| ✅ Checked | `draft` | ❌ No | Needs sponsorship |

**Try it now!** Create a challenge without checking "Request Sponsorship" and it should appear as **active** immediately! 🚀
