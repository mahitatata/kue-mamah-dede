# Dokumentasi Backend Pemula

Dokumentasi utama backend ada di [dokumentasi.md](./dokumentasi.md).

Ringkasan cepat:

- Backend: Laravel di folder `backend/`
- Frontend: React/Vite di folder `src/`
- Admin login:
  - Email: `admin@gmail.com`
  - Password: `123456`
- Midtrans sandbox:
  - Merchant ID: `YOUR_MERCHANT_ID`
  - Client Key: `Mid-client-REPLACE_ME`
  - Server Key: `Mid-server-REPLACE_ME`

Jalankan:

```bash
php backend/artisan storage:link
php backend/artisan migrate:fresh --seed
php backend/artisan serve --host=127.0.0.1 --port=8000
npm run dev
```
