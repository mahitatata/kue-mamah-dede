import { Link, useNavigate } from 'react-router-dom';
import './Keranjang.css';
import { useApp } from './context/AppContext';

function KeranjangPage() {
  const navigate = useNavigate();
  const { cart, updateCartItem, removeCartItem } = useApp();

  async function handleQuantity(cartItem, nextQuantity) {
    if (nextQuantity < 1) {
      return;
    }

    await updateCartItem(cartItem.id, { quantity: nextQuantity });
  }

  if (!cart.items.length) {
    return (
      <div className="keranjang-page-wrapper">
        <div className="keranjang-content">
          <h1 className="keranjang-title">Keranjang</h1>
          <p className="empty-cart-text">Keranjang masih kosong. Tambahkan produk dulu dari halaman menu.</p>
          <Link to="/" className="buy-now-btn">Lihat Menu</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="keranjang-page-wrapper">
      <div className="keranjang-content">
        <h1 className="keranjang-title">Keranjang</h1>

        <div className="cart-list">
          {cart.items.map((item) => (
            <div className="cart-card" key={item.id}>
              <div className="cart-info">
                <img src={item.product.image_url} alt={item.product.name} className="cart-img" />
                <div className="cart-details">
                  <h3>{item.product.name}</h3>
                  <p>Rp {item.product.price.toLocaleString('id-ID')}</p>
                  <button className="delete-btn" onClick={() => removeCartItem(item.id)}>Hapus</button>
                </div>
              </div>

              <div className="cart-actions">
                <div className="quantity-control">
                  <button className="qty-btn" onClick={() => handleQuantity(item, item.quantity - 1)}>-</button>
                  <span className="qty-number">{item.quantity}</span>
                  <button className="qty-btn" onClick={() => handleQuantity(item, item.quantity + 1)}>+</button>
                </div>
                <button className="buy-now-btn" onClick={() => navigate('/payment')}>Checkout</button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary-bar">
          <strong>Total Item: {cart.count}</strong>
          <strong>Subtotal: Rp {cart.subtotal.toLocaleString('id-ID')}</strong>
        </div>
      </div>
    </div>
  );
}

export default KeranjangPage;
