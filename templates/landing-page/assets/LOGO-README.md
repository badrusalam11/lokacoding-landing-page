# Logo Assets untuk Nova SaaS Landing Page

## 📦 Files yang Tersedia

### 1. **logo.svg** (48x48px)
Logo utama dengan gradient violet-purple dan lightning bolt lime green.
- Digunakan di: Navigation bar, brand identity
- Format: SVG (scalable, recommended)

### 2. **favicon.svg** (32x32px) 
Versi optimized untuk favicon dengan rounded corners.
- Digunakan di: Browser tab icon
- Format: SVG (modern browsers)

## 🎨 Konsep Logo

**Visual:** Lightning bolt / Rocket shape melambangkan:
- ⚡ Kecepatan dan efisiensi
- 🚀 Peluncuran produk yang cepat  
- ⭐ "Nova" (bintang yang meledak dengan energi)

**Warna:**
- Background: Gradient Violet (#7C3AED) → Purple (#5B21B6)
- Icon: Lime Green (#C4F042) — signature color Nova
- Accent: Small dot untuk menambah dinamis

**Style:** Modern, minimal, tech-forward, energetic

## 🔄 Konversi ke Format Lain

### Buat PNG Favicon (jika diperlukan):
Jika ingin support browser lama, convert SVG ke PNG menggunakan tools online:
- https://cloudconvert.com/svg-to-png
- https://svgtopng.com/

Atau gunakan Inkscape/Figma untuk export ke:
- favicon-16x16.png
- favicon-32x32.png  
- favicon-96x96.png
- apple-touch-icon.png (180x180px untuk iOS)

### Buat ICO (Legacy Support):
```bash
# Menggunakan ImageMagick
convert favicon.svg -define icon:auto-resize=16,32,48,64,256 favicon.ico
```

## 📱 Apple Touch Icon (Optional)

Untuk iOS home screen icon, buat versi dengan padding:

```html
<link rel="apple-touch-icon" sizes="180x180" href="assets/apple-touch-icon.png">
```

## 🌐 Full Favicon Setup (untuk production)

```html
<!-- Modern browsers (SVG) -->
<link rel="icon" type="image/svg+xml" href="assets/favicon.svg">

<!-- Fallback (PNG) -->
<link rel="icon" type="image/png" sizes="32x32" href="assets/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="assets/favicon-16x16.png">

<!-- Apple iOS -->
<link rel="apple-touch-icon" sizes="180x180" href="assets/apple-touch-icon.png">

<!-- Android Chrome -->
<link rel="manifest" href="/site.webmanifest">

<!-- Legacy -->
<link rel="shortcut icon" href="assets/favicon.ico">
```

## 🎯 Usage di HTML

Sudah terintegrasi di `index.html`:

```html
<!-- Favicon -->
<link rel="icon" type="image/svg+xml" href="assets/favicon.svg"/>

<!-- Navigation -->
<a class="brand" href="#">
  <img src="assets/logo.svg" alt="Nova Logo" width="32" height="32" class="brand-logo">
  Nova
</a>

<!-- Footer -->
<img src="assets/logo.svg" alt="Nova Logo" width="28" height="28">
```

## ✨ Logo Animation

Logo sudah memiliki hover effect di CSS:

```css
.brand-logo {
  transition: transform .3s cubic-bezier(.34,1.56,.64,1);
}
.brand:hover .brand-logo {
  transform: scale(1.1) rotate(-5deg);
}
```

Efek: Logo membesar dan berputar sedikit saat di-hover.

## 🔧 Customization

Untuk mengubah warna atau bentuk:
1. Edit file SVG dengan text editor atau design tool (Figma, Inkscape, Adobe Illustrator)
2. Ubah nilai gradient atau fill colors
3. Adjust path data untuk mengubah bentuk lightning bolt

---

**Design by:** Loka Coding  
**Version:** 1.0  
**License:** Untuk template Nova Landing Page
