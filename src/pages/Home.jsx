import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
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
import { FreeMode } from "swiper/modules"
import { useLanguage } from "../context/LangContext"

const Home = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('home');
  const { currentLang } = useLanguage();
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
          title_en,
          description_az,
          description_en,
          price,
          stock,
          image_url,
          rating,
          sold_count,
          is_weekly_highlight,
          created_at,
          banner_url,
          categories ( name_az, name_en ),
          authors ( name )
        `)
        .eq("is_active", true);

      if (error) {
        console.error("Products fetch error:", error);
      } else {
        const formatted = data.map((book) => ({
          ...book,
          title: currentLang === "en" ? book.title_en : book.title_az,
          description: currentLang === "en" ? book.description_en : book.description_az,
          category: currentLang === "en" ? book.categories?.name_en : book.categories?.name_az,
          author: book.authors?.name,
        }));
        setBooksData(formatted);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [currentLang]);

  const weeklyHighlights = booksData.filter((book) => book.is_weekly_highlight);
  const currentBestSeller = [...booksData].sort((a, b) => (b.sold_count ?? 0) - (a.sold_count ?? 0));
  const newArrivals = [...booksData].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const salesByCategory = booksData.reduce((acc, book) => {
    const cat = book.category;
    if (!cat) return acc;
    if (!acc[cat]) acc[cat] = { total: 0, books: [] };
    acc[cat].total += book.sold_count ?? 0;
    acc[cat].books.push(book);
    return acc;
  }, {});

  const topCategories = Object.entries(salesByCategory)
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 3);

  const topBooksByCategory = topCategories.map(([, data]) => {
    return [...data.books].sort((a, b) => (b.sold_count ?? 0) - (a.sold_count ?? 0))[0];
  });

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <HomeCarousel />

      <section>
        <div className="book-cards-1 container my-4">
          <h1>{t('sections.weeklyHighlight')}</h1>
          <div className="row g-3 single-card my-2">
            <Swiper
              slidesPerView={4.3}
              spaceBetween={10}
              
              pagination={{ clickable: true }}
              modules={[Pagination, FreeMode]}
              freeMode={true}
              className="mySwiper category-swiper"
              breakpoints={{
                320: { slidesPerView: 1, spaceBetween: 15 },
                576: { slidesPerView: 2, spaceBetween: 20 },
                992: { slidesPerView: 3, spaceBetween: 25 },
                1200: { slidesPerView: 4, spaceBetween: 20 },
                1440: { slidesPerView: 4, spaceBetween: 20 },
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

      <section>
        <div className="book-cards-1 container my-4">
          <h1>{t('sections.bestSellers')}</h1>
          <div className="row g-3 single-card my-2">
            <Swiper
              slidesPerView={4.3}
              spaceBetween={10}
              pagination={{ clickable: true }}
              modules={[Pagination, FreeMode]}
              freeMode={true}
              className="mySwiper category-swiper"
              breakpoints={{
                320: { slidesPerView: 1, spaceBetween: 15 },
                576: { slidesPerView: 2, spaceBetween: 20 },
                992: { slidesPerView: 3, spaceBetween: 25 },
                1200: { slidesPerView: 4, spaceBetween: 20 },
                1440: { slidesPerView: 4, spaceBetween: 20 },
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

      <section className="top-fav-thriller container p-5">
        <div className="thriller-content d-flex flex-column my-5">
          <h1 dangerouslySetInnerHTML={{ __html: t('thriller.title') }} />
          <span>{t('thriller.subtitle')}</span>
          <div className="btn-wrapper my-3">
            <button className="discover-btn" onClick={() => navigate(`/shop`)}>
              <span>{t('thriller.discover')}</span>
              <span><IoIosArrowForward /></span>
            </button>
          </div>
        </div>
        <img src={topFavThriller} alt="Thriller Book 1" className="thriller-img" />
        <img src={topFavThriller2} alt="Thriller Book 2" className="thriller-img-2" />
      </section>

      <section>
        <div className="book-cards-1 container my-4">
          <h1>{t('sections.newArrivals')}</h1>
          <div className="row g-3 single-card my-2">
            <Swiper
              slidesPerView={4.3}
              spaceBetween={10}
              pagination={{ clickable: true }}
              modules={[Pagination, FreeMode]}
              freeMode={true}
              className="mySwiper category-swiper"
              breakpoints={{
                320: { slidesPerView: 1, spaceBetween: 15 },
                576: { slidesPerView: 2, spaceBetween: 20 },
                992: { slidesPerView: 3, spaceBetween: 25 },
                1200: { slidesPerView: 4, spaceBetween: 20 },
                1440: { slidesPerView: 4, spaceBetween: 20 },
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

      <section>
        <div className="container">
          <div className="shop-now row g-4">
            <h1>{t('sections.topGenres')}</h1>
            {topBooksByCategory.map((book) => (
              <ShopNowCards
                key={book.id}
                bannerImg={book.banner_url}
                bookImg={book.image_url}
                category={book.category}
                title={book.title}
                id={book.id}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="top-categories my-5">
        <div className="container">
          <CategoryCarousel />
        </div>
      </section>

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