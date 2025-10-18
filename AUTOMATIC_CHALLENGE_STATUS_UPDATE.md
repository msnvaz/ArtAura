# Automatic Challenge Status Update Implementation

## Overview
This feature automatically updates challenge status from 'active' to 'completed' when the deadline passes.

## Files Modified/Created

### 1. **ChallengeDAO.java** (Interface)
**Location:** `server/artaura/src/main/java/com/artaura/artaura/dao/moderator/ChallengeDAO.java`

Added method:
```java
int updateExpiredChallenges();
```

### 2. **ChallengeDAOImpl.java** (Implementation)
**Location:** `server/artaura/src/main/java/com/artaura/artaura/dao/moderator/ChallengeDAOImpl.java`

Added method:
```java
@Override
public int updateExpiredChallenges() {
    String sql = "UPDATE challenges SET status = 'completed' " +
                 "WHERE status != 'completed' " +
                 "AND deadline_date_time < NOW()";
    return jdbcTemplate.update(sql);
}
```

**What it does:**
- Updates all challenges where deadline has passed
- Only updates challenges that are NOT already completed
- Uses MySQL's NOW() function to compare with deadline_date_time
- Returns the number of challenges updated

### 3. **ChallengeStatusScheduler.java** (NEW FILE)
**Location:** `server/artaura/src/main/java/com/artaura/artaura/service/moderator/ChallengeStatusScheduler.java`

This is a Spring Boot scheduled service that automatically runs periodically:

```java
@Service
public class ChallengeStatusScheduler {
    
    @Autowired
    private ChallengeDAO challengeDAO;

    @Scheduled(fixedRate = 3600000) // Runs every 1 hour
    public void updateExpiredChallenges() {
        try {
            int updatedCount = challengeDAO.updateExpiredChallenges();
            if (updatedCount > 0) {
                System.out.println("Challenge Status Update: " + updatedCount + 
                                 " challenge(s) automatically marked as completed");
            }
        } catch (Exception e) {
            System.err.println("Error updating expired challenges: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
```

**Schedule Options:**
- Current: `fixedRate = 3600000` (1 hour = 3,600,000 milliseconds)
- Can be changed to:
  - Every 30 minutes: `fixedRate = 1800000`
  - Every 5 minutes: `fixedRate = 300000`
  - Daily at midnight: `@Scheduled(cron = "0 0 0 * * ?")`
  - Every day at 1 AM: `@Scheduled(cron = "0 0 1 * * ?")`

### 4. **ArtauraApplication.java** (Modified)
**Location:** `server/artaura/src/main/java/com/artaura/artaura/ArtauraApplication.java`

Added `@EnableScheduling` annotation:
```java
@SpringBootApplication
@EnableScheduling  // <-- Added this
public class ArtauraApplication {
    // ... existing code
}
```

This enables Spring's scheduled task execution.

### 5. **ChallengeService.java** (Optional - To be added)
**Location:** `server/artaura/src/main/java/com/artaura/artaura/service/moderator/ChallengeService.java`

Add this method manually:
```java
public int updateExpiredChallenges() {
    return challengeDAO.updateExpiredChallenges();
}
```

### 6. **ChallengeController.java** (Optional - For Manual Testing)
**Location:** `server/artaura/src/main/java/com/artaura/artaura/controller/moderator/ChallengeController.java`

Add this endpoint manually for testing:
```java
@PostMapping("/update-expired")
public ResponseEntity<?> updateExpiredChallenges() {
    int updatedCount = challengeService.updateExpiredChallenges();
    return ResponseEntity.ok("Updated " + updatedCount + " expired challenge(s) to completed status");
}
```

## How It Works

### Automatic (Scheduled)
1. **Every hour**, the `ChallengeStatusScheduler` runs automatically
2. It calls `updateExpiredChallenges()` in the DAO
3. The SQL query updates all challenges where:
   - `status != 'completed'` (not already completed)
   - `deadline_date_time < NOW()` (deadline has passed)
4. Console logs show how many challenges were updated

### Manual (Optional Testing)
You can manually trigger the update by calling:
```
POST http://localhost:8080/api/challenges/update-expired
```

## Benefits

1. **Automatic**: No manual intervention needed
2. **Efficient**: Only updates challenges that need updating
3. **Reliable**: Runs every hour, ensuring timely updates
4. **Safe**: Only updates non-completed challenges
5. **Logged**: Console shows when updates occur

## Testing

### Test Scenario 1: Create a Challenge with Past Deadline
1. Create a challenge with `deadline_date_time` in the past
2. Wait for the next scheduled run (max 1 hour)
3. Check the database - status should be 'completed'

### Test Scenario 2: Manual Trigger (if endpoint added)
1. Create a challenge with past deadline
2. Call: `POST /api/challenges/update-expired`
3. Check response and database

### Verification Query
Run this in MySQL to see challenges that will be updated:
```sql
SELECT id, title, deadline_date_time, status 
FROM challenges 
WHERE status != 'completed' 
AND deadline_date_time < NOW();
```

## Configuration

### Change Schedule Frequency

Edit `ChallengeStatusScheduler.java`:

**Option 1: Fixed Rate (milliseconds)**
```java
@Scheduled(fixedRate = 1800000) // 30 minutes
@Scheduled(fixedRate = 300000)  // 5 minutes
@Scheduled(fixedRate = 60000)   // 1 minute (for testing)
```

**Option 2: Cron Expression**
```java
@Scheduled(cron = "0 0 * * * ?")    // Every hour
@Scheduled(cron = "0 */30 * * * ?") // Every 30 minutes
@Scheduled(cron = "0 0 0 * * ?")    // Daily at midnight
@Scheduled(cron = "0 0 1 * * ?")    // Daily at 1 AM
```

## Console Output Example

```
Challenge Status Update: 3 challenge(s) automatically marked as completed
Challenge Status Update: 1 challenge(s) automatically marked as completed
Challenge Status Update: 0 challenge(s) automatically marked as completed
```

## Important Notes

1. **Time Zone**: Uses server's MySQL NOW() function - ensure server time is correct
2. **Performance**: Query is efficient with index on `deadline_date_time` and `status` columns
3. **Database**: Works with existing database structure, no schema changes needed
4. **Restart**: Scheduler starts automatically when application starts

## Recommended Database Index

For better performance, add this index:
```sql
CREATE INDEX idx_challenge_deadline_status 
ON challenges(deadline_date_time, status);
```

This will speed up the scheduled query significantly with large datasets.
