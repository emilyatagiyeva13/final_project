import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "../assets/scss/ProductDetails.scss";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

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

  const handleQuantityChange = (type) => {
    if (type === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    } else if (type === "increase" && quantity < (product?.stock || 1)) {
      setQuantity((prev) => prev + 1);
    }
  };

  if (loading) {
    return (
      <div className="product-status-wrapper">
        <div className="spinner"></div>
        <p>Kitab məlumatları yüklənir...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-status-wrapper error">
        <h3>Axtardığınız kitab tapılmadı</h3>
        <button onClick={() => navigate("/")} className="btn-back">
          Ana Səhifəyə Qayıt
        </button>
      </div>
    );
  }

  return (
    <section className="product-details">
      <div className="container">
        <div className="row g-5 align-items-center">
          {/* Sol: Şəkil Qalereyası/Sferası */}
          <div className="col-12 col-lg-5">
            <div className="product-img-wrapper">
              <img
                src={product.image_url}
                alt={product.title_az}
                className="product-img"
              />
              {product.stock === 0 && (
                <div className="out-of-stock-badge">Tükəndi</div>
              )}
            </div>
          </div>

          {/* Sağ: Məhsul Məlumatları */}
          <div className="col-12 col-lg-7">
            <div className="product-info">
              {product.categories?.name_az && (
                <span className="category-badge">
                  {product.categories.name_az}
                </span>
              )}

              <h1 className="product-title">{product.title_az}</h1>

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
                <div className="price-tag">{product.price} ₼</div>
                {product.rating && (
                  <div className="rating-badge">
                    <span className="star">★</span>
                    <span>{product.rating}</span>
                  </div>
                )}
              </div>

              <p className="description">{product.description_az}</p>

              <div className="meta-info">
                <div className={`meta-item ${product.stock > 0 ? "in-stock" : "no-stock"}`}>
                  <span className="dot"></span>
                  <span>{product.stock > 0 ? `Stokda var (${product.stock} ədəd)` : "Stokda yoxdur"}</span>
                </div>
                <div className="meta-item">
                  <span className="label">Satılıb:</span>
                  <span className="value">{product.sold_count ?? 0}</span>
                </div>
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
                >
                  {product.stock === 0 ? "Stokda yoxdur" : "Səbətə əlavə et"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;