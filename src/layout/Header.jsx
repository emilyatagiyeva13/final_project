import { useState } from "react"
import { CiHeart, CiShoppingBasket, CiUser, CiSearch } from "react-icons/ci"
import logo from "../assets/Images/logo-bokifa.svg"
import "../assets/scss/_Header.scss"
import { NavLink } from "react-router-dom"
import ThemeToggle from "../components/ThemeToggle"

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false)
    return (
        <>
            <nav className="navbar">

                <div className="navbar-top container-fluid">

                    <div className="navbar-brand">
                        <img src={logo} alt="Bokifa" className="navbar-logo" />

                        <div className="navbar-search">
                            <select className="navbar-search-select">
                                <option>All</option>
                                <option>Books</option>
                                <option>Fiction</option>
                                <option>Kids Books</option>
                                <option>Non Fiction</option>
                                <option>Young Adult</option>
                            </select>
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="navbar-search-input"
                            />
                            <button className="navbar-search-btn">
                                <CiSearch className="fs-4" />
                                <span>Search</span>
                            </button>
                        </div>
                    </div>

                    <div className="navbar-actions">
                        <div className="navbar-lang-currency d-flex align-items-center">
                            <div className="lang-button"></div>
                            <ThemeToggle/>



                        </div>

                        <div className="navbar-icons">
                            <div className="navbar-icon">
                                <CiUser />
                            </div>
                            <div className="navbar-icon">
                                <CiHeart />
                                <span className="navbar-icon-badge">4</span>
                            </div>
                            <div className="navbar-icon">
                                <CiShoppingBasket />
                                <span className="navbar-icon-badge">0</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="navbar-bottom container-fluid">

                    <div
                        className="checkboxtoggler"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                    >
                        <div className={`line-1 ${menuOpen ? "open" : ""}`} />
                        <div className={`line-2 ${menuOpen ? "open" : ""}`} />
                        <div className={`line-3 ${menuOpen ? "open" : ""}`} />
                    </div>

                    <div className="navbar-bottom-right">
                        <div className={`navbar-nav-collapse${menuOpen ? " navbar-nav-collapse--open" : ""}`}>
                            <ul className="navbar-nav-list">
                                <NavLink to="/" className="navbar-nav-item nav-link"><span>Home</span></NavLink>
                                <NavLink to="/shop" className="navbar-nav-item nav-link"><span>Shop</span></NavLink>
                                <NavLink to="/blog" className="navbar-nav-item nav-link"><span>Blogs</span></NavLink>
                                <NavLink to="/aboutus" className="navbar-nav-item nav-link"><span>About Us</span></NavLink>
                                <NavLink to="/contact" className="navbar-nav-item nav-link"><span>Contact</span></NavLink>
                                <NavLink to="/faqs" className="navbar-nav-item nav-link"><span>FAQs</span></NavLink>
                            </ul>
                        </div>

                        <div className="navbar-helpline">
                            Need help? Call Us: <strong>+84 2500 888 33</strong>
                        </div>
                    </div>

                </div>
            </nav >

            <div className="hero" />
        </>
    )
}

export default Header