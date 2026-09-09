import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import '../assets/scss/_HomeCarousels.scss';
import h1sliderbg from "../assets/Images/h1-sliderbg1.png";
import h1sliderbg3 from "../assets/Images/h1-slider3-3.svg"
import h1slider3 from "../assets/Images/h1-slider3.png";
import Aos from 'aos';
import { useEffect, useRef, useState } from 'react';
import 'aos/dist/aos.css';
import h1slider22 from "../assets/Images/h1-slider2-2.png";
import h1slider21 from "../assets/Images/h1-slider2-1.png";
import slider31 from "../assets/Images/h1-slider3-1.png";
import { IoIosArrowForward } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
export default function HomeCarousels() {

    const swiperRef = useRef(null);
    const navigate = useNavigate();

    // her slide ucun aos islesin deye yeni state yaradiriq
    const [slideKeys, setSlideKeys] = useState([0, 0, 0]);

    useEffect(() => {
        Aos.init({
            duration: 900,
            easing: 'ease-out-cubic',
            once: false,
            offset: 0,
        });
    }, []);

    useEffect(() => {

        // aos-un her slide ucun yeniden ise dusmesi ucun bu kodu yazariq hansi ki keyler ile bir-bir onlari refresh edib aoslar ise dusecek
        Aos.refreshHard();
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

    // const [isPaused, setIsPaused] = useState(false);
    // const marqueeItems = [
    //     { number: "1200", text: "AUTHORS" },
    //     { number: "12.000", text: "BOOKS SOLD" },
    //     { number: "95%", text: "HAPPY CUSTOMERS" },
    //     { number: "20.000", text: "TOTAL BOOKS" },
    // ];



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
                            <div className="btn-wrapper" data-aos="fade-up" data-aos-delay="800">
                                <button className="discover-btn" onClick={() => navigate(`/shop`)}>
                                    <span>DISCOVER NOW</span> <span><IoIosArrowForward />
                                    </span>
                                </button>
                            </div>
                        </div>

                        <div className="off-slider-wrapper">
                            <div
                                className="off-slider"
                                data-aos="zoom-in"
                                data-aos-delay="400"
                                data-aos-duration="700"
                            >

                            </div>
                            <div className="off-text" data-aos="zoom-out">15 % <br />OFF</div>
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

                            <div className="btn-wrapper" data-aos="fade-up" data-aos-delay="800">
                                <button className="discover-btn" onClick={() => navigate(`/shop`)}>
                                    <span>DISCOVER NOW</span> <span ><IoIosArrowForward />
                                    </span>
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
                                    <span>15% <br /> OFF</span>
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
                                    Fiction addiction.
                                </h6>
                                <h1 data-aos="fade-right" data-aos-delay="400">
                                    YOUR ULTIMATE PAGE-TO-SCREEN READING LIST
                                </h1>
                                <p data-aos="fade-up" data-aos-delay="600">
                                    Save over <strong>$24</strong> with the Booker prize shortlist collection
                                </p>

                                <div className="btn-wrapper" data-aos="fade-up" data-aos-delay="800">
                                    <button className="discover-btn" onClick={() => navigate(`/shop`)}>
                                        <span>DISCOVER NOW</span> <span><IoIosArrowForward />
                                        </span>
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


            {/* SWIPER-2 */}

            {/* <div className="marquee-wrapper">
                <div className="marquee-track">
                    {[...marqueeItems, ...marqueeItems].map((item, index) => (
                        <div
                            key={index}
                            className="marquee-content"
                            style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
                        >
                            <span
                                className="marquee-item"
                                onMouseEnter={() => setIsPaused(true)}
                                onMouseLeave={() => setIsPaused(false)}
                            >
                                <span className="marquee-number">{item.number}</span>
                                <span className="marquee-text">{item.text}</span>
                            </span>
                        </div>
                    ))}
                </div>
            </div> */}






        </>

    );
}