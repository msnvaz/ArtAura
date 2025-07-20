# Backend Connection Test Script

## Quick Steps to Fix 403 Errors

### 1. **Restart the Backend Server**
After modifying the SecurityConfig.java file, you need to restart the Spring Boot application:

```bash
cd server/artaura
./mvnw spring-boot:run
```

### 2. **Test Backend Connectivity**
Open a new terminal and test if the backend is accessible:

```bash
# Test if backend is running
curl http://localhost:8081/api/admin/artworks

# Test with JSON response formatting (if you have jq installed)
curl http://localhost:8081/api/admin/artworks | jq .
```

### 3. **Frontend Debugging Steps**

1. **Clear browser cache and localStorage**:
   - Open browser DevTools (F12)
   - Go to Application tab → Storage → Clear storage
   - Or manually: `localStorage.clear()` in console

2. **Check Network requests**:
   - Open DevTools → Network tab
   - Try the API test buttons
   - Look for failed requests and their details

3. **Check Console for errors**:
   - Look for any JavaScript errors
   - Check if token is being sent correctly

### 4. **Alternative: Temporary Admin Token**

If you need a quick test, you can temporarily disable auth for admin endpoints by modifying the SecurityConfig.java:

```java
// In SecurityConfig.java, add this line to permitAll():
"/api/admin/**"  // Allow all admin endpoints temporarily
```

### 5. **Database Check**

Make sure your MySQL database is running and accessible:

```sql
-- Connect to MySQL and check if database exists
USE artaura_db;
SHOW TABLES;

-- Check if there are any artworks in the database
SELECT COUNT(*) FROM artworks;  -- or whatever your table name is
```

### 6. **Common Issues and Solutions**

| Issue | Solution |
|-------|----------|
| 403 Forbidden | Update SecurityConfig.java and restart backend |
| Connection Refused | Check if backend is running on port 8081 |
| CORS Error | Verify CORS configuration in SecurityConfig.java |
| No data returned | Check database connectivity and table contents |
| Token issues | Clear localStorage and check token format |

### 7. **Test Order**

1. First, test the "Direct Fetch" button in the test component
2. If that works, test the "Artworks Endpoint" button
3. Finally, test the "Statistics Endpoint" button

This will help isolate where the issue is occurring.
