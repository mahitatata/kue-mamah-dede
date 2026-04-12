import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import './PaymentPage.css';
import { api } from './lib/api';
import { useApp } from './context/AppContext';
import { getOrderStatusLabel, getPaymentStatusLabel } from './lib/status';

const copyMap = {
  success: {
    title: 'Pembayaran Sukses',
    description: 'Pesanan Anda sudah masuk dan pembayaran berhasil dikonfirmasi.',
  },
  pending: {
    title: 'Menunggu Pembayaran',
    description: 'Pesanan sudah dibuat. Selesaikan pembayaran Anda di Midtrans agar status berubah menjadi sukses.',
  },
  error: {
    title: 'Pembayaran Gagal',
    description: 'Pembayaran belum berhasil. Anda bisa cek kembali status pesanan dan ulangi pembayaran jika diperlukan.',
  },
};

function PaymentResultPage() {
  const { result } = useParams();
  const [searchParams] = useSearchParams();
  const { token } = useApp();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const orderId = searchParams.get('id');
  const copy = copyMap[result] || copyMap.pending;

  useEffect(() => {
    let active = true;

    async function loadOrder() {
      if (!orderId) {
        setLoading(false);
        return;
      }

      try {
        const response =
          result === 'success'
            ? await api.refreshPaymentStatus(token, orderId)
            : await api.getOrder(token, orderId);

        if (active) {
          setOrder(response);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadOrder();

    return () => {
      active = false;
    };
  }, [orderId, result, token]);

  return (
    <div className="payment-page-wrapper">
      <div className="payment-container" style={{ paddingTop: 100 }}>
        <div className="info-card" style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <h1 className="payment-title" style={{ marginTop: 0 }}>{copy.title}</h1>
          <p className="payment-subtitle" style={{ color: '#F3DDC4' }}>{copy.description}</p>

          {loading ? <p>Sedang mengambil status terbaru...</p> : null}

          {order ? (
            <div style={{ textAlign: 'left', marginTop: 24 }}>
              <p><strong>No. Pesanan:</strong> {order.order_number}</p>
              <p><strong>Status Pesanan:</strong> {getOrderStatusLabel(order.order_status)}</p>
              <p><strong>Status Pembayaran:</strong> {getPaymentStatusLabel(order.payment_status)}</p>
              <p><strong>Status Midtrans:</strong> {order.midtrans_status || '-'}</p>
              <p><strong>Tipe Pembayaran Midtrans:</strong> {order.midtrans_payment_type || '-'}</p>
              <p><strong>Total:</strong> Rp {order.total_amount.toLocaleString('id-ID')}</p>
            </div>
          ) : null}

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 24, flexWrap: 'wrap' }}>
            <Link className="order-button" style={{ maxWidth: 260, textAlign: 'center', textDecoration: 'none' }} to="/pesanan">
              Lihat Pesanan
            </Link>
            <Link className="result-secondary-button" to="/">
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentResultPage;
