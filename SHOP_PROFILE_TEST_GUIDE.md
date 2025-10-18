# Shop Profile Edit - Quick Test Guide

## Prerequisites
- Backend server running on port 8080
- Frontend running on port 5173
- Database with shops table populated
- A valid shop account to test with

## Test Steps

### 1. Login Test
1. Navigate to shop login page
2. Login with shop credentials (e.g., `art2@gmail.com`)
3. Open browser DevTools Console
4. Check console logs:
   ```
   ✅ User logged in: {role: "shop", userId: 2}
   ```
5. Verify localStorage contains:
   - `token`: JWT token
   - `role`: "shop"
   - `userId`: (shop_id number)

### 2. View Profile Test
1. Navigate to shop profile page (`/shop/profile` or similar)
2. Check console logs:
   ```
   LocalStorage contents: {token: "present", userId: 2, role: "shop"}
   Fetching profile for userId (shopId): 2
   Response status: 200
   ✅ Received shop data: {shopId: 2, shopName: "Art", ...}
   📋 Formatted profile data: {...}
   ```
3. Verify backend logs:
   ```
   📋 ShopController: Fetching shop profile for userId/shopId: 2
   ✅ Shop found: Art (ID: 2)
   ```
4. Verify all profile fields are displayed:
   - ✅ Shop Name: "Art"
   - ✅ Owner Name: "Wall"
   - ✅ Email: "art2@gmail.com"
   - ✅ Contact Number: "25468876"
   - ✅ Business Type: "Sole Proprietorship"
   - ✅ Business License: "huyyrretxe"
   - ✅ Tax ID: "bhvfcdx"
   - ✅ Description: "kjbyuvtcry"
   - ✅ Shop Status: "Active"
   - ✅ Member Since: "June 30, 2025"

### 3. Edit Profile Test
1. Click **"Edit Profile"** button
2. Verify:
   - ✅ All input fields become editable
   - ✅ "Edit Profile" button changes to "Save Changes"
   - ✅ "Cancel" button appears
   
3. Modify some fields:
   ```
   Shop Name: "Art Gallery"
   Owner Name: "John Wall"
   Description: "Premium art supplies and materials"
   Contact Number: "0771234567"
   ```

4. Click **"Save Changes"**

5. Check console logs:
   ```
   📝 Updating shop profile: {
     shopName: "Art Gallery",
     ownerName: "John Wall",
     email: "art2@gmail.com",
     contactNo: "0771234567",
     businessType: "Sole Proprietorship",
     businessLicense: "huyyrretxe",
     taxId: "bhvfcdx",
     description: "Premium art supplies and materials"
   }
   ✅ Profile updated successfully
   ```

6. Verify backend logs:
   ```
   📝 ShopController: Updating shop with ID: 2
   📄 Update data: Art Gallery, art2@gmail.com
   ✅ Shop updated successfully
   ```

7. Verify:
   - ✅ Success toast notification appears
   - ✅ Edit mode closes
   - ✅ Updated data is displayed
   - ✅ Fields are no longer editable

8. Refresh the page and verify changes persisted

### 4. Cancel Edit Test
1. Click **"Edit Profile"**
2. Modify some fields
3. Click **"Cancel"** button
4. Verify:
   - ✅ Edit mode closes
   - ✅ Original data is restored
   - ✅ No changes were saved

### 5. Error Handling Tests

#### Test 5.1: No Authentication
1. Clear localStorage
2. Try to access profile page
3. Verify error message: "No user ID found. Please log in again."

#### Test 5.2: Invalid Token
1. Modify token in localStorage to invalid value
2. Try to access profile page
3. Verify error message: "Authentication failed. Please log in again."

#### Test 5.3: Network Error
1. Stop backend server
2. Try to edit and save profile
3. Verify error message: "Server error. Please try again later."

## Expected Database Update

After successful edit, run this SQL to verify:
```sql
SELECT shop_id, shop_name, owner_name, email, contact_no, description 
FROM shops 
WHERE shop_id = 2;
```

Expected result:
```
shop_id: 2
shop_name: "Art Gallery"
owner_name: "John Wall"
email: "art2@gmail.com"
contact_no: "0771234567"
description: "Premium art supplies and materials"
```

## Test with Different Shop Accounts

Test with multiple shops from the database:
- Shop ID 1: clane23@gmail.com (Status: Suspended)
- Shop ID 2: art2@gmail.com (Status: Active)
- Shop ID 7: jcpaint56@gmail.com (Status: Active)
- Shop ID 8: rasanjani9jayasingha@gmail.com (Status: Active)

## Common Issues & Solutions

### Issue: 404 Not Found
**Cause**: Shop ID doesn't exist in database
**Solution**: Verify userId in localStorage matches a shop_id in database

### Issue: 401 Unauthorized
**Cause**: Invalid or expired token
**Solution**: Log out and log back in

### Issue: Changes not saving
**Cause**: Backend error or validation issue
**Solution**: Check backend console logs for error details

### Issue: Profile not loading
**Cause**: Missing userId in localStorage
**Solution**: Log out and log back in to reset authentication

## Success Criteria

✅ Shop can view their profile
✅ All profile fields display correctly
✅ Shop can edit all editable fields
✅ Changes save successfully to database
✅ Changes persist after page refresh
✅ Appropriate error messages for all error scenarios
✅ UI is responsive and user-friendly
✅ Toast notifications work correctly
✅ Cancel button discards changes
✅ Loading states display properly

## Browser Console Logs (Expected)

### On Profile Load:
```
LocalStorage contents: {token: "present", userId: 2, role: "shop"}
Fetching profile for userId (shopId): 2
Response status: 200
✅ Received shop data: Object
📋 Formatted profile data: Object
```

### On Profile Update:
```
📝 Updating shop profile: Object
✅ Profile updated successfully
```

### Backend Logs:
```
📋 ShopController: Fetching shop profile for userId/shopId: 2
✅ Shop found: Art Gallery (ID: 2)
📝 ShopController: Updating shop with ID: 2
📄 Update data: Art Gallery, art2@gmail.com
✅ Shop updated successfully
```

## API Test (Optional)

Use Postman/Insomnia to test endpoints directly:

### Get Profile
```
GET http://localhost:8080/api/shop/profile/2
Headers:
  Authorization: Bearer {your-token}
  Content-Type: application/json
```

### Update Profile
```
PUT http://localhost:8080/api/shop/update/2
Headers:
  Authorization: Bearer {your-token}
  Content-Type: application/json
Body:
{
  "shopName": "Test Shop",
  "ownerName": "Test Owner",
  "email": "test@example.com",
  "contactNo": "0771234567",
  "businessType": "Sole Proprietorship",
  "businessLicense": "BL12345",
  "taxId": "TX12345",
  "description": "Test description"
}
```

---

**Test Status**: ⏳ Ready for Testing
**Last Updated**: October 18, 2025
