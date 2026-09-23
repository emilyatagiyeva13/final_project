import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import "../assets/scss/ProductDetails.scss";
import Loader from "../components/Loader.jsx";
import useCartStore from "../store/useCartStore.js";

// Statik JSON məlumatı (və ya import edə bilərsiniz)
import staticProduct from "../data/productData.json";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.startsWith("en") ? "en" : "az";

  const cartItems = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [theme, setTheme] = useState("light");

  // Tema dəyişdirici funksiya
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    // Statik datanı simulyasiya edirik
    setLoading(true);
    setTimeout(() => {
      if (staticProduct) {
        setProduct(staticProduct);
      } else {
        setError(true);
      }
      setLoading(false);
    }, 500);
  }, [id]);

  useEffect(() => {
    if (!product) return;
    const existing = cartItems.find((i) => i.id === product.id);
    setQuantity(existing ? existing.quantity : 1);
  }, [product, cartItems]);

  const handleQuantityChange = (type) => {
    if (type === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    } else if (type === "increase" && quantity < (product?.stock || 1)) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleAddToCart = async () => {
    if (!product || product.stock === 0) return;

    if (quantity > product.stock) {
      Swal.fire({
        icon: "warning",
        title: t("product.notEnoughStock", "Kifayət qədər stok yoxdur"),
        text: `${t("product.available", "Mövcud")}: ${product.stock}`,
      });
      return;
    }

    try {
      const existing = cartItems.find((i) => i.id === product.id);
      if (existing) {
        await updateQuantity(product.id, quantity);
      } else {
        await addItem(product);
        if (quantity > 1) {
          await updateQuantity(product.id, quantity);
        }
      }

      toast.success(
        t("product.addedToCart", "Səbətə əlavə edildi") +
          ` (${quantity} ${t("product.pcs", "ədəd")})`
      );
    } catch (err) {
      console.error(err);
      toast.error(t("product.addToCartError", "Səbətə əlavə edilərkən xəta baş verdi"));
    }
  };

  if (loading) {
    return (
      <div className={`product-status-wrapper ${theme}`}>
        <Loader />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={`product-status-wrapper error ${theme}`}>
        <h3>{t("product.notFound", "Axtardığınız kitab tapılmadı")}</h3>
        <button onClick={() => navigate("/")} className="btn-back">
          {t("product.backHome", "Ana Səhifəyə Qayıt")}
        </button>
      </div>
    );
  }

  const title = lang === "en" ? (product.title_en || product.title_az) : (product.title_az || product.title_en);
  const description = lang === "en"
    ? (product.description_en || product.description_az)
    : (product.description_az || product.description_en);
  const categoryName = lang === "en"
    ? (product.categories?.name_en || product.categories?.name_az)
    : (product.categories?.name_az || product.categories?.name_en);

  const inCart = cartItems.find((i) => i.id === product.id);

  return (
    <section className={`modern-product-section ${theme}`}>
      <div className="theme-toggle-container">
        <button className="theme-toggle-btn" onClick={toggleTheme}>
          {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </button>
      </div>

      <div className="modern-container">
        <div className="product-grid">
          {/* Sol: Premium Şəkil Bloku */}
          <div className="product-gallery">
            <div className="image-card">
              <img src={product.image_url} alt={title} />
              {product.stock === 0 && (
                <span className="badge-status out">{t("product.outOfStock", "Tükəndi")}</span>
              )}
              {product.stock > 0 && (
                <span className="badge-status in">{t("product.inStock", "Stokda var")}</span>
              )}
            </div>
          </div>

          {/* Sağ: Məlumat və Alqı-Satqı Paneli */}
          <div className="product-content">
            <div className="category-tag">{categoryName}</div>
            <h1 className="product-heading">{title}</h1>

            {product.authors && (
              <div className="author-box" onClick={() => navigate(`/author/${product.authors.slug}`)}>
                <img src={product.authors.img_url} alt={product.authors.name} />
                <div>
                  <span className="author-label">Müəllif / Author</span>
                  <h4 className="author-title">{product.authors.name}</h4>
                </div>
              </div>
            )}

            <div className="price-review-row">
              <div className="price-box">
                <span className="currency">₼</span>
                <span className="amount">{product.price}</span>
              </div>
              {product.rating && (
                <div className="review-box">
                  ⭐ <span className="score">{product.rating}</span>
                </div>
              )}
            </div>

            <p className="product-description">{description}</p>

            <div className="stats-row">
              <div className="stat-item">
                <span>Satılıb / Sold:</span>
                <strong>{product.sold_count}</strong>
              </div>
              <div className="stat-item">
                <span>Stok / Stock:</span>
                <strong>{product.stock} {t("product.pcs", "ədəd")}</strong>
              </div>
            </div>

            {inCart && (
              <div className="cart-alert">
                🛒 {t("product.alreadyInCart", "Səbətdə artıq var")}: <strong>{inCart.quantity} {t("product.pcs", "ədəd")}</strong>
              </div>
            )}

            <div className="purchase-actions">
              {product.stock > 0 && (
                <div className="counter-box">
                  <button onClick={() => handleQuantityChange("decrease")} disabled={quantity <= 1}>-</button>
                  <span>{quantity}</span>
                  <button onClick={() => handleQuantityChange("increase")} disabled={quantity >= product.stock}>+</button>
                </div>
              )}

              <button 
                className="checkout-btn" 
                disabled={product.stock === 0}
                onClick={handleAddToCart}
              >
                {product.stock === 0
                  ? t("product.noStock", "Stokda yoxdur")
                  : inCart
                  ? t("product.updateCart", "Səbəti yenilə")
                  : t("product.addToCart", "Səbətə əlavə et")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;