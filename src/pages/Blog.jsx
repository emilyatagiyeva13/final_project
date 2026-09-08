import { NavLink } from "react-router-dom";
import blogImg from "../assets/Images/blog.jpg"
import "../assets/scss/Blog.scss";
import { MdKeyboardArrowRight } from "react-icons/md";
const Blog = () => {
    return (
        <>
            <div className="hero-box">
                <img src={blogImg} size={100} className="blog-hero-img" />
                <div className="content">
                    <div className="d-flex">
                        <NavLink to={"/"} className="nav-link">Home</NavLink>
                        <p> <MdKeyboardArrowRight /> Blogs</p>
                    </div>
                </div>
            </div>



        </>
    )
}

export default Blog;