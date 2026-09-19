import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import '../assets/scss/HomeCarousels.scss';
import h1sliderbg from "../assets/Images/h1-sliderbg1.png";
import h1sliderbg3 from "../assets/Images/h1-slider3-3.svg";
import h1slider3 from "../assets/Images/h1-slider3.png";
import Aos from 'aos';
import { useEffect, useRef, useState } from 'react';
import 'aos/dist/aos.css';
import h1slider22 from "../assets/Images/h1-slider2-2.png";
import h1slider21 from "../assets/Images/h1-slider2-1.png";
import slider31 from "../assets/Images/h1-slider3-1.png";
import { IoIosArrowForward } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function HomeCarousels() {
    const { t } = useTranslation('home');
    const swiperRef = useRef(null);
    const navigate = useNavigate();

    // her slide ucun aos islesin deye yeni state yaradiriq
    const [slideKeys, setSlideKeys] = useState([0, 0, 0]);

    useEffect(() => {
        Aos.init({
            duration: 900,
            easing: 'ease-out-cubic',
            once: true,
            offset: 0,
        });
    }, []);

    useEffect(() => {
        // aos-un her slide ucun yeniden ise dusmesi ucun bu kodu yazariq hansi ki keyler ile bir-bir onlari refresh edib aoslar ise dusecek
        Aos.refresh();
    }, [slideKeys]);

    // componenti yeniden render etmek ucun slidelar ucun key yaradiriq
    const handleSlideChange = (swiper) => {
        const index = swiper.activeIndex;
        setSlideKeys((img) => {
            const updated = [...img];
            updated[index] = updated[index] + 1;
            return updated;
        });
    };

    return (
        <>
            <Swiper
                pagination={{ clickable: true }}
                modules={[Pagination, Autoplay]}
                autoplay={{
                    delay: 4500,
                    disableOnInteraction: false,
                }}
                onSlideChange={handleSlideChange}
                className="mySwiper1"
                ref={swiperRef}
            >
                {/* SLIDE 1 */}
                <SwiperSlide>
                    <div className="slide-1" key={slideKeys[0]}>
                        <div
                            className="slider-content container d-flex flex-column gap-3 my-5"
                            data-aos="fade-right"
                            data-aos-delay="100"
                        >
                            <div className="content d-flex flex-column justify-content-center container-fluid">
                                <h6
                                    data-aos="fade-down"
                                    data-aos-delay="200"
                                >
                                    {t('carousels.slide1.subtitle')}
                                </h6>
                                <h1
                                    data-aos="fade-up"
                                    data-aos-delay="350"
                                >
                                    {t('carousels.slide1.title')}
                                </h1>
                                <span
                                    data-aos="fade-up"
                                    data-aos-delay="500"
                                >
                                    {t('carousels.slide1.description')}
                                </span>
                            </div>
                            <div className="btn-wrapper" data-aos="fade-up" data-aos-delay="800">
                                <button className="discover-btn" onClick={() => navigate(`/shop`)}>
                                    <span>{t('carousels.discover_now')}</span> <span><IoIosArrowForward /></span>
                                </button>
                            </div>
                        </div>

                        <div className="off-slider-wrapper">
                            <div
                                className="off-slider"
                                data-aos="zoom-in"
                                data-aos-delay="400"
                                data-aos-duration="700"
                            ></div>
                            <div className="off-text" data-aos="zoom-out">
                                15 % <br />{t('carousels.off')}
                            </div>
                        </div>

                        <img
                            src={h1sliderbg}
                            alt="Slider background"
                            width={800}
                            className="h1-slider"
                            data-aos="fade-left"
                            data-aos-delay="200"
                            data-aos-duration="1000"
                        />

                        <div className="slider-books">
                            <img
                                src={h1slider3}
                                alt="Book"
                                width={200}
                                className="h1-slider3-01"
                                data-aos="fade-up"
                                data-aos-delay="300"
                                data-aos-duration="800"
                            />
                            <img
                                src={h1slider3}
                                alt="Book"
                                width={100}
                                className="h1-slider3-02"
                                data-aos="fade-down"
                                data-aos-delay="500"
                                data-aos-duration="800"
                            />
                            <img
                                src={h1slider3}
                                alt="Book"
                                width={150}
                                className="h1-slider3-03"
                                data-aos="fade-up"
                                data-aos-delay="450"
                                data-aos-duration="800"
                            />
                        </div>
                    </div>
                </SwiperSlide>

                {/* SLIDE 2 */}
                <SwiperSlide>
                    <div className="slide-2" key={slideKeys[1]}>
                        <div className="content d-flex flex-column align-items-center">
                            <h6
                                data-aos="fade-down"
                                data-aos-delay="150"
                            >
                                {t('carousels.slide2.subtitle')}
                            </h6>
                            <h1
                                data-aos="fade-up"
                                data-aos-delay="300"
                            >
                                {t('carousels.slide2.title')}
                            </h1>
                            <span
                                data-aos="fade-up"
                                data-aos-delay="450"
                            >
                                {t('carousels.slide2.description')}
                            </span>

                            <div className="btn-wrapper" data-aos="fade-up" data-aos-delay="800">
                                <button className="discover-btn" onClick={() => navigate(`/shop`)}>
                                    <span>{t('carousels.discover_now')}</span> <span><IoIosArrowForward /></span>
                                </button>
                            </div>
                        </div>

                        <div className="slider-books">
                            <img
                                src={h1slider22}
                                alt="Book cover"
                                className="h1-slider-22"
                                data-aos="fade-right"
                                data-aos-delay="200"
                                data-aos-duration="900"
                                data-aos-easing="ease-out-back"
                            />
                            <img
                                src={h1slider21}
                                alt="Book cover"
                                className="h1-slider-21"
                                data-aos="fade-left"
                                data-aos-delay="400"
                                data-aos-duration="900"
                                data-aos-easing="ease-out-back"
                            />
                        </div>
                    </div>
                </SwiperSlide>

                {/* SLIDE 3 */}
                <SwiperSlide>
                    <div className="slide-3 d-flex align-items-center" key={slideKeys[2]}>
                        <div className="container position-relative h-100 d-flex align-items-center">
                            <div className="off-slider-wrapper" data-aos="zoom-in" data-aos-delay="900">
                                <div className="off-slider-bg"></div>
                                <div className="off-slider-text">
                                    <span>15% <br /> {t('carousels.off')}</span>
                                </div>
                            </div>

                            <img
                                src={slider31}
                                alt="Main Illustration"
                                className="main-slider-img"
                                data-aos="fade-left"
                                data-aos-duration="1200"
                            />

                            <div className="content-box">
                                <h6 data-aos="fade-down" data-aos-delay="200">
                                    {t('carousels.slide3.subtitle')}
                                </h6>
                                <h1 data-aos="fade-right" data-aos-delay="400">
                                    {t('carousels.slide3.title')}
                                </h1>
                                <p data-aos="fade-up" data-aos-delay="600">
                                    {t('carousels.slide3.description_prefix')}
                                    <strong>{t('carousels.slide3.description_highlight')}</strong>
                                    {t('carousels.slide3.description_suffix')}
                                </p>

                                <div className="btn-wrapper" data-aos="fade-up" data-aos-delay="800">
                                    <button className="discover-btn" onClick={() => navigate(`/shop`)}>
                                        <span>{t('carousels.discover_now')}</span> <span><IoIosArrowForward /></span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="h1sliderbg3">
                            <img src={h1sliderbg3} alt="" />
                        </div>
                    </div>
                </SwiperSlide>
            </Swiper>
        </>
    );
}