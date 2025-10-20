# Winner Selection - Display Guide

## Overview
The Winner Selection page now displays completed challenges with full details including:
- Challenge information (name, description, category, deadlines)
- Scoring criteria breakdown (Likes, Comments, Shares weights)
- Winners list (1st, 2nd, 3rd place)

## Features Implemented

### 1. **Completed Challenges Dropdown**
- Only shows challenges with status: 'completed', 'complete', 'finished', or 'done' (case-insensitive)
- Sorted by completion date (most recent first)
- Displays completion date in the dropdown option text
- Guard prevents selecting non-completed challenges

### 2. **Challenge Details Display**
When a challenge is selected, the following sections are shown:

#### Challenge Information Card
- **Challenge Name** with "Completed" badge
- **Category** badge (if available)
- **Description**
- **Completion Date**
- **Deadline Date**
- **Max Participants**
- **Rewards** (if available) - shown in a highlighted box with trophy icon
- **Sponsorship Status** (if requested) - shown as a badge

#### Scoring Criteria Section
Displays the three main scoring weights:
- **Likes Weight** (%) - with Heart icon
- **Comments Weight** (%) - with MessageCircle icon
- **Share Weight** (%) - with Send icon
- **Total Weight** - sum of all weights (should be 100%)

Each criterion is shown in a card with:
- Icon representation
- Percentage value
- Clean typography and color coding

#### Winners Display Section
Shows the top 3 winners with:
- **Position badges** (1st 🥇, 2nd 🥈, 3rd 🥉)
- **Position icons** (Crown for 1st, Medal for 2nd, Award for 3rd)
- **Winner name**
- **Artwork title**
- **Color-coded backgrounds**:
  - 1st place: Gold (#FFD700)
  - 2nd place: Silver (#C0C0C0)
  - 3rd place: Bronze (#CD7F32)

### 3. **Data Mapping & Fallbacks**
The component handles various field name formats from the API:
- `title` / `name` / `challengeName`
- `deadlineDateTime` / `deadline` / `completedDate`
- `scoringCriteria` / `scoring`
- `participants` / `participantCount`
- `submissions` / `submissionCount`

Default scoring criteria if not provided:
```javascript
{
  likesWeight: 34,
  commentsWeight: 33,
  shareWeight: 33
}
```

### 4. **Debug Logging**
Console debug messages help verify:
- Number of challenges fetched from API
- Number of completed challenges detected
- Selected challenge data structure
- Scoring criteria values
- Winners array

## How to Use

### For Moderators:
1. Navigate to **Moderator Dashboard** → **Winners** tab
2. Or click **"Select Winners"** button in the header
3. Select a completed challenge from the dropdown
4. View:
   - Challenge details and metadata
   - Scoring criteria percentages
   - Winners (if available)

### For Developers:
Check browser console for debug logs:
```
Fetched challenges from API: X
Completed challenges count: Y
Selected challenge: {object}
Scoring criteria: {object}
Winners: [array]
```

## Example Data Structure

### Challenge Object (from API):
```javascript
{
  id: 123,
  title: "Abstract Art Contest",
  description: "Create innovative digital artwork...",
  category: "Abstract Art",
  status: "completed",
  deadlineDateTime: "2025-07-30T23:59:59",
  maxParticipants: 100,
  rewards: "1st: LKR 30000, 2nd: LKR 15000, 3rd: LKR 7500",
  requestSponsorship: true,
  scoringCriteria: {
    likesWeight: 34,
    commentsWeight: 33,
    shareWeight: 33
  },
  winners: [
    { position: 1, name: "Artist Name", title: "Artwork Title" },
    { position: 2, name: "Artist Name", title: "Artwork Title" },
    { position: 3, name: "Artist Name", title: "Artwork Title" }
  ]
}
```

## UI Components

### Icons Used (from lucide-react):
- `Trophy` - Challenge winners, rewards
- `Crown` - 1st place winner
- `Medal` - 2nd place winner
- `Award` - 3rd place winner
- `Heart` - Likes weight
- `MessageCircle` - Comments weight
- `Send` - Share weight
- `Shield` - Dashboard navigation

### Color Scheme:
- Primary Brown: `#362625`
- Secondary Brown: `#7f5539`
- Accent Orange: `#D87C5A`
- Cream Background: `#FFF5E1`
- Light Cream: `#f4e8dc`
- Gold: `#FFD700`, `#FFD95A`

## Files Modified
1. `client/src/pages/Moderator/WinnerSelection.jsx`
   - Added Heart, MessageCircle, Send icons to imports
   - Enhanced scoring criteria display
   - Added debug logging
   - Improved data mapping for API fields

2. `client/src/pages/Moderator/ChallengeList.jsx`
   - Default filter set to "Completed"
   - Case-insensitive status detection
   - Added debug logging for fetched challenges

## Testing Checklist
- [ ] Dropdown shows only completed challenges
- [ ] Selecting a challenge displays all sections
- [ ] Scoring criteria shows correct percentages
- [ ] Winners list displays with proper ranking
- [ ] Console shows debug information
- [ ] All icons render correctly
- [ ] Responsive layout works on mobile/tablet
- [ ] No console errors

## Next Steps (Optional Enhancements)
1. Add real-time winner calculation from submissions
2. Export winners list to PDF/CSV
3. Add filtering/sorting for winners
4. Display submission statistics (total likes, comments, shares)
5. Show participant artworks in a gallery view
6. Add winner announcement/notification feature

---
Last Updated: October 19, 2025
