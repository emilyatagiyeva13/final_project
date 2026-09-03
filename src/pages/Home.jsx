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
import { useNavigate } from "react-router-dom"
import { booksData } from "../data/data"
import { Swiper, SwiperSlide } from 'swiper/react';

import { Pagination } from "react-bootstrap"
// import UpcomingBooks from "../components/Picksforu"

const Home = () => {
  const navigate = useNavigate();

  // current best selling books
  const currentBestSeller = [...booksData].sort((a, b) => b.soldCount - a.soldCount);
  const newArrivals = [...booksData].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))


  return (
    <>

      {/* HERO CAROUSEL */}
      <HomeCarousel />


      {/* THIS WEEKS HIGHLIGHT SECTION */}
      <section>

        <div className="book-cards-1 container my-4">
          <h1>This week's highlight</h1>

          <div className="row g-3 single-card my-2">



            {/* {
              booksData.filter((book) => book.isWeeklyHighlight).map((book) => (
                <SingleCard key={book.id} {...book} />
              ))
            } */}


            <Swiper
              slidesPerView={4.3}
              spaceBetween={10}
              pagination={{ clickable: true }}
              modules={[Pagination]}
              className="mySwiper"
              breakpoints={{
                320: { slidesPerView: 1, spaceBetween: 15 },
                576: { slidesPerView: 2, spaceBetween: 20 },
                992: { slidesPerView: 3, spaceBetween: 25 },
                1200: { slidesPerView: 4, spaceBetween: 20 },
                1440: { slidesPerView: 5, spaceBetween: 200 },
              }}
            >
              {booksData.map((book) => (
                <SwiperSlide >
                  <SingleCard key={book.id} {...book} />
                </SwiperSlide>
              ))}
            </Swiper>



            {/* {
              booksData.filter((book) => book.isWeeklyHighlight).map((book) => (
                <SingleCard key={book.id} title={book.title} id={book.id} price={book.price} />
              ))
            } */}

          </div>


        </div>

      </section>


      {/* CURRENT BEST SELLING BOOKS SECTION */}

      <section>

        <div className="book-cards-1 container my-4">
          <h1>Current bestselling books</h1>

          <div className="row g-3 single-card my-2">



            {/* {
              booksData.filter((book) => book.isWeeklyHighlight).map((book) => (
                <SingleCard key={book.id} {...book} />
              ))
            } */}


            <Swiper
              slidesPerView={4.3}
              spaceBetween={10}
              pagination={{ clickable: true }}
              modules={[Pagination]}
              className="mySwiper"
              breakpoints={{
                320: { slidesPerView: 1, spaceBetween: 15 },
                576: { slidesPerView: 2, spaceBetween: 20 },
                992: { slidesPerView: 3, spaceBetween: 25 },
                1200: { slidesPerView: 4, spaceBetween: 20 },
                1440: { slidesPerView: 5, spaceBetween: 200 },
              }}
            >
              {currentBestSeller.map((book) => (
                <SwiperSlide >
                  <SingleCard key={book.id} {...book} />
                </SwiperSlide>
              ))}
            </Swiper>



            {/* {
              booksData.filter((book) => book.isWeeklyHighlight).map((book) => (
                <SingleCard key={book.id} title={book.title} id={book.id} price={book.price} />
              ))
            } */}

          </div>


        </div>

      </section>



      <section className="top-fav-thriller container p-5 ">
        <div className="thriller-content container d-flex flex-column my-5">
          <h1>TOP FAVOURITE <br /> THRILLER STORIES </h1>
          <span>Find our take on the best books of all time.</span>
          <div className="btn-wrapper my-3">
            <button className="discover-btn" onClick={() => navigate(`/shop`)}>
              <span>DISCOVER NOW</span> <span ><IoIosArrowForward />
              </span>
            </button>
          </div>

        </div>
        <img src={topFavThriller} alt="" className="thriller-img" />

        <img src={topFavThriller2} alt="" className="thriller-img-2" />



      </section>

      <section>

        <div className="book-cards-1 container my-4">
          <h1>New arrivals</h1>

          <div className="row g-3 single-card my-2">



            {/* {
              booksData.filter((book) => book.isWeeklyHighlight).map((book) => (
                <SingleCard key={book.id} {...book} />
              ))
            } */}


            <Swiper
              slidesPerView={4.3}
              spaceBetween={10}
              pagination={{ clickable: true }}
              modules={[Pagination]}
              className="mySwiper"
              breakpoints={{
                320: { slidesPerView: 1, spaceBetween: 15 },
                576: { slidesPerView: 2, spaceBetween: 20 },
                992: { slidesPerView: 3, spaceBetween: 25 },
                1200: { slidesPerView: 4, spaceBetween: 20 },
                1440: { slidesPerView: 5, spaceBetween: 200 },
              }}
            >
              {newArrivals.map((book) => (
                <SwiperSlide >
                  <SingleCard key={book.id} {...book} />
                </SwiperSlide>
              ))}
            </Swiper>



            {/* {
              booksData.filter((book) => book.isWeeklyHighlight).map((book) => (
                <SingleCard key={book.id} title={book.title} id={book.id} price={book.price} />
              ))
            } */}

          </div>


        </div>

      </section>

      <section >
        <div className="container">
          <div className="shop-now row g-4">

            <ShopNowCards />
            <ShopNowCards />
            <ShopNowCards />

          </div>
        </div>
      </section>

      <section className="top-categories my-5">
        <div className="container">
          <CategoryCarousel />
        </div>

      </section>

      {/* <section className="picks-for-u">
        <UpcomingBooks />
      </section> */}

      <section className="author">
        <AuthorsCarousel />
      </section>
      <div className="line border d-flex container"></div>




      <section className="service">
        <ServiceFeatures />
      </section>

    </>
  )
}

export default Home