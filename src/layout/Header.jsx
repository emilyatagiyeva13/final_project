import { useState, useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import { CiHeart, CiShoppingBasket, CiUser, CiSearch, CiLogout } from "react-icons/ci"
import logo from "../assets/Images/logo-bokifa.svg"
import "../assets/scss/Header.scss"
import { Link, NavLink, useNavigate } from "react-router-dom"
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

    const closeMenu = () => setMenuOpen(false)

    const [categories, setCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [query, setQuery] = useState("")
    const [suggestions, setSuggestions] = useState([])
    const [showDropdown, setShowDropdown] = useState(false)
    const [searchLoading, setSearchLoading] = useState(false)
    const searchWrapperRef = useRef(null)

    const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false)
    const categoryDropdownRef = useRef(null)

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

    useEffect(() => {
        const trimmed = query.trim().replace(/[,()%]/g, " ").trim()

        if (trimmed.length < 2) {
            setSuggestions([])
            setShowDropdown(false)
            setSearchLoading(false)
            return
        }

        let cancelled = false

        const timer = setTimeout(async () => {
            let categoryId = null
            if (selectedCategory !== "all") {
                const cat = categories.find((c) => c.slug === selectedCategory)
                if (!cat) {
                    setSuggestions([])
                    setShowDropdown(true)
                    setSearchLoading(false)
                    return
                }
                categoryId = cat.id
            }

            setSearchLoading(true)

            let dbQuery = supabase
                .from("products")
                .select("id, slug, title_az, title_en, price, image_url, category_id")
                .or(`title_az.ilike.%${trimmed}%,title_en.ilike.%${trimmed}%`)
                .eq("is_active", true)
                .limit(6)

            if (categoryId) dbQuery = dbQuery.eq("category_id", categoryId)

            const { data, error } = await dbQuery

            if (cancelled) return

            if (!error) {
                setSuggestions(data || [])
                setShowDropdown(true)
            } else {
                setSuggestions([])
                setShowDropdown(true)
            }
            setSearchLoading(false)
        }, 300)

        return () => {
            cancelled = true
            clearTimeout(timer)
        }
    }, [query, selectedCategory, categories])

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target)) {
                setShowDropdown(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(e.target)) {
                setCategoryDropdownOpen(false)
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

        setQuery("")
        setSelectedCategory("all")
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") goToFullResults()
        if (e.key === "Escape") setShowDropdown(false)
    }

    const handleSuggestionClick = (product) => {
        setShowDropdown(false)
        setQuery("")

        const targetParam = product.slug || product.id
        navigate(`/shop/${targetParam}`)
    }

    const handleLogout = async () => {
    await logout()
    toast.warning(t('user.loggedOut'), {
        position: "top-right",
        autoClose: 3000,
        transition: Bounce,
    })
    navigate("/")
}

    const selectedCategoryLabel = selectedCategory === "all"
        ? t('search.categories.all')
        : (categories.find((c) => c.slug === selectedCategory)
            ? (i18n.language === 'az'
                ? categories.find((c) => c.slug === selectedCategory).name_az
                : categories.find((c) => c.slug === selectedCategory).name_en)
            : t('search.categories.all'))

    const handleCategorySelect = (slug) => {
        setSelectedCategory(slug)
        setCategoryDropdownOpen(false)
    }

    const renderUserBlock = (isMobile = false) => {
        if (authLoading || profileResolving) {
            return <div className="navbar-user-skeleton" />
        }

        if (user) {
            return (
                <div className="navbar-user">
                    <div className="navbar-user-info">
                        <span className="navbar-username" title={username}>{username}</span>
                    </div>
                    <button
                        type="button"
                        className="navbar-logout-btn"
                        onClick={() => {
                            if (isMobile) closeMenu()
                            handleLogout()
                        }}
                        aria-label={t('user.logout')}
                        title={t('user.logout')}
                    >
                        <CiLogout />
                    </button>
                </div>
            )
        }

        return (
            <NavLink
                to="/login"
                className="nav-link user-login-icon"
                aria-label={t('user.login')}
                onClick={closeMenu}
            >
                <CiUser />
                {isMobile && <span>{t('user.login')}</span>}
            </NavLink>
        )
    }

    return (
        <>
            <nav className="navbar">
                <div className="navbar-top container-fluid">
                    <div className="navbar-brand">
                        <Link to='/' className="navbar-logo" onClick={closeMenu}>
                            <img src={logo} alt="Bokifa" />
                        </Link>

                        <div className="navbar-search" ref={searchWrapperRef}>
                            <div
                                className={`navbar-search-category ${categoryDropdownOpen ? "open" : ""}`}
                                ref={categoryDropdownRef}
                                onMouseEnter={() => setCategoryDropdownOpen(true)}
                                onMouseLeave={() => setCategoryDropdownOpen(false)}
                            >
                                <button
                                    type="button"
                                    className="navbar-search-category-btn"
                                    onClick={() => setCategoryDropdownOpen((prev) => !prev)}
                                >
                                    <span>{selectedCategoryLabel}</span>
                                </button>

                                {categoryDropdownOpen && (
                                    <ul className="navbar-search-category-dropdown">
                                        <li
                                            className={`navbar-search-category-item ${selectedCategory === "all" ? "active" : ""}`}
                                            onClick={() => handleCategorySelect("all")}
                                        >
                                            {t('search.categories.all')}
                                        </li>
                                        {categories.map((cat) => (
                                            <li
                                                key={cat.id}
                                                className={`navbar-search-category-item ${selectedCategory === cat.slug ? "active" : ""}`}
                                                onClick={() => handleCategorySelect(cat.slug)}
                                            >
                                                {i18n.language === 'az' ? cat.name_az : cat.name_en}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

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
                                                        onMouseDown={() => handleSuggestionClick(product)}
                                                        style={{ cursor: "pointer" }}
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
                                                                {product.price} $
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                                <div
                                                    className="navbar-search-dropdown-item navbar-search-dropdown-viewall"
                                                    onMouseDown={goToFullResults}
                                                    style={{ cursor: "pointer" }}
                                                >
                                                    {t('search.viewAll')}
                                                </div>
                                            </>
                                        ) : (
                                            <div className="navbar-search-dropdown-item navbar-search-dropdown-empty">
                                                {t('search.noResults')}
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

                    <div className="navbar-actions-wrapper">
                        <div className="navbar-actions">
                            <div className="navbar-settings-group">
                                <div className="navbar-icon">
                                    <LanguageSwitchButton />
                                </div>
                                <div className="navbar-lang-currency d-flex align-items-center">
                                    <ThemeToggle />
                                </div>
                            </div>

                            <div className="navbar-user-actions">

                                <div className="navbar-icon navbar-user-wrapper">
                                    {renderUserBlock(false)}
                                </div>

                                <div className="navbar-icon">
                                    <NavLink to="/wishlist" className="nav-link" aria-label="Wishlist" onClick={closeMenu}>
                                        <CiHeart />
                                    </NavLink>
                                    {wishlistCount > 0 && (
                                        <span className="navbar-icon-badge">{wishlistCount}</span>
                                    )}
                                </div>

                                <div className="navbar-icon">
                                    <NavLink to="/basket" className="nav-link" aria-label="Basket" onClick={closeMenu}>
                                        <CiShoppingBasket />
                                    </NavLink>
                                    {basketCount > 0 && (
                                        <span className="navbar-icon-badge">{basketCount}</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div
                            className="checkboxtoggler"
                            onClick={() => setMenuOpen(!menuOpen)}
                            aria-label="Toggle menu"
                        >
                            <div className={`line-1 ${menuOpen ? "open" : ""}`} />
                            <div className={`line-2 ${menuOpen ? "open" : ""}`} />
                            <div className={`line-3 ${menuOpen ? "open" : ""}`} />
                        </div>
                    </div>
                </div>

                <div className="navbar-bottom container-fluid">
                    <div className="navbar-bottom-right">
                        <div className={`navbar-nav-collapse${menuOpen ? " navbar-nav-collapse--open" : ""}`}>
                            <div className="navbar-user-mobile">
                                {renderUserBlock(true)}
                            </div>

                            <ul className="navbar-nav-list">
                                <li className="navbar-nav-item">
                                    <NavLink to="/" className="nav-link" onClick={closeMenu}><span>{t('nav.home')}</span></NavLink>
                                </li>
                                <li className="navbar-nav-item">
                                    <NavLink to="/shop" className="nav-link" onClick={closeMenu}><span>{t('nav.shop')}</span></NavLink>
                                </li>
                                <li className="navbar-nav-item">
                                    <NavLink to="/blog" className="nav-link" onClick={closeMenu}><span>{t('nav.blogs')}</span></NavLink>
                                </li>
                                <li className="navbar-nav-item">
                                    <NavLink to="/aboutus" className="nav-link" onClick={closeMenu}><span>{t('nav.aboutUs')}</span></NavLink>
                                </li>
                                <li className="navbar-nav-item">
                                    <NavLink to="/contact" className="nav-link" onClick={closeMenu}><span>{t('nav.contact')}</span></NavLink>
                                </li>
                                <li className="navbar-nav-item">
                                    <NavLink to="/faqs" className="nav-link" onClick={closeMenu}><span>{t('nav.faqs')}</span></NavLink>
                                </li>
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