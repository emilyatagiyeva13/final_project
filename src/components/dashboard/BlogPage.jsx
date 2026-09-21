import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBlogStore } from '../../store/useBlogStore.js';
import { useLanguage } from '../../context/LangContext.jsx';
import '../../assets/scss/ProductPage.scss';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BlogPage = () => {
    const { t } = useTranslation("dashboard");
    const { posts, loading, fetchPosts, addPost, updatePost, deletePost } = useBlogStore();
    const { currentLang } = useLanguage();

    const [editingPost, setEditingPost] = useState(null);
    const [form, setForm] = useState({});

    useEffect(() => {
        fetchPosts();
    }, []);

    const lang = currentLang?.split('-')[0] || 'az';
    const postTranslate = (p, field) => (lang === 'az' ? (p?.[`${field}_az`] || p?.[field]) : p?.[field]) ?? '';

    const openNew = () => {
        setForm({
            title: '', title_az: '',
            summary: '', summary_az: '',
            content: '', content_az: '',
            author_name: '', post_date: '', read_time: '', read_time_az: '',
            banner_url: '', slug: '', sort_order: 0,
        });
        setEditingPost({});
    };

    const openEdit = (post) => {
        setForm({ ...post });
        setEditingPost(post);
    };

    const closeForm = () => {
        setEditingPost(null);
        setForm({});
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...form, sort_order: Number(form.sort_order) || 0 };

            if (editingPost?.id) {
                await updatePost(editingPost.id, payload);
                toast.success(t('blog.successUpdate') || 'Uğurla yeniləndi!');
            } else {
                await addPost(payload);
                toast.success(t('blog.successAdd') || 'Uğurla əlavə olundu!');
            }

            closeForm();
        } catch (error) {
            console.error(error)

            toast.error(t('blog.errorOccurred') || 'Xəta baş verdi!');
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: t('blog.confirmDelete') || 'Silmək istədiyinizə əminsiniz?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: t('blog.yesDelete') || 'Bəli, sil!',
            cancelButtonText: t('blog.cancel') || 'Ləğv et'
        });

        if (result.isConfirmed) {
            try {
                await deletePost(id);
                toast.success(t('blog.successDelete') || 'Uğurla silindi!');
            } catch (error) {
                console.error(error)

                toast.error(t('blog.errorOccurred') || 'Xəta baş verdi!');
            }
        }
    };

    if (loading) return <p className="loading-text">{t('blog.loading')}</p>;

    return (
        <div className="products-page">
            <div className="products-header">
                <h1>{t('blog.title')}</h1>
                <button className="btn-primary" onClick={openNew}>{t('blog.newPost')}</button>
            </div>

            <div className="table-responsive">
                <table className="products-table">
                    <thead>
                        <tr>
                            <th>{t('blog.image')}</th>
                            <th>{t('blog.tableTitle')}</th>
                            <th>{t('blog.author')}</th>
                            <th>{t('blog.date')}</th>
                            <th className="actions-th"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.map((p) => (
                            <tr key={p.id}>
                                <td><img src={p.banner_url} alt="" className="product-thumb" /></td>
                                <td>{postTranslate(p, 'title')}</td>
                                <td>{p.author_name || '—'}</td>
                                <td>{p.post_date || '—'}</td>
                                <td className="actions-cell">
                                    <button className="btn-edit" onClick={() => openEdit(p)}>{t('blog.edit')}</button>
                                    <button className="btn-delete" onClick={() => handleDelete(p.id)}>{t('blog.delete')}</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {editingPost !== null && (
                <div className="modal-overlay" onClick={closeForm}>
                    <form className="form-modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSave}>
                        <h2>{editingPost?.id ? t('blog.editTitle') : t('blog.newTitle')}</h2>

                        <input name="title" placeholder={t('blog.placeholderTitleEn')} value={form.title || ''} onChange={handleChange} />
                        <input name="title_az" placeholder={t('blog.placeholderTitleAz')} value={form.title_az || ''} onChange={handleChange} />
                        <input name="slug" placeholder={t('blog.placeholderSlug')} value={form.slug || ''} onChange={handleChange} />

                        <textarea name="summary" placeholder={t('blog.placeholderSummaryEn')} value={form.summary || ''} onChange={handleChange} />
                        <textarea name="summary_az" placeholder={t('blog.placeholderSummaryAz')} value={form.summary_az || ''} onChange={handleChange} />

                        <textarea name="content" placeholder={t('blog.placeholderContentEn')} rows="6" value={form.content || ''} onChange={handleChange} />
                        <textarea name="content_az" placeholder={t('blog.placeholderContentAz')} rows="6" value={form.content_az || ''} onChange={handleChange} />

                        <input name="author_name" placeholder={t('blog.placeholderAuthor')} value={form.author_name || ''} onChange={handleChange} />
                        <input name="post_date" type="date" value={form.post_date || ''} onChange={handleChange} />
                        <input name="read_time" placeholder={t('blog.placeholderReadTimeEn')} value={form.read_time || ''} onChange={handleChange} />
                        <input name="read_time_az" placeholder={t('blog.placeholderReadTimeAz')} value={form.read_time_az || ''} onChange={handleChange} />
                        <input name="banner_url" placeholder={t('blog.placeholderBannerUrl')} value={form.banner_url || ''} onChange={handleChange} />
                        <input name="sort_order" type="number" placeholder={t('blog.placeholderSortOrder')} value={form.sort_order ?? 0} onChange={handleChange} />

                        <div className="form-actions">
                            <button type="button" className="btn-cancel" onClick={closeForm}>{t('blog.cancel')}</button>
                            <button type="submit" className="btn-save">{t('blog.save')}</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default BlogPage;