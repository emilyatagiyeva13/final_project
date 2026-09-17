import "../assets/scss/SingleCard.scss";
import { MdAddShoppingCart } from "react-icons/md";
import { FaHeart, FaRegHeart, FaStar } from "react-icons/fa";
import { GrView } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import { useWishlistStore } from "../store/useWishlistStore";
import { useAuthStore } from "../store/authStore";
import useCartStore from "../store/useCartStore";

const SingleCard = ({ id, image_url, title_az, author, price, rating = 0, description_az, viewMode = "grid" }) => {
    const navigate = useNavigate();
    const fullStars = Math.round(rating);

    const isInWishlist = useWishlistStore((state) => state.isInWishlist(id));
    const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
    const user = useAuthStore((state) => state.user);
    const addItem = useCartStore((state) => state.addItem);

    const handleAddToCart = (e) => {
        e.stopPropagation();
        if (!user) {
            navigate("/login");
            return;
        }
        addItem({ id, title_az, price, image_url });
    };

    const handleWishlistClick = (e) => {
        e.stopPropagation();
        if (!user) {
            navigate("/login");
            return;
        }
        toggleWishlist(id);
    };

    return (
        <div
            className={`book-card ${viewMode === "list" ? "book-card-list" : ""}`}
            data-aos="fade-up"
            onClick={() => navigate(`/shop/${id}`)}
        >
            <div className="d-flex view-heart-col">
                <button
                    className="card-hover-heart"
                    onClick={handleWishlistClick}
                >
                    {isInWishlist ? <FaHeart color="red" /> : <FaRegHeart />}
                </button>

                <button
                    className="quick-view"
                    onClick={(e) => e.stopPropagation()}
                >
                    <GrView />
                </button>
            </div>

            <div className="book-card-image-wrapper">
                <img src={image_url} alt={title_az} className="book-card-image" />
            </div>

            <div className="book-card-info">
                <div className="book-card-stars">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <FaStar
                            key={i}
                            className={`star ${i < fullStars ? "filled" : ""}`}
                        />
                    ))}
                    <span className="book-card-rating">({rating})</span>
                </div>

                <h3 className="book-card-title">{title_az}</h3>

                <div className="book-card-author">{author}</div>

                {viewMode === "list" && (
                    <p className="book-card-description">{description_az}</p>
                )}

                <div className="book-card-line"></div>

                <div className="book-card-price">${price}</div>
            </div>

            <div className="add-to-cart">
                <button className="button" onClick={handleAddToCart} >
                    <MdAddShoppingCart className="icon-shop" />
                    <span>Add to cart</span>
                </button>
            </div>
        </div>
    );
};

export default SingleCard;