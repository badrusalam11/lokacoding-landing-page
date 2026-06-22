# 🎬 Video Generation Prompts untuk Mori Nihongo

Template ini punya **5 slot video**, semuanya saat ini dalam mode placeholder (lihat badge `🎬 nama-file.mp4` di tiap frame saat preview). Jangan isi slot ini dengan stock footage acak — tiap prompt di bawah sudah dikunci ke konsep dan palet warna Mori Nihongo (tema Ghibli, tenang, hangat, penuh cerita) supaya hasilnya nyambung satu sama lain.

## 🔒 Style Lock (berlaku untuk SEMUA video di bawah)

Tempel blok ini di awal setiap prompt jika generator-nya mendukung system/style prompt terpisah:

```
STYLE LOCK:
- Mood: calm, warm, nostalgic, gentle — like a quiet scene from a classic Japanese animated film
- Color palette ONLY: sage green #A9C9A0, forest green #5B7F5E, soft sky teal #BEE0DB, warm blush #F2C6BB, golden sun #F0CE86, cream #FBF6EC
- Lighting: soft natural light, warm afternoon golden hour, no harsh shadows, no neon, no cold blue tones
- Pacing: slow, unhurried, meditative — never fast cuts or energetic motion
- NO: corporate/office settings, generic stock-footage business people, neon or cyberpunk tones, fast/jittery camera, on-screen text or logos, watermarks
- Seamless loop: first and last frame must match for clean looping
```

Ini langsung menjawab masalah versi sebelumnya: video lama (`ambience.mp4`) adalah stock footage pria berkacamata di kantor — sama sekali di luar konsep. Setiap prompt di bawah didesain supaya hal itu tidak terulang.

---

## 📹 Video 1 — Hero Scene
**Filename:** `hero-loop.mp4`
**Dipakai di:** `#hero` → `.hero-scene` (`index.html`)
**Durasi:** 8-12 detik, loop mulus
**Aspect Ratio:** ~4:4.3 (mendekati persegi, sedikit portrait)

### Prompt:
```
A gentle establishing shot in the style of classic Japanese animated films (Ghibli-esque painterly look). A quiet countryside scene at warm golden-hour afternoon: a single weathered torii gate stands among soft rolling green hills, a few soft cumulus clouds drift slowly across the sky, small leaves float gently down from off-screen, warm sunlight rays filter through. No people, no readable text, no logos. Camera: very slow, subtle drift/parallax — almost still, like a painted background that breathes. Color palette: sage and forest greens, cream sky, golden warm light accents.

STYLE LOCK: calm, warm, nostalgic mood. Soft natural lighting only. Slow meditative pacing. Seamless loop (first frame = last frame). No corporate/office imagery, no neon, no on-screen text.
```

### Alt Prompt (singkat):
```
Ghibli-style painterly countryside loop: torii gate on soft green hills, drifting clouds, floating leaves, warm golden-hour light. No people, no text. Slow gentle camera drift. Seamless 10s loop. Palette: sage green, cream, warm gold.
```

---

## 📹 Video 2 — Kartu Kelas: Hiragana & Katakana
**Filename:** `kelas-hiragana.mp4`
**Dipakai di:** `#video` → kartu pertama (`.kelas-frame.v1`)
**Durasi:** 8-10 detik, loop mulus
**Aspect Ratio:** 4:5 (vertikal)

### Prompt:
```
Close-up overhead shot of a hand calmly practicing handwriting on cream-colored notebook paper, gently drawing a hiragana or katakana character stroke by stroke with a soft brush pen. Soft natural window light from the side, slightly soft focus background with a hint of a houseplant leaf. No face visible, just hand and paper. Calm, patient pacing — this represents a beginner Japanese writing class.

STYLE LOCK: warm cream and sage tones, soft natural light, slow unhurried pacing, seamless loop, no on-screen text/logo, no office setting.
```

### Alt Prompt (singkat):
```
Overhead close-up: hand slowly writing hiragana strokes with a brush pen on cream paper, soft window light, plant leaf softly out of focus in background. Calm, patient pacing. Seamless 8s loop. Warm cream/sage palette, no text overlay.
```

---

## 📹 Video 3 — Kartu Kelas: Kaiwa (Percakapan)
**Filename:** `kelas-kaiwa.mp4`
**Dipakai di:** `#video` → kartu kedua (`.kelas-frame.v2`)
**Durasi:** 8-10 detik, loop mulus
**Aspect Ratio:** 4:5 (vertikal)

### Prompt:
```
A warm, softly-lit medium shot of two people sitting at a small wooden table in a cozy room, having a relaxed, friendly conversation — leaning in, smiling, gesturing gently as if practicing casual Japanese conversation. A cup of tea steams quietly on the table, a small potted plant nearby, large soft window light from one side giving a warm blush-toned glow. Faces may be softly blurred or angled away — the focus is the warm, intimate mood, not specific likeness. No readable text, no branding, no office setting.

STYLE LOCK: blush and cream warm tones, soft natural light, slow relaxed pacing (like chatting with a close friend), seamless loop, no corporate vibe.
```

### Alt Prompt (singkat):
```
Two people chatting warmly at a small wooden table, cozy room, soft window light, tea cup steaming, plant nearby. Relaxed "close friends talking" mood, blush/cream tones. No readable text. Seamless 9s loop.
```

---

## 📹 Video 4 — Kartu Kelas: Kanji
**Filename:** `kelas-kanji.mp4`
**Dipakai di:** `#video` → kartu ketiga (`.kelas-frame.v3`)
**Durasi:** 8-10 detik, loop mulus
**Aspect Ratio:** 4:5 (vertikal)

### Prompt:
```
Close-up of a hand using an ink brush to slowly draw a simple kanji character (e.g. 木 "tree" or 山 "mountain") on cream washi paper. As the final stroke completes, a small, softly-illustrated sketch matching the character's meaning gently fades in beside it (e.g. a delicate line-drawing of a tree growing in beside the 木 character) — visualizing "learning kanji through stories and illustration." Soft natural light, sage-green accent tones, no face, no readable Latin text.

STYLE LOCK: forest/sage palette, soft natural light, slow contemplative pacing, seamless loop, no office/corporate elements.
```

### Alt Prompt (singkat):
```
Hand brush-painting a simple kanji on washi paper; a soft illustrated sketch of its meaning fades in beside it (storytelling style). Sage/forest tones, soft light, contemplative pacing. Seamless 9s loop, no Latin text.
```

---

## 📹 Video 5 — Nook "Kenapa Kami"
**Filename:** `nook-study.mp4`
**Dipakai di:** `#why` → `.nook`
**Durasi:** 8-12 detik, loop mulus
**Aspect Ratio:** ~4:4.2 (mendekati persegi)

### Prompt:
```
A cozy still-life study corner, slightly top-down angle: an open notebook with pages gently fluttering from a soft breeze, a warm cup of matcha or tea beside it with slow rising steam, a small potted plant with one or two leaves softly swaying. Warm afternoon window light casts soft long shadows. Nothing else moves quickly — this is a quiet, comforting "reading nook" loop. No people, no readable text, no logo.

STYLE LOCK: blush and cream warm tones, soft golden-hour light, slow gentle motion only (steam, page flutter, leaf sway), seamless loop.
```

### Alt Prompt (singkat):
```
Cozy study-corner still life: notebook pages fluttering gently, steaming tea cup, small swaying plant leaf, warm soft window light. Calm, no people, no text. Seamless 10s loop. Blush/cream palette.
```

---

## 🎨 Kalau Tidak Pakai AI Generator (Stock Video Bertarget)

Hindari kata kunci umum seperti "study" atau "japan" saja — itu yang dulu menghasilkan `ambience.mp4` yang nyasar ke stock kantor. Pakai kombinasi kata kunci spesifik berikut:

- `hero-loop.mp4` → "torii gate countryside anime style", "ghibli style landscape loop", "japanese hillside golden hour animation"
- `kelas-hiragana.mp4` → "hand writing japanese calligraphy close up", "brush pen hiragana practice", "japanese handwriting notebook overhead"
- `kelas-kaiwa.mp4` → "two friends warm conversation cozy room", "casual chat tea table soft light"
- `kelas-kanji.mp4` → "ink brush kanji calligraphy close up", "japanese brush painting character"
- `nook-study.mp4` → "cozy reading nook still life", "tea steam notebook aesthetic loop", "study corner ambience soft light"

**Sumber yang cocok untuk gaya ini:** Pexels Videos, Pixabay Videos, Coverr (gratis) — semua mendukung filter aspek "calm/aesthetic/cozy" yang relevan untuk konsep ini, lebih spesifik daripada Envato/Shutterstock generik.

---

## ⚙️ Spesifikasi Teknis

### Kompresi untuk web:
```bash
ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset slow -c:a aac -b:a 96k -movflags +faststart -an output.mp4
```
(`-an` membuang audio track — semua video di template ini autoplay+muted, jadi audio tidak perlu ikut terkirim ke browser.)

### Target ukuran file:
- `hero-loop.mp4` & `nook-study.mp4`: < 4MB
- tiap `kelas-*.mp4`: < 2.5MB (3 video diputar bersamaan di satu section, jaga total payload tetap ringan)

### Extract poster frame (opsional, untuk `poster=""` di tag `<video>`):
```bash
ffmpeg -i hero-loop.mp4 -ss 00:00:01 -vframes 1 hero-loop-poster.jpg
```

---

## 🎯 Cara Pasang di HTML

Tiap slot sudah ada di `index.html`, tinggal timpa file mp4 dengan nama yang sama persis di `assets/mp4/` — tidak perlu ubah kode apa pun. Begitu file ditemukan oleh browser, badge placeholder (`🎬 nama-file.mp4`) otomatis hilang dan ilustrasi fallback diganti video asli (lihat `autoRevealVideo()` di akhir `index.html`).

```html
<!-- contoh: kartu Hiragana di section #video -->
<div class="kelas-frame v1">
  <video autoplay muted loop playsinline preload="auto">
    <source src="assets/mp4/kelas-hiragana.mp4" type="video/mp4">
  </video>
  ...
</div>
```

---

## 📋 Checklist Sebelum Publish

- [ ] Semua 5 video dibuat dari prompt di atas (atau stock bertarget di atas) — tidak ada yang "asal nyambung"
- [ ] Tiap video di-compress (`-an`, H.264, target ukuran sesuai poin di atas)
- [ ] Loop mulus (frame pertama ≈ frame terakhir)
- [ ] Tidak ada teks/logo terbaca di dalam video (caption sudah ditangani oleh HTML/CSS)
- [ ] Nama file sama persis dengan yang direferensikan di `index.html` (lihat tabel filename di atas)
- [ ] Dicek di browser: badge placeholder hilang otomatis begitu video terpasang
- [ ] Dicek di mobile width — 3 kartu Video Kelas collapse jadi 1 kolom dengan rapi

---

## 🚀 Rekomendasi AI Video Tool

1. **Runway Gen-3 / Gen-4** — kontrol gaya & loop paling rapi, cocok untuk scene hero & nook
2. **Kling AI** — bagus untuk gerakan tangan/close-up (cocok untuk kelas-hiragana, kelas-kanji)
3. **Pika Labs** — alternatif cepat untuk scene percakapan/cozy
4. **Luma Dream Machine** — alternatif untuk scene landscape/establishing shot
5. **Stable Video Diffusion** — opsi open-source jika butuh kontrol lokal

**Pro tip:** generate 2-3 variasi per prompt, pilih yang paling mulus saat di-loop — jangan langsung pakai hasil pertama.

---

Generated for **Mori Nihongo — Template Kursus Bahasa Jepang (Tema Ghibli)** by Loka Coding
