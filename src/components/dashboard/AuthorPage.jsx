import { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LangContext.jsx';
import '../../assets/scss/ProductPage.scss';
import { useAuthorStore } from '../../store/useAuthorStore.js';

const AuthorsPage = () => {
    const { authors, loading, fetchAuthors, addAuthor, updateAuthor, deleteAuthor } =
        useAuthorStore();
    const { currentLang } = useLanguage();

    const [editingAuthor, setEditingAuthor] = useState(null);
    const [form, setForm] = useState({});

    useEffect(() => {
        fetchAuthors();
    }, []);

    // authors cədvəlində "name_en" yoxdur — "name" default/EN kimi istifadə olunur
    const lang = currentLang?.split('-')[0] || 'az';
    const t = (a) => (lang === 'az' ? (a?.name_az || a?.name) : a?.name) ?? '';

    const openNew = () => {
        setForm({ name: '', name_az: '', slug: '', img_url: '' });
        setEditingAuthor({});
    };

    const openEdit = (author) => {
        setForm({ ...author });
        setEditingAuthor(author);
    };

    const closeForm = () => {
        setEditingAuthor(null);
        setForm({});
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const payload = { ...form };

        if (editingAuthor?.id) {
            await updateAuthor(editingAuthor.id, payload);
        } else {
            await addAuthor(payload);
        }

        closeForm();
    };

    const handleDelete = async (id) => {
        if (!confirm('Silmək istədiyinizə əminsiniz?')) return;
        await deleteAuthor(id);
    };

    if (loading) return <p>Yüklənir...</p>;

    return (
        <div className="products-page">
            <div className="products-header">
                <h1>Müəlliflər</h1>
                <button onClick={openNew}>+ Yeni müəllif</button>
            </div>

            <table className="products-table">
                <thead>
                    <tr>
                        <th>Şəkil</th><th>Ad</th><th></th>
                    </tr>
                </thead>
                <tbody>
                    {authors.map((a) => (
                        <tr key={a.id}>
                            <td><img src={a.img_url} alt="" className="product-thumb" /></td>
                            <td>{t(a)}</td>
                            <td>
                                <button onClick={() => openEdit(a)}>Redaktə</button>
                                <button onClick={() => handleDelete(a.id)}>Sil</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {editingAuthor !== null && (
                <div className="modal-overlay" onClick={closeForm}>
                    <form className="form-modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSave}>
                        <h2>{editingAuthor?.id ? 'Redaktə et' : 'Yeni müəllif'}</h2>

                        <input name="name" placeholder="Ad (EN)" value={form.name} onChange={handleChange} />
                        <input name="name_az" placeholder="Ad (AZ)" value={form.name_az} onChange={handleChange} />
                        <input name="img_url" placeholder="Şəkil URL" value={form.img_url} onChange={handleChange} />

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

export default AuthorsPage;