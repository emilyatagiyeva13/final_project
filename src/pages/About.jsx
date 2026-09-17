import { useState, useEffect } from "react"
import { IoIosArrowForward } from "react-icons/io"
import { Link } from "react-router-dom"
import "../assets/scss/AboutUs.scss"
import { FaSmile } from "react-icons/fa"
import { supabase } from "../supabaseClient.js"
import AOS from "aos"
import Loader from "../components/Loader"
import { FreeMode, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from 'swiper/react'
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/free-mode"
import CountUpSection from "../components/CountUp.jsx"

const buildContentMap = (rows) => {
    const map = {};
    rows.forEach((row) => {
        if (!map[row.section]) map[row.section] = {};
        map[row.section][row.key] = row.text_en;
        if (row.image_url) {
            if (!map[row.section]) map[row.section] = {};
            map[row.section][`${row.key}_url`] = row.image_url;
        }
    });
    return map;
};

const About = () => {
    const [data, setData] = useState([]);
    const [content, setContent] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAboutData = async () => {
            const [
                { data: data, error: dataError },
                { data: contentData, error: contentError },
            ] = await Promise.all([
                supabase
                    .from("about_us")
                    .select("id, text, author, role, sort_order")
                    .order("sort_order"),
                supabase
                    .from("page_content")
                    .select("section, key, text_en, image_url")
                    .eq("page", "about_us"),
            ]);

            if (dataError) {
                console.error("data fetch error:", dataError);
            } else {
                setData(data);
            }

            if (contentError) {
                console.error("About Us content fetch error:", contentError);
            } else {
                setContent(buildContentMap(contentData));
            }

            setLoading(false);
            setTimeout(() => AOS.refresh(), 0);
        };

        fetchAboutData();
    }, []);

    if (loading) {
        return <Loader />;
    }

    return (
        <>
            <section className="about-hero">
                <div className="hero-bg">
                    <img src={content.hero?.bg_image_url} alt="Library Background" />
                    <div className="overlay"></div>
                </div>

                <div className="container hero-content">
                    <div className="breadcrumb">
                        <Link to="/" className="home-link nav-link">Home</Link>
                        <IoIosArrowForward className="breadcrumb-icon" />
                        <span className="current-page">{content.breadcrumb?.current}</span>
                    </div>
                    <h1 className="hero-title" data-aos="fade-up">{content.hero?.title}</h1>
                </div>
            </section>

            <section className="who-we-are">
                <div className="container">
                    <div className="headers" data-aos="fade-up">
                        <h6>{content.who_we_are?.label}</h6>
                        <h1>
                            {content.who_we_are?.heading_pre}
                            <span> {content.who_we_are?.heading_highlight}</span> {content.who_we_are?.heading_post}
                        </h1>
                    </div>

                    <div className="our-mission-grid">
                        <div className="left-content-wrapper" data-aos="fade-right" data-aos-delay="200">
                            <div className="main-img-bucket">
                                <img src={content.mission?.image_url} alt="Bookstore interior" className="left-box-img" />

                                <div className="mission-overlay-card">
                                    <h2>{content.mission?.title}</h2>
                                    <p>{content.mission?.text}</p>
                                </div>
                            </div>
                        </div>

                        <div className="right-services-list" data-aos="fade-left" data-aos-delay="400">
                            <div className="service-item">
                                <h4>{content.services?.service1_title}</h4>
                                <p>{content.services?.service1_desc}</p>
                            </div>

                            <div className="service-item">
                                <h4>{content.services?.service2_title}</h4>
                                <p>{content.services?.service2_desc}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="data-section py-5">
                <div className="container">
                    <h2 className="section-title text-center" data-aos="fade-down">{content.testimonials?.title}</h2>

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
                            {data.map((item) => (
                                <SwiperSlide key={item.id}>
                                    <div className="data-card text-center" data-aos="fade-up">
                                        <div className="card-top">
                                            <p className="data-text">{item.text}</p>
                                        </div>
                                        <div className="card-bottom">
                                            <div className="icon-wrapper">
                                                <FaSmile className="client-icon" />
                                            </div>
                                            <h4 className="author-name">{item.author}</h4>
                                            <span className="author-role">{item.role}</span>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </section>

            <section className="count-up">
                <CountUpSection />
            </section>
        </>
    )
}

export default About