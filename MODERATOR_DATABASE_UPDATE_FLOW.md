# Moderator Exhibition Status Update - Complete Database Flow

## ✅ FEATURE STATUS: FULLY IMPLEMENTED AND WORKING

The moderator can **approve** or **reject** exhibitions, and the changes are **automatically saved to the database** in real-time.

---

## 🔄 Complete Workflow

### **When Moderator Clicks "Approve Exhibition":**

1. **Frontend (VerificationList.jsx)**
   - Line 181-235: `handleStatusChange()` function is triggered
   - Maps `approved` → `verified` (database status)
   - Makes API call: `PUT /api/exhibitions/{exhibitionId}/status`
   - Sends payload: `{ status: "verified", reason: "" }`
   - Updates local state immediately for instant UI feedback
   - Shows success message: "✅ Exhibition approved successfully!"

2. **Backend Controller (ExhibitionController.java)**
   - Line 48-89: `updateExhibitionStatus()` endpoint receives request
   - Validates JWT token from Authorization header
   - Extracts status from request body
   - Calls service layer: `exhibitionService.updateExhibitionStatus()`

3. **Service Layer (ExhibitionServiceImpl.java)**
   - Line 97-99: `updateExhibitionStatus()` method
   - Delegates to DAO layer: `exhibitionDAO.updateExhibitionStatus()`

4. **Database Layer (ExhibitionDAOImpl.java)**
   - Line 328-345: `updateExhibitionStatus()` method
   - **Executes SQL UPDATE query:**
     ```sql
     UPDATE exhibitions 
     SET status = 'verified'
     WHERE id = {exhibitionId}
     ```
   - Returns true if rows affected > 0

5. **Database (MySQL)**
   - Updates the `exhibitions` table
   - Sets `status = 'verified'` for the exhibition
   - Changes persist permanently in database

---

### **When Moderator Clicks "Reject Exhibition":**

1. **Frontend (VerificationList.jsx)**
   - Prompts moderator for rejection reason
   - Makes API call with status: `rejected` and reason
   - Shows success message: "❌ Exhibition rejected successfully!"

2. **Backend → Database Flow (Same as Above)**
   - SQL UPDATE executed:
     ```sql
     UPDATE exhibitions 
     SET status = 'rejected', 
         requirements = '{rejection reason}'
     WHERE id = {exhibitionId}
     ```
   - Rejection reason stored in `requirements` field

---

## 📊 Database Schema

**Table: `exhibitions`**
```sql
CREATE TABLE `exhibitions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `location` varchar(255) NOT NULL,
  `category` varchar(100) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `organizer` varchar(255) DEFAULT NULL,
  `entry_fee` varchar(50) DEFAULT NULL,
  `max_participants` int(11) DEFAULT NULL,
  `contact_email` varchar(255) DEFAULT NULL,
  `contact_phone` varchar(50) DEFAULT NULL,
  `requirements` text DEFAULT NULL,
  `likes` int(11) NOT NULL DEFAULT 0,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

**Status Field Values:**
- `pending` - Awaiting moderator review
- `verified` - Approved by moderator
- `rejected` - Rejected by moderator

---

## 🔐 Security & Authentication

- **GET /api/exhibitions** - No authentication required (permitAll)
- **PUT /api/exhibitions/{id}/status** - Requires JWT token
- **Token Validation:**
  - Extracts from `Authorization: Bearer {token}` header
  - Validates using `JwtUtil.validateToken()`
  - Returns 401 Unauthorized if invalid

---

## 🎯 API Endpoint Details

### **Update Exhibition Status**

**Endpoint:** `PUT /api/exhibitions/{exhibitionId}/status`

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "verified",
  "reason": ""
}
```
or
```json
{
  "status": "rejected",
  "reason": "Exhibition does not meet quality standards."
}
```

**Response (Success):**
```json
"Exhibition status updated successfully"
```

**Response (Error):**
```json
{
  "error": "Exhibition not found"
}
```

**Status Codes:**
- `200 OK` - Status updated successfully
- `400 BAD REQUEST` - Invalid input (missing status)
- `401 UNAUTHORIZED` - Missing or invalid JWT token
- `404 NOT FOUND` - Exhibition not found
- `500 INTERNAL SERVER ERROR` - Database error

---

## 🎨 Frontend UI Flow

### **Moderator Actions Section (VerificationList.jsx)**

**Location:** Lines 790-850

**UI Components:**
1. **Approve Button** (Green Gradient)
   - Only visible when `status === 'pending'`
   - Shows loading spinner during update
   - Disabled during processing
   - Calls: `handleStatusChange(id, 'approved')`

2. **Reject Button** (Red Gradient)
   - Only visible when `status === 'pending'`
   - Prompts for rejection reason
   - Shows loading spinner during update
   - Disabled during processing
   - Calls: `handleStatusChange(id, 'rejected', reason)`

3. **Success Message**
   - Appears after successful update
   - Auto-dismisses after 3 seconds
   - Green for approval, Red for rejection

---

## 🔍 Real-Time UI Updates

After status update, the frontend **immediately reflects changes**:

1. **Statistics Update:**
   - Total exhibitions count
   - Pending count decreases
   - Approved/Rejected count increases

2. **Exhibition Card:**
   - Status badge changes color
   - Card border changes color
   - Verification status updated

3. **Modal View:**
   - Status banner changes color
   - Verification notes updated
   - Moderator actions hidden (if no longer pending)

---

## 🧪 Testing Instructions

### **Test Approve Flow:**

1. Navigate to Moderator Dashboard → Verifications
2. Find an exhibition with status "Pending" (e.g., "Faces & Feelings" - ID: 6)
3. Click "View Full Details"
4. Click "Approve Exhibition" button
5. ✅ Verify:
   - Success message appears
   - Modal closes
   - Card status changes to "Approved"
   - Green badge and border appear
   - Statistics update (Pending: 0, Approved: 5)

### **Test Reject Flow:**

1. Find another pending exhibition
2. Click "View Full Details"
3. Click "Reject Exhibition" button
4. Enter rejection reason: "Missing required documentation"
5. ✅ Verify:
   - Success message appears
   - Modal closes
   - Card status changes to "Rejected"
   - Red badge and border appear
   - Statistics update (Rejected: 2)

### **Verify Database Persistence:**

Run SQL query:
```sql
SELECT id, title, status, requirements, created_at 
FROM exhibitions 
WHERE id IN (2, 3, 4, 6, 12, 13);
```

Expected Results:
- Status changes persist after page refresh
- Rejection reasons stored in `requirements` field
- Database state matches UI display

---

## 📝 Code References

### **Frontend Files:**
- `client/src/pages/Moderator/VerificationList.jsx`
  - Line 181-235: `handleStatusChange()` function
  - Line 790-850: Moderator Actions UI

### **Backend Files:**
- `server/artaura/src/main/java/com/artaura/artaura/controller/ExhibitionController.java`
  - Line 48-89: `updateExhibitionStatus()` endpoint

- `server/artaura/src/main/java/com/artaura/artaura/service/ExhibitionServiceImpl.java`
  - Line 97-99: Service layer method

- `server/artaura/src/main/java/com/artaura/artaura/dao/Impl/ExhibitionDAOImpl.java`
  - Line 328-345: Database UPDATE query

- `server/artaura/src/main/java/com/artaura/artaura/config/SecurityConfig.java`
  - Configured `/api/exhibitions/**` in permitAll for GET requests

---

## ✅ Verification Checklist

- [x] Frontend makes API call with correct payload
- [x] Backend validates JWT token
- [x] Backend extracts status from request body
- [x] Service layer delegates to DAO
- [x] DAO executes SQL UPDATE query
- [x] Database status field updates correctly
- [x] Frontend receives success response
- [x] UI updates immediately (local state)
- [x] Success message displays
- [x] Statistics recalculate correctly
- [x] Changes persist after page refresh
- [x] Rejection reason stored in database
- [x] Error handling implemented (401, 404, 500)
- [x] Loading states prevent duplicate submissions
- [x] Console logging for debugging

---

## 🎉 Conclusion

**The moderator approve/reject feature is FULLY FUNCTIONAL with complete database integration.**

✅ **When moderator approves an exhibition:**
- Status changes from `pending` → `verified` in database
- Changes persist permanently
- UI reflects updates immediately

✅ **When moderator rejects an exhibition:**
- Status changes to `rejected` in database
- Rejection reason stored in `requirements` field
- Changes persist permanently
- UI reflects updates immediately

**No additional code changes needed - the feature is production-ready!** 🚀
