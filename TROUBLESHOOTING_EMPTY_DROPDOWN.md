# Winner Selection - Troubleshooting Empty Dropdown

## Issue
Dropdown shows "Select a challenge..." but no completed challenges appear, even though database has 6 completed challenges:
- August Art Challenge
- Portfolio Art Challenge
- Art Aura challenge
- July Art final week challenge
- A4 Art Challenge
- Prompts to Inspire Creativity

## Debug Steps

### Step 1: Check Browser Console

Open the browser console (F12 or Right-click → Inspect → Console) and look for these log messages:

#### Expected Logs:
```
Fetched challenges from API: 6
Challenge 1: "August Art Challenge" - Status: "completed"
Challenge 2: "Portfolio Art Challenge" - Status: "completed"
Challenge 3: "Art Aura challenge" - Status: "completed"
Challenge 4: "July Art final week challenge" - Status: "completed"
Challenge 5: "A4 Art Challenge" - Status: "completed"
Challenge 6: "Prompts to Inspire Creativity" - Status: "completed"
Completed challenges count: 6
```

#### If You See:
```
Fetched challenges from API: 0
```
**Problem**: API is not returning any challenges
**Solution**: Check backend server is running on port 8081

#### If You See:
```
Fetched challenges from API: 6
Challenge 1: "August Art Challenge" - Status: "active"
```
**Problem**: Challenges have wrong status (not "completed")
**Solution**: Update database status field to "completed"

#### If You See:
```
Error fetching challenges: Network Error
```
**Problem**: Cannot connect to backend
**Solution**: Ensure backend is running and VITE_API_URL is correct

### Step 2: Check Environment Variable

Verify your `.env` file has the correct API URL:

```env
VITE_API_URL=http://localhost:8081
```

**Restart your frontend after changing .env file!**

### Step 3: Check Backend API Response

Open browser Network tab and look for the `/api/challenges` request:

**Request URL should be:**
```
http://localhost:8081/api/challenges
```

**Response should include your 6 challenges:**
```json
[
  {
    "id": 1,
    "title": "August Art Challenge",
    "status": "completed",
    "deadlineDateTime": "2025-08-31T23:59:59",
    ...
  },
  {
    "id": 2,
    "title": "Portfolio Art Challenge",
    "status": "completed",
    ...
  }
  // ... more challenges
]
```

### Step 4: Check Database Status Field

Connect to your MySQL database and run:

```sql
SELECT id, title, status FROM challenges WHERE status = 'completed';
```

**Should return 6 rows:**
```
+----+--------------------------------+-----------+
| id | title                          | status    |
+----+--------------------------------+-----------+
|  1 | August Art Challenge           | completed |
|  2 | Portfolio Art Challenge        | completed |
|  3 | Art Aura challenge             | completed |
|  4 | July Art final week challenge  | completed |
|  5 | A4 Art Challenge               | completed |
|  6 | Prompts to Inspire Creativity  | completed |
+----+--------------------------------+-----------+
```

**If status is not "completed", update it:**
```sql
UPDATE challenges 
SET status = 'completed' 
WHERE id IN (1, 2, 3, 4, 5, 6);
```

## Common Issues & Solutions

### Issue 1: Backend Not Running
**Symptoms:**
- Console shows: `Error fetching challenges: Network Error`
- Network tab shows failed request

**Solution:**
```bash
cd c:\Users\anush\OneDrive\Desktop\ArtAura\server\artaura
mvnw.cmd spring-boot:run
```

Wait for: `Started ArtauraApplication`

### Issue 2: Wrong Status in Database
**Symptoms:**
- Console shows: `Challenge "August Art Challenge" - Status: "active" → isCompleted: false`
- Completed challenges count: 0

**Solution:**
Update database to set status = "completed":
```sql
UPDATE challenges SET status = 'completed' WHERE title IN (
  'August Art Challenge',
  'Portfolio Art Challenge',
  'Art Aura challenge',
  'July Art final week challenge',
  'A4 Art Challenge',
  'Prompts to Inspire Creativity'
);
```

### Issue 3: Status Field is NULL
**Symptoms:**
- Console shows: `Challenge "August Art Challenge" - Status: "null" → isCompleted: false`

**Solution:**
```sql
UPDATE challenges 
SET status = 'completed' 
WHERE status IS NULL AND deadlineDateTime < NOW();
```

### Issue 4: Case Sensitivity Issue
**Symptoms:**
- Console shows: `Challenge "August Art Challenge" - Status: "COMPLETED" → isCompleted: false`

**This should work!** The code handles case-insensitive matching. If it doesn't, there might be extra spaces:

**Solution:**
```sql
UPDATE challenges 
SET status = TRIM(LOWER(status)) 
WHERE status LIKE '%completed%';
```

### Issue 5: CORS Error
**Symptoms:**
- Console shows: `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
Check `SecurityConfig.java` allows your frontend origin:
```java
config.setAllowedOrigins(List.of(
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000"
));
```

### Issue 6: Frontend Not Using Latest Code
**Symptoms:**
- Made changes but dropdown still empty

**Solution:**
1. Stop frontend (Ctrl+C in terminal)
2. Clear cache: `npm cache clean --force`
3. Restart: `npm run dev`
4. Hard refresh browser: Ctrl+Shift+R

## Verification Checklist

Run through this checklist:

- [ ] Backend is running on port 8081
- [ ] Frontend is running on port 5173 (or 5174)
- [ ] `.env` has `VITE_API_URL=http://localhost:8081`
- [ ] Database has 6 challenges with `status = 'completed'`
- [ ] Browser console shows "Fetched challenges from API: 6"
- [ ] Browser console shows "Completed challenges count: 6"
- [ ] No CORS errors in console
- [ ] No Network errors in console

## Quick Fix Script

If you need to quickly update your database, run this SQL:

```sql
-- Set all 6 challenges to completed status
UPDATE challenges 
SET status = 'completed' 
WHERE title IN (
  'August Art Challenge',
  'Portfolio Art Challenge', 
  'Art Aura challenge',
  'July Art final week challenge',
  'A4 Art Challenge',
  'Prompts to Inspire Creativity'
);

-- Verify the update
SELECT id, title, status 
FROM challenges 
WHERE title IN (
  'August Art Challenge',
  'Portfolio Art Challenge',
  'Art Aura challenge', 
  'July Art final week challenge',
  'A4 Art Challenge',
  'Prompts to Inspire Creativity'
);
```

## Expected Final Result

After fixing, you should see in the dropdown:

```
Select a challenge...
August Art Challenge - Completed: [date]
Portfolio Art Challenge - Completed: [date]
Art Aura challenge - Completed: [date]
July Art final week challenge - Completed: [date]
A4 Art Challenge - Completed: [date]
Prompts to Inspire Creativity - Completed: [date]
```

## Still Not Working?

Share the console output with these exact logs:
1. `Fetched challenges from API: X`
2. All `Challenge "X" - Status: "Y"` lines
3. `Completed challenges count: X`
4. Any error messages

This will help identify the exact issue!

---
**Last Updated:** October 19, 2025
**File:** `client/src/pages/Moderator/WinnerSelection.jsx`
