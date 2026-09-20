import { Link, NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import '../assets/scss/Basket.scss';
import useCartStore from '../store/useCartStore';
import { useEffect } from 'react';
import Loader from '../components/Loader';
import EmptyBasket from '../components/EmptyBasket';
import { useLocalize } from '../components/hooks/useLocalise';
import { useTranslation } from 'react-i18next';

const Basket = () => {
  const { t } = useTranslation("common");
  const { localize } = useLocalize();
  const { items = [], updateQuantity, removeItem, totalPrice, loading, fetchBasket } = useCartStore();

  useEffect(() => {
    fetchBasket();
  }, [fetchBasket]);

  const handleIncrease = async (item) => {
    await updateQuantity(item.id, item.quantity + 1);
    toast.success(t('basket.increaseAlert'));
  };

  const handleDecrease = async (item) => {
    if (item.quantity <= 1) return;
    await updateQuantity(item.id, item.quantity - 1);
    toast.info(t('basket.decreaseAlert'));
  };

  const handleRemove = async (item) => {
    const result = await Swal.fire({
      title: t('basket.removeConfirmTitle'),
      text: `"${localize(item, 'title')}" ${t('basket.removeConfirmText')}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#306D36',
      cancelButtonColor: '#6b7280',
      confirmButtonText: t('basket.confirmBtn'),
      cancelButtonText: t('basket.cancelBtn'),
    });

    if (!result.isConfirmed) return;

    await removeItem(item.id);

    const stillInBasket = useCartStore.getState().items.some((i) => i.id === item.id);
    if (stillInBasket) {
      toast.error(t('basket.removeError'));
    } else {
      toast.error(t('basket.removeSuccess'));
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

  const subTotal = totalPrice();
  const shippingCost = 2.00; 
  const finalTotal = subTotal + shippingCost;
  const totalItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="basket-page">
      <div className="basket-page__header">
        <div className="basket-page__title-wrapper">
          <h1 className="basket-page__title">{t('basket.header')}</h1>
          {items.length > 0 && (
            <span className="basket-count-badge">
              {t('basket.total')}: <span>{totalItemsCount} {t('basket.productCount')}</span>
            </span>
          )}
        </div>
        <Link to="/shop" className="basket-page__shop-btn">
          {t('basket.shopBtn')}
        </Link>
      </div>

      <div className="basket-page__content-grid">
        <div className="basket-page__list">
          {items.map((item) => (
            <div className="basket-item" key={item.id}>
              <img
                className="basket-item__image"
                src={item.image}
                alt={localize(item, 'title')}
              />

              <div className="basket-item__info">
                <h3 className="basket-item__title">{localize(item, 'title')}</h3>
                <span className="basket-item__price">{item.price} $</span>
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
                {(item.price * item.quantity).toFixed(2)} $
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

        <div className="basket-summary-card">
          <h3>{t('basket.summaryTitle')}</h3>
          
          <div className="summary-row">
            <span>{t('basket.subtotal')}</span>
            <span>{subTotal.toFixed(2)} $</span>
          </div>

          <div className="summary-row">
            <span>{t('basket.shipping')}</span>
            <span>{shippingCost.toFixed(2)} $</span>
          </div>

          <div className="summary-divider"></div>

          <div className="summary-row total-row">
            <span>{t('basket.finalTotal')}</span>
            <span className="basket-page__summary-total">{finalTotal.toFixed(2)} $</span>
          </div>

          <button className="basket-page__checkout-btn">
            <NavLink className="nav-link" to="/checkout">{t('basket.checkout')}</NavLink>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Basket;