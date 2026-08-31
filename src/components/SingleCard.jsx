import "../assets/scss/SingleCard.scss";
import { MdAddShoppingCart } from "react-icons/md";
import { FaRegHeart, FaStar } from "react-icons/fa";
import { GrView } from "react-icons/gr";

const SingleCard = ({ image, title, author, price, rating = 0 }) => {
    const fullStars = Math.round(rating);

    return (
        <div className="col-12 col-sm-6 col-md-3 col-lg-3" data-aos="fade-up">
            <div className="book-card">
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

                <div className="book-card-line"></div>

                <div className="book-card-price">${price}</div>

                <div className="add-to-cart">
                    <button className="button">
                        <MdAddShoppingCart className="icon-shop" />
                        <span>Add to cart</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SingleCard;