import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../context/LangContext.jsx';
import '../../assets/scss/ProductPage.scss';
import { useProductStore } from '../../store/useProductStore.js';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductsPage = () => {
    const { t } = useTranslation("dashboard");
    const { products, categories, authors, loading, fetchAll, addProduct, updateProduct, deleteProduct } =
        useProductStore();
    const { currentLang } = useLanguage();

    const [editingProduct, setEditingProduct] = useState(null);
    const [form, setForm] = useState({});

    useEffect(() => {
        fetchAll();
    }, []);

    const lang = currentLang?.split('-')[0] || 'az';
    const productTranslate = (p, field) => p?.[`${field}_${lang}`] ?? p?.[`${field}_az`] ?? '';
    const categoryTranslate = (c) => c?.[`name_${lang}`] ?? c?.name_az ?? '';
    const authorTranslate = (a) => (lang === 'az' ? (a?.name_az || a?.name) : a?.name) ?? '';

    const openNew = () => {
        setForm({
            title_az: '', title_en: '', description_az: '', description_en: '',
            price: 0, stock: 0, category_id: '', author_id: '', image_url: '',
            is_active: true, is_weekly_highlight: false, slug: '',
        });
        setEditingProduct({});
    };

    const openEdit = (product) => {
        setForm({ ...product });
        setEditingProduct(product);
    };

    const closeForm = () => {
        setEditingProduct(null);
        setForm({});
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...form,
                price: Number(form.price),
                stock: Number(form.stock),
                category_id: form.category_id || null,
                author_id: form.author_id || null,
            };
            delete payload.categories;
            delete payload.authors;

            if (editingProduct?.id) {
                await updateProduct(editingProduct.id, payload);
                toast.success(t('products.successUpdate') || 'Uğurla yeniləndi!');
            } else {
                await addProduct(payload);
                toast.success(t('products.successAdd') || 'Uğurla əlavə olundu!');
            }

            closeForm();
        } catch (error) {
            toast.error(t('products.errorOccurred') || 'Xəta baş verdi!');
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: t('products.confirmDelete') || 'Silmək istədiyinizə əminsiniz?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: t('products.yesDelete') || 'Bəli, sil!',
            cancelButtonText: t('products.cancel') || 'Ləğv et'
        });

        if (result.isConfirmed) {
            try {
                await deleteProduct(id);
                toast.success(t('products.successDelete') || 'Uğurla silindi!');
            } catch (error) {
                toast.error(t('products.errorOccurred') || 'Xəta baş verdi!');
            }
        }
    };

    if (loading) return <p className="loading-text">{t('products.loading')}</p>;

    return (
        <div className="products-page">
            <div className="products-header">
                <h1>{t('products.title')}</h1>
                <button className="btn-primary" onClick={openNew}>{t('products.newProduct')}</button>
            </div>

            <div className="table-responsive">
                <table className="products-table">
                    <thead>
                        <tr>
                            <th>{t('products.image')}</th>
                            <th>{t('products.tableTitle')}</th>
                            <th>{t('products.category')}</th>
                            <th>{t('products.author')}</th>
                            <th>{t('products.price')}</th>
                            <th>{t('products.stock')}</th>
                            <th>{t('products.active')}</th>
                            <th className="actions-th"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((p) => (
                            <tr key={p.id}>
                                <td><img src={p.image_url} alt="" className="product-thumb" /></td>
                                <td>{productTranslate(p, 'title')}</td>
                                <td>{categoryTranslate(p.categories) || '—'}</td>
                                <td>{authorTranslate(p.authors) || '—'}</td>
                                <td>{p.price} $</td>
                                <td>{p.stock}</td>
                                <td>{p.is_active ? 'Active' : 'Deacctive'}</td>
                                <td className="actions-cell">
                                    <button className="btn-edit" onClick={() => openEdit(p)}>{t('products.edit')}</button>
                                    <button className="btn-delete" onClick={() => handleDelete(p.id)}>{t('products.delete')}</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {editingProduct !== null && (
                <div className="modal-overlay" onClick={closeForm}>
                    <form className="form-modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSave}>
                        <h2>{editingProduct?.id ? t('products.editTitle') : t('products.newTitle')}</h2>

                        <input name="title_az" placeholder={t('products.placeholderTitleAz')} value={form.title_az || ''} onChange={handleChange} />
                        <input name="title_en" placeholder={t('products.placeholderTitleEn')} value={form.title_en || ''} onChange={handleChange} />
                        <input name="slug" placeholder={t('products.placeholderSlug')} value={form.slug || ''} onChange={handleChange} />
                        <textarea name="description_az" placeholder={t('products.placeholderDescAz')} value={form.description_az || ''} onChange={handleChange} />
                        <textarea name="description_en" placeholder={t('products.placeholderDescEn')} value={form.description_en || ''} onChange={handleChange} />

                        <select name="category_id" value={form.category_id || ''} onChange={handleChange}>
                            <option value="">{t('products.selectCategory')}</option>
                            {categories.map((c) => <option key={c.id} value={c.id}>{categoryTranslate(c)}</option>)}
                        </select>

                        <select name="author_id" value={form.author_id || ''} onChange={handleChange}>
                            <option value="">{t('products.selectAuthor')}</option>
                            {authors.map((a) => <option key={a.id} value={a.id}>{authorTranslate(a)}</option>)}
                        </select>

                        <input name="price" type="number" step="0.01" placeholder={t('products.price')} value={form.price ?? ''} onChange={handleChange} />
                        <input name="stock" type="number" placeholder={t('products.stock')} value={form.stock ?? ''} onChange={handleChange} />
                        <input name="image_url" placeholder={t('products.placeholderImgUrl')} value={form.image_url || ''} onChange={handleChange} />

                        <div className="checkbox-group">
                            <label><input type="checkbox" name="is_active" checked={!!form.is_active} onChange={handleChange} /> {t('products.activeLabel')}</label>
                            <label><input type="checkbox" name="is_weekly_highlight" checked={!!form.is_weekly_highlight} onChange={handleChange} /> {t('products.weeklyHighlight')}</label>
                        </div>

                        <div className="form-actions">
                            <button type="button" className="btn-cancel" onClick={closeForm}>{t('products.cancel')}</button>
                            <button type="submit" className="btn-save">{t('products.save')}</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ProductsPage;