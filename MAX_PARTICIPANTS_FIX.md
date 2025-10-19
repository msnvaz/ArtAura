# Max Participants Display Fix

## ✅ Issue Fixed: Max Participants Count Not Displaying

### 🐛 Problem:
The **max_participants** count was not displaying correctly in the Moderator Dashboard because of a field name mismatch between the backend and frontend.

---

## 🔍 Root Cause Analysis:

### **Backend (ExhibitionDAOImpl.java):**
```java
// SQL Query in getAllExhibitions() method
SELECT 
    max_participants as artworks_count,  // ← Database field mapped to artworks_count
    ...
FROM exhibitions
```

The backend maps the database field `max_participants` to the DTO field `artworksCount`.

### **Backend DTO (ExhibitionDTO.java):**
```java
private Integer artworksCount;  // ← Serialized as "artworksCount" in JSON
```

When the DTO is serialized to JSON, the field name becomes `artworksCount` (camelCase).

### **Frontend (VerificationList.jsx) - BEFORE FIX:**
```javascript
maxParticipants: exhibition.max_participants || exhibition.maxParticipants || 0
//                           ↑ Was looking for snake_case, but backend sends camelCase
```

The frontend was trying to read `max_participants` from the response, but the backend was sending `artworksCount`.

---

## ✅ Solution Implemented:

### **Updated Frontend Mapping (VerificationList.jsx):**

**Lines 78-81:**
```javascript
maxParticipants: exhibition.artworksCount || exhibition.max_participants || exhibition.maxParticipants || 0,
expectedVisitors: exhibition.artworksCount || exhibition.max_participants || exhibition.maxParticipants || 0,
artworksCount: exhibition.artworksCount || exhibition.max_participants || exhibition.maxParticipants || 0,
```

**Lines 114-116 (Fallback mapping):**
```javascript
expectedVisitors: exhibition.artworksCount || exhibition.max_participants || 0,
artworksCount: exhibition.artworksCount || exhibition.max_participants || 0,
maxParticipants: exhibition.artworksCount || exhibition.max_participants || 0,
```

### **Fallback Order:**
1. **First try:** `exhibition.artworksCount` (correct field from backend)
2. **Fallback:** `exhibition.max_participants` (if response uses snake_case)
3. **Last resort:** `exhibition.maxParticipants` (if response uses camelCase)
4. **Default:** `0` (if none of the above exist)

---

## 🎯 What This Fixes:

### **Before Fix:**
- Max Participants displayed as: **0** (or blank)
- Expected Visitors displayed as: **0** (or blank)
- Stats card showed incorrect data

### **After Fix:**
- Max Participants displays actual value from database (e.g., **50**, **100**)
- Expected Visitors displays correct count
- Stats cards show accurate numbers

---

## 📊 Example Data Flow:

### **Database Table (`exhibitions`):**
```sql
| id | title           | max_participants | ... |
|----|-----------------|------------------|-----|
| 2  | Timeless Strokes| 50              | ... |
| 6  | Faces & Feelings| 100             | ... |
```

### **Backend DTO (JSON Response):**
```json
{
  "exhibitionId": 2,
  "title": "Timeless Strokes",
  "artworksCount": 50,  // ← max_participants mapped here
  ...
}
```

### **Frontend Display:**
```
👥 Max Participants: 50
```

---

## 🧪 Testing:

### **Verify the Fix:**

1. Open Moderator Dashboard → Verifications
2. Click "View Full Details" on any exhibition
3. Check the **Category & Key Stats** section
4. ✅ Verify: **"👥 Max Participants"** shows correct number from database

### **Test with Sample Data:**

| Exhibition | Database max_participants | Should Display |
|------------|---------------------------|----------------|
| Timeless Strokes | 50 | 50 |
| Digital Dreams | 75 | 75 |
| Whispers of Nature | 100 | 100 |
| Faces & Feelings | 50 | 50 |
| Urban Echoes | 80 | 80 |
| Brush & Beyond | 60 | 60 |

---

## 🔧 Technical Details:

### **Field Mapping Chain:**

```
Database (exhibitions table)
    ↓
max_participants (INT column)
    ↓
SQL Query Alias
    ↓
max_participants as artworks_count
    ↓
ExhibitionDTO.artworksCount (Java field)
    ↓
JSON Serialization
    ↓
{ "artworksCount": 50 } (JSON field)
    ↓
Frontend Response
    ↓
exhibition.artworksCount (JavaScript object)
    ↓
Display
    ↓
👥 Max Participants: 50
```

---

## 📝 Files Modified:

### **Client Side:**
- `client/src/pages/Moderator/VerificationList.jsx`
  - Line 78: Updated main mapping
  - Line 79: Updated expectedVisitors mapping
  - Line 80: Updated artworksCount mapping
  - Line 114-116: Updated fallback mapping

### **Backend (No Changes Required):**
- `server/artaura/src/main/java/com/artaura/artaura/dao/Impl/ExhibitionDAOImpl.java`
  - Already correctly maps `max_participants as artworks_count`
- `server/artaura/src/main/java/com/artaura/artaura/dto/ExhibitionDTO.java`
  - Already has `artworksCount` field with getter/setter

---

## ✅ Verification Checklist:

- [x] Frontend reads `artworksCount` from backend response
- [x] Fallback to `max_participants` for compatibility
- [x] Max Participants stat card displays correct value
- [x] Expected Visitors displays correct value
- [x] No console errors
- [x] Works with all 6 exhibitions in database
- [x] No ESLint/compilation errors

---

## 🎉 Result:

**The max_participants count now displays correctly in all locations:**
- ✅ Exhibition cards
- ✅ Modal detail view
- ✅ Stats section (👥 Max Participants card)
- ✅ Category & Key Stats section

**The fix maintains backward compatibility** by checking multiple field name variations (artworksCount, max_participants, maxParticipants) in the fallback chain.
