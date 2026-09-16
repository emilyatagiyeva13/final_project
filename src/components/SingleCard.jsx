import "../assets/scss/SingleCard.scss";
import { MdAddShoppingCart } from "react-icons/md";
import { FaRegHeart, FaStar } from "react-icons/fa";
import { GrView } from "react-icons/gr";
import { useNavigate } from "react-router-dom";

const SingleCard = ({ id, image_url, title_az, author, price, rating = 0, description_az, viewMode = "grid" }) => {
    const navigate = useNavigate();
    const fullStars = Math.round(rating);

    return (
        <div
            className={`book-card ${viewMode === "list" ? "book-card-list" : ""}`}
            data-aos="fade-up"
            onClick={() => navigate(`/shop/${id}`)}
        >
            <div className="d-flex view-heart-col">
                <button
                    className="card-hover-heart"
                    onClick={(e) => e.stopPropagation()}
                >
                    <FaRegHeart />
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
                <button className="button" onClick={(e) => e.stopPropagation()}>
                    <MdAddShoppingCart className="icon-shop" />
                    <span>Add to cart</span>
                </button>
            </div>
        </div>
    );
};

export default SingleCard;