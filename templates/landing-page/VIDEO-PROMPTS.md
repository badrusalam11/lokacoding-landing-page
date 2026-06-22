# 🎬 Video Generation Prompts untuk Nova Landing Page

Generate 2 video assets berikut untuk meningkatkan visual landing page Nova SaaS.

---

## 📹 Video 1: Hero Background — Dashboard Analytics Animation
**Filename:** `hero-dashboard.mp4`  
**Duration:** 15-20 detik (looping seamlessly)  
**Aspect Ratio:** 16:9 (1920x1080)  
**Style:** Modern, clean, tech-focused

### Prompt untuk AI Video Generator (Runway, Pika, Kling AI, etc):

```
Create a cinematic 15-second looping video showcasing a modern SaaS dashboard interface with analytics and data visualization. 

VISUAL ELEMENTS:
- Clean, modern dashboard interface with dark theme (navy blue #0A0A12 background)
- Multiple animated charts and graphs showing upward growth trends
- Real-time metrics updating (user count, uptime percentage, growth rate)
- Subtle floating UI cards with glassmorphism effect
- Data visualizations: line charts, bar graphs, progress circles
- Color scheme: violet (#7C3AED) and lime green (#C4F042) accents on dark background
- Smooth transitions between different dashboard views

ANIMATION STYLE:
- Smooth, professional camera movement (slow zoom in or subtle parallax)
- Charts and numbers animating/counting up elegantly
- Soft glowing effects on interactive elements
- Minimalist and premium feel
- 60fps for smooth playback
- Seamless loop (start and end frames match perfectly)

MOOD:
- Professional, trustworthy, innovative
- High-tech but approachable
- Inspiring confidence and growth

TECHNICAL:
- 1920x1080 resolution
- 60fps
- MP4 format (H.264)
- Dark ambient background with subtle gradients
- No text/labels (just visual data representation)
```

### Alternative Prompt (Shorter Version):
```
Modern SaaS dashboard animation with growing charts, analytics metrics, and data visualizations. Dark theme with violet and lime green accents. Smooth camera movement, professional UI elements floating in 3D space. Glassmorphism cards, upward trending graphs. Seamless 15-second loop. 60fps, cinematic, high-tech aesthetic.
```

---

## 📹 Video 2: Showcase Section — Team Collaboration in Action
**Filename:** `team-collaboration.mp4`  
**Duration:** 12-15 detik (looping seamlessly)  
**Aspect Ratio:** 21:9 atau 16:9 (ultra-wide preferred)  
**Style:** Dynamic, collaborative, inspiring

### Prompt untuk AI Video Generator:

```
Create a dynamic 12-second looping video showing a modern tech team collaborating on a product. 

VISUAL ELEMENTS:
- Modern, bright office or co-working space with large windows
- 3-4 diverse team members actively working together around a large screen/monitor
- Screen displays a product dashboard or roadmap (blurred/abstract)
- Laptop screens with code/designs (not readable, just ambient)
- Sticky notes, whiteboards with diagrams in background
- Natural daylight streaming through windows
- Plants and modern office furniture for warmth

ANIMATION STYLE:
- Slow cinematic camera movement (gentle dolly or orbit)
- Natural, candid moments: pointing at screen, discussing, nodding in agreement
- Authentic body language showing engagement and excitement
- Soft focus on foreground, sharp on collaboration moment
- Color grading: bright, slightly warm tones with high contrast
- Professional but approachable atmosphere

MOOD:
- Collaborative, innovative, productive
- Energetic but focused
- Diverse and inclusive team
- Success and forward momentum

TECHNICAL:
- 1920x1080 (or 2560x1080 for ultra-wide)
- 60fps or 30fps
- MP4 format (H.264)
- Natural lighting with soft shadows
- Seamless loop capability
- Slight motion blur for cinematic feel
```

### Alternative Prompt (Shorter Version):
```
Cinematic video of diverse tech team collaborating around large monitor in modern bright office. Natural daylight, plants, whiteboards. People pointing at screen, discussing enthusiastically. Slow camera movement, professional color grading. Warm, productive atmosphere. Seamless 12-second loop. 1920x1080, 60fps, modern workspace aesthetic.
```

---

## 🎨 Stock Video Alternatives

Jika tidak menggunakan AI generator, cari stock video dengan keywords:

### Untuk Hero Video:
- "SaaS dashboard animation"
- "analytics dashboard loop"
- "data visualization motion graphics"
- "modern UI interface animation"
- "dashboard metrics growing"
- "tech dashboard 3D"

**Recommended Sources:**
- Envato Elements
- Motion Array
- Storyblocks
- Adobe Stock (search "dashboard UI animation")

### Untuk Showcase Video:
- "tech team collaboration"
- "startup team working together"
- "office teamwork modern"
- "diverse team brainstorming"
- "product team meeting"
- "agile team collaboration"

**Recommended Sources:**
- Pexels Videos (free)
- Pixabay Videos (free)
- Coverr (free)
- Envato Elements
- Shutterstock

---

## ⚙️ Technical Specifications

### Optimisasi untuk Web:
```bash
# Compress dengan FFmpeg untuk web performance
ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset slow -c:a aac -b:a 128k -movflags +faststart output.mp4

# Untuk file lebih kecil (jika diperlukan):
ffmpeg -i input.mp4 -vf scale=1280:720 -c:v libx264 -crf 28 -preset slow -c:a aac -b:a 96k -movflags +faststart output-720p.mp4
```

### Fallback Poster Images:
Buat poster frame dari video untuk fallback:
```bash
ffmpeg -i hero-dashboard.mp4 -ss 00:00:03 -vframes 1 hero-dashboard-poster.jpg
ffmpeg -i team-collaboration.mp4 -ss 00:00:02 -vframes 1 team-collaboration-poster.jpg
```

---

## 🎯 Usage dalam HTML

Video sudah terintegrasi dalam code dengan struktur:

```html
<!-- Hero Video -->
<video autoplay muted loop playsinline preload="auto" id="heroVideo">
  <source src="assets/hero-dashboard.mp4" type="video/mp4">
</video>

<!-- Showcase Video -->
<video autoplay muted loop playsinline preload="metadata" id="showcaseVideo">
  <source src="assets/team-collaboration.mp4" type="video/mp4">
</video>
```

---

## 📋 Checklist Sebelum Publish

- [ ] Video dikompresi untuk web (target: < 5MB per video)
- [ ] Format MP4 dengan H.264 codec
- [ ] Loop seamlessly (frame pertama = frame terakhir)
- [ ] Tested di Chrome, Safari, Firefox
- [ ] Tested di mobile devices
- [ ] Fallback image/gradient berfungsi saat video loading
- [ ] Video autoplay muted (requirement untuk autoplay di browser)
- [ ] Aspect ratio sesuai dengan container

---

## 🚀 AI Video Tools Recommendations

1. **Runway Gen-3** - Terbaik untuk dashboard animations dan UI
2. **Pika Labs** - Bagus untuk cinematic office scenes
3. **Kling AI** - Alternatif dengan hasil natural
4. **Leonardo Motion** - Untuk motion graphics style
5. **Stable Video Diffusion** - Open source option

**Pro Tip:** Untuk hasil terbaik, generate beberapa variasi dan pilih yang paling smooth untuk looping!

---

Generated for **Nova SaaS Landing Page Template** by Loka Coding
