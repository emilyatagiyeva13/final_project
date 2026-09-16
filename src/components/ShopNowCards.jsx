import { MdAddShoppingCart } from "react-icons/md"
import "../assets/scss/ShopNowCards.scss"
import { useNavigate } from "react-router-dom"

const ShopNowCards = ({ bannerImg, bookImg, category, title, id }) => {
    const navigate = useNavigate();
    return (
        <div className="col-12 col-md-4">
            <div className="shopcard" data-aos="flip-up">

                <img src={bannerImg} alt="" className="background-img" />
                <img src={bookImg} alt="" className="book-img" width={100} />

                <div className="content">
                    <div className="category">{category}</div>
                    <div className="title fw-bolder">{title}</div>
                </div>

                <div className="shop-now-btn">
                    <button className="button" onClick={() => navigate(`/shop/${id}`)}>
                        <span>SHOP</span>
                        <MdAddShoppingCart className="icon-shop" />
                    </button>
                </div>

            </div>
        </div>
    )
}

export default ShopNowCards