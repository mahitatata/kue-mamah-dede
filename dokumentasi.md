# Dokumentasi Backend CakeTime Untuk Pemula

Dokumen ini menjelaskan backend Laravel di proyek CakeTime dengan bahasa yang sederhana.

## Gambaran besar

Proyek ini sekarang terdiri dari 2 bagian:

- `src/` = frontend React/Vite
- `backend/` = backend Laravel API + Midtrans + database

Frontend menampilkan halaman. Backend menyimpan data, memproses login, keranjang, pesanan, dan pembayaran.

## Flow singkat aplikasi

1. User buka frontend React.
2. Frontend memanggil API Laravel di `backend/routes/api.php`.
3. Laravel mengambil data dari database MySQL.
4. Saat checkout Midtrans:
   - order dibuat dulu di Laravel
   - token Snap dibuat di Laravel
   - frontend membuka popup Midtrans
   - status pembayaran disinkronkan ke Laravel (dari callback frontend, callback halaman backend, atau webhook)
   - Laravel menyimpan status Midtrans dan update status pembayaran order
5. Setelah sukses, user bisa lihat:
   - halaman sukses dari callback backend Laravel
   - halaman pesanan dari frontend React

## Folder penting backend

### `backend/app/Models`

Ini adalah representasi tabel database.

- `User.php`
  - data user
  - role admin/customer
  - relasi ke cart dan orders
- `Product.php`
  - data produk
  - kategori, harga, deskripsi, gambar
- `CartItem.php`
  - item keranjang user
- `Order.php`
  - data pesanan utama
  - menyimpan total, payment status, order status, midtrans status
- `OrderItem.php`
  - detail item di dalam order
- `PaymentNotification.php`
  - log payload notifikasi dari Midtrans

### `backend/app/Http/Controllers/Api`

Ini tempat controller API untuk frontend React.

- `AuthController.php`
  - register
  - login
  - logout
  - ambil user login
- `ProductController.php`
  - list produk
  - detail produk
- `CartController.php`
  - lihat keranjang
  - tambah item
  - update qty
  - hapus item
- `OrderController.php`
  - checkout
  - list pesanan user
  - detail pesanan
  - refresh status pembayaran dari Midtrans
  - terima webhook Midtrans

### `backend/app/Http/Controllers/Api/Admin`

Ini controller admin.

- `ProductController.php`
  - CRUD produk
  - upload foto produk
- `OrderController.php`
  - lihat semua pesanan
  - update status pesanan

### `backend/app/Services`

Ini tempat logika bisnis yang dipakai ulang.

- `MidtransService.php`
  - konfigurasi Midtrans
  - buat transaksi Snap
  - cek status ke Midtrans
  - validasi signature webhook
- `OrderPaymentService.php`
  - simpan notifikasi Midtrans
  - ubah payload Midtrans jadi status order lokal
  - sinkronkan order dari Midtrans

### `backend/routes`

- `api.php`
  - semua route API untuk frontend
- `web.php`
  - route web biasa Laravel
  - dipakai untuk halaman callback pembayaran seperti:
    - `/payment/success`
    - `/payment/pending`
    - `/payment/error`

## Relasi backend dengan halaman frontend

### Halaman `src/LoginPage.jsx`

Pakai:

- `POST /api/login`

Controller:

- `backend/app/Http/Controllers/Api/AuthController.php`

### Halaman `src/RegisterPage.jsx`

Pakai:

- `POST /api/register`

Controller:

- `AuthController.php`

### Halaman `src/ProductPage.jsx`

Pakai:

- `GET /api/products/{slug}`
- `POST /api/cart/items`

Controller:

- `ProductController.php`
- `CartController.php`

### Halaman `src/KeranjangPage.jsx`

Pakai:

- `GET /api/cart`
- `PATCH /api/cart/items/{id}`
- `DELETE /api/cart/items/{id}`

Controller:

- `CartController.php`

### Halaman `src/PaymentPage.jsx`

Pakai:

- `POST /api/orders/checkout`

Yang terjadi:

- Laravel buat order
- Laravel buat token Snap Midtrans
- frontend buka popup `window.snap.pay`

Controller:

- `OrderController.php`

### Halaman `src/PaymentResultPage.jsx`

Pakai:

- `POST /api/orders/{id}/refresh-payment-status`
- `GET /api/orders/{id}`

Halaman ini dipakai saat frontend aktif.

### Halaman callback backend Laravel

Dipakai saat Midtrans redirect balik ke backend:

- `http://127.0.0.1:8000/payment/success`
- `http://127.0.0.1:8000/payment/pending`
- `http://127.0.0.1:8000/payment/error`

Controller:

- `backend/app/Http/Controllers/PaymentPageController.php`

Kenapa ini penting:

- kalau frontend port `5173` sedang mati, user tetap melihat halaman hasil pembayaran
- backend tetap bisa sinkronkan status Midtrans
- tombol "Buka Halaman Pesanan" dan "Kembali ke Beranda" lewat bridge `/go-frontend/...`
- route backend `http://127.0.0.1:8000/admin` juga diarahkan ke frontend admin

### Halaman `src/OrdersPage.jsx`

Pakai:

- `GET /api/orders`

Controller:

- `OrderController.php`

### Halaman `src/AdminPage.jsx`

Pakai:

- `GET /api/admin/products`
- `POST /api/admin/products`
- `POST /api/admin/products/{slug}`
- `DELETE /api/admin/products/{slug}`
- `GET /api/admin/orders`
- `PATCH /api/admin/orders/{id}/status`

Controller:

- `Api/Admin/ProductController.php`
- `Api/Admin/OrderController.php`

## Database dan migrasi

Semua struktur tabel ada di:

- `backend/database/migrations`

File penting:

- `create_products_table`
- `create_orders_table`
- `create_order_items_table`
- `create_payment_notifications_table`
- `create_cart_items_table`
- `add_role_to_users_table`
- `add_midtrans_status_columns_to_orders_table`

## Seeder

Seeder ada di:

- `backend/database/seeders`

File penting:

- `DatabaseSeeder.php`
  - buat akun admin dan customer
- `ProductSeeder.php`
  - isi produk awal dari aset gambar frontend

## Akun default

- Admin
  - email: `admin@gmail.com`
  - password: `123456`
- Customer
  - email: `customer@caketime.test`
  - password: `customer12345`

## Konfigurasi Midtrans (sandbox)

- Merchant ID: `YOUR_MERCHANT_ID`
- Client Key: `Mid-client-REPLACE_ME`
- Server Key: `Mid-server-REPLACE_ME`

Simpan di `backend/.env`:

```env
MIDTRANS_IS_PRODUCTION=false
MIDTRANS_MERCHANT_ID=YOUR_MERCHANT_ID
MIDTRANS_CLIENT_KEY=Mid-client-REPLACE_ME
MIDTRANS_SERVER_KEY=Mid-server-REPLACE_ME
FRONTEND_URL=http://localhost:5173
```

## Payment status dan artinya

Di backend ada 3 istilah yang perlu dibedakan:

- `payment_status`
  - status pembayaran versi aplikasi
  - contoh: `paid`, `pending`, `failed`
- `midtrans_status`
  - status asli dari Midtrans
  - contoh: `settlement`, `capture`, `pending`, `expire`
- `order_status`
  - status pengerjaan pesanan
  - contoh: `processing`, `completed`, `cancelled`

Contoh:

- kalau Midtrans `settlement`, maka:
  - `midtrans_status = settlement`
  - `payment_status = paid`
  - `order_status = processing`

Kenapa `order_status` tetap `processing`?

Karena pembayaran sukses tidak berarti kuenya sudah selesai dibuat.

## Cara menjalankan proyek

### Backend

```bash
php backend/artisan storage:link
php backend/artisan migrate:fresh --seed
php backend/artisan serve --host=127.0.0.1 --port=8000
```

### Frontend

```bash
npm install
npm run dev
```

## Kalau halaman sukses Midtrans tidak muncul

Cek ini:

1. Pastikan backend Laravel hidup di `127.0.0.1:8000`
2. Pastikan `.env` backend memakai `APP_URL=http://127.0.0.1:8000`
3. Pastikan order dibuat memakai flow terbaru, karena callback Midtrans sekarang diarahkan ke backend
4. Jalankan Vite (`npm run dev`) lalu pastikan `FRONTEND_URL` backend sesuai (`http://localhost:5173`)

## Kalau status di Midtrans sukses tapi di app belum sukses

Cek ini:

1. Pastikan callback frontend `sync-client-result` terpanggil (dari `PaymentPage.jsx`)
2. Kalau user kembali lewat callback backend, route `/payment/success` sekarang juga punya fallback sinkron status
3. Webhook Midtrans ke `POST /api/midtrans/notifications` (untuk lokal perlu tunnel publik)
4. Atau refresh status dengan endpoint:
   - `POST /api/orders/{id}/refresh-payment-status`
5. Lihat tabel `payment_notifications`
6. Lihat kolom `midtrans_status` dan `payment_status` di tabel `orders`

## Ringkasan paling mudah

- React = tampilan
- Laravel = otak aplikasi
- MySQL = penyimpanan data
- Midtrans = pembayaran
- Admin page = alat kelola toko

Kalau ingin membaca backend mulai dari mana, urutan paling enak:

1. `backend/routes/api.php`
2. `backend/app/Http/Controllers/Api`
3. `backend/app/Services`
4. `backend/app/Models`
5. `backend/database/migrations`
