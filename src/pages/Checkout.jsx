import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Lock, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import useCartStore from '../store/useCartStore';
import { useAuthStore } from '../store/authStore.js';
import { useLocalize } from '../components/hooks/useLocalise';
import '../assets/scss/Checkout.scss';
import Loader from '../components/Loader';
import { useOrderStore } from '../store/useOrderStore.js';

const Checkout = () => {
    const { t } = useTranslation('common');
    const { localize } = useLocalize();
    const navigate = useNavigate();
    const { items = [], totalPrice, clearBasket } = useCartStore();
    const { confirmOrder } = useOrderStore();
    const user = useAuthStore((s) => s.user);

    const [isFlipped, setIsFlipped] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        cardNumber: '',
        cardName: '',
        expiry: '',
        cvc: ''
    });

    const subTotal = totalPrice();
    const shippingCost = 2.00;
    const finalTotal = subTotal + shippingCost;

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'cardNumber') {
            const formatted = value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
            setFormData((prev) => ({ ...prev, cardNumber: formatted }));
        } else if (name === 'expiry') {
            const formatted = value.replace(/\D/g, '').replace(/(.{2})/g, '$1/').trim().slice(0, 5);
            if (formatted.endsWith('/')) {
                setFormData((prev) => ({ ...prev, expiry: formatted.slice(0, 2) }));
            } else {
                setFormData((prev) => ({ ...prev, expiry: formatted }));
            }
        } else if (name === 'cvc') {
            const formatted = value.replace(/\D/g, '').slice(0, 3);
            setFormData((prev) => ({ ...prev, cvc: formatted }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user?.id) {
            toast.error(t('checkout.mustBeLoggedIn') || 'Sifariş vermək üçün daxil olmalısınız.');
            return;
        }

        const result = await Swal.fire({
            title: t('checkout.confirmTitle') || 'Sifarişi təsdiqləyirsiniz?',
            text: t('checkout.confirmText') || 'Ödəniş kartınızdan silinəcək və sifariş rəsmiləşdiriləcək.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: t('checkout.confirmYes') || 'Bəli, təsdiqləyirəm',
            cancelButtonText: t('checkout.confirmNo') || 'Xeyr, ləğv et'
        });

        if (result.isConfirmed) {
            setSubmitting(true);

            const { error } = await confirmOrder(
                user.id,
                {
                    fullName: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                },
                items.map((item) => ({
                    id: item.id,
                    title_az: item.title_az,
                    title_en: item.title_en,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.image,
                })),
                {
                    subtotal: subTotal,
                    shippingCost,
                    total: finalTotal,
                }
            );

            setSubmitting(false);

            if (error) {
                toast.error(t('checkout.orderFailed') || 'Sifariş yadda saxlanmadı, yenidən cəhd edin.');
                return;
            }

            const orderedItems = items.map((item) => ({
                id: item.id,
                title_az: item.title_az,
                title_en: item.title_en,
                image: item.image,
            }));

            if (clearBasket) await clearBasket();
            toast.success(t('checkout.successMessage') || 'Sifarişiniz uğurla rəsmiləşdirildi!');
            navigate('/success', { state: { items: orderedItems } });
        }
    };

    if (loading) {
        return (
            <div className="loader-container">
                <Loader />
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <div className="checkout-page__header">
                <button className="back-btn" onClick={() => navigate('/basket')}>
                    <ArrowLeft size={18} /> {t('checkout.backToCart')}
                </button>
                <h1 className="checkout-page__title">{t('checkout.header')}</h1>
            </div>

            <div className="checkout-page__grid">
                <form className="checkout-form" onSubmit={handleSubmit}>
                    <div className="form-section">
                        <h3>{t('checkout.shippingInfo')}</h3>
                        <div className="input-group full">
                            <label>{t('checkout.fullNameLabel')}</label>
                            <input
                                type="text"
                                name="fullName"
                                required
                                placeholder={t('checkout.fullNamePlaceholder')}
                                value={formData.fullName}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="input-row">
                            <div className="input-group">
                                <label>{t('checkout.emailLabel')}</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    placeholder={t('checkout.emailPlaceholder')}
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="input-group">
                                <label>{t('checkout.phoneLabel')}</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    required
                                    placeholder="+994 50 000 00 00"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="input-group full">
                            <label>{t('checkout.addressLabel')}</label>
                            <textarea
                                name="address"
                                rows="2"
                                required
                                placeholder={t('checkout.addressPlaceholder')}
                                value={formData.address}
                                onChange={handleChange}
                            ></textarea>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>{t('checkout.paymentInfo')}</h3>

                        <div className="card-wrapper">
                            <div className={`interactive-card ${isFlipped ? 'is-flipped' : ''}`}>
                                <div className="card-front">
                                    <div className="card-top">
                                        <span className="card-chip"></span>
                                        <CreditCard className="card-logo" size={32} />
                                    </div>
                                    <div className="card-number">
                                        {formData.cardNumber || '•••• •••• •••• ••••'}
                                    </div>
                                    <div className="card-bottom">
                                        <div className="card-holder">
                                            <span className="label">{t('checkout.cardHolderLabelCard')}</span>
                                            <span className="value">{formData.cardName || t('checkout.cardHolderPlaceholderCard')}</span>
                                        </div>
                                        <div className="card-expiry">
                                            <span className="label">{t('checkout.expiryLabelCard')}</span>
                                            <span className="value">{formData.expiry || 'MM/YY'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="card-back">
                                    <div className="card-stripe"></div>
                                    <div className="card-cvc-box">
                                        <span className="label">CVC / CVV</span>
                                        <div className="cvc-value">{formData.cvc || '•••'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="input-group full">
                            <label>{t('checkout.cardNameLabel')}</label>
                            <input
                                type="text"
                                name="cardName"
                                required
                                placeholder="ALI ALIYEV"
                                value={formData.cardName}
                                onChange={handleChange}
                                onFocus={() => setIsFlipped(false)}
                            />
                        </div>
                        <div className="input-group full">
                            <label>{t('checkout.cardNumberLabel')}</label>
                            <input
                                type="text"
                                name="cardNumber"
                                required
                                placeholder="0000 0000 0000 0000"
                                value={formData.cardNumber}
                                onChange={handleChange}
                                onFocus={() => setIsFlipped(false)}
                            />
                        </div>
                        <div className="input-row">
                            <div className="input-group">
                                <label>{t('checkout.expiryLabel')}</label>
                                <input
                                    type="text"
                                    name="expiry"
                                    required
                                    placeholder="MM/YY"
                                    value={formData.expiry}
                                    onChange={handleChange}
                                    onFocus={() => setIsFlipped(false)}
                                />
                            </div>
                            <div className="input-group">
                                <label>CVC / CVV</label>
                                <input
                                    type="password"
                                    name="cvc"
                                    required
                                    placeholder="123"
                                    value={formData.cvc}
                                    onChange={handleChange}
                                    onFocus={() => setIsFlipped(true)}
                                    onBlur={() => setIsFlipped(false)}
                                />
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="checkout-submit-btn" disabled={submitting}>
                        <Lock size={18} /> {finalTotal.toFixed(2)} $ — {submitting ? t('checkout.processing') : t('checkout.payNow')}
                    </button>
                </form>

                <div className="checkout-summary">
                    <h3>{t('basket.summaryTitle')}</h3>

                    <div className="checkout-items-list">
                        {items.map((item) => (
                            <div key={item.id} className="summary-item">
                                <img src={item.image} alt={localize(item, 'title')} />
                                <div className="summary-item__info">
                                    <h4>{localize(item, 'title')}</h4>
                                    <p>{item.quantity} {t('checkout.itemUnit')} × {item.price} $</p>
                                </div>
                                <span className="summary-item__price">
                                    {(item.price * item.quantity).toFixed(2)} $
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="summary-row">
                        <span>{t('basket.subtotal')}</span>
                        <span>{subTotal.toFixed(2)} $</span>
                    </div>

                    <div className="summary-row">
                        <span>{t('basket.shipping')}</span>
                        <span>{shippingCost.toFixed(2)} $</span>
                    </div>

                    <div className="summary-divider"></div>

                    <div className="summary-row total-row">
                        <span>{t('basket.finalTotal')}</span>
                        <span className="total-amount">{finalTotal.toFixed(2)} $</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;