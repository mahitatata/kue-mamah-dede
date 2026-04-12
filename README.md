## CakeTime Fullstack

Frontend tetap memakai React/Vite dari proyek ini, lalu backend ditambahkan di folder `backend/` memakai Laravel 13 + Sanctum + Midtrans.

### Fitur

- Login dan register user ke backend Laravel
- Produk diambil dari API Laravel
- Keranjang tersimpan di backend
- Checkout dengan COD atau Midtrans Snap
- Setelah Midtrans sukses, halaman frontend menampilkan pembayaran sukses
- Admin bisa CRUD produk, upload foto, dan update status pesanan
- Riwayat pesanan user tersimpan di backend

### Struktur

- `src/` untuk frontend React
- `backend/` untuk API Laravel

### Menjalankan backend

```bash
php backend/artisan storage:link
php backend/artisan migrate:fresh --seed
php backend/artisan serve --host=127.0.0.1 --port=8000
```

### Menjalankan frontend

```bash
npm install
npm run dev
```

Frontend Vite sudah diproxy ke `http://127.0.0.1:8000` untuk path `/api`.

### Akun seed

- Admin
  - Email: `admin@gmail.com`
  - Password: `123456`
- Customer
  - Email: `customer@caketime.test`
  - Password: `customer12345`

### Midtrans

Key Midtrans dipasang di `backend/.env` dan template-nya ada di `backend/.env.example`.

Contoh format konfigurasi sandbox (isi dari akun Midtrans Anda sendiri):

- Merchant ID: `YOUR_MERCHANT_ID`
- Client Key: `Mid-client-REPLACE_ME`
- Server Key: `Mid-server-REPLACE_ME`

Untuk local development, status pembayaran disinkronkan lewat 3 jalur:

1. hasil callback `snap.pay(...)` dari frontend (`sync-client-result`)
2. callback halaman backend `/payment/success|pending|error`
3. endpoint refresh status order

Kalau ingin notifikasi Midtrans server-to-server masuk penuh ke mesin lokal, expose URL `backend` ke internet memakai tunnel seperti `ngrok` lalu arahkan notification URL Midtrans ke:

```text
POST /api/midtrans/notifications
```

### Catatan

- Database backend default memakai MySQL lokal `root` tanpa password dengan nama database `kue_mamah_dede`
- Seed produk mengambil aset gambar dari `src/assets`
- Link bridge backend ke frontend membaca `FRONTEND_URL` (default sekarang `http://localhost:5173`) dan otomatis fallback ke `127.0.0.1` jika perlu
- Dokumentasi backend untuk pemula ada di `DOKUMENTASI-BACKEND-PEMULA.md`
