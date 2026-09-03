import { FreeMode, Pagination } from "swiper/modules"
import 'swiper/css';
import 'swiper/css/pagination';
import { SwiperSlide, Swiper } from "swiper/react";
import "../assets/scss/CategorySlider.scss"
import { category } from "../data/category";

const CategoryCarousel = () => {
    return (
        <div className="category-carousel-container">
            <h1 className="text-center">TOP CATEGORIES FOR YOU</h1>

            <Swiper
                slidesPerView={4}
                spaceBetween={30}
                freeMode={true}
                pagination={{ clickable: true }}
                modules={[FreeMode, Pagination]}
                className="category-swiper"
            >
                {category.map((i) => (
                    <SwiperSlide key={i.id}>
                        <div className="category-card my-4">
                            <div className="icon-box">
                                <img src={i.img} alt={i.category} />
                            </div>
                            <div className="category-label">
                                <span>{i.category}</span>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default CategoryCarousel