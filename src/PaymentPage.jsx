import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PaymentPage.css';
import { api } from './lib/api';
import { useApp } from './context/AppContext';

const MIDTRANS_SCRIPT_URL = 'https://app.sandbox.midtrans.com/snap/snap.js';

function loadSnap(clientKey) {
  return new Promise((resolve, reject) => {
    const existingScript = document.querySelector('script[data-midtrans-snap]');

    if (existingScript) {
      existingScript.setAttribute('data-client-key', clientKey);
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = MIDTRANS_SCRIPT_URL;
    script.setAttribute('data-client-key', clientKey);
    script.setAttribute('data-midtrans-snap', 'true');
    script.onload = resolve;
    script.onerror = () => reject(new Error('Gagal memuat Midtrans Snap.'));
    document.body.appendChild(script);
  });
}

function PaymentPage() {
  const navigate = useNavigate();
  const { token, user, cart, refreshCart } = useApp();
  const [paymentMethod, setPaymentMethod] = useState('midtrans');
  const [form, setForm] = useState({
    customer_name: user?.name || '',
    phone: '',
    address: '',
  });
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function syncClientResult(orderId, result) {
    try {
      await api.syncPaymentClientResult(token, orderId, result);
    } catch {
      // Ignore sync error here; the user can still open payment result page and refresh status later.
    }
  }

  useEffect(() => {
    setForm((current) => ({
      ...current,
      customer_name: user?.name || '',
    }));
  }, [user]);

  async function handleCheckout() {
    try {
      setSubmitting(true);
      setFeedback('');

      const response = await api.checkout(token, {
        ...form,
        payment_method: paymentMethod,
      });

      await refreshCart();

      if (paymentMethod === 'cod') {
        navigate(`/payment/success?id=${response.order.id}&method=cod`);
        return;
      }

      await loadSnap(response.payment.client_key);

      window.snap.pay(response.payment.snap_token, {
        onSuccess: async (result) => {
          await syncClientResult(response.order.id, result);
          navigate(`/payment/success?id=${response.order.id}&order=${response.order.order_number}`);
        },
        onPending: async (result) => {
          await syncClientResult(response.order.id, result);
          navigate(`/payment/pending?id=${response.order.id}&order=${response.order.order_number}`);
        },
        onError: async (result) => {
          await syncClientResult(response.order.id, result);
          navigate(`/payment/error?id=${response.order.id}&order=${response.order.order_number}`);
        },
        onClose: () => {
          setFeedback('Popup Midtrans ditutup sebelum pembayaran selesai.');
        },
      });
    } catch (error) {
      setFeedback(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="payment-page-wrapper">
      <div className="payment-container">
        <h1 className="payment-title">Selesaikan Pemesanan Anda</h1>
        <p className="payment-subtitle">Tinjau barang anda dan pilih metode pembayaran yang diinginkan.</p>

        <div className="payment-grid">
          <div className="payment-left-column">
            <div className="info-card">
              <h3 className="card-header">Alamat Pengiriman</h3>
              <div className="input-field">
                <input
                  type="text"
                  placeholder="Nama Lengkap"
                  value={form.customer_name}
                  onChange={(event) => setForm((current) => ({ ...current, customer_name: event.target.value }))}
                />
              </div>
              <div className="input-field">
                <input
                  type="text"
                  placeholder="No. Telp"
                  value={form.phone}
                  onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                />
              </div>
              <div className="input-field">
                <textarea
                  placeholder="Alamat Lengkap"
                  rows="3"
                  value={form.address}
                  onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))}
                ></textarea>
              </div>
            </div>

            <div className="info-card">
              <h3 className="card-header">Metode Pembayaran</h3>
              <div className="payment-options">
                <div
                  className={`method-box ${paymentMethod === 'cod' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('cod')}
                >
                  <span className="method-title">COD</span>
                  <span className="method-desc">Cash On Delivery</span>
                </div>
                <div
                  className={`method-box ${paymentMethod === 'midtrans' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('midtrans')}
                >
                  <span className="method-title">Midtrans</span>
                  <span className="method-desc">Pembayaran Online</span>
                </div>
              </div>
            </div>

            {feedback ? <p style={{ color: '#A12628', fontWeight: 700 }}>{feedback}</p> : null}
          </div>

          <div className="payment-right-column">
            <div className="info-card summary-card">
              <h3 className="card-header">Ringkasan Pesanan</h3>

              {cart.items.map((item) => (
                <div className="summary-item" key={item.id}>
                  <span>{item.product.name} x{item.quantity}</span>
                  <span>Rp {item.line_total.toLocaleString('id-ID')}</span>
                </div>
              ))}

              <hr className="summary-divider" />

              <div className="summary-row">
                <span>Subtotal</span>
                <span>Rp {cart.subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="summary-row">
                <span>Pengiriman</span>
                <span>Rp 15.000</span>
              </div>

              <div className="summary-total">
                <span>TOTAL</span>
                <span>Rp {(cart.subtotal + 15000).toLocaleString('id-ID')}</span>
              </div>

              <button className="order-button" onClick={handleCheckout} disabled={submitting || !cart.items.length}>
                {submitting ? 'Memproses...' : 'Lakukan Pemesanan'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;
