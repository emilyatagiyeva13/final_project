import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { FaInstagram, FaTwitter, FaGithub, FaYoutube } from "react-icons/fa"
import logo from "../assets/Images/logo-bokifa.svg"
import "../assets/scss/Footer.scss"
import { supabase } from "../supabaseClient.js"
import { useLocalize } from "../components/hooks/useLocalise.jsx"

const SOCIAL_LINKS = [
  { label: "Instagram", icon: <FaInstagram />, href: "https://instagram.com" },
  { label: "Twitter", icon: <FaTwitter />, href: "https://twitter.com" },
  { label: "GitHub", icon: <FaGithub />, href: "https://github.com" },
  { label: "YouTube", icon: <FaYoutube />, href: "https://youtube.com" },
]

const Footer = () => {
  const { t } = useTranslation("footer")
  const { localize } = useLocalize()

  const [categories, setCategories] = useState([])

  useEffect(() => {
    let isMounted = true

    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, slug, name_az, name_en")
        .order("created_at")

      if (error) {
        console.error("Footer categories fetch error:", error)
      } else if (isMounted) {
        setCategories(data || [])
      }
    }

    fetchCategories()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <footer className="main-footer">
      <div className="footer-top">
        <div className="footer-col brand-col">
          <div className="footer-logo">
            <img src={logo} alt="Bokifa" />
          </div>
          <p className="brand-text">
            {t(
              "brandText",
              "Bokifa draws book lovers of all ages into a community, engage with booklovers and meet their favourite literary personalities."
            )}
          </p>
          <div className="contact-info">
            <div className="phone">
              <span>+(84) - 1800 - 4635</span>
            </div>
            <div className="email">
              <span>contact@example.com</span>
            </div>
          </div>
        </div>

        <div className="footer-col">
          <h4>{t("categories", "Categories")}</h4>
          <ul>
            {categories.map((cat) => (
              <li key={cat.id}>
                <Link to={`/shop?category=${cat.slug}`}>{localize(cat, "name")}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          <h4>{t("support.title", "Customer Support")}</h4>
          <ul>
            <li>
              <Link to="/shop">{t("support.storeList", "Store List")}</Link>
            </li>
            <li>
              <Link to="/contact">{t("support.openingHours", "Opening Hours")}</Link>
            </li>
            <li>
              <Link to="/contact">{t("support.contactUs", "Contact Us")}</Link>
            </li>
            <li>
              <Link to="/contact">{t("support.returnPolicy", "Return Policy")}</Link>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>{t("explore.title", "Explore")}</h4>
          <ul>
            <li>
              <Link to="/about">{t("explore.aboutUs", "About us")}</Link>
            </li>
            <li>
              <Link to="/contact">{t("explore.storeLocator", "Store Locator")}</Link>
            </li>
            <li>
              <Link to="/blog">{t("explore.blogs", "Blogs")}</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="bottom-content">
          <p>
            Copyright © {new Date().getFullYear()} <span className="highlight">Bokifa</span>. All rights reserved
          </p>

          <div className="bottom-right">
            <div className="payment-methods">
              <div className="payment-placeholder">Social :</div>
              <div className="button-container">
                {SOCIAL_LINKS.map(({ label, icon, href }) => (
                  <a
                    key={label}
                    href={href}
                    className="button flex-center"
                    aria-label={label}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer