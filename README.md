# Trade an Idea - Cinematic Landing Page

A modern, high-performance landing page with frame-based canvas animation. Built with vanilla HTML, CSS, and JavaScript—no external dependencies required.

## Features

✨ **Modern Design**

- Cinematic full-screen frame animation
- Responsive design for all screen sizes
- Futuristic UI with glassmorphism effects
- Smooth fade-in and slide-in animations

🎬 **Performance Optimized**

- Canvas-based rendering with `requestAnimationFrame`
- Efficient frame preloading with progress tracking
- High DPI support for sharp rendering on retina displays
- Optimized frame rate (60 FPS)
- Minimal repaints and reflows

🎯 **Frame Animation**

- Supports 120 sequentially numbered frames (frame_001.jpg to frame_120.jpg)
- Seamless looping without flickering
- Automatic aspect ratio handling
- Fallback gradient background for missing frames

📱 **Responsive**

- Works on desktop, tablet, and mobile devices
- Adaptive text sizing with `clamp()`
- Touch-friendly button interactions

## Project Structure

```
Trade An Idea/
├── index.html           # Main HTML structure
├── style.css            # Styling and animations
├── script.js            # Canvas animation and frame rendering logic
├── netlify.toml         # Netlify deployment configuration
├── .gitignore           # Git ignore rules
├── README.md            # This file
└── frames/              # 120 sequential frame images (frame_001.jpg to frame_120.jpg)
    ├── frame_001.jpg
    ├── frame_002.jpg
    ├── ...
    └── frame_120.jpg
```

## How It Works

### Frame Preloading

1. All 216 frames are preloaded in parallel using Promises
2. Progress is tracked and displayed to the user
3. Frames are cached in memory for smooth playback

### Canvas Rendering

1. Uses `requestAnimationFrame` for optimal rendering timing
2. Maintains 60 FPS playback
3. Automatically scales frames to fit any screen size
4. Handles device pixel ratio for sharp rendering

### Animation Loop

1. Current frame index increments each frame
2. Index wraps around using modulo operator for seamless looping
3. No blank frames or flickering

## Deployment to Netlify

### Option 1: Direct Upload via Netlify UI

1. Go to [netlify.com](https://netlify.com)
2. Sign up or log in
3. Click "Add new site" → "Deploy manually"
4. Drag and drop the entire `Trade An Idea` folder
5. Your site will be live in seconds!

### Option 2: Git Integration

1. Push your repository to GitHub:

   ```bash
   git init
   git add .
   git commit -m "Initial commit: Trade an Idea landing page"
   git branch -M main
   git remote add origin https://github.com/yourusername/trade-an-idea.git
   git push -u origin main
   ```
2. Connect to Netlify:

   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Select your repository
   - Netlify will auto-detect `netlify.toml` settings
   - Deploy!

### Option 3: Netlify CLI

```bash
# Install Netlify CLI (if not already installed)
npm install -g netlify-cli

# Navigate to project directory
cd "Trade An Idea"

# Deploy
netlify deploy --prod
```

## Configuration

### Adjusting Frame Count

Edit `script.js` and change:

```javascript
this.frameCount = 120; // Change to your frame count
```

### Adjusting Animation Speed

Modify target FPS in `script.js`:

```javascript
this.targetFPS = 60; // Increase for faster, decrease for slower
```

### Customizing Text and Styling

- Edit text in `index.html`
- Modify colors and animations in `style.css`
- All CSS uses CSS variables-ready structure for easy customization

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Tips

1. **Optimize Images**: Ensure frames are compressed and optimized

   - Use JPEG format for best compression
   - Target 1920x1080 or higher resolution
   - Aim for 100-200KB per frame
2. **CDN Delivery**: Netlify automatically serves from global CDN
3. **Lazy Loading**: Frames load before animation starts
4. **Hardware Acceleration**: Canvas rendering uses GPU acceleration

## Customization

### Change Button Behavior

Edit the `handleButtonClick()` method in `script.js`:

```javascript
handleButtonClick() {
    // Replace alert with your custom action
    window.location.href = '/signup';
}
```

### Add More Content Sections

Add elements before the closing `</body>` tag in `index.html` and style in `style.css`

### Adjust Dark Overlay Opacity

Modify the `.overlay` background in `style.css`:

```css
background: rgba(0, 0, 0, 0.35); /* Change 0.35 to desired opacity */
```

## Troubleshooting

### Frames Not Loading

1. Verify frame files are in the `frames/` folder
2. Ensure file naming matches: `frame_001.jpg`, `frame_002.jpg`, etc.
3. Check browser console for error messages
4. Try opening in Chrome DevTools (F12) Network tab to see if frames load

### Animation Stuttering

1. Check if frame images are too large
2. Monitor CPU usage (may indicate optimization needed)
3. Reduce target FPS if necessary
4. Check for other heavy scripts on the page

### Blank Canvas

1. Clear browser cache
2. Check file paths in `script.js`
3. Verify frames folder is in the root directory
4. Check CORS settings in browser console

## File Size Considerations

For optimal deployment:

- 120 frames × 150KB = ~18MB total (typical)
- Consider using VideoJS or WebM as alternative if too large
- Current implementation loads all frames upfront (best for smooth playback)

## License

This project is free to use and modify for personal and commercial projects.

## Support

For issues or questions, check:

1. Browser console (F12 → Console tab)
2. Network tab to verify frames load correctly
3. Frame file naming and location
4. Netlify deployment logs

---

**Ready to deploy?** Push to GitHub and connect to Netlify for free hosting! 🚀
