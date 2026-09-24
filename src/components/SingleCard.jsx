import "../assets/scss/SingleCard.scss";
import { MdAddShoppingCart } from "react-icons/md";
import { FaHeart, FaRegHeart, FaStar } from "react-icons/fa";
import { GrView } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useWishlistStore } from "../store/useWishlistStore";
import { useAuthStore } from "../store/authStore";
import useCartStore from "../store/useCartStore";
import { Bounce, toast } from "react-toastify";

const toastOptions = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    transition: Bounce,
};

const SingleCard = ({
    id,
    slug,
    image_url,
    title,
    title_az,
    author,
    price,
    rating = 0,
    description,
    description_az,
    viewMode = "grid",
    stock
}) => {
    const { t } = useTranslation("common", "shop");
    const navigate = useNavigate();
    const fullStars = Math.round(rating);

    const displayTitle = title ?? title_az;
    const displayDescription = description ?? description_az;

    const isInWishlist = useWishlistStore((state) => state.isInWishlist(id));
    const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
    const user = useAuthStore((state) => state.user);
    const addItem = useCartStore((state) => state.addItem);

    const handleAddToCart = async (e) => {
        e.stopPropagation();
        if (stock === 0) return;

        if (!user) {
            toast.error(t("card.loginRequired"), toastOptions);
            navigate("/login");
            return;
        }
        await addItem({ id, title_az: displayTitle, price, image_url });
        toast.success(t("card.addedToCart"), toastOptions);
    };

    const handleWishlistClick = async (e) => {
        e.stopPropagation();
        if (!user) {
            toast.error(t("card.loginRequired"), toastOptions);
            navigate("/login");
            return;
        }

        const wasInWishlist = isInWishlist;
        await toggleWishlist(id);

        if (wasInWishlist) {
            toast.info(t("card.removedFromWishlist"), toastOptions);
        } else {
            toast.success(t("card.addedToWishlist"), toastOptions);
        }
    };

    return (
        <div
            className={`book-card ${viewMode === "list" ? "book-card-list" : ""}`}
            data-aos="fade-up"
            onClick={() => navigate(`/shop/${slug ?? id}`)}
        >
            <div className="d-flex view-heart-col">
                <button
                    className="card-hover-heart"
                    onClick={handleWishlistClick}
                >
                    {isInWishlist ? <FaHeart color="red" /> : <FaRegHeart />}
                </button>

                
            </div>

            <div className="book-card-image-wrapper">
                <img src={image_url} alt={displayTitle} className="book-card-image" />
                {stock === 0 && (
                    <div className="out-of-stock-badge">
                        {t("product.outOfStock", "Tükəndi")}
                    </div>
                )}
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

                <h3 className="book-card-title">{displayTitle}</h3>

                <div className="book-card-author">{author}</div>

                {viewMode === "list" && (
                    <p className="book-card-description">{displayDescription}</p>
                )}

                <div className="book-card-line"></div>

                <div className="book-card-price">${price}</div>
            </div>

            <div className="add-to-cart">
                <button 
                    className="button" 
                    onClick={handleAddToCart}
                    disabled={stock === 0}
                >
                    <MdAddShoppingCart className="icon-shop" />
                    <span>
                        {stock === 0 
                            ? t("product.noStock", "Stokda yoxdur") 
                            : t("card.addToCart", "Səbətə əlavə et")}
                    </span>
                </button>
            </div>
        </div>
    );
};

export default SingleCard;