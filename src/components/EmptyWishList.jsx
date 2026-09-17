import { Heart, ShoppingBag} from 'lucide-react';
import { Link } from 'react-router-dom';
import '../assets/scss/EmptyWishlist.scss';

const EmptyWishlist = () => {


  return (
    <div className="empty-wishlist-container">
      <div className="empty-wishlist-content">
        {/* İkon Vizuallığı */}
        <div className="icon-wrapper">
          <div className="icon-bg">
            <Heart className="heart-icon" size={48} />
          </div>
          <span className="badge-zero">0</span>
        </div>

        <h2 className="title">Your Wishlist is Empty</h2>
        <p className="description">
          You haven't saved any books to your wishlist yet. Explore our collection and add your favorite stories to read later!
        </p>

        <Link to="/shop" className="btn-start-shopping">
          <ShoppingBag size={18} />
          <span>Start Shopping</span>
        </Link>

      </div>
    </div>
  );
};

export default EmptyWishlist;