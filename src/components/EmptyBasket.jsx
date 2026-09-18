import { ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../assets/scss/EmptyBasket.scss';

const EmptyBasket = () => {
  return (
    <div className="empty-basket-container">
      <div className="empty-basket-content">
        <div className="icon-wrapper">
          <div className="icon-bg">
            <ShoppingBag className="basket-icon" size={48} />
          </div>
          <span className="badge-zero">0</span>
        </div>

        <h2 className="title">Your Cart is Empty</h2>
        <p className="description">
          You haven't added any books to your shopping cart yet. Discover our latest arrivals and fill your shelf with great reads!
        </p>

        <Link to="/shop" className="btn-start-shopping">
          <span>Explore Shop</span>
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
};

export default EmptyBasket;