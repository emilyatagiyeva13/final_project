import { useState, useEffect } from "react"
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
import { supabase } from "../supabaseClient"
import { Swiper, SwiperSlide } from 'swiper/react';
import Loader from "../components/Loader"

import { Pagination } from "react-bootstrap"
// import UpcomingBooks from "../components/Picksforu"

const Home = () => {
  const navigate = useNavigate();
  const [booksData, setBooksData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          id,
          slug,
          title_az,
          description_az,
          price,
          stock,
          image_url,
          rating,
          sold_count,
          is_weekly_highlight,
          created_at,
          categories ( name_az ),
          authors ( name )
        `)
        .eq("is_active", true);

      if (error) {
        console.error("Products fetch error:", error);
      } else {
        const formatted = data.map((book) => ({
          ...book,
          category: book.categories?.name_az,
          author: book.authors?.name,
        }));
        setBooksData(formatted);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  // this week's highlight
  const weeklyHighlights = booksData.filter((book) => book.is_weekly_highlight);

  // current best selling books
  const currentBestSeller = [...booksData].sort((a, b) => (b.sold_count ?? 0) - (a.sold_count ?? 0));

  // new arrivals
  const newArrivals = [...booksData].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  if (loading) {
    return <Loader/>;
  }

  return (
    <>

      {/* HERO CAROUSEL */}
      <HomeCarousel />


      {/* THIS WEEKS HIGHLIGHT SECTION */}
      <section>

        <div className="book-cards-1 container my-4">
          <h1>This week's highlight</h1>

          <div className="row g-3 single-card my-2">

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
              {weeklyHighlights.map((book) => (
                <SwiperSlide key={book.id}>
                  <SingleCard {...book} />
                </SwiperSlide>
              ))}
            </Swiper>

          </div>


        </div>

      </section>


      {/* CURRENT BEST SELLING BOOKS SECTION */}

      <section>

        <div className="book-cards-1 container my-4">
          <h1>Current bestselling books</h1>

          <div className="row g-3 single-card my-2">

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
                <SwiperSlide key={book.id}>
                  <SingleCard {...book} />
                </SwiperSlide>
              ))}
            </Swiper>

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
                <SwiperSlide key={book.id}>
                  <SingleCard {...book} />
                </SwiperSlide>
              ))}
            </Swiper>

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