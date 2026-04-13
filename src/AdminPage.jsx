import { useEffect, useState } from 'react';
import './AdminPage.css';
import { api } from './lib/api';
import { useApp } from './context/AppContext';
import { getOrderStatusLabel, getPaymentStatusLabel } from './lib/status';

const initialForm = {
  name: '',
  slug: '',
  category: '',
  description: '',
  price: '',
  preorder_estimate: '',
  max_order: '',
  is_active: true,
  image: null,
};

const CATEGORIES = [
  'Portion Cake',
  'Cupcake',
  'Whole Cake',
  'Strawberry Pancake',
  'Tiramisu Cake',
  'Cheesecake',
];

function AdminPage() {
  const { token } = useApp();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingSlug, setEditingSlug] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);

  async function loadDashboard() {
    const [productsResponse, ordersResponse] = await Promise.all([
      api.getAdminProducts(token),
      api.getAdminOrders(token),
    ]);

    setProducts(productsResponse);
    setOrders(ordersResponse);
  }

  useEffect(() => {
    let active = true;

    async function bootstrap() {
      try {
        setLoading(true);
        const [productsResponse, ordersResponse] = await Promise.all([
          api.getAdminProducts(token),
          api.getAdminOrders(token),
        ]);

        if (active) {
          setProducts(productsResponse);
          setOrders(ordersResponse);
        }
      } catch (error) {
        if (active) {
          setFeedback(error.message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    bootstrap();

    return () => {
      active = false;
    };
  }, [token]);

  function handleChange(event) {
    const { name, value, type, checked, files } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : files ? files[0] : value,
    }));
  }

  function startEdit(product) {
    setEditingSlug(product.slug);
    setForm({
      name: product.name,
      slug: product.slug,
      category: product.category,
      description: product.description,
      price: String(product.price),
      preorder_estimate: product.preorder_estimate,
      max_order: String(product.max_order),
      is_active: product.is_active,
      image: null,
    });
    setFeedback('');
  }

  function resetForm() {
    setEditingSlug(null);
    setForm(initialForm);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const payload = new FormData();
    payload.append('name', form.name);
    payload.append('slug', form.slug);
    payload.append('category', form.category);
    payload.append('description', form.description);
    payload.append('price', form.price);
    payload.append('preorder_estimate', form.preorder_estimate);
    payload.append('max_order', form.max_order);
    payload.append('is_active', form.is_active ? '1' : '0');

    if (form.image) {
      payload.append('image', form.image);
    }

    try {
      setFeedback(editingSlug ? 'Menyimpan perubahan...' : 'Membuat produk...');

      if (editingSlug) {
        await api.updateAdminProduct(token, editingSlug, payload);
      } else {
        await api.createAdminProduct(token, payload);
      }

      await loadDashboard();
      resetForm();
      setFeedback('Produk berhasil disimpan.');
    } catch (error) {
      setFeedback(error.message);
    }
  }

  async function handleDelete(slug) {
    const confirmed = window.confirm('Hapus produk ini?');

    if (!confirmed) {
      return;
    }

    try {
      await api.deleteAdminProduct(token, slug);
      await loadDashboard();
      setFeedback('Produk berhasil dihapus.');
    } catch (error) {
      setFeedback(error.message);
    }
  }

  async function handleOrderStatus(orderId, orderStatus) {
    try {
      await api.updateAdminOrderStatus(token, orderId, orderStatus);
      await loadDashboard();
      setFeedback('Status pesanan diperbarui.');
    } catch (error) {
      setFeedback(error.message);
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-shell">
        <div className="admin-hero">
          <div className="admin-hero-brand">CakeTime Admin</div>
          <div className="admin-hero-copy">
            <h1>Kelola toko dari backend</h1>
            <p>Produk, foto, status pesanan, dan hasil Midtrans dipantau dari satu dashboard dengan tema yang selaras dengan frontend.</p>
          </div>
          <div className="admin-stats">
            <div className="admin-stat">
              <span>Total Produk</span>
              <strong>{products.length}</strong>
            </div>
            <div className="admin-stat">
              <span>Total Pesanan</span>
              <strong>{orders.length}</strong>
            </div>
          </div>
        </div>

        <div className="admin-panel">
          <h2>Form Produk</h2>
          <p>Tambah produk baru, edit produk lama, aktif/nonaktifkan katalog, dan upload foto dari sini.</p>
          {feedback ? <p className="admin-feedback">{feedback}</p> : null}

          <form className="admin-form" onSubmit={handleSubmit}>
            <input name="name" placeholder="Nama produk" value={form.name} onChange={handleChange} required />
            <input name="slug" placeholder="Slug URL" value={form.slug} onChange={handleChange} />
            
            <select name="category" value={form.category} onChange={handleChange} required style={{
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              fontSize: '14px',
              width: '100%',
              boxSizing: 'border-box',
            }}>
              <option value="">Pilih Kategori</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            
            <textarea
              name="description"
              placeholder="Deskripsi produk"
              value={form.description}
              onChange={handleChange}
              required
              rows="4"
            />
            <input name="price" placeholder="Harga" type="number" value={form.price} onChange={handleChange} required />
            <input
              name="preorder_estimate"
              placeholder="Estimasi pre-order"
              value={form.preorder_estimate}
              onChange={handleChange}
              required
            />
            <input
              name="max_order"
              placeholder="Maksimum order"
              type="number"
              value={form.max_order}
              onChange={handleChange}
              required
            />
            <label className="admin-checkbox">
              <input name="is_active" type="checkbox" checked={form.is_active} onChange={handleChange} />
              Produk aktif
            </label>
            <input name="image" type="file" accept="image/*" onChange={handleChange} />

            <div className="admin-actions">
              <button type="submit">{editingSlug ? 'Update Produk' : 'Tambah Produk'}</button>
              {editingSlug ? (
                <button type="button" className="ghost-button" onClick={resetForm}>
                  Batal Edit
                </button>
              ) : null}
            </div>
          </form>
        </div>

        <div className="admin-grid">
          <section className="admin-card">
            <h2>Produk</h2>
            {loading ? <p>Memuat data...</p> : null}
            <div className="admin-list">
              {products.map((product) => (
                <div className="admin-item" key={product.id}>
                  <img src={product.image_url} alt={product.name} />
                  <div>
                    <h3>{product.name}</h3>
                    <p>{product.category}</p>
                    <p>Rp {product.price.toLocaleString('id-ID')}</p>
                  </div>
                  <div className="admin-item-actions">
                    <button onClick={() => startEdit(product)}>Edit</button>
                    <button className="danger-button" onClick={() => handleDelete(product.slug)}>Hapus</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="admin-card">
            <h2>Pesanan</h2>
            <div className="admin-list">
              {orders.map((order) => (
                <div className="admin-item admin-item-order" key={order.id}>
                  <div>
                    <h3>{order.order_number}</h3>
                    <p>{order.customer_name}</p>
                    <p>{order.payment_method.toUpperCase()} • {getPaymentStatusLabel(order.payment_status)}</p>
                    <p>Midtrans: {order.midtrans_status || '-'}</p>
                    <p>Status Pesanan: {getOrderStatusLabel(order.order_status)}</p>
                    <p>Rp {order.total_amount.toLocaleString('id-ID')}</p>
                  </div>

                  <select
                    value={order.order_status}
                    onChange={(event) => handleOrderStatus(order.id, event.target.value)}
                  >
                    <option value="processing">processing</option>
                    <option value="completed">completed</option>
                    <option value="cancelled">cancelled</option>
                  </select>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
