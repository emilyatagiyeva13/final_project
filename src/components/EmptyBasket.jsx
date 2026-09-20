import { ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../assets/scss/EmptyBasket.scss';
import { useTranslation } from 'react-i18next';

const EmptyBasket = () => {
  const { t } = useTranslation("common")
  return (
    <div className="empty-basket-container">
      <div className="empty-basket-content">
        <div className="icon-wrapper">
          <div className="icon-bg">
            <ShoppingBag className="basket-icon" size={48} />
          </div>
          <span className="badge-zero">0</span>
        </div>

        <h2 className="title">{t('basket.emptyBasket.header')}</h2>
        <p className="description">
          {t('basket.emptyBasket.content-1')}
        </p>

        <Link to="/shop" className="btn-start-shopping">
          <span>{t('basket.emptyBasket.start')}</span>
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
};

export default EmptyBasket;