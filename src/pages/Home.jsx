import SingleCard from "../components/SingleCard"
import "../assets/scss/Home.scss"
import topFavThriller from "../assets/Images/h1-banner01-1.jpg"
import topFavThriller2 from "../assets/Images/h3-banner-6.png"
import { IoIosArrowForward } from "react-icons/io"
import ShopNowCards from "../components/ShopNowCards"
import HomeCarousel from "../components/HeroCrousel"
import CategoryCarousel from "../components/CategoryCarousel"
import AuthorsCarousel from "../components/AuthorsCarousel"
import ServiceFeatures from "../components/Service"

const Home = () => {
  return (
    <>
      <HomeCarousel />
      <section>

        <div className="book-cards-1 container-fluid">
          <h1>This week's highlight</h1>

          <div className="row g-3 single-card">
            <SingleCard />
            <SingleCard />
            <SingleCard />
            <SingleCard />
          </div>


        </div>

      </section>

      <section>
        <div className="current-bestselling my-5 container-fluid">
          <h1>Current bestselling books</h1>
          <div className="row g-3 single-card">
            <SingleCard />
            <SingleCard />
            <SingleCard />
            <SingleCard />
          </div>
        </div>


      </section>

      <section className="top-fav-thriller container-fluid">
        <div className="thriller-content container d-flex flex-column">
          <h1>TOP FAVOURITE <br /> THRILLER STORIES </h1>
          <span>Find our take on the best books of all time.</span>
          <div className="discover-now-btn btn d-flex align-items-center">
            <button className="d-flex align-items-center gap-3 discover-btn"> DISCOVER NOW <span><IoIosArrowForward /></span> </button>
          </div>
        </div>
        <img src={topFavThriller} alt="" className="thriller-img" />

        <img src={topFavThriller2} alt="" className="thriller-img-2" />



      </section>

      <section className="half-price">
        <div className="current-bestselling my-5 container-fluid">
          <h1>Half price books</h1>
          <div className="row g-3 single-card">
            <SingleCard />
            <SingleCard />
            <SingleCard />
            <SingleCard />
          </div>
        </div>
      </section>

      <section className="shop-now row g-3 container-fluid">

        <ShopNowCards />
        <ShopNowCards />
        <ShopNowCards />

      </section>

      <section className="top-categories my-5">
        <h2 className="text-center">TOP CATEGORIES FOR YOU</h2>
        <CategoryCarousel />

      </section>

      <section className="author">
        <AuthorsCarousel/>
      </section>
      <div className="line border d-flex container"></div>

      <section className="service">

        <ServiceFeatures/>

        


      </section>


    </>
  )
}

export default Home