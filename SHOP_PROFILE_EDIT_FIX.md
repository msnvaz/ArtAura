# Shop Profile Edit Functionality - Implementation Guide

## Overview
Fixed the shop profile viewing and editing functionality. The system now properly fetches shop data using the logged-in user's ID and allows editing of shop profile fields.

## Key Architecture Understanding

### Authentication Flow
1. When a shop owner logs in, the backend returns:
   - `token`: JWT authentication token
   - `role`: "shop"
   - `userId`: This is actually the **shop_id** from the `shops` table

2. The `userId` stored in localStorage for shops **IS** the `shop_id`
   - There is no separate `user_id` column in the shops table
   - Shops are identified by their `shop_id` (primary key) and `email` (unique)

## Changes Made

### Backend Changes

#### 1. ShopDAOImpl.java
**File**: `server/artaura/src/main/java/com/artaura/artaura/dao/Impl/ShopDAOImpl.java`

**Issue**: The `findByUserId()` method was correct but needed clarification
**Fix**: Added comment to clarify that userId for shops IS the shop_id

```java
@Override
public ShopDTO findByUserId(Long userId) {
    // In this system, userId for shops IS the shop_id (from authentication)
    String sql = "SELECT * FROM shops WHERE shop_id = ?";
    try {
        return jdbc.queryForObject(sql, (rs, rowNum) -> mapShop(rs), userId);
    } catch (org.springframework.dao.EmptyResultDataAccessException e) {
        return null;
    }
}
```

#### 2. ShopDTO.java
**File**: `server/artaura/src/main/java/com/artaura/artaura/dto/shop/ShopDTO.java`

**Issues**: 
- Removed unused `LocalDateTime` import
- Removed problematic duplicate `setCreatedAt()` method that threw UnsupportedOperationException
- Added all missing getters and setters (Lombok @Data should handle this, but added explicitly for clarity)

#### 3. ShopController.java
**File**: `server/artaura/src/main/java/com/artaura/artaura/controller/ShopController.java`

**Changes**:
- Added logging to all endpoints for debugging
- Clarified that `/profile/{userId}` endpoint receives shop_id as userId
- Enhanced error handling in update endpoint

```java
@GetMapping("/profile/{userId}")
public ResponseEntity<ShopDTO> getShopProfile(@PathVariable Long userId) {
    System.out.println("📋 ShopController: Fetching shop profile for userId/shopId: " + userId);
    ShopDTO shop = shopService.getShopByUserId(userId);
    if (shop != null) {
        System.out.println("✅ Shop found: " + shop.getShopName() + " (ID: " + shop.getShopId() + ")");
        return ResponseEntity.ok(shop);
    } else {
        System.out.println("❌ Shop not found for userId/shopId: " + userId);
        return ResponseEntity.notFound().build();
    }
}

@PutMapping("/update/{shopId}")
public ResponseEntity<String> updateShop(@PathVariable Long shopId, @RequestBody ShopDTO shopDTO) {
    System.out.println("📝 ShopController: Updating shop with ID: " + shopId);
    try {
        shopService.updateShop(shopId, shopDTO);
        System.out.println("✅ Shop updated successfully");
        return ResponseEntity.ok("Shop updated successfully");
    } catch (Exception e) {
        System.out.println("❌ Error updating shop: " + e.getMessage());
        return ResponseEntity.status(500).body("Error updating shop: " + e.getMessage());
    }
}
```

### Frontend Changes

#### 4. Profile.jsx
**File**: `client/src/pages/shop/Profile.jsx`

**Major Changes**:

##### a) Simplified fetchShopProfile()
- Removed unnecessary email-based lookup
- Uses `userId` from localStorage (which is the shop_id)
- Calls `/api/shop/profile/${userId}` endpoint
- Better error handling and logging

```javascript
const fetchShopProfile = async () => {
  try {
    setLoading(true);
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId"); // This is actually the shop_id
    
    if (!userId || !token) {
      throw new Error("Please log in again.");
    }
    
    const response = await fetch(`${API_URL}/api/shop/profile/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // Handle errors...
    }

    const data = await response.json();
    // Format and set data...
  } catch (err) {
    // Error handling...
  }
};
```

##### b) Enhanced handleSave()
- Added validation to ensure shopId exists
- Trims all input fields before sending
- Better error handling
- Updates local state after successful save
- Improved user feedback

```javascript
const handleSave = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!profileData.shopId) {
      showToast("❌ Shop ID not found. Please reload the page.", "error", 3000);
      return;
    }

    const updateData = {
      shopName: editData.shopName.trim(),
      ownerName: editData.ownerName.trim(),
      email: editData.email.trim(),
      contactNo: editData.contactNo.trim(),
      businessType: editData.businessType.trim(),
      businessLicense: editData.businessLicense.trim(),
      taxId: editData.taxId.trim(),
      description: editData.description.trim()
    };

    const response = await fetch(`${API_URL}/api/shop/update/${profileData.shopId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      // Error handling...
      return;
    }

    // Update local state
    const updatedData = {
      ...editData,
      ...updateData,
      joinDate: profileData.joinDate
    };
    
    setProfileData(updatedData);
    setEditData(updatedData);
    setIsEditing(false);
    showToast("✅ Profile updated successfully!", "success", 2500);
    
  } catch (err) {
    console.error("❌ Error updating profile:", err);
    showToast("❌ Server error. Please try again later.", "error", 3000);
  }
};
```

#### 5. AuthContext.jsx
**File**: `client/src/context/AuthContext.jsx`

**Changes**:
- Removed unnecessary shopId fetching after login
- Simplified login function
- Added clarifying comments
- Cleaned up logout function

```javascript
const login = (token, role, userId) => {
  localStorage.setItem("token", token);
  localStorage.setItem("role", role);
  localStorage.setItem("userId", userId);
  setAuth({ token, role, userId });
  
  console.log("✅ User logged in:", { role, userId });
  // Note: For shops, userId IS the shop_id from the database
};

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("userId");
  setAuth({ token: null, role: null, userId: null });
  console.log("✅ User has been logged out.");
};
```

## Database Schema Reference

### shops table structure:
```sql
CREATE TABLE `shops` (
  `shop_id` bigint(20) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `agreed_terms` bit(1) NOT NULL,
  `business_license` varchar(255) DEFAULT NULL,
  `business_type` varchar(255) DEFAULT NULL,
  `contact_no` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT current_timestamp(6),
  `description` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL UNIQUE,
  `owner_name` varchar(255) DEFAULT NULL,
  `nic` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `shop_name` varchar(255) DEFAULT NULL,
  `tax_id` varchar(255) DEFAULT NULL,
  `status` enum('Active','Suspended') DEFAULT 'Active',
  `nic_image_url` varchar(500) DEFAULT NULL
);
```

**Key Points**:
- `shop_id` is the primary key
- `email` is unique
- **No `user_id` column exists**

## API Endpoints

### 1. Get Shop Profile
**Endpoint**: `GET /api/shop/profile/{userId}`
**Parameters**: 
- `userId`: The user ID from localStorage (which is the shop_id)
**Headers**: 
- `Authorization: Bearer {token}`
**Response**: ShopDTO object

### 2. Get Shop by ID
**Endpoint**: `GET /api/shop/{shopId}`
**Parameters**: 
- `shopId`: The shop ID
**Headers**: 
- `Authorization: Bearer {token}`
**Response**: ShopDTO object

### 3. Update Shop Profile
**Endpoint**: `PUT /api/shop/update/{shopId}`
**Parameters**: 
- `shopId`: The shop ID to update
**Headers**: 
- `Authorization: Bearer {token}`
- `Content-Type: application/json`
**Body**: ShopDTO with updated fields
**Response**: Success message

## Testing Instructions

1. **Login as Shop Owner**
   - Use valid shop credentials
   - Verify token, role, and userId are stored in localStorage

2. **View Profile**
   - Navigate to shop profile page
   - Profile should load automatically
   - Verify all fields are populated correctly

3. **Edit Profile**
   - Click "Edit Profile" button
   - Modify fields (shop name, owner name, email, contact, business details, description)
   - Click "Save Changes"
   - Verify success toast appears
   - Verify changes are reflected immediately
   - Refresh page and verify changes persisted

4. **Error Scenarios**
   - Try accessing profile without authentication
   - Try updating with invalid data
   - Verify appropriate error messages appear

## Features

### Editable Fields
- ✅ Shop Name
- ✅ Owner Name
- ✅ Email Address
- ✅ Contact Number
- ✅ Business Type
- ✅ Business License
- ✅ Tax ID
- ✅ Description

### Read-Only Fields
- Shop Status
- Join Date (Created At)
- Agreed Terms

### UI Features
- ✅ Edit/Save/Cancel buttons
- ✅ Input validation (trimming whitespace)
- ✅ Loading states
- ✅ Error handling with user-friendly messages
- ✅ Success/error toast notifications
- ✅ Responsive design

## Important Notes

1. **User ID = Shop ID**: In the authentication system, when a shop logs in, the `userId` returned is actually the `shop_id` from the database.

2. **No Separate User Table**: Shops don't have a separate user entry - they are users identified by their shop_id.

3. **Email is Unique**: Each shop has a unique email address that can be used for authentication.

4. **Status Field**: Shops can have status 'Active' or 'Suspended' - suspended shops cannot log in.

## Troubleshooting

### Issue: "Shop not found"
**Solution**: Verify that:
- User is logged in as a shop owner (role = "shop")
- userId is stored in localStorage
- Shop exists in database with that shop_id

### Issue: "Update failed"
**Solution**: Check that:
- All required fields are filled
- Email format is valid
- Shop ID is valid
- User has permission to update (authenticated)

### Issue: Profile not loading
**Solution**: 
- Check browser console for errors
- Verify backend is running
- Check network tab for API call status
- Verify authentication token is valid

## Conclusion

The shop profile edit functionality is now fully functional with:
- ✅ Proper data fetching using userId (shop_id)
- ✅ Full profile editing capabilities
- ✅ Real-time updates
- ✅ Proper error handling
- ✅ User-friendly UI with toast notifications
- ✅ Comprehensive logging for debugging
