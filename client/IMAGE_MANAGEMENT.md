# ArtAura Development Image Management

This document explains how to handle images during development to ensure all team members can see profile pictures, artworks, and other uploaded content.

## 🎯 Problem Solved

When developing ArtAura, uploaded images are stored in `server/uploads/` but the frontend can't access them directly in development mode. This creates broken image links for new developers.

## 🛠️ Solution: Dual Image Sources

We've implemented a smart image system that:
1. **Production**: Loads images from backend API (`/api/uploads/`)
2. **Development**: Falls back to local public folder (`/uploads/`) if API fails

## 🚀 Quick Setup for New Developers

### 1. First Time Setup
```bash
# In the client directory
cd client
npm install
npm run sync-images  # Copy existing images for development
npm run dev          # Start development server
```

### 2. Alternative: Auto-sync with Development
```bash
npm run setup-dev   # Syncs images then starts dev server
```

## 📁 Image Directory Structure

```
client/
├── public/
│   └── uploads/           # Development images (auto-generated, git-ignored)
│       ├── profiles/      # Profile pictures
│       ├── artworks/      # Artwork images
│       ├── covers/        # Cover photos
│       ├── posts/         # Post images
│       └── *.jpg          # Root level uploads
└── src/
    └── components/
        └── SmartImage.jsx # Intelligent image component
```

## 🔧 Available Commands

| Command | Description |
|---------|-------------|
| `npm run sync-images` | Copy images from server to public folder |
| `npm run clean-images` | Remove all development images |
| `npm run setup-dev` | Sync images + start development server |

## 🎨 Using SmartImage Component

For new components, use the `SmartImage` component instead of regular `<img>` tags:

```jsx
import SmartImage from './SmartImage';

// Instead of:
<img src={`http://localhost:8081/uploads/${imagePath}`} alt="Artwork" />

// Use:
<SmartImage 
  src={imagePath} 
  alt="Artwork" 
  fallback="/placeholder-artwork.jpg"
  className="w-full h-48 object-cover"
/>
```

## 🔍 How It Works

1. **SmartImage** first tries to load from backend API
2. If that fails, tries local public folder
3. If both fail, shows fallback image
4. Handles loading states and errors gracefully

## 📋 Image URL Resolution

The `imageUrlResolver.js` utility provides these functions:

```javascript
import { getImageUrl, getAvatarUrl, getCoverUrl } from '../util/imageUrlResolver';

// General image resolution
const imageUrl = getImageUrl('artworks/painting.jpg');

// Profile picture with fallback
const avatarUrl = getAvatarUrl(user.profilePicture);

// Cover image with fallback  
const coverUrl = getCoverUrl(artist.coverImage);
```

## 🔄 Development Workflow

### When Starting Development:
1. Pull latest code from repository
2. Run `npm run sync-images` to get latest uploaded images
3. Start development with `npm run dev`

### When Adding New Images:
- Images uploaded through the app will be saved to `server/uploads/`
- Run `npm run sync-images` to copy them to development
- Other developers should run `npm run sync-images` after pulling your changes

### When Committing Code:
- Development images in `client/public/uploads/` are git-ignored
- Only commit code changes, not the copied images
- Other developers will sync images separately

## 🌐 Environment Variables

Make sure your `.env` file in the client directory contains:

```env
VITE_API_URL=http://localhost:8081
```

All API calls now use this environment variable instead of hardcoded URLs.

## 🚨 Important Notes

- **Development images are temporary** - they're copied for local development only
- **Don't commit development images** - they're in `.gitignore` for a reason
- **Production uses backend storage** - the smart image system handles this automatically
- **Run sync-images regularly** - especially after pulling changes with new uploads

## 🔧 Troubleshooting

### Images Not Loading?
1. Check if backend server is running on port 8081
2. Run `npm run sync-images` to refresh development images
3. Check browser network tab for failed image requests

### Missing Images in Development?
1. Verify `server/uploads/` has the images
2. Run `npm run clean-images` then `npm run sync-images`
3. Check that `.env` has correct `VITE_API_URL`

### Backend Images Not Syncing?
1. Ensure backend server has created `uploads/` directory
2. Upload some test images through the application
3. Check file permissions on `server/uploads/`

## 📞 Support

If you're still having issues with image loading:
1. Check the browser console for error messages
2. Verify the backend server is running and accessible
3. Confirm the image sync script runs without errors
4. Ask the team for help - we're here to support each other! 🤝
