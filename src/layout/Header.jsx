import { useState } from "react"
import { CiHeart, CiShoppingBasket, CiUser, CiSearch, CiLogout } from "react-icons/ci"
import logo from "../assets/Images/logo-bokifa.svg"
import "../assets/scss/Header.scss"
import { NavLink, useNavigate } from "react-router-dom"
import ThemeToggle from "../components/ThemeToggle"
import LanguageSwitchButton from "../components/LangButton"
import { useAuthStore } from "../store/authStore.js"

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false)
    const navigate = useNavigate()

    // Öz ayrıca supabase.auth.getSession() çağırışımızı ləğv etdik —
    // bu, refresh zamanı "login olunmayıb" ikonunun bir anlıq görünməsinə
    // (flicker) səbəb olurdu. Bunun əvəzinə App.jsx-də artıq init olunan
    // mərkəzi authStore-a etibar edirik.
    const user = useAuthStore((state) => state.user)
    const profile = useAuthStore((state) => state.profile)
    const authLoading = useAuthStore((state) => state.loading)
    const logout = useAuthStore((state) => state.logout)
    const username = profile?.username || ""

    const handleLogout = async () => {
        await logout()
        navigate("/")
    }

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
                        <div className="navbar-icon">
                            <LanguageSwitchButton />
                        </div>
                        <div className="navbar-lang-currency d-flex align-items-center">
                            <div className="lang-button"></div>
                            <ThemeToggle />
                        </div>
                        <div className="navbar-icons d-flex">

                            <div className="navbar-icon">
                                {authLoading ? (
                                    // authStore hələ init olunur — refresh-dən sonra bir anlıq
                                    // "login olunmayıb" ikonunun görünməsinin (flicker) qarşısını
                                    // almaq üçün nə username, nə də login ikonu göstərilmir
                                    <span className="navbar-icon-placeholder" style={{ width: 24, height: 24, display: "inline-block" }} />
                                ) : user ? (
                                    <div className="navbar-user d-flex align-items-center">
                                        <span className="navbar-username">{username}</span>
                                        <button
                                            type="button"
                                            className="navbar-logout-btn nav-link"
                                            onClick={handleLogout}
                                            aria-label="Logout"
                                        >
                                            <CiLogout />
                                        </button>
                                    </div>
                                ) : (
                                    <NavLink to="/login" className="nav-link"><CiUser /></NavLink>
                                )}
                            </div>

                            <div className="navbar-icon">
                                <NavLink to="/wishlist" className="nav-link"><CiHeart /></NavLink>
                                <span className="navbar-icon-badge">4</span>
                            </div>
                            <div className="navbar-icon">

                                <NavLink to="/basket" className="nav-link"><CiShoppingBasket /> </NavLink>
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