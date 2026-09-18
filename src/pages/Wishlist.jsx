import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient.js";
import { useWishlistStore } from "../store/useWishlistStore.js";
import SingleCard from "../components/SingleCard";
import Loader from "../components/Loader";
import "../assets/scss/Wishlist.scss";
import EmptyWishlist from "../components/EmptyWishList.jsx";

const Wishlist = () => {
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
                    description_az,
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
          author: book.authors?.name,
        }));
        setProducts(formatted);
      }
      setProductsLoading(false);
    };

    fetchProducts();
  }, [wishlist]);

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
        <h1>My Wishlist</h1>
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