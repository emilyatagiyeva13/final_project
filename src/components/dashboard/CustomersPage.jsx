import { useEffect } from 'react';
import '../../assets/scss/ProductPage.scss';
import { useCustomerStore } from '../../store/useCustomers';

const formatDate = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('az-AZ', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit',
    });
};

const CustomersPage = () => {
    const { customers, loading, fetchCustomers } = useCustomerStore();

    useEffect(() => {
        fetchCustomers();
    }, []);

    if (loading) return <p>Yüklənir...</p>;

    return (
        <div className="products-page">
            <div className="products-header">
                <h1>Müştərilər</h1>
            </div>

            <table className="products-table">
                <thead>
                    <tr>
                        <th>İstifadəçi adı</th>
                        <th>E-poçt</th>
                        <th>Rol</th>
                        <th>Qeydiyyat tarixi</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.map((c) => (
                        <tr key={c.id}>
                            <td>{c.username || '—'}</td>
                            <td>{c.email}</td>
                            <td>{c.role}</td>
                            <td>{formatDate(c.created_at)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {customers.length === 0 && <p>Hələ qeydiyyatdan keçən istifadəçi yoxdur.</p>}
        </div>
    );
};

export default CustomersPage;