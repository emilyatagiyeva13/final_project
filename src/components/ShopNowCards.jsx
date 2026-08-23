import { MdAddShoppingCart } from "react-icons/md"
import shopNow from "../assets/Images/h1-banner02-1.jpg"
import shopNow2 from "../assets/Images/h1-slider2.png"
import "../assets/scss/ShopNowCards.scss"
const ShopNowCards = () => {
    return (
        <>
            <div className="col-6 col-sm-4 col-md-4 col-lg-4">
                <div className="shopcard">

                    <img src={shopNow} alt="" className="background-img" />
                    <img src={shopNow2} alt="" className="book-img" width={100} />

                    <div className="content">

                        <div className="category">
                            Game.Anime.Life
                        </div>

                        <div className="title fw-bolder">
                            COLLECT SHOP
                        </div>
                    </div>

                    <div className="shop-now-btn">
                        <button className="button">
                            <span>SHOP</span>
                            <MdAddShoppingCart className="icon-shop" />
                        </button>
                    </div>

                </div>
            </div>


        </>
    )
}

export default ShopNowCards