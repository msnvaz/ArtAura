# Admin Artwork Backend-Frontend Integration

## Overview
This document describes the successful integration between the Admin Artwork backend API and the frontend dashboard.

## Backend Setup

### Endpoints Available
- **Base URL:** `http://localhost:8081/api/admin/artworks`
- **Port:** 8081 (configured in application.properties)

### API Endpoints:
1. `GET /` - Get all artworks with pagination and filtering
2. `GET /{id}` - Get artwork by ID
3. `GET /artist/{artistId}` - Get artworks by artist ID
4. `GET /category/{category}` - Get artworks by category
5. `GET /status/{status}` - Get artworks by status
6. `GET /featured` - Get featured artworks
7. `GET /search?q={searchTerm}` - Search artworks
8. `GET /statistics` - Get artwork statistics
9. `GET /filter-options` - Get filter options
10. `PUT /{id}/status` - Update artwork status
11. `PUT /{id}/featured` - Update artwork featured status
12. `PUT /bulk/status` - Bulk update artwork status
13. `PUT /bulk/featured` - Bulk update artwork featured status

### CORS Configuration
- Configured to allow requests from `http://localhost:5173` (Vite dev server)

## Frontend Setup

### Files Created/Modified:

#### 1. API Service (`src/services/adminArtworkApi.js`)
- Axios-based API client
- Handles all backend communication
- Includes request interceptors for authentication
- Error handling and response transformation

#### 2. Updated Artwork Management Page (`src/pages/admin/Artwork.jsx`)
- Replaced mock data with real API calls
- Added loading states and error handling
- Real-time updates for status and featured changes
- Pagination support
- Search functionality
- Success/error notifications

#### 3. Test Component (`src/components/admin/AdminArtworkTestComponent.jsx`)
- Utility component to test API connections
- Can be removed in production

### Key Features Implemented:

#### Data Loading:
- Initial load of artworks with pagination
- Statistics loading for dashboard metrics
- Filter options loading
- Real-time search functionality

#### Interactive Features:
- Approve/Flag artworks
- Toggle featured status
- View artwork details in modal
- Pagination controls
- Search by artist name or general search

#### UI Enhancements:
- Loading indicators
- Error handling with user-friendly messages
- Success notifications
- Responsive design maintained
- Animation preserved

#### Data Mapping:
Backend DTO fields mapped to frontend display:
- `artworkId` → Unique identifier
- `artistName` → Artist display name
- `title` → Artwork title
- `category` → Artwork category
- `price` → Artwork price
- `status` → ACTIVE/PENDING/FLAGGED
- `imageUrl` → Artwork image
- `viewsCount`/`likesCount` → Engagement metrics
- `isFeatured` → Featured status
- `createdAt` → Upload date

## How to Test the Integration

### Backend:
1. Ensure MySQL database is running with `artaura_db`
2. Run the Spring Boot application:
   ```bash
   cd server/artaura
   ./mvnw spring-boot:run
   ```
3. Backend will be available at `http://localhost:8081`

### Frontend:
1. Install dependencies:
   ```bash
   cd client
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Frontend will be available at `http://localhost:5173`

### Testing:
1. Navigate to the Admin Dashboard → Artwork section
2. Use the test component to verify API connectivity
3. Test CRUD operations (view, approve/flag, toggle featured)
4. Test search functionality
5. Test pagination

## Error Handling

### Backend Errors:
- Network connectivity issues
- Authentication failures
- Server errors (500)
- Not found errors (404)

### Frontend Handling:
- Graceful degradation with error messages
- Retry mechanisms
- Loading states
- User feedback through notifications

## Security Considerations

### Authentication:
- JWT token support in API service
- Token automatically included in requests
- Error handling for authentication failures

### CORS:
- Properly configured for development environment
- Should be updated for production deployment

## Production Considerations

### Remove Test Components:
- Remove `AdminArtworkTestComponent` import and usage
- Clean up any console.log statements

### Environment Configuration:
- Use environment variables for API base URL
- Configure proper CORS for production domain
- Set up proper error logging

### Performance:
- Implement caching for frequently accessed data
- Optimize image loading
- Add loading skeletons for better UX

## Troubleshooting

### Common Issues:

1. **CORS Errors:**
   - Verify backend CORS configuration
   - Check if frontend is running on port 5173

2. **Connection Refused:**
   - Ensure backend is running on port 8081
   - Check application.properties configuration

3. **Database Issues:**
   - Verify MySQL is running
   - Check database connection in application.properties

4. **Authentication Issues:**
   - Verify JWT token is properly set in localStorage
   - Check token expiration

### Debug Steps:
1. Use the test component to verify basic connectivity
2. Check browser network tab for failed requests
3. Review backend logs for errors
4. Verify database connectivity

## Next Steps

1. **Data Validation:**
   - Add form validation for bulk operations
   - Implement client-side data validation

2. **Enhanced Features:**
   - Real-time updates with WebSocket
   - Advanced filtering options
   - Bulk selection and operations

3. **Performance:**
   - Implement virtual scrolling for large datasets
   - Add caching layer
   - Optimize API queries

4. **User Experience:**
   - Add confirmation dialogs for destructive actions
   - Implement undo functionality
   - Add keyboard shortcuts

This integration provides a solid foundation for admin artwork management with real backend connectivity and proper error handling.
