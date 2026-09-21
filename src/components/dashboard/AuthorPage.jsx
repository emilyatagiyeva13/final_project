import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../context/LangContext.jsx';
import '../../assets/scss/ProductPage.scss';
import { useAuthorStore } from '../../store/useAuthorStore.js';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../Loader.jsx';

const AuthorsPage = () => {
    const { t } = useTranslation("dashboard");
    const { authors, loading, fetchAuthors, addAuthor, updateAuthor, deleteAuthor } =
        useAuthorStore();
    const { currentLang } = useLanguage();

    const [editingAuthor, setEditingAuthor] = useState(null);
    const [form, setForm] = useState({});

    useEffect(() => {
        fetchAuthors();
    }, []);

    const lang = currentLang?.split('-')[0] || 'az';
    const authorNameTranslate = (a) => (lang === 'az' ? (a?.name_az || a?.name) : a?.name) ?? '';

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
        try {
            const payload = { ...form };

            if (editingAuthor?.id) {
                await updateAuthor(editingAuthor.id, payload);
                toast.success(t('authors.successUpdate') || 'Uğurla yeniləndi!');
            } else {
                await addAuthor(payload);
                toast.success(t('authors.successAdd') || 'Uğurla əlavə olundu!');
            }

            closeForm();
        } catch (error) {
            console.error(error);
            toast.error(t('authors.errorOccurred') || 'Xəta baş verdi!');
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: t('authors.confirmDelete') || 'Silmək istədiyinizə əminsiniz?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: t('authors.yesDelete') || 'Bəli, sil!',
            cancelButtonText: t('authors.cancel') || 'Ləğv et'
        });

        if (result.isConfirmed) {
            try {
                await deleteAuthor(id);
                toast.success(t('authors.successDelete') || 'Uğurla silindi!');
            } catch (error) {
                console.error(error);
                toast.error(t('authors.errorOccurred') || 'Xəta baş verdi!');
            }
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="products-page">
            <div className="products-header">
                <h1>{t('authors.title')}</h1>
                <button className="btn-primary" onClick={openNew}>{t('authors.newAuthor')}</button>
            </div>

            {/* Responsiv cədvəl qabı */}
            <div className="table-responsive">
                <table className="products-table">
                    <thead>
                        <tr>
                            <th>{t('authors.image')}</th>
                            <th>{t('authors.name')}</th>
                            <th className="actions-th"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {authors.map((a) => (
                            <tr key={a.id}>
                                <td><img src={a.img_url} alt="" className="product-thumb" /></td>
                                <td>{authorNameTranslate(a)}</td>
                                <td className="actions-cell">
                                    <button className="btn-edit" onClick={() => openEdit(a)}>{t('authors.edit')}</button>
                                    <button className="btn-delete" onClick={() => handleDelete(a.id)}>{t('authors.delete')}</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {editingAuthor !== null && (
                <div className="modal-overlay" onClick={closeForm}>
                    <form className="form-modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSave}>
                        <h2>{editingAuthor?.id ? t('authors.editTitle') : t('authors.newTitle')}</h2>

                        <input name="name" placeholder={t('authors.placeholderNameEn')} value={form.name || ''} onChange={handleChange} />
                        <input name="name_az" placeholder={t('authors.placeholderNameAz')} value={form.name_az || ''} onChange={handleChange} />
                        <input name="img_url" placeholder={t('authors.placeholderImgUrl')} value={form.img_url || ''} onChange={handleChange} />

                        <div className="form-actions">
                            <button type="button" className="btn-cancel" onClick={closeForm}>{t('authors.cancel')}</button>
                            <button type="submit" className="btn-save">{t('authors.save')}</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AuthorsPage;