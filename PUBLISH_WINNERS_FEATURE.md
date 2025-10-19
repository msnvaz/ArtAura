# Publish Winners Feature - Documentation

## Overview
The "Publish Winners" feature allows moderators to share challenge results with all ArtAura users by publishing winner details to the main feed.

## Location
**Path:** Moderator Dashboard → Winners Tab
**Component:** `WinnerSelection.jsx`

## How It Works

### 1. Select a Completed Challenge
- Choose a completed challenge from the dropdown menu
- The challenge must have winners calculated

### 2. Review Winner Details
The page displays:
- **Challenge Information**
  - Challenge name and description
  - Completed date and deadline
  - Category and rewards
  - Maximum participants

- **Winners Section** (🏆)
  - 1st Place (Gold) - Winner name and artwork
  - 2nd Place (Silver) - Winner name and artwork
  - 3rd Place (Bronze) - Winner name and artwork

- **Scoring Criteria** (📊)
  - Likes Weight (%)
  - Comments Weight (%)
  - Share Weight (%)
  - Total Weight verification

### 3. Publish Winners Button
Located after the Scoring Criteria section, the button allows you to:
- **Publish** winners to the main feed where all users can see
- **Status indicators:**
  - ✅ **Green badge**: "Published!" (success)
  - 🔄 **Spinning loader**: "Publishing..." (in progress)
  - 📢 **Megaphone icon**: "Publish Winners" (ready to publish)

### 4. Publish Restrictions
The button is **disabled** when:
- No challenge is selected
- The challenge has no winners calculated
- Publishing is already in progress

## UI Components

### Publish Section Design
```
┌─────────────────────────────────────────────────────────────┐
│  📢  Publish Winners to Main Feed                     [Button]│
│      Share the winners and results with all ArtAura users    │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- **Gradient background**: Amber to orange gradient with dashed border
- **Megaphone icon**: Visual indicator for publishing action
- **Responsive layout**: Stacks vertically on mobile, horizontal on desktop
- **Hover effects**: Button elevates and changes gradient on hover

### Success Message
```
✅ Winners Published Successfully!
   The winners are now visible on the main feed for all users.
```

### Error Message
```
❌ Failed to Publish
   [Error details displayed here]
```

### Warning Message (No Winners)
```
⚠️ Winners must be calculated before publishing to the main feed.
```

## Technical Implementation

### State Management
```javascript
const [isPublishing, setIsPublishing] = useState(false);
const [publishSuccess, setPublishSuccess] = useState(false);
const [publishError, setPublishError] = useState(null);
```

### Publish Function
```javascript
const handlePublishWinners = async () => {
  // Validates challenge selection
  // Prepares winner data
  // Calls API to publish
  // Shows success/error feedback
}
```

### Data Structure Published
```javascript
{
  challengeId: number,
  challengeName: string,
  challengeDescription: string,
  completedDate: string,
  winners: [
    {
      position: 1,
      name: string,
      title: string
    },
    // ... more winners
  ],
  scoringCriteria: {
    likesWeight: number,
    commentsWeight: number,
    shareWeight: number
  },
  category: string,
  rewards: string
}
```

## Backend Integration (To Be Implemented)

### API Endpoint
```
POST /api/challenges/{challengeId}/publish-winners
```

### Request Headers
```
Authorization: Bearer {token}
```

### Request Body
```json
{
  "challengeId": 1,
  "challengeName": "August Art Challenge",
  "challengeDescription": "...",
  "completedDate": "2024-08-31T23:59:59",
  "winners": [...],
  "scoringCriteria": {...},
  "category": "Mixed Media",
  "rewards": "LKR 50000"
}
```

### Expected Response
```json
{
  "success": true,
  "message": "Winners published successfully",
  "feedPostId": 123
}
```

## User Experience Flow

### Happy Path
1. Moderator selects completed challenge
2. Reviews winners and scoring criteria
3. Clicks "Publish Winners" button
4. Button shows loading state ("Publishing...")
5. Success message appears with green checkmark
6. Button shows "Published!" for 3 seconds
7. Winners appear in main feed for all users

### Error Handling
1. **No Challenge Selected**: Error message "Please select a challenge first"
2. **Challenge Not Found**: Error message "Challenge not found"
3. **API Failure**: Shows error from backend or "Failed to publish winners"
4. **No Winners**: Button disabled with warning message

## Visual Design

### Color Scheme
- **Primary Button**: Gradient from `#D87C5A` to `#c4664a`
- **Success**: Green (`#28a745`, `#d4edda`)
- **Error**: Red (`#dc3545`, `#f8d7da`)
- **Warning**: Yellow (`#ffc107`, `#fff3cd`)
- **Background**: Amber to orange gradient (`from-amber-50 to-orange-50`)

### Icons
- 📢 **Megaphone** (Publish action)
- ✅ **CheckCircle** (Success state)
- ❌ **XCircle** (Error state)
- ⚠️ **AlertCircle** (Warning state)

### Button States
| State | Background | Cursor | Effect |
|-------|-----------|--------|--------|
| Enabled | Gradient | Pointer | Hover lift & shadow |
| Disabled | Gray | Not-allowed | No hover effect |
| Publishing | Gray | Default | Spinner animation |
| Success | Green | Default | Checkmark icon |

## Testing Checklist

- [ ] Button appears after selecting a completed challenge
- [ ] Button is disabled when no challenge is selected
- [ ] Button is disabled when challenge has no winners
- [ ] Clicking button shows "Publishing..." with spinner
- [ ] Success message appears after successful publish
- [ ] Success message disappears after 3 seconds
- [ ] Error message appears if publish fails
- [ ] Console logs show published data
- [ ] Button hover effects work correctly
- [ ] Responsive design works on mobile

## Current Status (v1.0)

### ✅ Implemented
- UI components and button
- State management
- Validation logic
- Success/error messaging
- Responsive design
- Dummy data simulation
- Console logging

### ⏳ To Be Implemented
- Backend API endpoint
- Actual API integration
- Feed post creation
- User notifications
- Published status tracking
- Unpublish functionality (future)

## Dummy Data Mode

Currently, the feature operates with **dummy data**:
- Simulates API call with 1.5 second delay
- Logs publish data to console
- Shows success message
- No actual database changes

**To enable real publishing:**
Uncomment the API call section in `handlePublishWinners()` function:
```javascript
const response = await axios.post(
  `${import.meta.env.VITE_API_URL}/api/challenges/${challenge.id}/publish-winners`,
  publishData,
  {
    headers: { 
      'Authorization': `Bearer ${localStorage.getItem('token')}` 
    }
  }
);
```

## Future Enhancements

1. **Published Status Indicator**: Show which challenges have been published
2. **Republish Option**: Update published winners if changed
3. **Unpublish Feature**: Remove winners from main feed
4. **Preview Before Publish**: Show how winners will appear in feed
5. **Scheduled Publishing**: Publish winners at specific time
6. **Email Notifications**: Notify winners via email
7. **Social Media Sharing**: Share winners on social platforms

## Support

For issues or questions:
- Check browser console for debug logs
- Verify challenge has winners calculated
- Ensure user has moderator permissions
- Check network tab for API calls (when implemented)

---

**Last Updated:** October 19, 2025
**Component:** `client/src/pages/Moderator/WinnerSelection.jsx`
**Feature Status:** ✅ Frontend Complete | ⏳ Backend Pending
