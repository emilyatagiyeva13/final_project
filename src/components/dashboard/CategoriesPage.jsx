import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../context/LangContext.jsx';
import '../../assets/scss/ProductPage.scss';
import { useCategoryStore } from '../../store/useCategoryStore.js';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CategoriesPage = () => {
    const { t } = useTranslation("dashboard");
    const { categories, loading, fetchCategories, addCategory, updateCategory, deleteCategory } =
        useCategoryStore();
    const { currentLang } = useLanguage();

    const [editingCategory, setEditingCategory] = useState(null);
    const [form, setForm] = useState({});

    useEffect(() => {
        fetchCategories();
    }, []);

    const lang = currentLang?.split('-')[0] || 'az';
    const categoryNameTranslate = (c, field) => c?.[`${field}_${lang}`] ?? c?.[`${field}_az`] ?? '';

    const openNew = () => {
        setForm({ name_az: '', name_en: '', slug: '' });
        setEditingCategory({});
    };

    const openEdit = (category) => {
        setForm({ ...category });
        setEditingCategory(category);
    };

    const closeForm = () => {
        setEditingCategory(null);
        setForm({});
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...form };

            if (editingCategory?.id) {
                await updateCategory(editingCategory.id, payload);
                toast.success(t('categories.successUpdate') || 'Uğurla yeniləndi!');
            } else {
                await addCategory(payload);
                toast.success(t('categories.successAdd') || 'Uğurla əlavə olundu!');
            }

            closeForm();
        } catch (error) {
                console.error(error)

            toast.error(t('categories.errorOccurred') || 'Xəta baş verdi!');
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: t('categories.confirmDelete') || 'Silmək istədiyinizə əminsiniz?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: t('categories.yesDelete') || 'Bəli, sil!',
            cancelButtonText: t('categories.cancel') || 'Ləğv et'
        });

        if (result.isConfirmed) {
            try {
                await deleteCategory(id);
                toast.success(t('categories.successDelete') || 'Uğurla silindi!');
            } catch (error) {
                console.error(error)

                toast.error(t('categories.errorOccurred') || 'Xəta baş verdi!');
            }
        }
    };

    if (loading) return <p className="loading-text">{t('categories.loading')}</p>;

    return (
        <div className="products-page">
            <div className="products-header">
                <h1>{t('categories.title')}</h1>
                <button className="btn-primary" onClick={openNew}>{t('categories.newCategory')}</button>
            </div>

            {/* Responsiv cədvəl qabı */}
            <div className="table-responsive">
                <table className="products-table">
                    <thead>
                        <tr>
                            <th>{t('categories.name')}</th>
                            <th>{t('categories.slug')}</th>
                            <th className="actions-th"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((c) => (
                            <tr key={c.id}>
                                <td>{categoryNameTranslate(c, 'name')}</td>
                                <td>{c.slug}</td>
                                <td className="actions-cell">
                                    <button className="btn-edit" onClick={() => openEdit(c)}>{t('categories.edit')}</button>
                                    <button className="btn-delete" onClick={() => handleDelete(c.id)}>{t('categories.delete')}</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {editingCategory !== null && (
                <div className="modal-overlay" onClick={closeForm}>
                    <form className="form-modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSave}>
                        <h2>{editingCategory?.id ? t('categories.editTitle') : t('categories.newTitle')}</h2>

                        <input name="name_az" placeholder={t('categories.placeholderNameAz')} value={form.name_az || ''} onChange={handleChange} />
                        <input name="name_en" placeholder={t('categories.placeholderNameEn')} value={form.name_en || ''} onChange={handleChange} />
                        <input name="slug" placeholder={t('categories.placeholderSlug')} value={form.slug || ''} onChange={handleChange} />

                        <div className="form-actions">
                            <button type="button" className="btn-cancel" onClick={closeForm}>{t('categories.cancel')}</button>
                            <button type="submit" className="btn-save">{t('categories.save')}</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default CategoriesPage;