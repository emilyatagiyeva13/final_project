import Book1 from "../assets/Images/product-28-1.jpg";
import "../assets/scss/SingleCard.scss";
import { MdAddShoppingCart } from "react-icons/md";
import { FaRegHeart, FaStar } from "react-icons/fa";
import { GrView } from "react-icons/gr";

const SingleCard = () => {
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
                    <img src={Book1} alt="Book cover" className="book-card-image" />
                </div>

                <div className="book-card-stars">
                    {[1, 2, 3, 4].map((s) => (
                        <FaStar key={s} className="star filled" />
                    ))}
                    <FaStar className="star" />
                    <span className="book-card-rating">(4)</span>
                </div>

                <h3 className="book-card-title">
                    Extremely Loud & <br /> Incredibly Close
                </h3>

                <div className="book-card-author">Enrique Wallace</div>

                <div className="book-card-line"></div>

                <div className="book-card-price">$11.64</div>

                <div className="add-to-cart ">
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