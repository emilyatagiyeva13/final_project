import { useEffect, useState } from 'react';
import { useCategoryStore } from '../../store/useCategoryStore.js';
import { useLanguage } from '../../context/LanguageContext.jsx';
import '../../assets/scss/ProductPage.scss';

const CategoriesPage = () => {
    const { categories, loading, fetchCategories, addCategory, updateCategory, deleteCategory } =
        useCategoryStore();
    const { currentLang } = useLanguage();

    const [editingCategory, setEditingCategory] = useState(null);
    const [form, setForm] = useState({});

    useEffect(() => {
        fetchCategories();
    }, []);

    const lang = currentLang?.split('-')[0] || 'az';
    const t = (c, field) => c?.[`${field}_${lang}`] ?? c?.[`${field}_az`] ?? '';

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
        const payload = { ...form };

        if (editingCategory?.id) {
            await updateCategory(editingCategory.id, payload);
        } else {
            await addCategory(payload);
        }

        closeForm();
    };

    const handleDelete = async (id) => {
        if (!confirm('Silmək istədiyinizə əminsiniz?')) return;
        await deleteCategory(id);
    };

    if (loading) return <p>Yüklənir...</p>;

    return (
        <div className="products-page">
            <div className="products-header">
                <h1>Kateqoriyalar</h1>
                <button onClick={openNew}>+ Yeni kateqoriya</button>
            </div>

            <table className="products-table">
                <thead>
                    <tr>
                        <th>Ad</th><th>Slug</th><th></th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((c) => (
                        <tr key={c.id}>
                            <td>{t(c, 'name')}</td>
                            <td>{c.slug}</td>
                            <td>
                                <button onClick={() => openEdit(c)}>Redaktə</button>
                                <button onClick={() => handleDelete(c.id)}>Sil</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {editingCategory !== null && (
                <div className="modal-overlay" onClick={closeForm}>
                    <form className="form-modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSave}>
                        <h2>{editingCategory?.id ? 'Redaktə et' : 'Yeni kateqoriya'}</h2>

                        <input name="name_az" placeholder="Ad (AZ)" value={form.name_az} onChange={handleChange} />
                        <input name="name_en" placeholder="Ad (EN)" value={form.name_en} onChange={handleChange} />
                        <input name="slug" placeholder="slug" value={form.slug} onChange={handleChange} />

                        <div className="form-actions">
                            <button type="button" onClick={closeForm}>Ləğv et</button>
                            <button type="submit">Yadda saxla</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default CategoriesPage;