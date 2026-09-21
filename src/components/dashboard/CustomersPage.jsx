import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../../assets/scss/ProductPage.scss';
import { useCustomerStore } from '../../store/useCustomers';

const formatDate = (iso, locale = 'az-AZ') => {
    if (!iso) return '—';
    return new Date(iso).toLocaleString(locale, {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit',
    });
};

const CustomersPage = () => {
    const { t, i18n } = useTranslation("dashboard");
    const { customers, loading, fetchCustomers } = useCustomerStore();

    useEffect(() => {
        fetchCustomers();
    }, []);

    if (loading) return <p className="loading-text">{t('customers.loading')}</p>;

    const dateLocale = i18n.language?.startsWith('en') ? 'en-US' : 'az-AZ';

    return (
        <div className="products-page">
            <div className="products-header">
                <h1>{t('customers.title')}</h1>
            </div>

            <div className="table-responsive">
                <table className="products-table">
                    <thead>
                        <tr>
                            <th>{t('customers.username')}</th>
                            <th>{t('customers.email')}</th>
                            <th>{t('customers.role')}</th>
                            <th>{t('customers.createdAt')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map((c) => (
                            <tr key={c.id}>
                                <td>{c.username || '—'}</td>
                                <td>{c.email}</td>
                                <td>{c.role}</td>
                                <td>{formatDate(c.created_at, dateLocale)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {customers.length === 0 && <p className="no-data-text">{t('customers.noCustomers')}</p>}
        </div>
    );
};

export default CustomersPage;