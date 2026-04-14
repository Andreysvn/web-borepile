# Deploy web-borepile

## Ringkasan

Proyek ini adalah website statis dengan backend Node.js sederhana di `server.js` untuk menghitung `Total Visitor` harian.

## Kebutuhan

- Frontend: HTML/CSS/JS statis
- Backend: Node.js + Express
- Penyimpanan sementara: `visitor-counts.json`

## Hosting yang direkomendasikan

### GitHub Pages
- Cocok untuk website statis seperti `index.html`, `proses-jasa.html`, `css/`, `js/`, dan `imgs/`
- Saat ini repo sudah disiapkan dengan `CNAME` untuk custom domain `agungperkasaborepile.com`
- Tidak bisa menjalankan `server.js` atau API backend pada GitHub Pages
- Backend visitor akan dideploy nanti di Render atau hosting terpisah

### Render
- Bisa deploy Node.js sekaligus file statis
- Mendukung repo GitHub
- Cocok untuk `server.js` dan file `visitor-counts.json`

### Railway
- Fokus API dan backend kecil
- Bisa deploy langsung dari GitHub

### Vercel
- Bisa deploy frontend statis
- Untuk backend Node.js, gunakan API route atau serverless function
- `visitor-counts.json` tidak cocok di Vercel karena storage serverless bersifat ephemeral

## Langkah deploy ke Render

1. Push kode ke GitHub (sudah dilakukan).
2. Buat akun Render dan hubungkan repo GitHub.
3. Tambahkan service baru:
   - type: Web Service
   - branch: main
   - build command: `npm install`
   - start command: `npm start`
   - root: `.`
4. Render bisa otomatis membaca `render.yaml` di root repo.
5. Deploy dan tunggu sampai status "Live".
6. Buka `https://<app-url>/api/visitor-today` untuk verifikasi.
7. Buka situs deploy untuk memastikan footer `Total Visitor` tampil.

## Catatan penting

- Jika menggunakan host Node.js dengan storage persistent, `visitor-counts.json` bisa menyimpan hitungan harian sementara.
- Untuk production lebih baik gunakan database, karena file sistem di server bisa berubah saat deploy ulang.

## Verifikasi

- Buka `http://<app-url>/api/visitor-today`
- Seharusnya mengembalikan JSON seperti:
  ```json
  { "count": 1 }
  ```

- Buka halaman situs dan cek footer `Total Visitor`.
