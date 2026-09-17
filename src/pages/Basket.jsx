import { Link } from 'react-router-dom';
import useCartStore from '../store/useCartStore';
import '../assets/scss/Basket.scss';

const Basket = () => {
  const { items, updateQuantity, removeItem, totalPrice, loading } = useCartStore();

  if (loading) {
    return <div className="basket-page basket-page--loading">Yüklənir...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="basket-page basket-page--empty">
        <h2>Basketiniz boşdur</h2>
        <p>Görünür hələ heç bir kitab əlavə etməmisiniz.</p>
        <Link to="/shop" className="basket-page__shop-btn">
          Şopa keç
        </Link>
      </div>
    );
  }

  return (
    <div className="basket-page">
      <h1 className="basket-page__title">Basket</h1>

      <div className="basket-page__list">
        {items.map((item) => (
          <div className="basket-item" key={item.id}>
            <img
              className="basket-item__image"
              src={item.image}
              alt={item.title}
            />

            <div className="basket-item__info">
              <h3 className="basket-item__title">{item.title}</h3>
              <span className="basket-item__price">{item.price} ₼</span>
            </div>

            <div className="basket-item__quantity">
              <button
                className="basket-item__qty-btn"
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                aria-label="Azalt"
              >
                −
              </button>
              <span className="basket-item__qty-value">{item.quantity}</span>
              <button
                className="basket-item__qty-btn"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                disabled={item.stock != null && item.quantity >= item.stock}
                aria-label="Artır"
              >
                +
              </button>
            </div>

            <div className="basket-item__subtotal">
              {(item.price * item.quantity).toFixed(2)} ₼
            </div>

            <button
              className="basket-item__remove"
              onClick={() => removeItem(item.id)}
              aria-label="Sil"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="basket-page__summary">
        <span className="basket-page__summary-label">Ümumi:</span>
        <span className="basket-page__summary-total">
          {totalPrice().toFixed(2)} ₼
        </span>
        <button className="basket-page__checkout-btn">Sifarişi tamamla</button>
      </div>
    </div>
  );
};

export default Basket;