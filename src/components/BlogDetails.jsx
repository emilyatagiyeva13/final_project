import { useState, useEffect } from "react";
import { useParams, NavLink } from "react-router-dom";
import { supabase } from "../supabaseClient.js";
import { MdCalendarToday, MdPerson } from "react-icons/md";
import Loader from "../components/Loader";
import "../assets/scss/BlogDetails.scss";

const BlogDetails = () => {
    const { id } = useParams(); // URL-dən slug gəlir
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPostDetails = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from("blog_cards")
                .select("*")
                .eq("slug", id)
                .single();

            if (error) {
                console.error("Error fetching blog details:", error);
            } else {
                setPost(data);
            }
            setLoading(false);
        };

        fetchPostDetails();
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) {
        return (
            <div className="loader-container">
                <Loader />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="not-found-container">
                <h2>No topics</h2>
                <NavLink to="/blog" className="back-btn">Back to blog page</NavLink>
            </div>
        );
    }

    return (
        <div className="blog-details-page">
            

            <article className="blog-article container">
                <header className="article-header">
                    <h1 className="article-title">{post.title}</h1>

                    <div className="article-meta">
                        <span className="meta-item">
                            <MdPerson /> {post.author_name}
                        </span>
                        <span className="separator">•</span>
                        <span className="meta-item">
                            <MdCalendarToday /> {post.post_date}
                        </span>
                        <span className="separator">•</span>
                        <span className="meta-item">{post.read_time}</span>
                    </div>
                </header>

                <div className="article-image-box">
                    <img src={post.banner_url} alt={post.title} />
                </div>

                <div className="article-content">
                    <p>{post.content}</p>
                </div>

                <div className="article-footer">
                    <NavLink to="/blog" className="back-to-blogs-btn">
                        ← Back to all blogs
                    </NavLink>
                </div>
            </article>
        </div>
    );
};

export default BlogDetails;