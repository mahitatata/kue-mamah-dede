import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Footer from './Footer';
import './MenuPage.css';
import { useApp } from './context/AppContext';
import { api } from './lib/api';

function ProductPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, addToCart } = useApp();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadProduct() {
      try {
        setLoading(true);
        const response = await api.getProduct(slug);

        if (active) {
          setProduct(response);
          setQuantity(1);
          setFeedback('');
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

    loadProduct();

    return () => {
      active = false;
    };
  }, [slug]);

  async function handleAddToCart() {
    if (!user) {
      navigate('/login', {
        state: { redirectTo: location.pathname },
      });
      return;
    }

    try {
      setSubmitting(true);
      const response = await addToCart({
        product_id: product.id,
        quantity,
      });
      setFeedback(response.message);
    } catch (error) {
      setFeedback(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="menu-page-wrapper">
        <div className="menu-container">
          <h1 className="main-title">Memuat produk...</h1>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="menu-page-wrapper">
        <div className="menu-container">
          <h1 className="main-title">Produk tidak ditemukan</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="menu-page-wrapper">
      <div className="menu-container">
        <h1 className="main-title">
          Menu <span className="separator">|</span> <span className="category-name">{product.category}</span>
        </h1>

        <div className="product-detail-section">
          <div className="detail-left">
            <div className="image-white-box">
              <img src={product.image_url} alt={product.name} />
            </div>
          </div>

          <div className="detail-right">
            <h2 className="detail-name">{product.name}</h2>
            <div className="detail-desc">
              <p>{product.description}</p>
              <p>
                <strong>Estimasi PO:</strong> {product.preorder_estimate}
              </p>
              <p>
                <strong>Maks. pemesanan:</strong> {product.max_order} pcs
              </p>
            </div>

            <h3 className="detail-price">Rp {product.price.toLocaleString('id-ID')}</h3>

            <div className="action-row">
              <div className="quantity-picker">
                <button onClick={() => setQuantity((current) => Math.max(1, current - 1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity((current) => Math.min(product.max_order, current + 1))}>+</button>
              </div>

              <button className="buy-button" onClick={handleAddToCart} disabled={submitting}>
                {submitting ? 'Menambahkan...' : 'Tambah ke Keranjang'}
              </button>
            </div>

            {feedback ? (
              <p style={{ color: '#A12628', fontWeight: 600, marginTop: 16 }}>
                {feedback}
              </p>
            ) : null}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ProductPage;
