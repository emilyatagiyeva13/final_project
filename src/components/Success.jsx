import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ShoppingBag } from 'lucide-react';
import Swal from 'sweetalert2';
import '../assets/scss/Success.scss';
import RecommendedProducts from '../components/RecommendedProducts';

const Success = () => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();

  // Təsadüfi Sifariş Nömrəsi generatoru
  const orderNumber = Math.floor(100000 + Math.random() * 900000);

  useEffect(() => {
    // Səhifə açılan kimi SweetAlert uğur pəncərəsi göstərilir
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
      <div className="success-page">
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
      </div>

      <RecommendedProducts />
    </>
  );
};

export default Success;