# Quick Start Guide: Scoring Criteria Feature

## Step 1: Apply Database Migration

Run this SQL script on your database:

```bash
mysql -u your_username -p -h mysql-artaura.alwaysdata.net artaura_db < database_scripts/add_scoring_criteria_to_challenges.sql
```

Or manually execute these commands:

```sql
ALTER TABLE challenges
ADD COLUMN likes_weight INT DEFAULT 34 NOT NULL,
ADD COLUMN comments_weight INT DEFAULT 33 NOT NULL,
ADD COLUMN share_weight INT DEFAULT 33 NOT NULL;

ALTER TABLE challenges
ADD CONSTRAINT chk_scoring_total 
CHECK (likes_weight + comments_weight + share_weight = 100);

UPDATE challenges 
SET likes_weight = 34, 
    comments_weight = 33, 
    share_weight = 33
WHERE likes_weight IS NULL;
```

## Step 2: Rebuild Backend

Navigate to the backend directory and rebuild:

```bash
cd server/artaura
mvnw clean install
```

## Step 3: Restart Backend Server

```bash
mvnw spring-boot:run
```

## Step 4: Test the Feature

### Test Creating a Challenge

1. Open your browser and navigate to: `http://localhost:5173/create-challenge`
2. Fill in all the challenge details
3. Adjust the scoring criteria sliders:
   - **Likes & Engagement Weight**: 35%
   - **Comments & Interaction Weight**: 30%
   - **Share Weight**: 35%
4. Ensure the total shows **100%** (green background)
5. Click "Create Challenge"
6. You should see: "Challenge created successfully!"

### Test Viewing Challenges

1. Navigate to: `http://localhost:5173/moderatordashboard`
2. Click on "Scoring & Evaluation" tab
3. Select a challenge from the dropdown
4. You should see the scoring criteria displayed with:
   - Large percentage numbers (e.g., 35%, 30%, 35%)
   - Progress bars showing the weights
   - Icons for each criterion

### Verify Database

Check that the data was saved:

```sql
SELECT id, title, likes_weight, comments_weight, share_weight 
FROM challenges 
ORDER BY id DESC 
LIMIT 5;
```

Expected output:
```
+----+---------------------------+--------------+------------------+--------------+
| id | title                     | likes_weight | comments_weight  | share_weight |
+----+---------------------------+--------------+------------------+--------------+
|  1 | AI Art Innovation...      |           35 |               30 |           35 |
+----+---------------------------+--------------+------------------+--------------+
```

## Files Modified/Created

### New Files
- ✅ `database_scripts/add_scoring_criteria_to_challenges.sql`
- ✅ `server/artaura/src/main/java/com/artaura/artaura/dto/moderator/ScoringCriteriaDTO.java`
- ✅ `SCORING_CRITERIA_IMPLEMENTATION.md` (detailed documentation)
- ✅ `QUICK_START_SCORING_CRITERIA.md` (this file)

### Modified Files
- ✅ `server/artaura/src/main/java/com/artaura/artaura/dto/moderator/ChallengeDTO.java`
- ✅ `server/artaura/src/main/java/com/artaura/artaura/dto/moderator/ChallengeListDTO.java`
- ✅ `server/artaura/src/main/java/com/artaura/artaura/dao/moderator/ChallengeRowMapper.java`
- ✅ `server/artaura/src/main/java/com/artaura/artaura/dao/moderator/ChallengeDAOImpl.java`

### Frontend (Already Has the Feature)
- ✅ `client/src/pages/Moderator/CreateChallenge.jsx` (already includes scoring criteria form)
- ✅ `client/src/pages/Moderator/ModeratorDashboard.jsx` (already displays scoring criteria)

## Common Issues & Solutions

### Issue: "Column 'likes_weight' not found"
**Solution:** Database migration not applied. Run Step 1 again.

### Issue: Backend compilation errors
**Solution:** 
```bash
cd server/artaura
mvnw clean install -DskipTests
```

### Issue: Frontend shows old data
**Solution:** Clear browser cache or hard refresh (Ctrl+F5)

### Issue: "Scoring criteria weights must total 100%"
**Solution:** Adjust the sliders so the total equals exactly 100%

## API Request Example

When creating a challenge, the request body now includes:

```json
{
  "title": "AI Art Innovation Challenge",
  "category": "Digital Art",
  "publishDateTime": "2025-10-20T09:00",
  "deadlineDateTime": "2025-11-20T23:59",
  "description": "Create innovative AI-generated artwork",
  "maxParticipants": 100,
  "rewards": "1st: $1000, 2nd: $500, 3rd: $250",
  "requestSponsorship": false,
  "scoringCriteria": {
    "likesWeight": 35,
    "commentsWeight": 30,
    "shareWeight": 35
  }
}
```

## What's Next?

The feature is now fully integrated! You can:

1. ✅ Create challenges with custom scoring criteria
2. ✅ View scoring percentages in the dashboard
3. ✅ Update existing challenges (if update functionality is implemented)
4. ✅ See how contestants are scored based on the criteria

For detailed technical documentation, see: `SCORING_CRITERIA_IMPLEMENTATION.md`
