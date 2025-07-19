# Achievements Feature - Setup and Usage Guide

## Overview
The achievements feature allows artists to showcase their awards, recognitions, and accomplishments in their portfolio. This includes both backend API endpoints and frontend components.

## Backend Files Created

### Database Schema
- `achievements_table_schema.sql` - Creates the achievements table with sample data

### DTOs (Data Transfer Objects)
- `AchievementCreateDTO.java` - For creating new achievements
- `AchievementResponseDTO.java` - For returning achievement data
- `AchievementUpdateDTO.java` - For updating existing achievements

### DAO Layer
- `AchievementDAO.java` - Interface for database operations
- `AchievementDAOImpl.java` - Implementation of database operations using JdbcTemplate

### Service Layer
- `AchievementService.java` - Interface for business logic
- `AchievementServiceImpl.java` - Implementation of business logic

### Controller
- `AchievementController.java` - REST API endpoints for achievements

## Frontend Files Created

### Components
- `AchievementsSection.jsx` - Main component for displaying and managing achievements

## Database Setup

1. Run the SQL script in phpMyAdmin:
```sql
-- Execute the content of achievements_table_schema.sql
```

## API Endpoints

### GET `/api/achievements/artist/{artistId}`
- Retrieves all achievements for a specific artist
- No authentication required for viewing

### GET `/api/achievements/{achievementId}`
- Retrieves a specific achievement by ID

### POST `/api/achievements/create`
- Creates a new achievement
- Requires Bearer token authentication
- Content-Type: multipart/form-data or application/json

### PUT `/api/achievements/{achievementId}`
- Updates an existing achievement
- Requires Bearer token authentication
- Content-Type: application/json

### DELETE `/api/achievements/{achievementId}`
- Deletes an achievement
- Requires Bearer token authentication

## Frontend Integration

The AchievementsSection component has been integrated into the ArtistPortfolio page under the "Achievements" tab.

### Features:
- View achievements (for all users)
- Add new achievements (for profile owner)
- Edit existing achievements (for profile owner)
- Delete achievements (for profile owner)
- Customizable icons and color schemes
- Date formatting and validation

### Achievement Types:
- Winner
- Featured
- Runner-up
- Special
- Certificate
- Award

### Icon Types:
- Trophy
- Star
- Medal
- Award
- Certificate
- Badge

### Color Schemes:
- Gold, Silver, Bronze
- Blue, Purple, Green, Red

## Usage

### For Artists:
1. Go to your artist portfolio
2. Click on the "Achievements" tab
3. Click "Add Achievement" to create a new one
4. Fill in the details (title, type, date, prize/recognition, description)
5. Choose an appropriate icon and color scheme
6. Save the achievement

### For Viewers:
1. Visit any artist's portfolio
2. Click on the "Achievements" tab to view their accomplishments
3. See their awards, recognition, and achievements with visual indicators

## Error Handling

The system includes proper error handling for:
- Authentication failures
- Invalid data submission
- Network errors
- Database connection issues
- Missing required fields

## Notes

- The backend uses JWT authentication for protected operations
- All dates are stored and displayed in a user-friendly format
- Images for achievements are not currently supported but can be extended
- The component is responsive and works well on mobile devices
