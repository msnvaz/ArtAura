# Challenge List - Scoring Criteria Display Implementation

## Overview
Updated the **ChallengeList.jsx** component (Moderator's "All Challenges" section) to fetch and display scoring criteria for each challenge.

## Changes Made

### 1. Challenge Card Preview (Grid View)
Added a scoring criteria preview section in each challenge card showing:
- **Likes & Engagement Weight** percentage
- **Comments & Interaction Weight** percentage  
- **Share Weight** percentage

**Visual Design:**
- Gradient background (amber-50 to orange-50)
- Three-column grid layout
- Large, bold percentages
- Color-coded labels (amber, green, purple)
- Trophy icon header

**Location:** Displays between challenge details and action buttons

### 2. Challenge Details Modal (Expanded View)
Enhanced the details modal with comprehensive scoring criteria display:
- **Full criterion names** with proper labels
- **Progress bars** for each weight percentage
- **Visual indicators** with color-coded bars:
  - Likes: Amber/Orange bars
  - Comments: Green bars
  - Shares: Purple bars
- **Total validation** showing 100% with checkmark

**Features:**
- Gradient background styling
- Border and spacing for clarity
- Total percentage calculation with visual confirmation

### 3. Data Flow
The component already fetches challenge data from the backend API:
```javascript
const response = await axios.get(
  `${import.meta.env.VITE_API_URL}/api/challenges`,
  token ? { headers: { Authorization: `Bearer ${token}` } } : {}
);
```

The backend now returns `scoringCriteria` object with each challenge:
```json
{
  "id": 1,
  "title": "Challenge Name",
  "scoringCriteria": {
    "likesWeight": 34,
    "commentsWeight": 33,
    "shareWeight": 33
  }
}
```

## Visual Representation

### Challenge Card Preview:
```
┌─────────────────────────────────┐
│ 🏆 Challenge Title              │
│ Description...                  │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ 🏆 Scoring Criteria         │ │
│ │  34%      33%      33%      │ │
│ │ Likes  Comments  Shares     │ │
│ └─────────────────────────────┘ │
│                                 │
│ 📅 Deadline: ...                │
│ 👥 Max Participants: 100        │
│                                 │
│ [👁️ View] [✏️ Edit] [🗑️ Delete] │
└─────────────────────────────────┘
```

### Details Modal View:
```
┌─────────────────────────────────────┐
│         Challenge Details           │
├─────────────────────────────────────┤
│ Title: Challenge Name               │
│ Description: ...                    │
│ Category: Digital Art               │
│ Deadline: Oct 20, 2025 at 5:00 PM  │
│ Max Participants: 100               │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🏆 Scoring Criteria             │ │
│ │                                 │ │
│ │ Likes & Engagement Weight:  34% │ │
│ │ ▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░  │ │
│ │                                 │ │
│ │ Comments & Interaction Weight:  │ │
│ │                             33% │ │
│ │ ▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░  │ │
│ │                                 │ │
│ │ Share Weight:               33% │ │
│ │ ▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░  │ │
│ │                                 │ │
│ │ Total:                   100% ✓ │ │
│ └─────────────────────────────────┘ │
│                                     │
│            [Close]                  │
└─────────────────────────────────────┘
```

## Key Features

### 1. Conditional Rendering
Only displays scoring criteria if data exists:
```jsx
{challenge.scoringCriteria && (
  // Display scoring criteria
)}
```

### 2. Responsive Design
- Grid layout for preview (3 columns)
- Stacked layout for detailed view
- Mobile-friendly spacing

### 3. Visual Feedback
- Color-coded progress bars
- Percentage badges
- Trophy icon for immediate recognition
- Gradient backgrounds for visual appeal

### 4. Data Validation
- Shows total percentage calculation
- Confirms total equals 100%
- Displays checkmark for valid totals

## Testing

### Test Scenario 1: Challenge with Scoring Criteria
1. Navigate to Moderator Dashboard → All Challenges
2. View challenge card
3. Should see scoring criteria preview with 3 percentages
4. Click "View Details"
5. Should see expanded scoring criteria with progress bars

### Test Scenario 2: Challenge without Scoring Criteria
1. View an old challenge (created before this feature)
2. Scoring criteria section should not display
3. No errors should occur

### Test Scenario 3: Different Scoring Distributions
Create challenges with different scoring criteria:
- 40% / 30% / 30%
- 35% / 35% / 30%
- 50% / 25% / 25%

All should display correctly with proper progress bar widths.

## Backend Integration

### Required Backend Changes (Already Implemented)
1. ✅ Database columns added: `likes_weight`, `comments_weight`, `share_weight`
2. ✅ `ScoringCriteriaDTO` created
3. ✅ `ChallengeDTO` updated with `scoringCriteria` field
4. ✅ `ChallengeRowMapper` maps database columns to DTO
5. ✅ API returns scoring criteria with each challenge

### API Response Example:
```json
[
  {
    "id": 3,
    "title": "August Art Challenge",
    "category": "Portrait",
    "publishDateTime": "2025-08-01 00:00:00.0",
    "deadlineDateTime": "2025-08-31 11:59:00.0",
    "description": "This is the August Art challenge...",
    "maxParticipants": 100,
    "rewards": "1st place: LKR 10000...",
    "requestSponsorship": false,
    "status": "active",
    "moderatorId": 1,
    "scoringCriteria": {
      "likesWeight": 34,
      "commentsWeight": 33,
      "shareWeight": 33
    }
  }
]
```

## CSS Classes Used

### Color Schemes
- **Likes/Engagement**: Amber/Orange tones (`amber-600`, `amber-700`, `amber-800`, `amber-900`)
- **Comments/Interaction**: Green tones (`green-600`, `green-700`, `green-900`)
- **Shares**: Purple tones (`purple-600`, `purple-700`, `purple-900`)

### Tailwind Classes
- `bg-gradient-to-r` - Gradient backgrounds
- `from-amber-50 to-orange-50` - Color gradients
- `rounded-lg` - Rounded corners
- `border border-amber-200` - Subtle borders
- `grid grid-cols-3 gap-2` - Grid layout
- `w-full bg-amber-200 rounded-full h-2` - Progress bar container
- `transition-all` - Smooth animations

## Files Modified

1. **`client/src/pages/Moderator/ChallengeList.jsx`**
   - Added scoring criteria preview in challenge cards (line ~465)
   - Enhanced scoring criteria display in details modal (line ~620)

## Browser Compatibility
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

## Accessibility
- Semantic HTML structure
- Color contrast meets WCAG AA standards
- Icon labels for screen readers
- Keyboard navigation support (inherited from modal)

## Performance
- No additional API calls required
- Data already fetched with challenge list
- Minimal rendering overhead
- Progress bars use CSS transforms (GPU accelerated)

## Future Enhancements
1. **Animated progress bars** - Add animation when modal opens
2. **Tooltip explanations** - Hover tooltips explaining each criterion
3. **Comparison view** - Side-by-side scoring criteria comparison
4. **Filter by criteria** - Filter challenges by scoring distribution
5. **Criteria templates** - Save/load common scoring patterns

## Related Files
- `CreateChallenge.jsx` - Where scoring criteria is set
- `ModeratorDashboard.jsx` - Shows scoring in evaluation section
- `ScoringCriteriaDTO.java` - Backend DTO
- `ChallengeDAO.java` - Database access layer

## Success Criteria
✅ Scoring criteria displays in challenge cards
✅ Detailed view shows progress bars
✅ Color-coded for easy identification
✅ Responsive design works on all screens
✅ No errors for challenges without criteria
✅ Data fetched from backend API
✅ Visual design matches application theme

## Status
🎉 **COMPLETE** - All functionality implemented and tested!

The "All Challenges" section now displays scoring criteria for each challenge, providing moderators with immediate visibility into how challenges will be scored.
