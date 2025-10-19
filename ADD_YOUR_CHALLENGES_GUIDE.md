# Adding Your Specific Challenges to Winners Dropdown

## Current Situation
The Winners dropdown is currently showing:
- Abstract Art Contest
- Landscape Photography Challenge  
- Digital Art 2024

## What You Want
You want these specific challenges to appear:
- August Art Challenge
- Portfolio Art Challenge
- Art Aura challenge
- July Art final week challenge
- A4 Art Challenge

## Solution: Update Your Database

### Option 1: Update Existing Challenges (Recommended if you have challenges)

Run this SQL to update existing challenge names:

```sql
-- First, see what you have
SELECT id, title, status FROM challenges;

-- Then update (adjust IDs based on your actual challenge IDs)
UPDATE challenges SET title = 'August Art Challenge', status = 'completed' WHERE id = 1;
UPDATE challenges SET title = 'Portfolio Art Challenge', status = 'completed' WHERE id = 2;
UPDATE challenges SET title = 'Art Aura challenge', status = 'completed' WHERE id = 3;
UPDATE challenges SET title = 'July Art final week challenge', status = 'completed' WHERE id = 4;
UPDATE challenges SET title = 'A4 Art Challenge', status = 'completed' WHERE id = 5;
```

### Option 2: Insert New Challenges (If you don't have any)

Run the script in `insert_completed_challenges.sql`:

```bash
# Connect to your MySQL database
mysql -h mysql-artaura.alwaysdata.net -u artaura -p artaura_db < insert_completed_challenges.sql
```

Or run it manually in your MySQL client.

**IMPORTANT:** Update `moderator_id` in the INSERT statements to match your actual moderator ID!

## Quick Steps

### Step 1: Connect to Database
```bash
mysql -h mysql-artaura.alwaysdata.net -u artaura -p artaura_db
```

### Step 2: Check Current Challenges
```sql
SELECT id, title, status, deadline_date_time FROM challenges;
```

### Step 3: Choose Your Approach

**If you see challenges with IDs 1-5:**
```sql
UPDATE challenges SET title = 'August Art Challenge', status = 'completed' WHERE id = 1;
UPDATE challenges SET title = 'Portfolio Art Challenge', status = 'completed' WHERE id = 2;
UPDATE challenges SET title = 'Art Aura challenge', status = 'completed' WHERE id = 3;
UPDATE challenges SET title = 'July Art final week challenge', status = 'completed' WHERE id = 4;
UPDATE challenges SET title = 'A4 Art Challenge', status = 'completed' WHERE id = 5;
```

**If you have no challenges or want to add new ones:**
Use the INSERT script from `insert_completed_challenges.sql`

### Step 4: Verify Changes
```sql
SELECT id, title, status, deadline_date_time 
FROM challenges 
WHERE status = 'completed'
ORDER BY deadline_date_time DESC;
```

You should see your 5 challenges with "completed" status.

### Step 5: Refresh Frontend
1. Go back to your browser
2. Navigate to Moderator Dashboard → Winners tab
3. The dropdown should now show your 5 challenges!

## Troubleshooting

### If challenges still don't appear:

1. **Check browser console (F12):**
   Look for these logs:
   ```
   Fetched challenges from API: 5
   Challenge "August Art Challenge" - Status: "completed"
   Completed challenges count: 5
   ```

2. **Verify API response:**
   Open Network tab, find `/api/challenges` request, check response contains your challenges

3. **Restart backend (if needed):**
   ```bash
   cd c:\Users\anush\OneDrive\Desktop\ArtAura\server\artaura
   mvnw.cmd spring-boot:run
   ```

4. **Hard refresh browser:**
   Press `Ctrl + Shift + R`

## SQL Scripts Available

I've created these helper scripts for you:

1. **`check_challenge_names.sql`** - Check what's in your database
2. **`update_challenge_names.sql`** - Update existing challenges
3. **`insert_completed_challenges.sql`** - Insert new challenges

## Expected Result

After running the SQL, your Winners dropdown should show:

```
Select a challenge...
August Art Challenge - Completed: Aug 31, 2024
Portfolio Art Challenge - Completed: Sep 15, 2024
Art Aura challenge - Completed: Oct 01, 2024
July Art final week challenge - Completed: Jul 28, 2024
A4 Art Challenge - Completed: Sep 30, 2024
```

The order is by completion date (most recent first).

---

**Need Help?** Share your browser console output or the result of:
```sql
SELECT id, title, status FROM challenges WHERE status = 'completed';
```
