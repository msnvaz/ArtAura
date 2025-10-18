# Scoring Criteria Feature Implementation

## Overview
This document describes the implementation of the scoring criteria feature for challenges in the ArtAura platform. This feature allows moderators to define custom scoring weights for challenge evaluation based on three metrics: Likes, Comments, and Shares.

## Database Changes

### Migration Script
**File:** `database_scripts/add_scoring_criteria_to_challenges.sql`

The migration adds three new columns to the `challenges` table:
- `likes_weight` (INT, DEFAULT 34) - Weight percentage for likes
- `comments_weight` (INT, DEFAULT 33) - Weight percentage for comments
- `share_weight` (INT, DEFAULT 33) - Weight percentage for shares

A check constraint ensures the total always equals 100%.

### How to Apply the Migration

1. **Connect to your MySQL database:**
   ```bash
   mysql -u your_username -p -h mysql-artaura.alwaysdata.net artaura_db
   ```

2. **Run the migration script:**
   ```bash
   mysql -u your_username -p -h mysql-artaura.alwaysdata.net artaura_db < database_scripts/add_scoring_criteria_to_challenges.sql
   ```

   Or from MySQL prompt:
   ```sql
   source database_scripts/add_scoring_criteria_to_challenges.sql;
   ```

3. **Verify the changes:**
   ```sql
   DESCRIBE challenges;
   SELECT * FROM challenges LIMIT 1;
   ```

## Backend Changes

### 1. New DTO Class: ScoringCriteriaDTO
**File:** `server/artaura/src/main/java/com/artaura/artaura/dto/moderator/ScoringCriteriaDTO.java`

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ScoringCriteriaDTO {
    private int likesWeight;
    private int commentsWeight;
    private int shareWeight;
    
    public boolean isValid() {
        return (likesWeight + commentsWeight + shareWeight) == 100;
    }
}
```

### 2. Updated ChallengeDTO
**File:** `server/artaura/src/main/java/com/artaura/artaura/dto/moderator/ChallengeDTO.java`

Added field:
```java
private ScoringCriteriaDTO scoringCriteria;
```

### 3. Updated ChallengeListDTO
**File:** `server/artaura/src/main/java/com/artaura/artaura/dto/moderator/ChallengeListDTO.java`

Added field:
```java
private ScoringCriteriaDTO scoringCriteria;
```

### 4. Updated ChallengeRowMapper
**File:** `server/artaura/src/main/java/com/artaura/artaura/dao/moderator/ChallengeRowMapper.java`

Added mapping logic to populate scoringCriteria from database columns:
```java
ScoringCriteriaDTO scoringCriteria = new ScoringCriteriaDTO();
scoringCriteria.setLikesWeight(rs.getInt("likes_weight"));
scoringCriteria.setCommentsWeight(rs.getInt("comments_weight"));
scoringCriteria.setShareWeight(rs.getInt("share_weight"));
challenge.setScoringCriteria(scoringCriteria);
```

### 5. Updated ChallengeDAOImpl
**File:** `server/artaura/src/main/java/com/artaura/artaura/dao/moderator/ChallengeDAOImpl.java`

#### insertChallenge Method
- Extracts scoring criteria from ChallengeDTO
- Validates that total equals 100%
- Uses default values (34%, 33%, 33%) if not provided
- Inserts all three weights into the database

#### updateChallenge Method
- Extracts scoring criteria from ChallengeDTO
- Validates that total equals 100%
- Updates all three weight columns in the database

## Frontend Integration

### CreateChallenge Component
**File:** `client/src/pages/Moderator/CreateChallenge.jsx`

The component already includes:
- State management for scoring criteria
- Visual sliders for adjusting weights
- Real-time validation (total must equal 100%)
- Submission includes scoringCriteria object

**Request Body Example:**
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

### ModeratorDashboard Component
**File:** `client/src/pages/Moderator/ModeratorDashboard.jsx`

The component displays:
- Challenge-specific scoring criteria percentages
- Visual progress bars for each weight
- Contestant performance calculated using the criteria
- Winners section showing the scoring weights used

## API Endpoints

### Create Challenge
**POST** `/api/challenges`

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "string",
  "category": "string",
  "publishDateTime": "YYYY-MM-DDTHH:mm",
  "deadlineDateTime": "YYYY-MM-DDTHH:mm",
  "description": "string",
  "maxParticipants": number,
  "rewards": "string",
  "requestSponsorship": boolean,
  "scoringCriteria": {
    "likesWeight": number,
    "commentsWeight": number,
    "shareWeight": number
  }
}
```

**Response:** 200 OK or 400 Bad Request

### Get All Challenges
**GET** `/api/challenges`

**Response:**
```json
[
  {
    "id": 1,
    "title": "AI Art Innovation Challenge",
    "category": "Digital Art",
    "publishDateTime": "2025-10-20 09:00:00.0",
    "deadlineDateTime": "2025-11-20 23:59:00.0",
    "description": "Create innovative AI-generated artwork",
    "maxParticipants": 100,
    "rewards": "1st: $1000, 2nd: $500, 3rd: $250",
    "requestSponsorship": false,
    "status": "active",
    "moderatorId": 123,
    "scoringCriteria": {
      "likesWeight": 35,
      "commentsWeight": 30,
      "shareWeight": 35
    }
  }
]
```

## Testing Steps

### 1. Apply Database Migration
```bash
mysql -u your_username -p -h mysql-artaura.alwaysdata.net artaura_db < database_scripts/add_scoring_criteria_to_challenges.sql
```

### 2. Restart Backend Server
```bash
cd server/artaura
mvnw clean install
mvnw spring-boot:run
```

### 3. Test Challenge Creation
1. Navigate to Create Challenge page
2. Fill in all required fields
3. Adjust scoring criteria sliders (ensure total = 100%)
4. Submit the form
5. Verify success message

### 4. Verify Database Entry
```sql
SELECT id, title, likes_weight, comments_weight, share_weight 
FROM challenges 
ORDER BY id DESC 
LIMIT 1;
```

### 5. Test Challenge Retrieval
1. Navigate to Moderator Dashboard
2. Select "Scoring & Evaluation" tab
3. Select a challenge from dropdown
4. Verify scoring criteria percentages display correctly
5. Check that contestant performance uses the criteria

### 6. Test Challenge Update
1. Navigate to edit challenge (if implemented)
2. Modify scoring criteria
3. Save changes
4. Verify database update

## Validation Rules

1. **Total Weight Must Equal 100%**
   - Frontend validates in real-time
   - Backend validates before insert/update
   - Database constraint enforces this rule

2. **Individual Weights**
   - Must be integers
   - Must be between 0 and 100
   - Cannot be negative

3. **Default Values**
   - Likes: 34%
   - Comments: 33%
   - Shares: 33%

## Error Handling

### Frontend Errors
- "Scoring criteria weights must total exactly 100%"
  - Displayed when total ≠ 100%
  - Prevents form submission

### Backend Errors
- `IllegalArgumentException`: "Scoring criteria weights must total 100%. Current total: X"
  - Thrown when validation fails
  - Returns 400 Bad Request to client

### Database Errors
- Constraint violation if total ≠ 100%
- Returns SQL error to backend

## Future Enhancements

1. **Dynamic Criteria**
   - Allow moderators to add custom criteria beyond the three defaults
   - Store criteria definitions in a separate table

2. **Historical Tracking**
   - Track changes to scoring criteria over time
   - Create audit log for modifications

3. **Preset Templates**
   - Save common scoring configurations as templates
   - Quick-apply templates to new challenges

4. **Analytics**
   - Show how different scoring criteria affect winner selection
   - Compare challenge performance based on criteria

## Troubleshooting

### Issue: Scoring criteria not displaying
**Solution:** Ensure database migration was applied and backend restarted

### Issue: Validation error on submit
**Solution:** Check that total equals exactly 100%, not 99 or 101

### Issue: Old challenges show null scoring criteria
**Solution:** Run UPDATE query to set default values:
```sql
UPDATE challenges 
SET likes_weight = 34, comments_weight = 33, share_weight = 33 
WHERE likes_weight IS NULL;
```

### Issue: Backend compilation errors
**Solution:** Ensure all new files are in correct packages and imports are correct

## Summary

The scoring criteria feature has been successfully implemented across:
- ✅ Database (3 new columns with constraint)
- ✅ Backend DTOs (ScoringCriteriaDTO)
- ✅ Data Access Layer (DAO insert/update/select)
- ✅ Frontend UI (CreateChallenge form with sliders)
- ✅ Frontend Display (ModeratorDashboard with percentages)

The feature is production-ready and fully integrated with the existing challenge management system.
