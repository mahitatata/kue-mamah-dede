<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Frontend Belum Jalan - CakeTime</title>
    <style>
        body {
            margin: 0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #F3DDC4;
            color: #5D2A2A;
            font-family: "Poppins", Arial, sans-serif;
            padding: 24px;
            box-sizing: border-box;
        }
        .card {
            max-width: 680px;
            width: 100%;
            background: #fffaf5;
            border-radius: 30px;
            border: 2px solid rgba(161, 38, 40, 0.1);
            box-shadow: 0 20px 36px rgba(93, 42, 42, 0.1);
            padding: 30px;
        }
        .badge {
            display: inline-block;
            background: #A12628;
            color: #F3DDC4;
            border-radius: 999px;
            padding: 8px 14px;
            font-weight: 700;
            margin-bottom: 14px;
        }
        h1 {
            color: #A12628;
            margin: 0 0 8px;
        }
        p {
            line-height: 1.65;
        }
        code {
            background: #EBD9B4;
            border-radius: 8px;
            padding: 2px 6px;
        }
        .cta {
            display: inline-block;
            margin-top: 16px;
            text-decoration: none;
            border-radius: 999px;
            padding: 12px 18px;
            background: #1A0D0D;
            color: #F3DDC4;
            font-weight: 700;
        }
    </style>
</head>
<body>
    <div class="card">
        <span class="badge">CakeTime</span>
        <h1>Frontend belum aktif</h1>
        <p>Tujuan <code>{{ $path }}</code> tidak bisa dibuka karena server frontend di <code>{{ $frontendUrl }}</code> belum berjalan.</p>
        <p>Jalankan frontend dengan perintah <code>npm run dev</code>, lalu buka lagi link ini:</p>
        <p><code>{{ $targetUrl }}</code></p>
        <a class="cta" href="{{ url('/payment/success') }}">Kembali ke halaman pembayaran backend</a>
    </div>
</body>
</html>
