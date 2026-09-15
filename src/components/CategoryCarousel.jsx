import { useState, useEffect } from "react"
import { FreeMode, Pagination } from "swiper/modules"
import 'swiper/css';
import 'swiper/css/pagination';
import { SwiperSlide, Swiper } from "swiper/react";
import "../assets/scss/CategorySlider.scss"
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

const CategoryCarousel = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            const { data, error } = await supabase
                .from("categories")
                .select("id, slug, name_az, img_url,name_en")
                .order("name_az");

            if (error) {
                console.error("Categories fetch error:", error);
            } else {
                setCategories(data);
            }
            setLoading(false);
        };

        fetchCategories();
    }, []);


    if (loading) return null;

    return (
        <div className="category-carousel-container container">
            <h1 className="text-center mb-4">TOP CATEGORIES FOR YOU</h1>

            <Swiper
                slidesPerView={4}
                spaceBetween={30}
                freeMode={true}
                pagination={{ clickable: true }}
                modules={[FreeMode, Pagination]}
                breakpoints={{
                    0: {
                        slidesPerView: 2,
                        spaceBetween: 15,
                    },
                    576: {
                        slidesPerView: 2.5,
                        spaceBetween: 20,
                    },
                    992: {
                        slidesPerView: 3,
                        spaceBetween: 25,
                    },
                    1200: {
                        slidesPerView: 4,
                        spaceBetween: 30,
                    },
                }}
                className="category-swiper"
            >
                {categories.map((i) => (
                    <SwiperSlide key={i.id}>
                        <div className="category-card my-4" onClick={() => navigate(`/shop?category=${i.slug}`)}>
                            <div className="icon-box">
                                {i.img_url ? (
                                    <img src={i.img_url} alt={i.name_az} />
                                ) : (
                                    <div className="image-placeholder" />
                                )}
                            </div>
                            <div className="category-label">
                                <span>{i.name_en}</span>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default CategoryCarousel;