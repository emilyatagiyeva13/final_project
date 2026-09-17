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
    const [products, setProducts] = useState([]);

    useEffect(() => {
        if (wishlist.length === 0) {
            setProducts([]);
            return;
        }

        const fetchProducts = async () => {
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
        };

        fetchProducts();
    }, [wishlist]);

    if (wishlistLoading) {
        return (
            <div className="wishlist-status">
                <Loader />
            </div>
        );
    }

    return (
        <div className="wishlist-page">
            <h1>My Wishlist</h1>
            {products.length === 0 ? (
                <div className="wishlist-empty">
                    <EmptyWishlist/>
                    
                </div>
            ) : (
                <div className="wishlist-grid row">
                    {products.map((p) => (
                        <div key={p.id} className="col-6 col-md-4 col-lg-3 my-3">
                            <SingleCard {...p} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;