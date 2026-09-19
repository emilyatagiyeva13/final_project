import { useState, useEffect, useMemo } from "react";
import { useParams, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "../supabaseClient.js";
import { MdCalendarToday, MdPerson } from "react-icons/md";
import Loader from "../components/Loader";
import "../assets/scss/BlogDetails.scss";
import { useLocalize } from "../components/hooks/useLocalise.jsx";

const BlogDetails = () => {
    const { id } = useParams(); // URL-dən slug gəlir
    const { t } = useTranslation("blog");
    const { localize } = useLocalize();
    const [rawPost, setRawPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPostDetails = async () => {
            setLoading(true);
            // select("*") title_az, content_az, read_time_az sütunlarını da gətirir
            const { data, error } = await supabase
                .from("blog_cards")
                .select("*")
                .eq("slug", id)
                .single();

            if (error) {
                console.error("Error fetching blog details:", error);
            } else {
                setRawPost(data);
            }
            setLoading(false);
        };

        fetchPostDetails();
        window.scrollTo(0, 0);
    }, [id]);

    // Dil dəyişəndə yenidən sorğu göndərmədən mətnlər dilə görə hazırlanır.
    // Aşağıdakı kod post.title, post.content, post.read_time oxumağa davam edir.
    // Hook-lar şərti return-lərdən əvvəl çağırılmalıdır.
    const post = useMemo(() => {
        if (!rawPost) return null;
        return {
            ...rawPost,
            title: localize(rawPost, "title"),
            content: localize(rawPost, "content"),
            read_time: localize(rawPost, "read_time"),
        };
    }, [rawPost, localize]);

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
                <h2>{t("details.notFound")}</h2>
                <NavLink to="/blog" className="back-btn">{t("details.backToBlog")}</NavLink>
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
                        {t("details.backToAll")}
                    </NavLink>
                </div>
            </article>
        </div>
    );
};

export default BlogDetails;