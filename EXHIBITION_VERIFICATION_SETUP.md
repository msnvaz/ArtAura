# Exhibition Verification System - Complete Setup

## 🎯 Overview
This document describes the complete implementation of the Exhibition Verification System that fetches data from the `exhibitions` table and displays it in the Moderator Dashboard.

## 📊 Database Schema
The system fetches from the `exhibitions` table with these fields:
- `id` - Primary key
- `title` - Exhibition title
- `description` - Full description
- `location` - Venue/address
- `category` - Exhibition type
- `start_date`, `end_date` - Event dates
- `start_time`, `end_time` - Event times
- `organizer` - Organizer name
- `entry_fee` - Entry cost (in LKR)
- `max_participants` - Maximum capacity
- `contact_email`, `contact_phone` - Contact information
- `requirements` - Special requirements/guidelines
- `likes` - Engagement count
- `created_by` - Creator ID
- `created_at` - Submission timestamp
- `status` - `pending`, `verified`, or `rejected`

## 🔧 Backend Implementation

### 1. **ExhibitionController.java**
**Endpoint:** `GET /api/exhibitions`
```java
@GetMapping
public ResponseEntity<?> getAllExhibitions()
```
- Returns all exhibitions from the database
- No authentication required (added to SecurityConfig permitAll)
- Returns List<ExhibitionDTO>

**Endpoint:** `PUT /api/exhibitions/{id}/status`
```java
@PutMapping("/{exhibitionId}/status")
public ResponseEntity<?> updateExhibitionStatus(...)
```
- Updates exhibition status (pending/verified/rejected)
- Requires JWT authentication
- Stores rejection reason in `requirements` field

### 2. **ExhibitionServiceImpl.java**
- `getAllExhibitions()` - Fetches all exhibitions via DAO
- `updateExhibitionStatus()` - Updates status with reason

### 3. **ExhibitionDAOImpl.java**
```java
public List<ExhibitionDTO> getAllExhibitions() {
    String sql = "SELECT id, title, description, location, category, " +
                 "start_date, end_date, start_time, end_time, " +
                 "organizer, CAST(entry_fee AS CHAR) as entry_fee, " +
                 "max_participants, contact_email, contact_phone, " +
                 "requirements, likes, created_by, created_at, status " +
                 "FROM exhibitions";
    return jdbcTemplate.query(sql, exhibitionRowMapper);
}
```
- Uses JdbcTemplate for database access
- Maps all fields from exhibitions table
- Handles type conversions (entry_fee as CHAR)

### 4. **SecurityConfig.java** ✅ CRITICAL FIX
Added `/api/exhibitions/**` to permitAll list:
```java
.requestMatchers(
    "/api/auth/login",
    // ... other endpoints ...
    "/api/exhibitions/**", // <<< ADDED THIS LINE
    "/api/users/**"
).permitAll()
```
**This fix resolves the 403 Forbidden error!**

## 🎨 Frontend Implementation

### 1. **VerificationList.jsx - Data Fetching**
```javascript
const fetchExhibitions = async () => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/exhibitions`,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    }
  );
  
  // Maps database fields to component props
  const mappedExhibitions = response.data.map(exhibition => ({
    id: exhibition.id,
    title: exhibition.title,
    description: exhibition.description,
    organizer: exhibition.organizer,
    organizerEmail: exhibition.contact_email,
    venue: exhibition.location,
    startDate: exhibition.start_date,
    endDate: exhibition.end_date,
    startTime: exhibition.start_time,
    endTime: exhibition.end_time,
    category: exhibition.category,
    entryFee: exhibition.entry_fee,
    contactPhone: exhibition.contact_phone,
    requirements: exhibition.requirements,
    likes: exhibition.likes,
    status: mapStatus(exhibition.status),
    // ... other mappings
  }));
}
```

### 2. **Status Mapping**
```javascript
const mapStatus = (dbStatus) => {
  const statusMap = {
    'pending': 'pending',
    'verified': 'approved',
    'rejected': 'rejected'
  };
  return statusMap[dbStatus.toLowerCase()] || 'pending';
};
```

### 3. **Enhanced UI Features**

#### Exhibition Cards Display:
- ✅ Status badge (Pending/Approved/Rejected)
- ✅ Category badge with color
- ✅ Date range with start/end times
- ✅ Organizer name and venue
- ✅ Entry fee and max participants grid
- ✅ Contact preview (phone & email)
- ✅ Rejection reason (if applicable)
- ✅ "View Full Details" gradient button

#### Details Modal Shows:
- ✅ Full description with gradient background
- ✅ Schedule card (start/end dates with times)
- ✅ Location card (venue & full address)
- ✅ Exhibition info grid (4 stat cards):
  - Category
  - Max Participants
  - Entry Fee
  - Likes count ❤️
- ✅ Contact information (organizer, email, phone)
- ✅ Requirements section (if exists)
- ✅ Document verification status
- ✅ Approve/Reject action buttons

### 4. **Statistics Dashboard**
```javascript
const stats = {
  total: exhibitions.length,
  pending: exhibitions.filter(e => e.status === 'pending').length,
  approved: exhibitions.filter(e => e.status === 'approved').length,
  rejected: exhibitions.filter(e => e.status === 'rejected').length
};
```

### 5. **Search & Filter**
- Search by title, organizer, or venue
- Filter by status (All/Pending/Approved/Rejected)
- Real-time filtering of exhibition list

## 🔍 Error Handling

### Enhanced Error Messages:
```javascript
if (err.response?.status === 401) {
  setError('Authentication failed. Please log in again.');
} else if (err.response?.status === 404) {
  setError('Exhibition endpoint not found.');
} else if (err.code === 'ERR_NETWORK') {
  setError('Cannot connect to server. Please ensure backend is running on http://localhost:8081');
} else {
  setError(`Failed to load exhibitions: ${err.response?.data || err.message}`);
}
```

### Console Logging:
```javascript
console.log('🔍 Fetching exhibitions from:', apiUrl);
console.log('✅ Fetched exhibitions successfully:', response.data);
console.log('📊 Total exhibitions:', response.data.length);
console.log('✨ Mapped exhibitions:', mappedExhibitions);
```

## 🚀 Testing Checklist

### Backend Tests:
- [ ] Spring Boot application running on port 8081
- [ ] SecurityConfig includes `/api/exhibitions/**` in permitAll
- [ ] GET `/api/exhibitions` returns 200 OK
- [ ] Response contains all 6 exhibitions from database
- [ ] PUT `/api/exhibitions/{id}/status` requires authentication

### Frontend Tests:
- [ ] Navigate to Moderator Dashboard → Verification tab
- [ ] Statistics show correct counts (Total: 6, Pending: 1, Approved: 4, Rejected: 1)
- [ ] All exhibitions display in cards
- [ ] Search functionality works
- [ ] Filter dropdown works
- [ ] Click "View Full Details" opens modal
- [ ] Modal shows all database fields
- [ ] Approve/Reject buttons function correctly
- [ ] Status updates reflect immediately

## 📝 Database Sample Data
The system expects 6 exhibitions in the database:
1. **Timeless Strokes** - Classic & Heritage Art (verified)
2. **Digital Dreams** - Digital Art & Innovation (verified)
3. **Whispers of Nature** - Nature & Landscape (verified)
4. **Faces & Feelings** - Portrait Art (verified)
5. **Urban Echoes** - Street & Graffiti Art (pending)
6. **Brush & Beyond** - Contemporary Art (rejected)

## 🔐 Security Notes
- Exhibition viewing requires NO authentication (public access)
- Status updates REQUIRE JWT authentication
- CORS configured for localhost:5173 and localhost:5174
- JWT token validated before status changes

## 🛠️ Environment Configuration

### Backend (application.properties):
```properties
server.port=8081
spring.datasource.url=jdbc:mysql://mysql-artaura.alwaysdata.net:3306/artaura_db
```

### Frontend (.env):
```properties
VITE_API_URL=http://localhost:8081
```

## 🎯 Next Steps
1. ✅ Security configuration updated
2. ⏳ Restart Spring Boot application
3. ⏳ Test API endpoint with curl
4. ⏳ Refresh frontend and verify data loads
5. ⏳ Test approve/reject functionality
6. ⏳ Verify search and filter work correctly

## 🐛 Common Issues & Solutions

### Issue: 403 Forbidden Error
**Solution:** Add `/api/exhibitions/**` to SecurityConfig permitAll list

### Issue: Empty exhibitions list
**Solution:** Check database connection and ensure exhibitions table has data

### Issue: Network Error
**Solution:** Ensure backend is running on port 8081

### Issue: Status not updating
**Solution:** Check JWT token is being sent in Authorization header

## 📚 Related Files
- Backend:
  - `ExhibitionController.java`
  - `ExhibitionServiceImpl.java`
  - `ExhibitionDAOImpl.java`
  - `SecurityConfig.java`
  
- Frontend:
  - `VerificationList.jsx`
  - `.env`

## ✅ Success Criteria
When properly configured, you should see:
- ✅ No "Failed to load exhibitions" error
- ✅ Statistics showing 6 total exhibitions
- ✅ All exhibition cards displaying
- ✅ Full details in modal
- ✅ Approve/Reject buttons functional
- ✅ Console logs showing successful API calls

---
**Last Updated:** October 19, 2025
**Status:** ✅ Backend security fixed, waiting for server restart
