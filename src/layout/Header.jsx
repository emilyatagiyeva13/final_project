import { useState, useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import { CiHeart, CiShoppingBasket, CiUser, CiSearch, CiLogout } from "react-icons/ci"
import logo from "../assets/Images/logo-bokifa.svg"
import "../assets/scss/Header.scss"
import { NavLink, useNavigate } from "react-router-dom"
import ThemeToggle from "../components/ThemeToggle"
import LanguageSwitchButton from "../components/LangButton.jsx"
import { useAuthStore } from "../store/authStore.js"
import { useWishlistStore } from "../store/useWishlistStore.js"
import useCartStore from "../store/useCartStore.js"
import { Bounce, toast } from "react-toastify"
import { supabase } from "../supabaseClient.js"

const Header = () => {
    const { t, i18n } = useTranslation('header')
    const [menuOpen, setMenuOpen] = useState(false)
    const navigate = useNavigate()

    const user = useAuthStore((state) => state.user)
    const profile = useAuthStore((state) => state.profile)
    const authLoading = useAuthStore((state) => state.loading)
    const logout = useAuthStore((state) => state.logout)

    const profileResolving = !!user && !profile
    const username = profile?.username || ""

    const wishlistCount = useWishlistStore((state) => state.wishlist.length)
    const basketCount = useCartStore((state) =>
        state.items.reduce((sum, item) => sum + item.quantity, 0)
    )

    // --- Search state ---
    const [categories, setCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [query, setQuery] = useState("")
    const [suggestions, setSuggestions] = useState([])
    const [showDropdown, setShowDropdown] = useState(false)
    const [searchLoading, setSearchLoading] = useState(false)
    const searchWrapperRef = useRef(null)

    // Kateqoriyaları Supabase-dən çəkirik
    useEffect(() => {
        const fetchCategories = async () => {
            const { data, error } = await supabase
                .from("categories")
                .select("id, slug, name_az, name_en")
                .order("created_at")

            if (!error && data) setCategories(data)
        }
        fetchCategories()
    }, [])

    // Canlı axtarış: 2 hərfdən sonra, 300ms debounce
    useEffect(() => {
        const trimmed = query.trim()

        if (trimmed.length < 2) {
            setSuggestions([])
            setShowDropdown(false)
            return
        }

        const timer = setTimeout(async () => {
            setSearchLoading(true)

            let dbQuery = supabase
                .from("products")
                .select("id, slug, title_az, title_en, price, image_url, category_id")
                .or(`title_az.ilike.%${trimmed}%,title_en.ilike.%${trimmed}%`)
                .eq("is_active", true)
                .limit(6)

            if (selectedCategory !== "all") {
                const cat = categories.find((c) => c.slug === selectedCategory)
                if (cat) dbQuery = dbQuery.eq("category_id", cat.id)
            }

            const { data, error } = await dbQuery

            if (!error) {
                setSuggestions(data || [])
                setShowDropdown(true)
            }
            setSearchLoading(false)
        }, 300)

        return () => clearTimeout(timer)
    }, [query, selectedCategory, categories])

    // Dropdown-dan kənara klikləndikdə bağlanması
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target)) {
                setShowDropdown(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const goToFullResults = () => {
        const trimmed = query.trim()
        if (!trimmed) return

        const params = new URLSearchParams()
        params.set("q", trimmed)
        if (selectedCategory !== "all") params.set("category", selectedCategory)

        setShowDropdown(false)
        navigate(`/shop?${params.toString()}`)
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") goToFullResults()
        if (e.key === "Escape") setShowDropdown(false)
    }

    const handleSuggestionClick = (product) => {
        setShowDropdown(false)
        setQuery("")
        navigate(`/product/${product.slug}`)
    }

    const handleLogout = async () => {
        await logout()
        toast.warning("You logged out from your account", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            transition: Bounce,
        })
        navigate("/")
    }

    return (
        <>
            <nav className="navbar">
                <div className="navbar-top container-fluid">
                    <div className="navbar-brand">
                        <img src={logo} alt="Bokifa" className="navbar-logo" />

                        <div className="navbar-search" ref={searchWrapperRef}>
                            <select
                                className="navbar-search-select"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                <option value="all">{t('search.categories.all')}</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.slug}>
                                        {i18n.language === 'az' ? cat.name_az : cat.name_en}
                                    </option>
                                ))}
                            </select>

                            <div className="navbar-search-input-wrapper">
                                <input
                                    type="text"
                                    placeholder={t('search.placeholder')}
                                    className="navbar-search-input"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    onFocus={() => query.trim().length >= 2 && setShowDropdown(true)}
                                />

                                {showDropdown && (
                                    <div className="navbar-search-dropdown">
                                        {searchLoading ? (
                                            <div className="navbar-search-dropdown-item navbar-search-dropdown-empty">
                                                {t('search.loading', 'Axtarılır...')}
                                            </div>
                                        ) : suggestions.length > 0 ? (
                                            <>
                                                {suggestions.map((product) => (
                                                    <div
                                                        key={product.id}
                                                        className="navbar-search-dropdown-item"
                                                        onClick={() => handleSuggestionClick(product)}
                                                    >
                                                        <img
                                                            src={product.image_url}
                                                            alt={i18n.language === 'az' ? product.title_az : product.title_en}
                                                            className="navbar-search-dropdown-img"
                                                        />
                                                        <div className="navbar-search-dropdown-info">
                                                            <span className="navbar-search-dropdown-title">
                                                                {i18n.language === 'az' ? product.title_az : product.title_en}
                                                            </span>
                                                            <span className="navbar-search-dropdown-price">
                                                                {product.price} ₼
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                                <div
                                                    className="navbar-search-dropdown-item navbar-search-dropdown-viewall"
                                                    onClick={goToFullResults}
                                                >
                                                    {t('search.viewAll', 'Bütün nəticələrə bax')}
                                                </div>
                                            </>
                                        ) : (
                                            <div className="navbar-search-dropdown-item navbar-search-dropdown-empty">
                                                {t('search.noResults', 'Nəticə tapılmadı')}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <button className="navbar-search-btn" onClick={goToFullResults}>
                                <CiSearch className="fs-4" />
                                <span>{t('search.button')}</span>
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
                            <div className="navbar-icon navbar-user-wrapper">
                                {authLoading || profileResolving ? (
                                    <div className="navbar-user-skeleton" />
                                ) : user ? (
                                    <div className="navbar-user">
                                        <div className="navbar-user-info">
                                            <span className="navbar-username" title={username}>{username}</span>
                                        </div>
                                        <button
                                            type="button"
                                            className="navbar-logout-btn"
                                            onClick={handleLogout}
                                            aria-label={t('user.logout')}
                                            title={t('user.logout')}
                                        >
                                            <CiLogout />
                                        </button>
                                    </div>
                                ) : (
                                    <NavLink to="/login" className="nav-link user-login-icon" aria-label={t('user.login')}>
                                        <CiUser />
                                    </NavLink>
                                )}
                            </div>

                            <div className="navbar-icon">
                                <NavLink to="/wishlist" className="nav-link" aria-label="Wishlist">
                                    <CiHeart />
                                </NavLink>
                                {wishlistCount > 0 && (
                                    <span className="navbar-icon-badge">{wishlistCount}</span>
                                )}
                            </div>

                            <div className="navbar-icon">
                                <NavLink to="/basket" className="nav-link" aria-label="Basket">
                                    <CiShoppingBasket />
                                </NavLink>
                                {basketCount > 0 && (
                                    <span className="navbar-icon-badge">{basketCount}</span>
                                )}
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
                                <NavLink to="/" className="navbar-nav-item nav-link"><span>{t('nav.home')}</span></NavLink>
                                <NavLink to="/shop" className="navbar-nav-item nav-link"><span>{t('nav.shop')}</span></NavLink>
                                <NavLink to="/blog" className="navbar-nav-item nav-link"><span>{t('nav.blogs')}</span></NavLink>
                                <NavLink to="/aboutus" className="navbar-nav-item nav-link"><span>{t('nav.aboutUs')}</span></NavLink>
                                <NavLink to="/contact" className="navbar-nav-item nav-link"><span>{t('nav.contact')}</span></NavLink>
                                <NavLink to="/faqs" className="navbar-nav-item nav-link"><span>{t('nav.faqs')}</span></NavLink>
                            </ul>
                        </div>

                        <div className="navbar-helpline">
                            {t('help.text')} <strong>+84 2500 888 33</strong>
                        </div>
                    </div>
                </div>
            </nav>
            <div className="hero" />
        </>
    )
}

export default Header