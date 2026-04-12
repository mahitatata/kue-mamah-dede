import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Pesanan.css';
import { api } from './lib/api';
import { useApp } from './context/AppContext';
import { getOrderStatusLabel, getPaymentStatusLabel } from './lib/status';

const tabs = [
  { label: 'Semua', href: '/pesanan', filter: 'all' },
  { label: 'Dalam Proses', href: '/pesanan/proses', filter: 'processing' },
  { label: 'Dibatalkan', href: '/pesanan/dibatalkan', filter: 'cancelled' },
  { label: 'Selesai', href: '/pesanan/selesai', filter: 'completed' },
];

const badgeMap = {
  processing: { label: 'Dalam Proses', color: '#EF633E' },
  completed: { label: 'Pesanan Selesai', color: '#4CAF50' },
  cancelled: { label: 'Dibatalkan', color: '#7A1F1F' },
};

function OrdersPage({ filter = 'all' }) {
  const { token } = useApp();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadOrders() {
      try {
        setLoading(true);
        setError('');
        const response = await api.getOrders(token, filter);

        if (active) {
          setOrders(response);
        }
      } catch (requestError) {
        if (active) {
          setError(requestError.message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadOrders();

    return () => {
      active = false;
    };
  }, [filter, token]);

  return (
    <div className="pesanan-page-wrapper">
      <div className="pesanan-content">
        <h1 className="pesanan-title">Pesanan</h1>

        <div className="filter-group">
          {tabs.map((tab) => (
            <Link key={tab.href} to={tab.href} className={`filter-btn ${tab.filter === filter ? 'active' : ''}`}>
              {tab.label}
            </Link>
          ))}
        </div>

        {loading ? <p>Memuat pesanan...</p> : null}
        {error ? <p style={{ color: '#A12628', fontWeight: 700 }}>{error}</p> : null}

        {!loading && !orders.length ? (
          <p style={{ color: '#5D2A2A', fontWeight: 600 }}>Belum ada pesanan untuk filter ini.</p>
        ) : null}

        <div className="order-list">
          {orders.map((order) => {
            const firstItem = order.items[0];
            const badge = badgeMap[order.order_status] || badgeMap.processing;

            return (
              <div className="order-card" key={order.id}>
                <div className="order-info">
                  <img
                    src={firstItem?.product?.image_url || 'https://via.placeholder.com/100x80?text=Cake'}
                    alt={firstItem?.product_name || order.order_number}
                    className="order-img"
                  />
                  <div className="order-details">
                    <h3>{order.order_number}</h3>
                    <p>
                      {firstItem?.product_name} • {order.items.reduce((total, item) => total + item.quantity, 0)} item
                    </p>
                    <p>Rp {order.total_amount.toLocaleString('id-ID')}</p>
                    <span className="status-badge" style={{ backgroundColor: badge.color }}>
                      {badge.label}
                    </span>
                    <p style={{ marginTop: 8, fontSize: 12 }}>
                      Pembayaran: {order.payment_method === 'midtrans' ? 'Midtrans' : 'COD'} • {getPaymentStatusLabel(order.payment_status)}
                    </p>
                    <p style={{ marginTop: 4, fontSize: 12 }}>
                      Status Midtrans: {order.midtrans_status || '-'} • Status Pesanan: {getOrderStatusLabel(order.order_status)}
                    </p>
                  </div>
                </div>
                <div className="order-arrow">›</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default OrdersPage;
