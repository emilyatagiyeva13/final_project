import { useState, useEffect, useMemo } from "react";
import { NavLink } from "react-router-dom";
import "../assets/scss/Blog.scss";
import { MdKeyboardArrowRight } from "react-icons/md";
import BlogCard from "../components/BlogCard";
import { supabase } from "../supabaseClient.js";
import Loader from "../components/Loader";
import { useLocalize } from "../components/hooks/useLocalise.jsx";
import { useTranslation } from "react-i18next";

const BLOG_HERO_URL = "https://zjagsvlmvgzvkjndcviz.supabase.co/storage/v1/object/public/blog_posts_img/blog-hero.jpg";

const Blog = () => {
    const { localize } = useLocalize();
    const { t } = useTranslation('blog')

    const [rawPosts, setRawPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            const { data, error } = await supabase
                .from("blog_cards")
                .select("*")
                .order("sort_order");

            if (error) {
                console.error("Blog fetch error:", error);
            } else {
                setRawPosts(data);
            }
            setLoading(false);
        };

        fetchPosts();
    }, []);
    const posts = useMemo(
        () =>
            rawPosts.map((post) => ({
                ...post,
                title: localize(post, "title"),
                summary: localize(post, "summary"),
                read_time: localize(post, "read_time"),
                content: localize(post, "content"),
            })),
        [rawPosts, localize]
    );

    if (loading) {
        return (
            <div className="loader-container">
                <Loader />
            </div>
        );
    }

    return (
        <div className="blog-page-container">
            <div className="hero-box">
                <img src={BLOG_HERO_URL} alt="Blog Hero" className="blog-hero-img" />
                <div className="hero-content-overlay">
                    <div className="hero-inner">
                        <h1 className="hero-title">{t('header_page')}</h1>
                        <div className="breadcrumb-wrapper">
                            <NavLink to="/" className="nav-link">{t('home')}</NavLink>
                            <span className="arrow-icon">
                                <MdKeyboardArrowRight />
                            </span>
                            <span className="current-page">{t('header_page')}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Blog Cards Section - Mərkəzləşdirilmiş */}
            <div className="container py-5">
                <div className="blog-cards-box">
                    {loading ? (
                        <div className="loader-wrapper">
                            <Loader />
                        </div>
                    ) : (
                        posts.map((post) => (
                            <BlogCard key={post.id} post={post} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Blog;