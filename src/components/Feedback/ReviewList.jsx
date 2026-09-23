import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { useTranslation } from "react-i18next";
import "../../assets/scss/ReviewList.scss";

export default function ReviewList({ productId, refreshKey }) {
  const { t, i18n } = useTranslation('common');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!productId) return;

    const fetchReviews = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("reviews")
        .select(
          `
          id,
          rating,
          comment,
          created_at,
          user_id,
          profiles ( username )
        `
        )
        .eq("product_id", productId)
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setReviews(data);
      }
      setLoading(false);
    };

    fetchReviews();
  }, [productId, refreshKey]);

  if (loading) return <p className="review-list__status">{t("reviews.loading", "Yüklənir...")}</p>;
  if (error) return <p className="review-list__status review-list__status--error">{error}</p>;
  if (reviews.length === 0)
    return <p className="review-list__status">{t("reviews.empty", "Hələ rəy yoxdur. İlk rəyi sən yaz!")}</p>;

  return (
    <ul className="review-list">
      {reviews.map((review) => (
        <li key={review.id} className="review-list__item">
          <div className="review-list__header">
            <span className="review-list__author">
              {review.profiles?.username || t("reviews.anonymous", "İstifadəçi")}
            </span>
            <span className="review-list__stars" aria-label={t("reviews.ratingAria", "{{rating}} / 5", { rating: review.rating })}>
              {"★".repeat(review.rating)}
              {"☆".repeat(5 - review.rating)}
            </span>
          </div>
          {review.comment && <p className="review-list__comment">{review.comment}</p>}
          <span className="review-list__date">
            {new Date(review.created_at).toLocaleDateString(i18n.language === 'az' ? 'az-AZ' : 'en-US')}
          </span>
        </li>
      ))}
    </ul>
  );
}