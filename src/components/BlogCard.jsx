import { NavLink } from "react-router-dom";
import "../assets/scss/BlogCard.scss";

const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    }).toUpperCase();
};

const BlogCard = ({ post }) => {
    const {
        slug,
        title,
        summary,
        author_name,
        post_date,
        read_time,
        banner_url,
    } = post;

    return (
        <div className="blog-card">
            <div className="img-box">
                <NavLink to={`/blog/${slug}`}>
                    <img src={banner_url} alt={title} />
                </NavLink>
                <div className="blog-meta">
                    <span className="category">{read_time?.toUpperCase()}</span>
                    <span className="separator">/</span>
                    <span className="date">{formatDate(post_date)}</span>
                    <span className="separator">/</span>
                    <span className="author">BY {author_name?.toUpperCase()}</span>
                </div>
            </div>

            <h3 className="blog-title">
                <NavLink to={`/blog/${slug}`}>{title}</NavLink>
            </h3>

            <p className="blog-description">{summary}</p>

            <NavLink to={`/blog/${slug}`} className="read-more">
                Read More
            </NavLink>
        </div>
    );
};

export default BlogCard;