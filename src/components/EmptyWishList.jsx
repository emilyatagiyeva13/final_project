import { Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../assets/scss/EmptyWishList.scss';
import { useTranslation } from 'react-i18next';

const EmptyWishlist = () => {

  const { t } = useTranslation('common')


  return (
    <div className="empty-wishlist-container">
      <div className="empty-wishlist-content">
        <div className="icon-wrapper">
          <div className="icon-bg">
            <Heart className="heart-icon" size={48} />
          </div>
          <span className="badge-zero">0</span>
        </div>

        <h2 className="title">{t('wishlist.emptyWishList.header')}</h2>
        <p className="description">
          {t('wishlist.emptyWishList.content-1')}
        </p>

        <Link to="/shop" className="btn-start-shopping">
          <ShoppingBag size={18} />
          <span>{t('wishlist.emptyWishList.start')}</span>
        </Link>

      </div>
    </div>
  );
};

export default EmptyWishlist;