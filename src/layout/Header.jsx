import { useState } from "react"
import { CiHeart, CiShoppingBasket, CiUser, CiSearch } from "react-icons/ci"
import logo from "../assets/Images/logo-bokifa.svg"
import "../assets/scss/Header.scss"
import { NavLink } from "react-router-dom"

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false)

    return (
        <>
            <nav className="navbar">

                {/* ── TOP NAVBAR ── */}
                <div className="navbar__top container-fluid">

                    {/* Logo + Search */}
                    <div className="navbar__brand">
                        <img src={logo} alt="Bokifa" className="navbar__logo" />

                        <div className="navbar__search">
                            <select className="navbar__search-select">
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
                                className="navbar__search-input"
                            />
                            <button className="navbar__search-btn">
                                <CiSearch className="fs-4" />
                                <span>Search</span>
                            </button>
                        </div>
                    </div>

                    {/* Right Actions */}
                    <div className="navbar__actions">
                        <div className="navbar__lang-currency">
                            <button className="navbar__btn">ENG ▾</button>
                            <button className="navbar__btn">USD ▾</button>
                        </div>

                        <div className="navbar__icons">
                            <div className="navbar__icon">
                                <CiUser />
                            </div>
                            <div className="navbar__icon">
                                <CiHeart />
                                <span className="navbar__icon-badge">4</span>
                            </div>
                            <div className="navbar__icon">
                                <CiShoppingBasket />
                                <span className="navbar__icon-badge">0</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── BOTTOM NAVBAR ── */}
                <div className="navbar__bottom container-fluid">

                    {/* TOGGLER */}
                    <div
                        className="checkboxtoggler"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                    >
                        <div className={`line-1 ${menuOpen ? "open" : ""}`} />
                        <div className={`line-2 ${menuOpen ? "open" : ""}`} />
                        <div className={`line-3 ${menuOpen ? "open" : ""}`} />
                    </div>

                    {/* Nav + Helpline */}
                    <div className="navbar__bottom-right">
                        <div className={`navbar__nav-collapse${menuOpen ? " navbar__nav-collapse--open" : ""}`}>
                            <ul className="navbar__nav-list">
                                <NavLink to="/" className="navbar__nav-item nav-link"><span>Home</span></NavLink>
                                <NavLink to="/shop" className="navbar__nav-item nav-link"><span>Shop</span></NavLink>
                                <NavLink className="navbar__nav-item nav-link"><span>Blogs</span></NavLink>
                                <NavLink to="/aboutus" className="navbar__nav-item nav-link"><span>About Us</span></NavLink>
                                <NavLink to="/contact" className="navbar__nav-item nav-link"><span>Contact</span></NavLink>
                                <NavLink to="/faqs" className="navbar__nav-item nav-link"><span>FAQs</span></NavLink>
                            </ul>
                        </div>

                        <div className="navbar__helpline">
                            Need help? Call Us: <strong>+84 2500 888 33</strong>
                        </div>
                    </div>

                </div>
            </nav>

            <div className="hero" />
        </>
    )
}

export default Header