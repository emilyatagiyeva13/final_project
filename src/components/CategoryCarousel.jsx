import { FreeMode, Pagination } from "swiper/modules"
import 'swiper/css';
import 'swiper/css/pagination';
import { SwiperSlide, Swiper } from "swiper/react";
import "../assets/scss/CategorySlider.scss"
import cat1 from "../assets/Images/categories_icons/home_icon.png"
import cat2 from "../assets/Images/categories_icons/fantasy.png"
import cat3 from "../assets/Images/categories_icons/biography_icon.png"
import cat4 from "../assets/Images/categories_icons/history_icon.png"
import cat5 from "../assets/Images/categories_icons/kids_icon.png"
import cat6 from "../assets/Images/categories_icons/romance_icon.png"
import cat7 from "../assets/Images/categories_icons/detective.png"

const categories = [
    { id: 1, name: "HOME", icon: cat1 },
    { id: 2, name: "FANTASY", icon: cat2 },
    { id: 3, name: "BIOGRAPHY", icon: cat3 },
    { id: 4, name: "HISTORY", icon: cat4 },
    { id: 5, name: "KIDS", icon: cat5 },
    { id: 6, name: "ROMANTICSM", icon: cat6 },
    { id: 7, name: "DEDECTIVE", icon: cat7 },
];

const CategoryCarousel = () => {
    return (
        <div className="category-carousel-container">
            <Swiper
                slidesPerView={3}
                spaceBetween={30}
                freeMode={true}
                pagination={{ clickable: true }}
                modules={[FreeMode, Pagination]}
                className="category-swiper"
            >
                {categories.map((cat) => (
                    <SwiperSlide key={cat.id}>
                        <div className="category-card">
                            <div className="icon-box">
                                <img src={cat.icon} alt={cat.name} />
                            </div>
                            <div className="category-label">
                                <span>{cat.name}</span>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default CategoryCarousel