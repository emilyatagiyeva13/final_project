import "../assets/scss/SingleCard.scss";
import { MdAddShoppingCart } from "react-icons/md";
import { FaRegHeart, FaStar } from "react-icons/fa";
import { GrView } from "react-icons/gr";

const SingleCard = ({ image, title, author, price, rating = 0, description, viewMode = "grid" }) => {
    const fullStars = Math.round(rating);

    return (
        <div className={`book-card ${viewMode === "list" ? "book-card-list" : ""}`} data-aos="fade-up">
            <div className="d-flex view-heart-col">
                <button className="card-hover-heart">
                    <FaRegHeart />
                </button>

                <button className="quick-view">
                    <GrView />
                </button>
            </div>

            <div className="book-card-image-wrapper">
                <img src={image} alt={title} className="book-card-image" />
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

                <h3 className="book-card-title">{title}</h3>

                <div className="book-card-author">{author}</div>


                {/* LIST rejiminde description gorsenecek */}

                {viewMode === "list"  && (
                    <p className="book-card-description">{description}</p>
                )}

                <div className="book-card-line"></div>

                <div className="book-card-price">${price}</div>
            </div>

            <div className="add-to-cart">
                <button className="button">
                    <MdAddShoppingCart className="icon-shop" />
                    <span>Add to cart</span>
                </button>
            </div>
        </div>
    );
};

export default SingleCard;