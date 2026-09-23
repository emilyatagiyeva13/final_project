import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../context/LangContext.jsx";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { supabase } from "../supabaseClient";
import "../assets/scss/ProductDetails.scss";
import Loader from "../components/Loader.jsx";
import useCartStore from "../store/useCartStore.js";
import { useAuthStore } from "../store/authStore.js";
import ReviewList from "../components/Feedback/ReviewList.jsx"; // öz path-inizə uyğunlaşdırın

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation('shop');
  const { currentLang } = useLanguage();
  const lang = currentLang?.split("-")[0] === "en" ? "en" : "az";

  const cartItems = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  const user = useAuthStore((state) => state.user);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Rəy göndəriləndə ReviewList-i yenidən çəkmək üçün
  const [reviewsRefreshKey, setReviewsRefreshKey] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          categories ( name_az, name_en, slug ),
          authors ( name, slug, img_url )
        `)
        .eq("id", id)
        .single();

      if (error) {
        console.error(error);
        setError(error);
      } else {
        setProduct(data);
      }

      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  // Məhsul (və ya səbət) dəyişəndə quantity-ni səbətdəki mövcud say ilə sinxronlaşdır
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
      <div className="product-status-wrapper">
        <div className="spinner"></div>
        <p><Loader /></p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-status-wrapper error">
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
  const country = lang === "en"
    ? (product.country_en || product.country_az)
    : (product.country_az || product.country_en);
  const language = lang === "en"
    ? (product.language_en || product.language_az)
    : (product.language_az || product.language_en);

  const inCart = cartItems.find((i) => i.id === product.id);

  const formattedPublishedDate = product.published_date
    ? new Date(product.published_date).toLocaleDateString(lang === "en" ? "en-GB" : "az-AZ")
    : null;

  return (
    <section className="product-details">
      <div className="container">
        <div className="row g-5 align-items-center">
          {/* Sol: Şəkil Qalereyası */}
          <div className="col-12 col-lg-5">
            <div className="product-img-wrapper">
              <img
                src={product.image_url}
                alt={title}
                className="product-img"
              />
              {product.stock === 0 && (
                <div className="out-of-stock-badge">{t("product.outOfStock", "Tükəndi")}</div>
              )}
            </div>
          </div>

          {/* Sağ: Məhsul Məlumatları */}
          <div className="col-12 col-lg-7">
            <div className="product-info">
              {categoryName && (
                <span className="category-badge">{categoryName}</span>
              )}

              <h1 className="product-title">{title}</h1>

              {product.authors && (
                <div
                  className="author-card"
                  onClick={() => navigate(`/author/${product.authors.slug}`)}
                >
                  {product.authors.img_url && (
                    <img
                      src={product.authors.img_url}
                      alt={product.authors.name}
                      className="author-avatar"
                    />
                  )}
                  <span className="author-name">{product.authors.name}</span>
                </div>
              )}

              <div className="price-rating-wrapper">
                <div className="price-tag">{product.price} $</div>
                {product.rating && (
                  <div className="rating-badge">
                    <span className="star">★</span>
                    <span>{product.rating}</span>
                  </div>
                )}
              </div>

              <p className="description">{description}</p>

              <div className="meta-info">
                <div className={`meta-item ${product.stock > 0 ? "in-stock" : "no-stock"}`}>
                  <span className="dot"></span>
                  <span>
                    {product.stock > 0
                      ? `${t("product.inStock", "Stokda var")} (${product.stock} ${t("product.pcs", "ədəd")})`
                      : t("product.noStock", "Stokda yoxdur")}
                  </span>
                </div>

                {formattedPublishedDate && (
                  <div className="meta-item">
                    <span className="label">{t("product.publishedDate", "Nəşr tarixi")}:</span>
                    <span className="value">{formattedPublishedDate}</span>
                  </div>
                )}

                {product.total_pages != null && (
                  <div className="meta-item">
                    <span className="label">{t("product.totalPages", "Səhifə sayı")}:</span>
                    <span className="value">{product.total_pages}</span>
                  </div>
                )}

                {country && (
                  <div className="meta-item">
                    <span className="label">{t("product.country", "Ölkə")}:</span>
                    <span className="value">{country}</span>
                  </div>
                )}

                {language && (
                  <div className="meta-item">
                    <span className="label">{t("product.language", "Dil")}:</span>
                    <span className="value">{language}</span>
                  </div>
                )}
              </div>

              {/* Miqdar və Əməliyyatlar */}
              <div className="actions-wrapper">
                {product.stock > 0 && (
                  <div className="quantity-selector">
                    <button
                      onClick={() => handleQuantityChange("decrease")}
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span>{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange("increase")}
                      disabled={quantity >= product.stock}
                    >
                      +
                    </button>
                  </div>
                )}

                <button
                  className="add-to-cart-btn"
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

        {/* ---- Rəylər bölməsi ---- */}
        <div className="row">
          <div className="col-12">
            <div className="product-reviews">
              <h2 className="product-reviews__title">
                {t("reviews.sectionTitle", "Rəylər")}
              </h2>
              <p className="review-list__status">
                {t("reviews.loginToReview", "Rəy yazmaq üçün daxil olun.")}
              </p>
              <ReviewList productId={product.id} refreshKey={reviewsRefreshKey} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;