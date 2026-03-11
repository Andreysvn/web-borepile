# Quick Reference - Panduan Cepat Update Konten

## 📌 Lokasi File Penting

### HTML Files
- `proses-jasa.html` - Halaman utama proses jasa
- Buka dengan text editor favorit (VS Code, Sublime Text, dll)

### CSS Files  
- `css/proses-jasa.css` - Styling halaman proses jasa
- `css/style.css` - Global styling (untuk brand colors)

### JavaScript Files
- `js/proses-jasa.js` - Interaktivity halaman proses
- `js/script.js` - Global scripts

---

## 🖼️ Mengganti Gambar

### Tahap 1: Pengeboran
Cari baris ini di proses-jasa.html:
```html
<img src="imgs/layanan 1.jpeg" alt="Proses Pengeboran Borepile" class="step-image" loading="lazy">
```
Ubah ke:
```html
<img src="imgs/pengeboran.jpg" alt="Proses Pengeboran Borepile dengan Mesin Rotary" class="step-image" loading="lazy">
```

### Tahap 2: Pemasangan Besi  
Cari dan ubah:
```html
<img src="imgs/layanan 1.jpeg" alt="Proses Pemasangan Besi Borepile"
```
Ke:
```html
<img src="imgs/pemasangan-besi.jpg" alt="Tahap Pemasangan Tulangan Besi Borepile"
```

### Tahap 3: Penuangan Beton
Cari dan ubah:
```html
<img src="imgs/layanan 1.jpeg" alt="Proses Penuangan Beton Borepile"
```
Ke:
```html
<img src="imgs/penuangan-beton.jpg" alt="Proses Penuangan Beton Borepile Berkualitas"
```

**Tips Gambar:**
- Dimensi ideal: 600x400px atau lebih
- Format: JPG untuk foto, PNG untuk graphics
- File size: < 200KB (gunakan TinyPNG)
- Pastikan gambar menunjukkan proses real project

---

## ✏️ Mengedit Deskripsi Tahapan

### Edit Deskripsi Pengeboran
Cari:
```html
<p>Pengeboran adalah tahap pertama dan paling kritis dalam proses pembuatan pondasi borepile...
```
Ubah teks sesuai kebutuhan (jangan ubah tags HTML)

### Edit Deskripsi Pemasangan Besi
Cari:
```html
<p>Pemasangan besi adalah tahap kedua yang sangat penting untuk kekuatan struktural pondasi...
```

### Edit Deskripsi Penuangan Beton
Cari:
```html
<p>Penuangan beton adalah tahap terakhir dan paling krusial dalam proses pembuatan pondasi borepile...
```

---

## 📝 Mengedit Fitur Penjelasan

Setiap tahapan punya 5 fitur utama. Untuk mengedit:

Cari struktur ini:
```html
<li>
    <i class="fas fa-check-circle"></i>
    <div>
        <strong>Nama Fitur</strong>
        <span>Deskripsi fitur</span>
    </div>
</li>
```

Contoh perubahan:
```html
<li>
    <i class="fas fa-check-circle"></i>
    <div>
        <strong>Kedalaman Presisi (Custom)</strong>
        <span>Hingga 30 meter dengan akurasi ultra tinggi</span>
    </div>
</li>
```

---

## 🎯 Mengubah Warna & Tema

### Warna Utama (Primary Color)
Halaman menggunakan: `#1a3a6e` (Navy Blue)

Untuk ubah:
1. Buka `css/proses-jasa.css`
2. Cari `:root` section di `css/style.css`
3. Ubah `--primary-color: #1a3a6e;` ke warna baru

Contoh:
```css
--primary-color: #2c3e50;  /* Dark gray-blue */
--secondary-color: #e67e22;  /* Orange */
--accent-color: #3498db;  /* Light blue */
```

### Warna Tautan & Hover
Edit di `css/proses-jasa.css`:
```css
.btn-primary {
    background-color: #e67e22;  /* Ubah warna tombol */
}

.btn-primary:hover {
    background-color: #d35400;  /* Ubah warna saat hover */
}
```

---

## 🆕 Menambah FAQ Baru

Temukan section FAQ (sekitar baris 450):
```html
<div class="faq-item" data-aos="fade-up" data-aos-delay="600">
    <button class="faq-question">
        <span>Pertanyaan baru Anda di sini?</span>
        <i class="fas fa-chevron-down"></i>
    </button>
    <div class="faq-answer">
        <p>Jawaban Anda di sini...</p>
    </div>
</div>
```

Copy struktur di atas dan paste sebelum closing `-faq-container`

---

## 📊 Update Meta Tags untuk SEO

Di head section proses-jasa.html:

### Update Meta Description
Cari:
```html
<meta name="description" content="Ketahui 3 tahapan proses jasa borepile kami...">
```

### Update Meta Keywords  
Cari:
```html
<meta name="keywords" content="proses borepile, tahapan pengeboran, pemasangan besi...">
```

### Update Open Graph untuk Sharing
Cari:
```html
<meta property="og:title" content="3 Tahapan Proses Jasa Borepile - Agung Perkasa">
<meta property="og:description" content="Pelajari 3 tahapan proses borepile...">
```

---

## 🔗 Navigasi Links

### Link di Navbar
- Sudah otomatis di-update di index.html
- Navbar akan menunjukkan "Proses Jasa" setelah "Layanan"

### Link di Footer
Edit di proses-jasa.html bagian footer untuk social links:
```html
<a href="https://www.instagram.com/agungperkasaborepile" target="_blank">
```

---

## ⏱️ Update Timeline/Waktu

### Pengeboran Time
Cari di Tahap 1:
```html
<span>2-4 jam per titik</span>
```

### Pemasangan Besi Time  
Cari di Tahap 2:
```html
<span>1-2 jam per titik</span>
```

### Penuangan Beton Time
Cari di Tahap 3:
```html
<span>1-2 jam per titik</span>
<span>Pengerasan 28 hari (full strength)</span>
```

---

## 💰 Update Harga (di Perbandingan)

Cari section "Comparison Page" (line ~500):

```html
<li><span class="label">Harga:</span> <span class="value">Rp 1.5-3.5 juta/m</span></li>
```

Ubah "1.5-3.5" ke harga terbaru Anda

---

## 📱 Testing Responsive

Setelah update:
1. Buka browser
2. Tekan F12 (Developer Tools)
3. Klik icon Toggle Device (device icon)
4. Test di berbagai ukuran:
   - Mobile: 320px, 375px, 414px
   - Tablet: 768px, 1024px
   - Desktop: 1920px

---

## 🔄 Update Sitemap

Setiap kali publikasi, update di `sitemap.xml`:

Ubah tanggal:
```xml
<lastmod>2026-02-20</lastmod>
```

Menjadi:
```xml
<lastmod>2024-02-21</lastmod>
```

---

## 📚 Testing Checklist

Setelah setiap update:

- [ ] Buka halaman di browser
- [ ] Klik semua tombol "Lihat Detail Teknis"
- [ ] Klik dan expand semua FAQ items
- [ ] Test klik timeline labels
- [ ] Check link tidak broken
- [ ] Test di mobile device
- [ ] Validate HTML (https://validator.w3.org/)
- [ ] Check gambar semua terlihat
- [ ] Cek console tidak ada error (F12)

---

## 🎨 CSS Classes Penting

Jika ingin styling custom:

```css
.proses-step          /* Kartu tahapan utama */
.step-image           /* Gambar tahapan */
.features-list        /* List fitur */
.faq-question         /* Tombol FAQ */
.faq-answer           /* Isi jawaban FAQ */
.comparison-card      /* Kartu perbandingan */
.btn-primary          /* Tombol utama */
```

---

## 🚨 Common Issues & Solutions

### Gambar tidak muncul
- Pastikan path gambar benar
- Gunakan relative path: `imgs/namefile.jpg`
- Not: `C:\Users\...` atau `http://`

### FAQ tidak bisa diklik
- Pastikan file `js/proses-jasa.js` ter-load
- Check console (F12) untuk error messages

### Styling berantakan di mobile
- Clear browser cache (Ctrl+Shift+Del)
- Test di different browser
- Check CSS file ter-load dengan baik

### Link broken  
- Pastikan file exists di folder
- Use relative paths (tidak absolute)
- Check spelling

---

## 📞 Format Kontak Update

Di footer proses-jasa.html:
```html
<li><i class="fas fa-phone"></i> +62 858-141737</li>
<li><i class="fas fa-envelope"></i> agungperkasaborepile@gmail.com</li>
```

Update nomor/email sesuai kebutuhan

---

## 🔐 Backup Penting

**JANGAN LUPA BACKUP:**
1. Sebelum edit besar-besaran
2. Setiap minggu minimal
3. Backup tools: GitHub, Google Drive, atau local backup

---

## 📊 Analytics Custom Event

Halaman sudah setup untuk track:
- Button clicks
- FAQ interactions  
- Details toggle clicks

Di Google Analytics, lihat di Events section

---

## ⚡ Performance Tips

### Optimize Gambar
```bash
# Gunakan TinyPNG atau ImageOptim
Recommended: max 150KB per image
```

### Minimize CSS
Opsional: minimize dengan tools online
Tapi sekarang sudah optimal

### Defer JavaScript
Sudah disetup di HTML (scripts di akhir)

---

## 📖 Struktur Folder Sekarang

```
web-borepile/
├── index.html
├── proses-jasa.html (NEW)
├── gallery.html
├── blog-borepile-vs-strauss.html
├── robots.txt
├── sitemap.xml (UPDATED)
├── css/
│   ├── style.css (MAIN)
│   └── proses-jasa.css (NEW)
├── js/
│   ├── script.js (MAIN)
│   └── proses-jasa.js (NEW)
├── imgs/
│   └── [semua image files]
├── vds/
│   └── [video files]
└── DOKUMENTASI_PROSES_JASA.md (NEW)
```

---

## 💡 Tips Terakhir

1. **Save teratur** - Jangan lupa save setelah edit
2. **Test sebelum publish** - Selalu test di browser dulu
3. **Mobile first** - Test di mobile terlebih dahulu
4. **Keep backup** - Simpan versi sebelumnya
5. **Monitor analytics** - Lihat performance page
6. **Update regularly** - Refresh content untuk SEO

---

Selamat menggunakan Proses Jasa Borepile page! 🚀
