# Deploy web-borepile

## Ringkasan

Proyek ini adalah website statis dengan backend Node.js sederhana di `server.js` untuk menghitung `Total Visitor` harian.

## Kebutuhan

- Frontend: HTML/CSS/JS statis
- Backend: Node.js + Express
- Penyimpanan sementara: `visitor-counts.json`

## Hosting yang direkomendasikan

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

1. Push kode ke GitHub
2. Buat akun Render dan hubungkan repo
3. Tambahkan service baru:
   - type: Web Service
   - branch: main
   - build command: `npm install`
   - start command: `npm start`
4. Render akan mem-build dan menjalankan `server.js`
5. Buka URL hasil deploy dan cek footer `Total Visitor`

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
