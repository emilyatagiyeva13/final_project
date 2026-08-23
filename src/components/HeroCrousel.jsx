import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import '../assets/scss/HomeCarousels.scss';
import h1sliderbg from "../assets/Images/h1-sliderbg1.png";
import { IoIosArrowForward } from 'react-icons/io';
import h1slider3 from "../assets/Images/h1-slider3.png";
import Aos from 'aos';
import { useEffect, useRef } from 'react';
import 'aos/dist/aos.css';
import h1slider22 from "../assets/Images/h1-slider2-2.png";
import h1slider21 from "../assets/Images/h1-slider2-1.png";
import slider31 from "../assets/Images/h1-slider3-1.png";

export default function HomeCarousels() {

    const swiperRef = useRef(null);

    useEffect(() => {
        Aos.init({
            duration: 900,
            easing: 'ease-out-cubic',
            once: false,          // Hər slide dəyişəndə yenidən işləsin
            mirror: true,         // Geri qayıdanda da animasiya olsun
            offset: 0,            // Slider daxilindəki elementlər üçün offset 0
        });
    }, []);

    // Slide dəyişəndə AOS-u yenilə ki animasiyalar yenidən işləsin
    const handleSlideChange = () => {
        setTimeout(() => {
            Aos.refresh();
        }, 100);
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
                {/* ── SLIDE 1 ── */}
                <SwiperSlide>
                    <div className="slide-1">
                        <div
                            className="slider-content container-fluid d-flex flex-column gap-3 my-5"
                            data-aos="fade-right"
                            data-aos-delay="100"
                        >
                            <div className="content d-flex flex-column justify-content-center container-fluid">
                                <h6
                                    data-aos="fade-down"
                                    data-aos-delay="200"
                                >
                                    A brand new series.
                                </h6>
                                <h1
                                    data-aos="fade-up"
                                    data-aos-delay="350"
                                >
                                    the world of young adult books
                                </h1>
                                <span
                                    data-aos="fade-up"
                                    data-aos-delay="500"
                                >
                                    Save up to 15% on new releases.
                                </span>
                            </div>
                            <div
                                className="discover-now-btn btn d-flex align-items-center container-fluid"
                                data-aos="fade-up"
                                data-aos-delay="650"
                            >
                                <button className="d-flex align-items-center gap-3 discover-btn">
                                    DISCOVER NOW <span><IoIosArrowForward /></span>
                                </button>
                            </div>
                        </div>

                        <div
                            className="off-slider"
                            data-aos="zoom-in"
                            data-aos-delay="400"
                            data-aos-duration="700"
                        >
                            15% <br /> OFF
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

                {/* ── SLIDE 2 ── */}
                <SwiperSlide>
                    <div className="slide-2">
                        <div className="content d-flex flex-column align-items-center">
                            <h6
                                data-aos="fade-down"
                                data-aos-delay="150"
                            >
                                Fiction addiction.
                            </h6>
                            <h1
                                data-aos="fade-up"
                                data-aos-delay="300"
                            >
                                YOUR ULTIMATE PAGE-TO-SCREEN READING LIST
                            </h1>
                            <span
                                data-aos="fade-up"
                                data-aos-delay="450"
                            >
                                Save over $24 with the Booker prize shortlist collection
                            </span>
                            <div
                                className="discover-now-btn btn d-flex align-items-center"
                                data-aos="fade-up"
                                data-aos-delay="600"
                            >
                                <button className="d-flex align-items-center gap-3 discover-btn">
                                    DISCOVER NOW <span><IoIosArrowForward /></span>
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

                {/* ── SLIDE 3 ── */}
                <SwiperSlide>
                    <div className="slide-3 d-flex align-items-center">
                        <div className="container position-relative h-100 d-flex align-items-center">

                            {/* Mətn Content */}
                            <div className="content-box">
                                <h6 data-aos="fade-down" data-aos-delay="200">
                                    Fiction addiction.
                                </h6>
                                <h1 data-aos="fade-right" data-aos-delay="400">
                                    YOUR ULTIMATE PAGE-TO-SCREEN READING LIST
                                </h1>
                                <p data-aos="fade-up" data-aos-delay="600">
                                    Save over <strong>$24</strong> with the Booker prize shortlist collection
                                </p>

                                <div className="btn-wrapper" data-aos="fade-up" data-aos-delay="800">
                                    <button className="discover-btn">
                                        DISCOVER NOW <span><IoIosArrowForward /></span>
                                    </button>
                                </div>
                            </div>

                            {/* Endirim "Ulduzu" */}
                            <div className="off-slider" data-aos="zoom-in" data-aos-delay="900">
                                <span>15% <br /> OFF</span>
                            </div>

                            {/* Arxa fon şəkli (Məsələn, böyük bir kitab və ya dekorativ element) */}
                            <img
                                src={slider31}
                                alt="Main Illustration"
                                className="main-slider-img"
                                data-aos="fade-left"
                                data-aos-duration="1200"
                            />

                            {/* Üzən Kiçik Kitablar */}
                            <div className="floating-elements d-none d-lg-block">
                                <img src={slider31} alt="Floating Book" className="book-1" />
                                <img src={slider31} alt="Floating Book" className="book-2" />
                                <img src={slider31} alt="Floating Book" className="book-3" />
                            </div>
                        </div>
                    </div>
                </SwiperSlide>


                
            </Swiper>






        </>




    );
}