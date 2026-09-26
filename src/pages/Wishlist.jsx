import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient.js";
import { useWishlistStore } from "../store/useWishlistStore.js";
import SingleCard from "../components/SingleCard";
import Loader from "../components/Loader";
import "../assets/scss/WishList.scss";
import EmptyWishlist from "../components/EmptyWishList.jsx";
import { useTranslation } from "react-i18next";

const Wishlist = () => {
  const { t, i18n } = useTranslation("common");
  const lang = i18n.language;

  const wishlist = useWishlistStore((state) => state.wishlist);
  const wishlistLoading = useWishlistStore((state) => state.loading);
  const fetchWishlist = useWishlistStore((state) => state.fetchWishlist);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  useEffect(() => {
    if (wishlist.length === 0) {
      setProducts([]);
      setProductsLoading(false);
      return;
    }

    const fetchProducts = async () => {
      setProductsLoading(true);

      const { data, error } = await supabase
        .from("products")
        .select(`
                    id,
                    slug,
                    title_az,
                    title_en,
                    description_az,
                    description_en,
                    price,
                    stock,
                    image_url,
                    rating,
                    sold_count,
                    categories ( slug, name_az, name_en ),
                    authors ( name, slug )
                `)
        .in("id", wishlist);

      if (error) {
        console.error("Wishlist products fetch error:", error);
      } else {
        const formatted = data.map((book) => ({
          ...book,
          title: lang === "en" ? book.title_en : book.title_az,
          description: lang === "en" ? book.description_en : book.description_az,
          category: lang === "en" ? book.categories?.name_en : book.categories?.name_az,
          author: book.authors?.name,
        }));
        setProducts(formatted);
      }
      setProductsLoading(false);
    };

    fetchProducts();
  }, [wishlist, lang]);

  if (wishlistLoading || productsLoading) {
    return (
      <div className="wishlist-status">
        <Loader />
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="container">
        <div className="wishlist-header">
          <h1>{t('wishlist.header')}</h1>
          {products.length > 0 && (
            <div className="wishlist-count-badge">
            {t('wishlist.total-product')}: <span>{products.length}</span>
            </div>
          )}
        </div>

        {products.length === 0 ? (
          <div className="wishlist-empty">
            <EmptyWishlist />
          </div>
        ) : (
          <div className="row wishlist-grid">
            {products.map((p) => (
              <div key={p.id} className="col-12 col-sm-6 col-md-4 col-lg-4 mb-4">
                <SingleCard {...p} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;