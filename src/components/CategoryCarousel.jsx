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
          <h1 className="text-center">TOP CATEGORIES FOR YOU</h1>
            
            <Swiper
                slidesPerView={4}
                spaceBetween={30}
                freeMode={true}
                pagination={{ clickable: true }}
                modules={[FreeMode, Pagination]}
                className="category-swiper"
            >
                {categories.map((i) => (
                    <SwiperSlide key={i.id}>
                        <div className="category-card my-4">
                            <div className="icon-box">
                                <img src={i.icon} alt={i.name} />
                            </div>
                            <div className="category-label">
                                <span>{i.name}</span>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default CategoryCarousel