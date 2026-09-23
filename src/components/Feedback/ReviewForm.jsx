import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { useTranslation } from "react-i18next";
import "../../assets/scss/ReviewForm.scss";

export default function ReviewForm({ productId, userId, onSubmitted }) {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      setError(t("reviews.loginRequired", "Rəy yazmaq üçün daxil olmalısan."));
      return;
    }
    if (rating === 0) {
      setError(t("reviews.ratingRequired", "Zəhmət olmasa reytinq seç."));
      return;
    }

    setSubmitting(true);
    setError(null);

    const { error: insertError } = await supabase.from("reviews").insert({
      product_id: productId,
      user_id: userId,
      rating,
      comment: comment.trim() || null,
    });

    setSubmitting(false);

    if (insertError) {
      if (insertError.code === "23505") {
        setError(t("reviews.alreadyReviewed", "Bu məhsula artıq rəy yazmısan."));
      } else if (insertError.code === "42501") {
        setError(
          t(
            "reviews.notPurchased",
            "Rəy yazmaq üçün əvvəlcə bu məhsulu almalı və sifarişin tamamlanmalıdır."
          )
        );
      } else {
        setError(insertError.message);
      }
      return;
    }

    setRating(0);
    setComment("");
    onSubmitted?.();

    navigate("/shop");
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <div className="review-form__stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="review-form__star"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            aria-label={t("reviews.starAriaLabel", "{{star}} ulduz", { star })}
          >
            {star <= (hoverRating || rating) ? "★" : "☆"}
          </button>
        ))}
      </div>

      <textarea
        className="review-form__textarea"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder={t("reviews.placeholder", "Rəyini yaz (istəyə bağlı)...")}
        rows={4}
      />

      {error && <p className="review-form__error">{error}</p>}

      <button type="submit" className="review-form__submit" disabled={submitting}>
        {submitting ? t("reviews.sending", "Göndərilir...") : t("reviews.submit", "Rəyi göndər")}
      </button>
    </form>
  );
}