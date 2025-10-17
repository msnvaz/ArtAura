# Image Storage Strategy

## 📁 Directory Structure
```
client/public/uploads/
├── profiles/          # Profile pictures and avatars
├── covers/           # Cover images for artist profiles  
├── artworks/         # Artwork images
└── posts/           # Post/exhibition images
```

## 🔧 How It Works

### Development Mode
- Images uploaded via backend are saved to `server/uploads/`
- Backend serves images at: `http://localhost:8081/uploads/image.jpg`
- Frontend fetches via: `${API_URL}/uploads/image.jpg`

### For Team Development
- Copy shared development images to `client/public/uploads/`
- Images accessible at: `http://localhost:5173/uploads/image.jpg`
- Alternative: Frontend can try both locations (API first, then public fallback)

## 🚀 Implementation Options

### Option A: Dual Source (Recommended)
Frontend checks both:
1. `${API_URL}/uploads/image.jpg` (from backend)
2. `/uploads/image.jpg` (from public folder)

### Option B: Development Copy
Manually copy sample images from `server/uploads/` to `client/public/uploads/` for development.

### Option C: Environment-Based
- Development: Use `client/public/uploads/`
- Production: Use backend `server/uploads/`

## 🎯 Benefits
- ✅ Team can share development images
- ✅ No repository bloat from user uploads
- ✅ Fast development setup
- ✅ Production-ready image serving

## 📝 Git Strategy
- Keep sample development images in git
- Add `.gitignore` rules for production uploads
- Use `git-lfs` for larger sample images if needed
