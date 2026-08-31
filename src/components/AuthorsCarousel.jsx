import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/navigation';
import "../assets/scss/AuthorsCarousel.scss"
import tolkienImg from "../assets/Images/authors/tolkien.jpg";
import georgeImg from "../assets/Images/authors/george.webp";
import rowlingImg from "../assets/Images/authors/rowling.webp";
import shakesImg from "../assets/Images/authors/shakes.jpeg";
import antonImg from "../assets/Images/authors/anton.webp";



const authors = [
    { id: 1, name: "Anton Chekhov", img: antonImg },
    { id: 2, name: "J.R.R. Tolkien", img: tolkienImg },
    { id: 3, name: "George R.R. Martin", img: georgeImg },
    { id: 4, name: "J.K. Rowling", img: rowlingImg },
    { id: 5, name: "William Shakespeare", img: shakesImg },
    { id: 5, name: "William Shakespeare", img: shakesImg },
    { id: 5, name: "William Shakespeare", img: shakesImg },
    { id: 5, name: "William Shakespeare", img: shakesImg },
];

const AuthorsCarousel = () => {
    return (
        <section className="authors-section">
            <h1 className="text-center">Featured authors</h1>

            <div className="authors-carousel-wrapper">
                <Swiper
                    slidesPerView={5}
                    spaceBetween={20}
                    navigation={true}
                    modules={[Navigation]}
                    breakpoints={{
                        320: { slidesPerView: 2 },
                        768: { slidesPerView: 3 },
                        1024: { slidesPerView: 5 },
                    }}
                    className="authors-swiper"
                >
                    {authors.map((author) => (
                        <SwiperSlide key={author.id}>
                            <div className="author-card my-3">
                                <div className="author-image-circle">
                                    {author.img ? (
                                        <img src={author.img} alt={author.name} />
                                    ) : (
                                        <div className="image-placeholder" />
                                    )}
                                </div>
                                <h4 className="author-name">{author.name}</h4>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default AuthorsCarousel;