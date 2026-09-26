import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../context/LangContext.jsx";
import { Bounce, toast } from "react-toastify";
import Swal from "sweetalert2";
import { supabase } from "../supabaseClient";
import "../assets/scss/ProductDetails.scss";
import Loader from "../components/Loader.jsx";
import useCartStore from "../store/useCartStore.js";
import ReviewList from "../components/Feedback/ReviewList.jsx";
import RecommendedProducts from "./RecommendedProducts.jsx";
import { useAuthStore } from "../store/authStore.js";
import { useWishlistStore } from "../store/useWishlistStore.js";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const ProductDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation("shop");
  const { currentLang } = useLanguage();
  const lang = currentLang?.split("-")[0] === "en" ? "en" : "az";

  const cartItems = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useAuthStore((state) => state.user);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const wishlist = useWishlistStore((state) => state.wishlist);
  const isInWishlist = product ? wishlist.includes(product.id) : false;

  const [selectedQty, setSelectedQty] = useState(null);
  const [reviewsRefreshKey] = useState(0);

  const toastOptions = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    transition: Bounce,
  };

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      setSelectedQty(null);

      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          categories ( name_az, name_en, slug ),
          authors ( name, slug, img_url )
        `)
        .eq("slug", slug)
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
  }, [slug]);

  const inCart = product ? cartItems.find((i) => i.id === product.id) : undefined;
  const quantity = selectedQty ?? inCart?.quantity ?? 1;

  const handleQuantityChange = (type) => {
    if (type === "decrease" && quantity > 1) {
      setSelectedQty(quantity - 1);
    } else if (type === "increase" && quantity < (product?.stock || 1)) {
      setSelectedQty(quantity + 1);
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

  const handleWishlistClick = async (e) => {
    e.stopPropagation();
    if (!product) return;

    if (!user) {
      toast.error(t("card.loginRequired"), toastOptions);
      navigate("/login");
      return;
    }

    const wasInWishlist = isInWishlist;
    await toggleWishlist(product.id);

    if (wasInWishlist) {
      toast.info(t("card.removedFromWishlist"), toastOptions);
    } else {
      toast.success(t("card.addedToWishlist"), toastOptions);
    }
  };

  if (loading) {
    return (
      <div className="product-status-wrapper">
        <Loader />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-status-wrapper error">
        <h3>{t("product.notFound")}</h3>
        <button onClick={() => navigate("/")} className="btn-back">
          {t("product.backHome")}
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

  const formattedPublishedDate = product.published_date
    ? new Date(product.published_date).toLocaleDateString(lang === "en" ? "en-GB" : "az-AZ")
    : null;

  return (
    <section className="product-details">
      <div className="container">
        <div className="row g-5 align-items-center">
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

              <div className={`stock-status ${product.stock > 0 ? "in-stock" : "no-stock"}`}>
                <span className="dot"></span>
                <span>
                  {product.stock > 0
                    ? `${t("product.inStock", "Stokda var")}`
                    : t("product.noStock", "Stokda yoxdur")}
                </span>
              </div>

              <div className="specs-table-wrapper">
                <div className="specs-grid">
                  {formattedPublishedDate && (
                    <div className="spec-item">
                      <span className="spec-label">{t("product.publishedDate", "Nəşr tarixi")}</span>
                      <span className="spec-value">{formattedPublishedDate}</span>
                    </div>
                  )}

                  {product.total_pages != null && (
                    <div className="spec-item">
                      <span className="spec-label">{t("product.totalPages", "Səhifə sayı")}</span>
                      <span className="spec-value">{product.total_pages}</span>
                    </div>
                  )}

                  {country && (
                    <div className="spec-item">
                      <span className="spec-label">{t("product.country", "Ölkə")}</span>
                      <span className="spec-value">{country}</span>
                    </div>
                  )}

                  {language && (
                    <div className="spec-item">
                      <span className="spec-label">{t("product.language", "Dil")}</span>
                      <span className="spec-value">{language}</span>
                    </div>
                  )}
                </div>
              </div>

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
                <button
                  className="card-hover-heart"
                  onClick={handleWishlistClick}
                >
                  {isInWishlist ? <FaHeart color="red" /> : <FaRegHeart />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-5">
          <div className="col-12">
            <div className="product-reviews">
              <h2 className="product-reviews__title">
                {t("reviews.sectionTitle")}
              </h2>
              <ReviewList productId={product.id} refreshKey={reviewsRefreshKey} />
            </div>
          </div>
        </div>

        <RecommendedProducts />
      </div>
    </section>
  );
};
export default ProductDetails;