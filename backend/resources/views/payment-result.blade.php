@php
    $copy = [
        'success' => [
            'title' => 'Pembayaran Sukses',
            'description' => 'Pembayaran Anda berhasil diproses. Status pesanan sudah kami sinkronkan dari Midtrans.',
            'accent' => '#4CAF50',
        ],
        'pending' => [
            'title' => 'Pembayaran Menunggu',
            'description' => 'Pesanan sudah dibuat, tetapi pembayaran masih menunggu penyelesaian di Midtrans.',
            'accent' => '#EF633E',
        ],
        'error' => [
            'title' => 'Pembayaran Gagal',
            'description' => 'Pembayaran belum berhasil. Silakan cek ulang status pesanan Anda.',
            'accent' => '#7A1F1F',
        ],
    ][$result] ?? [
        'title' => 'Status Pembayaran',
        'description' => 'Status pembayaran Anda sedang diperiksa.',
        'accent' => '#A12628',
    ];

    $paymentLabel = match($order?->payment_status) {
        'paid' => 'Sukses',
        'pending' => 'Pending',
        'failed' => 'Gagal',
        'expired' => 'Kedaluwarsa',
        'cancelled' => 'Dibatalkan',
        default => '-',
    };

    $orderLabel = match($order?->order_status) {
        'processing' => 'Dalam Proses',
        'completed' => 'Selesai',
        'cancelled' => 'Dibatalkan',
        default => '-',
    };
@endphp
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $copy['title'] }} - CakeTime</title>
    <style>
        body {
            margin: 0;
            font-family: "Poppins", Arial, sans-serif;
            background: #F3DDC4;
            color: #5D2A2A;
        }
        .page {
            min-height: 100vh;
            padding: 48px 20px;
            box-sizing: border-box;
        }
        .shell {
            max-width: 980px;
            margin: 0 auto;
        }
        .brand {
            background: #A12628;
            color: #F3DDC4;
            border-radius: 999px;
            text-align: center;
            padding: 18px 24px;
            font-size: 42px;
            font-weight: 800;
            letter-spacing: 1px;
            margin-bottom: 28px;
            box-shadow: 0 12px 28px rgba(93, 42, 42, 0.12);
        }
        .card {
            background: #fffaf5;
            border-radius: 30px;
            padding: 34px;
            box-shadow: 0 20px 40px rgba(93, 42, 42, 0.10);
            border: 2px solid rgba(161, 38, 40, 0.08);
        }
        .status-pill {
            display: inline-block;
            background: {{ $copy['accent'] }};
            color: white;
            padding: 10px 18px;
            border-radius: 999px;
            font-weight: 700;
            margin-bottom: 18px;
        }
        h1 {
            color: #A12628;
            margin: 0 0 10px;
            font-size: 38px;
        }
        .lead {
            margin: 0 0 28px;
            font-size: 17px;
            line-height: 1.7;
        }
        .grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 20px;
            margin-top: 24px;
        }
        .info {
            background: #F3DDC4;
            border-radius: 22px;
            padding: 20px;
        }
        .label {
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            opacity: 0.7;
            margin-bottom: 6px;
        }
        .value {
            font-size: 20px;
            font-weight: 700;
        }
        .actions {
            display: flex;
            gap: 14px;
            flex-wrap: wrap;
            margin-top: 28px;
        }
        .button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 999px;
            padding: 14px 22px;
            font-weight: 700;
            text-decoration: none;
        }
        .button-primary {
            background: #1A0D0D;
            color: #F3DDC4;
        }
        .button-secondary {
            background: #A12628;
            color: #F3DDC4;
        }
        .note {
            margin-top: 20px;
            font-size: 14px;
            opacity: 0.85;
        }
        @media (max-width: 768px) {
            .brand {
                font-size: 30px;
            }
            .card {
                padding: 24px;
            }
            .grid {
                grid-template-columns: 1fr;
            }
            h1 {
                font-size: 30px;
            }
        }
    </style>
</head>
<body>
    <div class="page">
        <div class="shell">
            <div class="brand">CakeTime</div>

            <div class="card">
                <span class="status-pill">{{ $copy['title'] }}</span>
                <h1>{{ $copy['title'] }}</h1>
                <p class="lead">{{ $copy['description'] }}</p>

                @if ($order)
                    <div class="grid">
                        <div class="info">
                            <div class="label">No. Pesanan</div>
                            <div class="value">{{ $order->order_number }}</div>
                        </div>
                        <div class="info">
                            <div class="label">Total</div>
                            <div class="value">Rp {{ number_format($order->total_amount, 0, ',', '.') }}</div>
                        </div>
                        <div class="info">
                            <div class="label">Status Pembayaran</div>
                            <div class="value">{{ $paymentLabel }}</div>
                        </div>
                        <div class="info">
                            <div class="label">Status Midtrans</div>
                            <div class="value">{{ $order->midtrans_status ?? '-' }}</div>
                        </div>
                        <div class="info">
                            <div class="label">Metode</div>
                            <div class="value">{{ strtoupper($order->payment_method) }}</div>
                        </div>
                        <div class="info">
                            <div class="label">Status Pesanan</div>
                            <div class="value">{{ $orderLabel }}</div>
                        </div>
                    </div>
                @else
                    <div class="info">
                        Data pesanan tidak ditemukan. Pastikan parameter order yang dikirim dari Midtrans valid.
                    </div>
                @endif

                <div class="actions">
                    <a class="button button-primary" href="{{ url('/go-frontend/pesanan') }}">Buka Halaman Pesanan</a>
                    <a class="button button-secondary" href="{{ url('/go-frontend') }}">Kembali ke Beranda</a>
                </div>

                <p class="note">
                    Halaman ini disediakan oleh backend Laravel agar callback Midtrans tetap menampilkan hasil pembayaran. Jika frontend belum aktif, sistem akan menampilkan petunjuk menjalankan frontend terlebih dahulu.
                </p>
            </div>
        </div>
    </div>
</body>
</html>
