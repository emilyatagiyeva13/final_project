import { IoIosArrowForward } from "react-icons/io"
import libraryimg from "../assets/Images/aboutus.png"
import { Link } from "react-router-dom"
import "../assets/scss/AboutUs.scss"
import { FaSmile } from "react-icons/fa"
import testimonialsData from "../data/aboutus"
const About = () => {
    return (
        <>

            <section className="about-hero">
                <div className="hero-bg">
                    <img src={libraryimg} alt="Library Background" />
                    <div className="overlay"></div>
                </div>

                <div className="container hero-content">
                    <div className="breadcrumb">
                        <Link to="/" className="home-link nav-link">Home</Link>
                        <IoIosArrowForward className="breadcrumb-icon" />
                        <span className="current-page">About Us</span>
                    </div>
                    <h1 className="hero-title" data-aos="fade-up">About Us</h1>
                </div>
            </section>

            <section className="testimonials-section py-5">
                <div className="container">
                    <h2 className="section-title text-center" data-aos="fade-down">What client says</h2>

                    <div className="row g-4 mt-4">
                        {testimonialsData.map((item) => (
                            <div className="col-12 col-md-6 col-lg-4" key={item.id}>
                                <div className="testimonial-card text-center" data-aos="fade-up">
                                    <div className="card-top">
                                        <p className="testimonial-text">{item.text}</p>
                                    </div>
                                    <div className="card-bottom">
                                        <div className="icon-wrapper">
                                            <FaSmile className="client-icon" />
                                        </div>
                                        <h4 className="author-name">{item.author}</h4>
                                        <span className="author-role">{item.role}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


        </>
    )
}

export default About