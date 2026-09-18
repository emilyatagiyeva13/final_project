import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import '../assets/scss/Basket.scss';
import useCartStore from '../store/useCartStore';
import { useEffect } from 'react';
import Loader from '../components/Loader';
import EmptyBasket from '../components/EmptyBasket';

const Basket = () => {
  const { items = [], updateQuantity, removeItem, totalPrice, loading, fetchBasket } = useCartStore();

  useEffect(() => {
    fetchBasket();
  }, [fetchBasket]);

  const handleIncrease = async (item) => {
    await updateQuantity(item.id, item.quantity + 1);
    toast.success('Məhsulun sayı artırıldı');
  };

  const handleDecrease = async (item) => {
    if (item.quantity <= 1) return;
    await updateQuantity(item.id, item.quantity - 1);
    toast.info('Məhsulun sayı azaldıldı');
  };

  const handleRemove = async (item) => {
    const result = await Swal.fire({
      title: 'Əminsiniz?',
      text: `"${item.title}" səbətdən silinsin?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#306D36',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Bəli, sil',
      cancelButtonText: 'Ləğv et',
    });

    if (!result.isConfirmed) return;

    await removeItem(item.id);

    // removeItem xəta olarsa məhsulu geri qaytarır, ona görə yoxlayırıq
    const stillInBasket = useCartStore.getState().items.some((i) => i.id === item.id);
    if (stillInBasket) {
      toast.error('Məhsulu silmək mümkün olmadı');
    } else {
      toast.error('Məhsul səbətdən silindi');
    }
  };

  if (loading) {
    return <div className="basket-page basket-page--loading"><Loader /></div>;
  }

  if (items.length === 0) {
    return (
      <div className="basket-page basket-page--empty">
        <EmptyBasket />
      </div>
    );
  }

  return (
    <div className="basket-page">
      <div className="basket-page__header">
        <h1 className="basket-page__title">Basket</h1>
        <Link to="/shop" className="basket-page__shop-btn">
          Shop
        </Link>
      </div>

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
                onClick={() => handleDecrease(item)}
                disabled={item.quantity <= 1}
                aria-label="Azalt"
              >
                −
              </button>
              <span className="basket-item__qty-value">{item.quantity}</span>
              <button
                className="basket-item__qty-btn"
                onClick={() => handleIncrease(item)}
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
              onClick={() => handleRemove(item)}
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