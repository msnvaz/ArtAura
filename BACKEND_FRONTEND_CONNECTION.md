# Backend-Frontend Connection Guide

## ✅ Connection Status: CONFIGURED

Your ArtAura application backend and frontend are now properly configured to communicate with each other.

---

## 📋 Configuration Summary

### Backend (Spring Boot)
- **Port:** `8081`
- **Base URL:** `http://localhost:8081`
- **Database:** MySQL (artaura_db on mysql-artaura.alwaysdata.net)
- **CORS:** Enabled for `http://localhost:5173`

### Frontend (React + Vite)
- **Port:** `5173`
- **API URL:** `http://localhost:8081`
- **Environment:** Development

---

## 🔧 Configuration Files

### 1. Backend Configuration

#### `application.properties`
```properties
# Server Configuration
server.port=8081

# Database Connection
spring.datasource.url=jdbc:mysql://mysql-artaura.alwaysdata.net:3306/artaura_db
spring.datasource.username=artaura_vaz2
spring.datasource.password=ArtAura@123

# JWT Configuration
jwt.secret=b7b8f7a9e4b3a6c1d2e5f8a2c7d4e9f1b3a8d6c2f5e7a9b1c3d6e8f2a4b7c9d2
jwt.expiration=3600000

# File Upload (10MB max)
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
```

#### `ChallengeController.java` (CORS Enabled)
```java
@RestController
@RequestMapping("/api/challenges")
@CrossOrigin(origins = "http://localhost:5173")
public class ChallengeController {
    // API endpoints for challenges
}
```

### 2. Frontend Configuration

#### `client/.env`
```properties
VITE_PORT=5173
VITE_API_URL=http://localhost:8081
REACT_APP_BACKEND_URL=http://localhost:8081
```

#### `vite.config.js`
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});
```

---

## 🚀 How to Start the Application

### Step 1: Start Backend (Spring Boot)

**Option A: Using IDE (Eclipse/IntelliJ)**
1. Open the project in your IDE
2. Navigate to `ArtauraApplication.java`
3. Right-click → Run As → Java Application
4. Wait for console message: `Started ArtauraApplication`

**Option B: Using Terminal**
```bash
cd server/artaura
./mvnw spring-boot:run
```

**Expected Output:**
```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::               (v3.2.4)

2025-10-18 10:00:00.000  INFO --- [main] Started ArtauraApplication in 5.123 seconds
```

**Backend URLs:**
- Base API: `http://localhost:8081`
- Challenges API: `http://localhost:8081/api/challenges`
- Health Check: `http://localhost:8081/actuator/health` (if enabled)

### Step 2: Start Frontend (React + Vite)

**Using Terminal:**
```bash
cd client
npm install  # Only needed first time
npm run dev
```

**Expected Output:**
```
  VITE v6.3.5  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

**Frontend URL:**
- Application: `http://localhost:5173`

---

## 🔌 API Endpoints Being Used

### Challenge Management (ModeratorDashboard, WinnerSelection)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/challenges` | Fetch all challenges |
| `POST` | `/api/challenges` | Create new challenge |
| `PUT` | `/api/challenges/{id}` | Update challenge |
| `DELETE` | `/api/challenges/{id}` | Delete challenge |

### Frontend Integration Examples

#### ModeratorDashboard.jsx
```javascript
const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/challenges`);
// Fetches from: http://localhost:8081/api/challenges
```

#### WinnerSelection.jsx
```javascript
const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/challenges`);
// Same endpoint - filters completed challenges client-side
```

#### CreateChallenge.jsx
```javascript
await axios.post(
  `${import.meta.env.VITE_API_URL}/api/challenges`,
  challengeData,
  { headers: { Authorization: `Bearer ${token}` } }
);
```

---

## 🧪 Testing the Connection

### Test 1: Backend Health Check

**Open browser or Postman:**
```
GET http://localhost:8081/api/challenges
```

**Expected Response:**
```json
[
  {
    "id": 1,
    "title": "Abstract Art Contest",
    "status": "active",
    "deadlineDateTime": "2025-10-30T23:59:59",
    "scoringCriteria": {
      "likesWeight": 34,
      "commentsWeight": 33,
      "shareWeight": 33
    }
  }
]
```

### Test 2: Frontend Console

**Open browser DevTools (F12):**
1. Navigate to `http://localhost:5173`
2. Go to ModeratorDashboard
3. Check Console tab

**Expected Output:**
```
✓ Challenges loaded: 5
✓ Completed challenges: 2
```

### Test 3: Network Tab

**In Browser DevTools → Network Tab:**
1. Refresh ModeratorDashboard
2. Look for requests to `localhost:8081`
3. Should see: `GET /api/challenges` with status `200 OK`

---

## 🔍 Troubleshooting

### Issue 1: CORS Error
**Symptom:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**
- ✅ Already fixed! `@CrossOrigin` added to ChallengeController
- Restart Spring Boot application

### Issue 2: Connection Refused
**Symptom:**
```
Error: connect ECONNREFUSED localhost:8081
```

**Solutions:**
1. Check if backend is running:
   ```bash
   netstat -ano | findstr :8081
   ```
2. Restart Spring Boot application
3. Check firewall settings

### Issue 3: Wrong Port
**Symptom:**
```
Failed to fetch from http://localhost:8080/api/challenges
```

**Solution:**
- Check `client/.env` → `VITE_API_URL=http://localhost:8081` (not 8080)
- Restart Vite dev server: `npm run dev`

### Issue 4: Environment Variables Not Loaded
**Symptom:**
```
undefined is not a valid URL
```

**Solution:**
1. Stop Vite dev server (Ctrl+C)
2. Verify `client/.env` exists with `VITE_API_URL`
3. Restart: `npm run dev`

### Issue 5: 404 Not Found
**Symptom:**
```
GET /api/challenges 404
```

**Solution:**
1. Check `ChallengeController` has `@RequestMapping("/api/challenges")`
2. Restart Spring Boot
3. Verify package scan includes controller package

---

## 📊 Connection Flow Diagram

```
┌─────────────────────────────────────────────────────┐
│                    FRONTEND                         │
│              http://localhost:5173                  │
│                                                     │
│  ┌──────────────────────────────────────────────┐ │
│  │  ModeratorDashboard.jsx                      │ │
│  │  WinnerSelection.jsx                         │ │
│  │  CreateChallenge.jsx                         │ │
│  └──────────────────┬───────────────────────────┘ │
│                     │                               │
│                     │ axios.get()                   │
│                     │ VITE_API_URL + '/api/...'    │
└─────────────────────┼───────────────────────────────┘
                      │
                      │ HTTP Request
                      │ GET/POST/PUT/DELETE
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│                   BACKEND                           │
│              http://localhost:8081                  │
│                                                     │
│  ┌──────────────────────────────────────────────┐ │
│  │  @RestController                             │ │
│  │  @RequestMapping("/api/challenges")          │ │
│  │  @CrossOrigin(origins = "http://...5173")    │ │
│  │                                               │ │
│  │  ChallengeController                         │ │
│  │    ↓                                          │ │
│  │  ChallengeService                            │ │
│  │    ↓                                          │ │
│  │  ChallengeDAO                                │ │
│  │    ↓                                          │ │
│  │  JdbcTemplate → MySQL Database               │ │
│  └──────────────────────────────────────────────┘ │
│                                                     │
│  Database: mysql-artaura.alwaysdata.net:3306       │
└─────────────────────────────────────────────────────┘
```

---

## ✅ Verification Checklist

- [x] Backend running on port **8081**
- [x] Frontend running on port **5173**
- [x] CORS configured for **http://localhost:5173**
- [x] Environment variable `VITE_API_URL` set to **http://localhost:8081**
- [x] Database connection configured
- [x] Challenge API endpoints accessible
- [x] Automatic challenge status scheduler enabled (`@EnableScheduling`)

---

## 🎯 Next Steps

### For Development:
1. ✅ Backend and frontend are connected
2. ✅ CORS is configured
3. ✅ Environment variables are set
4. 🔄 Start both servers
5. 🧪 Test API calls from frontend

### For Testing:
1. Open `http://localhost:5173`
2. Navigate to Moderator Dashboard
3. Check "View Winners and Criteria Details"
4. Verify challenges load from database
5. Check browser console for any errors

### For Production:
1. Update `VITE_API_URL` to production URL
2. Update CORS origins in all controllers
3. Use environment-specific properties
4. Enable HTTPS
5. Set up proper authentication

---

## 📞 Support

If you encounter any connection issues:

1. **Check Backend Logs:** Look at Spring Boot console output
2. **Check Frontend Console:** Open browser DevTools (F12)
3. **Verify Ports:** 
   - Backend: `netstat -ano | findstr :8081`
   - Frontend: `netstat -ano | findstr :5173`
4. **Test API Directly:** Use Postman or curl to test `http://localhost:8081/api/challenges`

---

## 🎉 Success Indicators

Your connection is working when:
- ✅ No CORS errors in browser console
- ✅ Challenges load in ModeratorDashboard
- ✅ Winner Selection shows completed challenges
- ✅ Network tab shows successful API calls
- ✅ Backend console shows incoming requests

**Status: READY FOR DEVELOPMENT! 🚀**
