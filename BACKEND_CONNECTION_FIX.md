# Quick Fix: Backend Connection Issue

## Problem
Frontend is trying to connect to `http://localhost:8081` but backend is not running.

## Error Messages
```
GET http://localhost:8081/api/shop/profile/23 net::ERR_CONNECTION_REFUSED
```

## Solution

### Option 1: Start Backend (RECOMMENDED)

The backend server needs to be running on port **8081**.

**Using Maven Wrapper (Windows):**
```powershell
cd d:\Artaura\ArtAura\server\artaura
.\mvnw.cmd spring-boot:run
```

**Using Maven (if installed):**
```powershell
cd d:\Artaura\ArtAura\server\artaura
mvn spring-boot:run
```

**Using IDE:**
- Open `ArtauraApplication.java` in your IDE
- Click the "Run" button or press Shift+F10 (IntelliJ) / Ctrl+F11 (Eclipse)

### Option 2: Run via VS Code
1. Open the Run and Debug panel (Ctrl+Shift+D)
2. Look for "Spring Boot" or "ArtauraApplication" configuration
3. Click the green "Start Debugging" button

### Verify Backend is Running

Wait for these log messages in the terminal:
```
Started ArtauraApplication in X.XXX seconds
Tomcat started on port(s): 8081 (http)
```

Then test in browser:
```
http://localhost:8081/api/shop/profile/23
```

You should see JSON data (not a connection error).

## Configuration Details

### Backend Port
**File**: `server/artaura/src/main/resources/application.properties`
```properties
server.port=${SERVER_PORT:8081}
```
Default port: **8081**

### Frontend API URL
**File**: `client/.env`
```properties
VITE_API_URL=http://localhost:8081
```

Both configurations are correct! Just need to start the backend.

## What Happens When Backend Starts

1. ✅ Spring Boot application starts
2. ✅ Connects to database (mysql-artaura.alwaysdata.net)
3. ✅ Loads all controllers including ShopController
4. ✅ Server listens on port 8081
5. ✅ Frontend can now make API calls

## Expected Startup Logs

```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v3.2.4)

2025-10-18 ... : Starting ArtauraApplication
2025-10-18 ... : No active profile set, falling back to default
2025-10-18 ... : Tomcat initialized with port(s): 8081 (http)
2025-10-18 ... : Started ArtauraApplication in 8.5 seconds
```

## Troubleshooting

### Port Already in Use
If you see: `Port 8081 is already in use`

**Find and kill the process:**
```powershell
# Find process using port 8081
netstat -ano | findstr :8081

# Kill the process (replace PID with actual process ID)
taskkill /F /PID <PID>
```

### Database Connection Failed
Check database credentials in `application.properties`:
```properties
spring.datasource.url=jdbc:mysql://mysql-artaura.alwaysdata.net:3306/artaura_db
spring.datasource.username=artaura_vaz2
spring.datasource.password=ArtAura@123
```

### Java Version Issues
Ensure you're using Java 17:
```powershell
java -version
```

Should show: `java version "17.x.x"`

## After Backend Starts Successfully

1. Refresh your frontend page
2. The shop profile should now load
3. Edit functionality will work

## Quick Test

Once backend is running, test these endpoints in browser:

1. **Health Check** (if available):
   ```
   http://localhost:8081/actuator/health
   ```

2. **Shop Profile** (requires authentication):
   ```
   http://localhost:8081/api/shop/profile/23
   ```
   (Will show 401/403 if not authenticated - that's OK, means server is working)

---

**Status**: Backend server is currently starting...
**Port**: 8081
**Frontend Port**: 5173
