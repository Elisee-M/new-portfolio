# Premium Portfolio Website - Setup & Customization Guide

## 🎯 Overview

This is a cinematic portfolio website with advanced scroll-triggered animations featuring:
- 360° rotating photo with smooth image sequencing
- Pinned hero section with scroll-driven rotation
- Glassmorphism UI with dark futuristic theme
- GSAP ScrollTrigger animations
- Mobile-responsive design
- 60 FPS optimized animations

---

## ⚙️ Critical: Image Sequence Setup

The component expects a sequence of 25 rotated images for the smooth rotation effect.

### Image Requirements
- **Format**: WebP (recommended for size) or PNG/JPG
- **Names**: `image_000.webp`, `image_015.webp`, `image_030.webp`, ... `image_360.webp`
- **Size**: 512×512px to 1024×1024px (optimized)
- **Quality**: Consistent lighting and positioning
- **Location**: `/public/portfolio-images/` directory

### Image Angles
```
0°, 15°, 30°, 45°, 60°, 75°, 90°, 105°, 120°, 135°, 150°, 165°, 180°, 195°, 210°, 225°, 240°, 255°, 270°, 285°, 300°, 315°, 330°, 345°, 360°
(Total: 25 images)
```

---

## 📸 How to Generate the Rotation Images

### Option 1: Blender (3D Method) - Recommended
1. **Import or create a 3D head model** with your photo as texture
2. **Set up camera and lighting** for consistent results
3. **Create a rotation keyframe animation** (360° around Y-axis)
4. **Render at 15° intervals**:
   ```
   Frame 0 (0°), Frame 15 (15°), Frame 30 (30°), etc.
   ```
5. **Export as WebP sequence**

**Blender Setup Tips:**
- Use a turntable rig for consistent rotation
- Lock camera to center of head
- Use HDRI lighting for professional results
- Render resolution: 1024×1024px minimum

### Option 2: Python Rotation Script
If you have a single high-quality photo, you can rotate it programmatically:

```python
from PIL import Image

# Load your passport photo
img = Image.open('portrait.jpg')

# Generate rotations
for angle in range(0, 361, 15):
    rotated = img.rotate(angle, expand=False, fillcolor='white')
    rotated.save(f'image_{angle:03d}.webp', 'WEBP', quality=95)
```

**Limitations:**
- Results in flat 2D rotation (less cinematic)
- Better as fallback than primary method
- Blender 3D approach produces more professional results

### Option 3: Professional Photography
1. Place subject on a rotating platform
2. Take 25 photos at 15° intervals
3. Ensure consistent lighting and positioning
4. Normalize and export as WebP

### Option 4: AI Image Generation
Use tools like:
- **Stable Diffusion** with ControlNet
- **Midjourney** with consistent seed/parameters
- **ComfyUI** for batch generation

---

## 🚀 Installation & Setup

### 1. Create React Project
```bash
npx create-react-app portfolio
cd portfolio
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 2. Add Images Directory
```bash
mkdir public/portfolio-images
# Add your 25 rotated images here
```

### 3. Configure Tailwind
Update `tailwind.config.js`:
```javascript
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
```

### 4. Place Component
Replace `src/App.js`:
```javascript
import PortfolioWebsite from './components/PortfolioWebsite';

function App() {
  return <PortfolioWebsite />;
}

export default App;
```

### 5. Run Project
```bash
npm start
```

---

## 🎨 Customization

### Change Hero Title & Description
```javascript
<h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
  Your Name
</h1>
<p className="text-xl text-blue-200/60">Your Title</p>
```

### Update Contact Links
```javascript
<a href="mailto:your-email@example.com" className="...">
  Email Me
</a>
<a href="https://github.com/yourprofile" className="...">
  GitHub
</a>
```

### Modify Colors
The design uses blue as primary. To change:
1. Replace `blue-` classes with `purple-`, `cyan-`, `green-`, etc.
2. Update gradient colors in hero section
3. Modify accent colors in sections

**Example (Purple Theme):**
```javascript
// Change from blue-400 to purple-400
from-purple-400 to-purple-600
border-purple-500/30
text-purple-300
```

### Adjust Animation Timings
In `initializeScrollAnimations()`:
```javascript
// Extend rotation phase (default 0.5 = 50% of scroll)
const rotationProgress = Math.min(progress / 0.6, 1); // 60% scroll for rotation

// Adjust fade animation duration
gsap.to(imageContainer, {
  duration: 1.5, // Increase from 1
  // ...
});
```

### Add New Sections
```javascript
<section className="px-4 md:px-12 py-16 max-w-6xl mx-auto">
  <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8">
    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-blue-300">New Section</h2>
    {/* Content */}
  </div>
</section>
```

---

## 📱 Mobile Optimization

The component is fully responsive. Mobile-specific adjustments:
- Hero section: 80px to 96px circular image
- Typography: Scales from 3xl (desktop) to 2xl (mobile)
- Padding: Responsive gutters
- Glassmorphism: Reduced backdrop blur on low-end devices

**For very slow devices**, reduce animation complexity:
```javascript
// Use prefers-reduced-motion
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
```

---

## ⚡ Performance Tips

### 1. Image Optimization
- Compress WebP files: `cwebp -q 85 image.jpg -o image.webp`
- Use lazy loading for below-fold sections
- PreLoad critical images during hero section

### 2. GSAP Optimization
- Uses `will-change: transform` on animated elements
- CSS variables in transforms for efficiency
- requestAnimationFrame batching (handled by GSAP)

### 3. Build Optimization
```bash
npm run build
# Result: ~150KB (with GSAP CDN)
```

---

## 🔍 Troubleshooting

### Images Not Loading
1. Check path: Should be `/portfolio-images/image_000.webp`
2. Verify files exist in `public/portfolio-images/`
3. Check browser console for 404 errors
4. Component falls back to CSS rotation if images missing

### Scroll Animation Not Triggering
1. Ensure GSAP and ScrollTrigger load from CDN
2. Check browser console for script errors
3. Verify ScrollTrigger is registered: `gsap.registerPlugin(ScrollTrigger)`

### Performance Issues (Jank)
1. Reduce image preloading: Comment out preloadImages()
2. Disable blur effect temporarily
3. Use Chrome DevTools Performance tab to profile

### Mobile Scroll Not Smooth
- Check for conflicting CSS animations
- Ensure `will-change: transform` is applied
- Reduce number of simultaneous animations

---

## 🎬 Advanced Customizations

### Add Video Background
```javascript
<video autoPlay muted loop className="absolute inset-0 w-full h-full object-cover opacity-20">
  <source src="bg-video.mp4" type="video/mp4" />
</video>
```

### Add Particle Effects
Use Three.js with GSAP for background particles:
```javascript
import * as THREE from 'three';
// Add particle system initialization
```

### Custom Scroll Easing
```javascript
gsap.to(element, {
  scrollTrigger: { /* ... */ },
  ease: "power4.inOut", // Change easing function
});
```

### Add More Portfolio Sections
Duplicate section structure and add new content. ScrollTrigger will automatically handle stagger.

---

## 📄 Dependencies

- **React** 18+
- **Tailwind CSS** 3+
- **GSAP** 3.12+ (loaded from CDN)
- **ScrollTrigger** (GSAP plugin, from CDN)

No additional npm packages required!

---

## 🌐 Deployment

### Vercel (Recommended)
```bash
vercel deploy
```

### Netlify
```bash
npm run build
# Drag & drop build/ folder
```

### GitHub Pages
```bash
npm run build
gh-pages -d build
```

**Important:** Update image paths if deploying to subdirectory:
```javascript
src: `/yourrepo/portfolio-images/image_${angle}.webp`
```

---

## 📞 Support & Resources

- **GSAP Documentation**: https://gsap.com/docs
- **ScrollTrigger Guide**: https://gsap.com/docs/v3/Plugins/ScrollTrigger
- **Tailwind CSS**: https://tailwindcss.com
- **React Hooks**: https://react.dev/reference/react

---

## ✨ Final Notes

- Component includes accessibility features (semantic HTML, ARIA labels)
- Optimized for all modern browsers (Chrome, Firefox, Safari, Edge)
- Dark mode is built-in via Tailwind
- Fallback mechanisms for missing images (CSS rotation)
- Mobile-first responsive design

**Next Steps:**
1. Generate 25 rotation images
2. Place in `public/portfolio-images/`
3. Customize text and colors
4. Test on mobile devices
5. Deploy!

Good luck with your portfolio! 🚀
