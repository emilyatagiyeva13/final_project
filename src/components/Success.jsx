import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle2, ShoppingBag } from 'lucide-react';
import Swal from 'sweetalert2';
import '../assets/scss/Success.scss';
import RecommendedProducts from '../components/RecommendedProducts';
import ReviewForm from '../components/Feedback/ReviewForm';
import { useAuthStore } from '../store/authStore.js';
import { useLocalize } from '../components/hooks/useLocalise';

const Success = () => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const location = useLocation();
  const { localize } = useLocalize();
  const user = useAuthStore((s) => s.user);


  const orderedItems = location.state?.items || [];

  // Təsadüfi Sifariş Nömrəsi generatoru
  const orderNumber = Math.floor(100000 + Math.random() * 900000);

  console.log('location.state:', location.state);
  console.log('orderedItems:', orderedItems);

  useEffect(() => {
    Swal.fire({
      icon: 'success',
      title: t('checkout.swalSuccessTitle') || 'Sifarişiniz Uğurla Qəbul Olundu!',
      text: `${t('checkout.orderNumber') || 'Sifariş Nömrəsi'}: #${orderNumber}`,
      confirmButtonText: t('checkout.swalOk') || 'Əla!',
      confirmButtonColor: '#10B981',
      timer: 4000,
      timerProgressBar: true
    });
  }, [t, orderNumber]);


  return (
    <>
      <div className="success-page d-flex flex-column">
        <div className="success-card">
          <div className="success-card__icon">
            <CheckCircle2 size={64} />
          </div>

          <h1 className="success-card__title">
            {t('checkout.successTitle') || 'Ödəniş Uğurla Tamamlandı!'}
          </h1>

          <p className="success-card__description">
            {t('checkout.successDesc') || 'Sifarişiniz qəbul olundu. Tezliklə çatdırılma üçün hazırlanacaq.'}
          </p>

          <div className="success-card__order-info">
            <span>{t('checkout.orderNumber') || 'Sifariş Nömrəsi'}:</span>
            <strong>#{orderNumber}</strong>
          </div>

          <div className="success-card__actions">
            <button className="btn-primary" onClick={() => navigate('/')}>
              <ShoppingBag size={18} />
              {t('checkout.continueShopping') || 'Alış-verişə davam et'}
            </button>
          </div>
        </div>

        {orderedItems.length > 0 && (
          <div className="success-reviews">
            <h2>{t('checkout.reviewPrompt') || 'Aldığın məhsullar haqqında fikrini bölüş'}</h2>

            {orderedItems.map((item) => (
              <div key={item.id} className="success-reviews__item">
                <div className="success-reviews__item-header">
                  <img src={item.image} alt={localize(item, 'title')}  />
                  <h4>{localize(item, 'title')}</h4>
                </div>

                <ReviewForm
                  productId={item.id}
                  userId={user?.id}
                  onSubmitted={() => { }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <RecommendedProducts />
    </>
  );
};

export default Success;