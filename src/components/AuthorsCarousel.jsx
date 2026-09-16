import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/navigation';
import "../assets/scss/AuthorsCarousel.scss"
import { supabase } from "../supabaseClient";

const AuthorsCarousel = () => {
    const [authors, setAuthors] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAuthors = async () => {
            const { data, error } = await supabase
                .from("authors")
                .select("id, slug, name, img_url")
                .order("name");

            if (error) {
                console.error("Authors fetch error:", error);
            } else {
                setAuthors(data);
            }
            setLoading(false);
        };

        fetchAuthors();
    }, []);

    if (loading) return null;

    const handleAuthorClick = (slug) => {
        navigate(`/shop?author=${slug}`);
    };

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
                            <div
                                className="author-card my-3"
                                onClick={() => handleAuthorClick(author.slug)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        handleAuthorClick(author.slug);
                                    }
                                }}
                            >
                                <div className="author-image-circle">
                                    {author.img_url ? (
                                        <img src={author.img_url} alt={author.name} />
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