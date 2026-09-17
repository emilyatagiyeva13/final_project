import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "../assets/scss/Blog.scss";
import { MdKeyboardArrowRight } from "react-icons/md";
import BlogCard from "../components/BlogCard";
import { supabase } from "../supabaseClient.js";
import Loader from "../components/Loader";

const BLOG_HERO_URL = "https://zjagsvlmvgzvkjndcviz.supabase.co/storage/v1/object/public/blog_posts_img/blog-hero.jpg";

const Blog = () => {
    const [posts, setPosts] = useState([]);
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
                setPosts(data);
            }
            setLoading(false);
        };

        fetchPosts();
    }, []);
    if (loading) {
        return (
            <div className="loader-container">
                <Loader />
            </div>
        );
    }

    return (
        <div className="blog-page-container">
            {/* Hero Section */}
            <div className="hero-box">
                <img src={BLOG_HERO_URL} alt="Blog Hero" className="blog-hero-img" />
                <div className="hero-content-overlay">
                    <div className="hero-inner">
                        <h1 className="hero-title">Blogs</h1>
                        <div className="breadcrumb-wrapper">
                            <NavLink to="/" className="nav-link">Home</NavLink>
                            <span className="arrow-icon">
                                <MdKeyboardArrowRight />
                            </span>
                            <span className="current-page">Blogs</span>
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