# Backend API Setup for Exhibition Verification

## Summary
The frontend `VerificationList.jsx` has been updated to fetch exhibition data from the database. The backend needs to be completed with two final methods in the DAO implementation.

## ✅ Completed

### Frontend
- ✅ Updated `VerificationList.jsx` to fetch from `/api/exhibitions`
- ✅ Mapped database fields to component fields
- ✅ Updated status handling to call `/api/exhibitions/{id}/status`
- ✅ Removed all mock data

### Backend Interface & Service
- ✅ Added `getAllExhibitions()` to ExhibitionService interface
- ✅ Added `updateExhibitionStatus()` to ExhibitionService interface
- ✅ Added implementations in ExhibitionServiceImpl
- ✅ Added methods to ExhibitionDAO interface
- ✅ Added controller endpoints in ExhibitionController

## ⏳ Pending - DAO Implementation

You need to add these two methods to `ExhibitionDAOImpl.java`:

### Method 1: getAllExhibitions()

Add this method before the closing `}` of the class:

```java
@Override
public List<ExhibitionDTO> getAllExhibitions() {
    logger.info("Fetching all exhibitions");

    String sql = """
        SELECT 
            id as exhibition_id, created_by as artist_id, title, description,
            location, location as venue, start_date, end_date, status,
            category as exhibition_type, max_participants as artworks_count,
            0 as total_visitors, NULL as featured_image_url,
            NULL as website_url, contact_email, contact_phone,
            CAST(entry_fee AS DECIMAL) as entry_fee, false as is_featured,
            created_at, created_at as updated_at
        FROM exhibitions
        ORDER BY created_at DESC
    """;

    try {
        return jdbcTemplate.query(sql, exhibitionRowMapper);
    } catch (Exception e) {
        logger.error("Error fetching all exhibitions: {}", e.getMessage(), e);
        throw new RuntimeException("Failed to fetch exhibitions", e);
    }
}
```

### Method 2: updateExhibitionStatus()

Add this method right after `getAllExhibitions()`:

```java
@Override
public boolean updateExhibitionStatus(Integer exhibitionId, String status, String reason) {
    logger.info("Updating exhibition status for ID: {} to status: {}", exhibitionId, status);

    String sql = """
        UPDATE exhibitions 
        SET status = ?, 
            requirements = CASE 
                WHEN ? IS NOT NULL AND ? != '' THEN ? 
                ELSE requirements 
            END
        WHERE id = ?
    """;

    try {
        int rowsAffected = jdbcTemplate.update(sql, status, reason, reason, reason, exhibitionId);
        logger.info("Updated {} rows for exhibition ID: {}", rowsAffected, exhibitionId);
        return rowsAffected > 0;
    } catch (Exception e) {
        logger.error("Error updating exhibition status for ID {}: {}", exhibitionId, e.getMessage(), e);
        throw new RuntimeException("Failed to update exhibition status", e);
    }
}
```

### File Location
`server/artaura/src/main/java/com/artaura/artaura/dao/Impl/ExhibitionDAOImpl.java`

Add these methods at line 287 (before the final `}`).

## Database Mapping

The SQL query maps the `exhibitions` table to the `ExhibitionDTO` format:

| Database Column | DTO Field | Notes |
|----------------|-----------|--------|
| id | exhibition_id | Primary key |
| created_by | artist_id | Foreign key |
| title | title | Exhibition title |
| description | description | Full description |
| location | location, venue | Address/venue |
| start_date | start_date | Start date |
| end_date | end_date | End date |
| status | status | pending/verified/rejected |
| category | exhibition_type | Art category |
| max_participants | artworks_count | Number of participants |
| contact_email | contact_email | Contact email |
| contact_phone | contact_phone | Contact phone |
| entry_fee | entry_fee | Entry fee amount |
| created_at | created_at, updated_at | Timestamps |

## Status Mapping

Frontend → Database:
- `approved` → `verified`
- `pending` → `pending`
- `rejected` → `rejected`

Database → Frontend:
- `verified` → `approved`
- `pending` → `pending`
- `rejected` → `rejected`

## Testing

After adding the DAO methods:

1. **Test GET all exhibitions:**
   ```
   GET http://localhost:8081/api/exhibitions
   ```

2. **Test UPDATE status:**
   ```
   PUT http://localhost:8081/api/exhibitions/2/status
   Headers: Authorization: Bearer {token}
   Body: { "status": "verified", "reason": "Approved" }
   ```

3. **Verify in database:**
   ```sql
   SELECT id, title, status FROM exhibitions;
   ```

## Frontend Features

Once backend is complete, moderators can:
- ✅ View all exhibitions
- ✅ Search and filter by status
- ✅ Approve exhibitions (sets status to 'verified')
- ✅ Reject exhibitions with reason
- ✅ View detailed information

## Expected Result

Moderator Dashboard → Verification tab will display:
- **Total Exhibitions:** 5
- **Pending Review:** 1 (Urban Echoes)
- **Approved:** 4 (Timeless Strokes, Digital Dreams, Whispers of Nature, Brush & Beyond)
- **Rejected:** 1 (Faces & Feelings)

---

**Next Step:** Add the two methods to `ExhibitionDAOImpl.java` and restart the backend server!
