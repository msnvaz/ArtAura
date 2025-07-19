# Exhibition Management System - Database Setup

## SQL Commands to Run in phpMyAdmin or MySQL

Execute these SQL commands in order to create the exhibition functionality:

```sql
-- Create artist_exhibitions table
CREATE TABLE artist_exhibitions (
    exhibition_id INT AUTO_INCREMENT PRIMARY KEY,
    artist_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255) NOT NULL,
    venue VARCHAR(255),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('upcoming', 'ongoing', 'completed', 'cancelled') DEFAULT 'upcoming',
    exhibition_type ENUM('solo', 'group', 'virtual', 'popup') DEFAULT 'group',
    artworks_count INT DEFAULT 0,
    total_visitors INT DEFAULT 0,
    featured_image_url VARCHAR(500),
    website_url VARCHAR(500),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    entry_fee DECIMAL(10, 2) DEFAULT 0.00,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_artist_exhibitions_artist_id (artist_id),
    INDEX idx_artist_exhibitions_status (status),
    INDEX idx_artist_exhibitions_dates (start_date, end_date)
);

-- Optional: Add foreign key constraint if artists table exists
-- Check your database first with: SHOW TABLES; and DESCRIBE artists;
-- If artists table exists with artist_id column, uncomment and run:
-- ALTER TABLE artist_exhibitions 
-- ADD CONSTRAINT fk_artist_exhibitions_artist_id 
-- FOREIGN KEY (artist_id) REFERENCES artists(artist_id) ON DELETE CASCADE;

-- Insert sample exhibition data for testing
INSERT INTO artist_exhibitions (
    artist_id, title, description, location, venue, start_date, end_date, 
    status, exhibition_type, artworks_count, total_visitors, 
    website_url, contact_email, entry_fee, is_featured
) VALUES 
(1, 'Modern Art Showcase', 'A contemporary exhibition featuring digital and traditional art pieces exploring modern themes.', 'Downtown Gallery District', 'Gallery ModernSpace', '2024-02-15', '2024-03-15', 'upcoming', 'solo', 12, 0, 'https://modernartshowcase.com', 'contact@modernart.com', 15.00, TRUE),
(1, 'Digital Dreams Exhibition', 'Virtual exhibition showcasing digital art and NFT collections.', 'Virtual Platform', 'ArtSpace Online', '2023-12-15', '2024-01-15', 'completed', 'virtual', 8, 245, 'https://digitaldreams.art', 'info@digitaldreams.art', 0.00, FALSE),
(1, 'Abstract Expressions', 'Group exhibition featuring abstract paintings and sculptures.', 'City Art Center', 'Main Exhibition Hall', '2024-04-10', '2024-05-10', 'upcoming', 'group', 5, 0, NULL, 'curator@cityartcenter.org', 12.50, FALSE),
(1, 'Pop-up Art Corner', 'Casual pop-up exhibition in the local community center.', 'Community Center', 'Multipurpose Room', '2024-01-20', '2024-01-22', 'completed', 'popup', 6, 89, NULL, NULL, 0.00, FALSE),
(2, 'Landscape Memories', 'Solo exhibition featuring landscape photography and paintings.', 'Nature Gallery', 'Main Floor', '2024-03-01', '2024-03-31', 'ongoing', 'solo', 15, 156, 'https://landscapememories.com', 'hello@naturegallery.com', 10.00, TRUE),
(2, 'Young Artists Collective', 'Group exhibition showcasing emerging artists from the local community.', 'Youth Art Hub', 'Studio A & B', '2024-02-05', '2024-02-25', 'completed', 'group', 4, 78, NULL, 'info@youthart.org', 5.00, FALSE);

-- Query to check the created table and data
SELECT * FROM artist_exhibitions ORDER BY created_at DESC;

-- Query to get exhibitions for a specific artist
SELECT * FROM artist_exhibitions WHERE artist_id = 1 ORDER BY start_date DESC;

-- Query to get upcoming exhibitions
SELECT * FROM artist_exhibitions WHERE status = 'upcoming' ORDER BY start_date ASC;

-- Query to get exhibition statistics for an artist
SELECT 
    COUNT(*) as total_exhibitions,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_exhibitions,
    COUNT(CASE WHEN status = 'upcoming' THEN 1 END) as upcoming_exhibitions,
    COUNT(CASE WHEN is_featured = TRUE THEN 1 END) as featured_exhibitions,
    SUM(artworks_count) as total_artworks_exhibited,
    SUM(total_visitors) as total_visitors
FROM artist_exhibitions 
WHERE artist_id = 1;
```

## Database Schema Features

### Table Structure
- **exhibition_id**: Primary key, auto-increment
- **artist_id**: Foreign key reference to artists table
- **title**: Exhibition name (required)
- **description**: Detailed description (optional)
- **location**: Exhibition location (required)
- **venue**: Specific venue name (optional)
- **start_date** & **end_date**: Exhibition duration (required)
- **status**: ENUM('upcoming', 'ongoing', 'completed', 'cancelled')
- **exhibition_type**: ENUM('solo', 'group', 'virtual', 'popup')
- **artworks_count**: Number of artworks in the exhibition
- **total_visitors**: Total visitor count
- **featured_image_url**: Main exhibition image
- **website_url**: Exhibition website
- **contact_email** & **contact_phone**: Contact information
- **entry_fee**: Admission fee (decimal)
- **is_featured**: Boolean for featured exhibitions
- **created_at** & **updated_at**: Timestamps

### Indexes
- Primary key on exhibition_id
- Index on artist_id for faster artist queries
- Index on status for status filtering
- Composite index on date range for date queries

### Sample Data
The sample data includes various exhibition types and statuses to test the functionality across different scenarios.

## Backend Implementation

### Complete CRUD API Endpoints
- `POST /api/exhibitions/create` - Create new exhibition
- `GET /api/exhibitions/artist/{artistId}` - Get all exhibitions for an artist
- `GET /api/exhibitions/{exhibitionId}` - Get specific exhibition
- `PUT /api/exhibitions/{exhibitionId}` - Update exhibition
- `DELETE /api/exhibitions/{exhibitionId}` - Delete exhibition
- `GET /api/exhibitions/status/{status}` - Get exhibitions by status
- `GET /api/exhibitions/featured` - Get featured exhibitions
- `GET /api/exhibitions/statistics/artist/{artistId}` - Get exhibition statistics

### Security
- JWT Authentication required for create, update, delete operations
- CORS configured for frontend access
- Input validation at service layer
- SQL injection protection through JdbcTemplate

## Frontend Implementation

### React Component Features
- Complete CRUD interface with modals
- Form validation and error handling
- Real-time data updates
- Responsive design with Tailwind CSS
- Integration with existing portfolio system
- Dynamic count updates in navigation tabs

### UI Features
- Add/Edit/Delete modals with comprehensive forms
- Exhibition status badges with appropriate colors
- Exhibition type icons and labels
- Contact information links (email, phone, website)
- Featured exhibition indicators
- Date formatting and display
- Loading states and empty states
- Confirmation dialogs for delete operations

## Integration

### Portfolio Integration
- New tab in artist portfolio for exhibitions
- Real-time count updates in navigation
- Seamless integration with existing authentication
- Consistent styling with portfolio theme

### Button Text Change
- Changed from "Apply for Exhibition" to "Add Exhibition Details" as requested
- Updated to reflect CRUD functionality rather than application process

## Testing

1. Run the SQL commands to create the table and sample data
2. Start the backend server
3. Start the frontend development server
4. Navigate to Artist Portfolio → Exhibitions tab
5. Test all CRUD operations:
   - Create new exhibitions
   - Edit existing exhibitions
   - Delete exhibitions
   - View exhibition lists with proper formatting

The system is now ready for full exhibition management with both backend API and frontend interface complete.
