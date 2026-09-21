import { useEffect, useState } from 'react';
import { useBlogStore } from '../../store/useBlogStore.js';
import { useLanguage } from '../../context/LangContext.jsx';
import '../../assets/scss/ProductPage.scss';

const BlogPage = () => {
    const { posts, loading, fetchPosts, addPost, updatePost, deletePost } = useBlogStore();
    const { currentLang } = useLanguage();

    const [editingPost, setEditingPost] = useState(null);
    const [form, setForm] = useState({});

    useEffect(() => {
        fetchPosts();
    }, []);

    const lang = currentLang?.split('-')[0] || 'az';
    const t = (p, field) => (lang === 'az' ? (p?.[`${field}_az`] || p?.[field]) : p?.[field]) ?? '';

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
        const payload = { ...form, sort_order: Number(form.sort_order) || 0 };

        if (editingPost?.id) {
            await updatePost(editingPost.id, payload);
        } else {
            await addPost(payload);
        }

        closeForm();
    };

    const handleDelete = async (id) => {
        if (!confirm('Silmək istədiyinizə əminsiniz?')) return;
        await deletePost(id);
    };

    if (loading) return <p>Yüklənir...</p>;

    return (
        <div className="products-page">
            <div className="products-header">
                <h1>Bloq yazıları</h1>
                <button onClick={openNew}>+ Yeni yazı</button>
            </div>

            <table className="products-table">
                <thead>
                    <tr>
                        <th>Şəkil</th><th>Başlıq</th><th>Müəllif</th><th>Tarix</th><th></th>
                    </tr>
                </thead>
                <tbody>
                    {posts.map((p) => (
                        <tr key={p.id}>
                            <td><img src={p.banner_url} alt="" className="product-thumb" /></td>
                            <td>{t(p, 'title')}</td>
                            <td>{p.author_name || '—'}</td>
                            <td>{p.post_date || '—'}</td>
                            <td>
                                <button onClick={() => openEdit(p)}>Redaktə</button>
                                <button onClick={() => handleDelete(p.id)}>Sil</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {editingPost !== null && (
                <div className="modal-overlay" onClick={closeForm}>
                    <form className="form-modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSave}>
                        <h2>{editingPost?.id ? 'Redaktə et' : 'Yeni yazı'}</h2>

                        <input name="title" placeholder="Başlıq (EN)" value={form.title} onChange={handleChange} />
                        <input name="title_az" placeholder="Başlıq (AZ)" value={form.title_az} onChange={handleChange} />
                        <input name="slug" placeholder="slug" value={form.slug} onChange={handleChange} />

                        <textarea name="summary" placeholder="Xülasə (EN)" value={form.summary} onChange={handleChange} />
                        <textarea name="summary_az" placeholder="Xülasə (AZ)" value={form.summary_az} onChange={handleChange} />

                        <textarea name="content" placeholder="Məzmun (EN)" rows="6" value={form.content} onChange={handleChange} />
                        <textarea name="content_az" placeholder="Məzmun (AZ)" rows="6" value={form.content_az} onChange={handleChange} />

                        <input name="author_name" placeholder="Müəllif adı" value={form.author_name} onChange={handleChange} />
                        <input name="post_date" type="date" value={form.post_date || ''} onChange={handleChange} />
                        <input name="read_time" placeholder="Oxu müddəti (EN, məs: 5 min)" value={form.read_time} onChange={handleChange} />
                        <input name="read_time_az" placeholder="Oxu müddəti (AZ)" value={form.read_time_az} onChange={handleChange} />
                        <input name="banner_url" placeholder="Banner şəkil URL" value={form.banner_url} onChange={handleChange} />
                        <input name="sort_order" type="number" placeholder="Sıra" value={form.sort_order} onChange={handleChange} />

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

export default BlogPage;