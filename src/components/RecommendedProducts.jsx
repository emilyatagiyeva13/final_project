import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import { supabase } from '../supabaseClient';
import { useLanguage } from '../context/LangContext';
import SingleCard from './SingleCard';

// Fisher-Yates qarışdırma
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const RecommendedProducts = ({ limit = 8 }) => {
  const { t } = useTranslation('common');
  const { currentLang } = useLanguage();
  const [picked, setPicked] = useState([]);

  // Məhsullar bir dəfə çəkilir və bir dəfə random seçilir (dil dəyişəndə yenidən qarışmır)
  useEffect(() => {
    let cancelled = false;

    const fetchRecommended = async () => {
      const { data, error } = await supabase
        .from('products')
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
          is_weekly_highlight,
          created_at,
          banner_url,
          categories ( name_az, name_en ),
          authors ( name, name_az )
        `)
        .eq('is_active', true)
        .gt('stock', 0);

      if (error) {
        console.error('Recommended products error:', error);
        return;
      }
      if (!cancelled) setPicked(shuffle(data || []).slice(0, limit));
    };

    fetchRecommended();
    return () => {
      cancelled = true;
    };
  }, [limit]);

  // Dil dəyişəndə yalnız formatlama yenilənir, siyahı eyni qalır
  const books = useMemo(
    () =>
      picked.map((book) => ({
        ...book,
        title: currentLang === 'en' ? book.title_en : book.title_az,
        description: currentLang === 'en' ? book.description_en : book.description_az,
        category: currentLang === 'en' ? book.categories?.name_en : book.categories?.name_az,
        author:
          currentLang === 'en' ? book.authors?.name : book.authors?.name_az || book.authors?.name,
      })),
    [picked, currentLang]
  );

  if (books.length === 0) return null;

  return (
    <section>
      <div className="book-cards-1 container my-4">
        <h1>{t('checkout.recommended', { defaultValue: 'Sizin üçün tövsiyələr' })}</h1>
        <div className="row g-3 single-card my-2">
          <Swiper
            slidesPerView={4.3}
            spaceBetween={10}
            modules={[FreeMode]}
            freeMode={true}
            className="mySwiper category-swiper"
            breakpoints={{
              320: { slidesPerView: 1, spaceBetween: 15 },
              576: { slidesPerView: 2, spaceBetween: 20 },
              992: { slidesPerView: 3, spaceBetween: 25 },
              1200: { slidesPerView: 4, spaceBetween: 20 },
              1440: { slidesPerView: 4, spaceBetween: 20 },
            }}
          >
            {books.map((book) => (
              <SwiperSlide key={book.id}>
                <SingleCard {...book} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default RecommendedProducts;