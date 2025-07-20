# 🔧 Achievement Feature - Troubleshooting Guide

## Current Issue: 500 Server Error on Achievement Creation

### Problem Description
- Frontend successfully imports the achievement component
- GET requests work fine for fetching achievements
- POST request to `/api/achievements/create` returns 500 server error
- Error occurs when trying to add new achievements

### Identified Issues and Solutions

#### 1. ✅ **Fixed: Lucide React Icons**
**Issue:** `Certificate` and `Badge` icons don't exist in lucide-react
**Solution:** Updated to use `FileText` and `Shield` instead

#### 2. 🔧 **In Progress: Lombok Compilation Issues**
**Issue:** Lombok annotations not working properly in the development environment
**Solutions Applied:**
- Converted DTOs from Lombok `@Data` to manual getters/setters
- Updated all DTO classes to have explicit constructors and methods

#### 3. ❗ **Potential Database Issues**
**Action Required:** Run the SQL schema to create the achievements table

```sql
-- Execute this in phpMyAdmin:
CREATE TABLE IF NOT EXISTS achievements (
    achievement_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    artist_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    type ENUM('winner', 'featured', 'runner-up', 'special', 'certificate', 'award') NOT NULL,
    achievement_date DATE NOT NULL,
    prize VARCHAR(255),
    description TEXT,
    icon_type ENUM('trophy', 'star', 'medal', 'award', 'certificate', 'badge') DEFAULT 'award',
    color_scheme ENUM('gold', 'silver', 'bronze', 'blue', 'purple', 'green', 'red') DEFAULT 'gold',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (artist_id) REFERENCES artists(artist_id) ON DELETE CASCADE
);
```

#### 4. 🔧 **JWT Token Validation**
**Current Status:** Updated to use proper JWT validation method
**Added Debug Logging:** Enhanced error messages for better debugging

### Debugging Steps to Follow

#### Step 1: Check Database Table
1. Open phpMyAdmin
2. Check if `achievements` table exists
3. If not, run the SQL script from `achievements_table_schema.sql`

#### Step 2: Check Server Logs
1. Start your Spring Boot application
2. Look for any startup errors related to:
   - Database connection
   - Bean creation failures
   - Autowiring issues

#### Step 3: Test API Endpoints
1. **Test GET first:** `http://localhost:8081/api/achievements/artist/1`
   - Should return empty array `[]` if table exists but has no data
   - Should return sample data if you ran the INSERT statements

2. **Test POST with Postman:**
   ```json
   POST http://localhost:8081/api/achievements/create
   Headers:
   - Authorization: Bearer [your-jwt-token]
   - Content-Type: application/json
   
   Body:
   {
     "title": "Test Achievement",
     "type": "winner",
     "achievementDate": "2024-01-15",
     "prize": "Test Prize",
     "description": "Test Description",
     "iconType": "trophy",
     "colorScheme": "gold"
   }
   ```

### Current Status of Files

#### ✅ **Frontend Files (Working)**
- `AchievementsSection.jsx` - ✅ Icon imports fixed
- `ArtistPortfolio.jsx` - ✅ Component integrated

#### 🔧 **Backend Files (Updated)**
- `AchievementCreateDTO.java` - ✅ Manual getters/setters
- `AchievementResponseDTO.java` - ✅ Manual getters/setters  
- `AchievementUpdateDTO.java` - ✅ Manual getters/setters
- `AchievementController.java` - ✅ Enhanced with debug logging
- `AchievementDAOImpl.java` - ❓ May need verification
- `AchievementServiceImpl.java` - ✅ Updated

#### 📋 **Database Files**
- `achievements_table_schema.sql` - ❗ **Needs to be executed**

### Next Steps

1. **Execute Database Script:**
   ```sql
   -- Copy and paste the content of achievements_table_schema.sql into phpMyAdmin
   ```

2. **Restart Spring Boot Application**

3. **Test API Endpoints** using the debugging steps above

4. **Check Frontend Integration** - navigate to Artist Portfolio → Achievements tab

### Expected Behavior After Fixes

✅ **GET `/api/achievements/artist/{artistId}`** - Returns list of achievements  
✅ **POST `/api/achievements/create`** - Creates new achievement  
✅ **PUT `/api/achievements/{id}`** - Updates achievement  
✅ **DELETE `/api/achievements/{id}`** - Deletes achievement  

### Common Error Messages and Solutions

| Error Message | Likely Cause | Solution |
|---------------|--------------|----------|
| `Table 'achievements' doesn't exist` | Database table not created | Run SQL schema script |
| `Column 'artist_id' cannot be null` | JWT token not extracting user ID | Check token format and validation |
| `Unknown column 'icon_type'` | Database schema mismatch | Re-run SQL schema with correct column names |
| `Bean creation error` | Autowiring issues | Check Spring Boot application startup logs |

### Testing Checklist

- [ ] Database table `achievements` exists
- [ ] Spring Boot application starts without errors
- [ ] GET endpoint returns data (even if empty array)
- [ ] JWT token is valid and contains userId
- [ ] POST request creates achievement successfully
- [ ] Frontend component loads without console errors
- [ ] Add/Edit/Delete operations work in UI

---

**Status:** Ready for database setup and testing  
**Priority:** Execute SQL schema script first, then test endpoints
