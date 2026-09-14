import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient.js';
import '../../assets/scss/ProductPage.scss';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState(null);
    const [form, setForm] = useState({});

    useEffect(() => {
        fetchAll();
    }, []);

    const fetchAll = async () => {
        setLoading(true);
        const [{ data: prods }, { data: cats }, { data: auths }] = await Promise.all([
            supabase.from('products').select('*, categories(name_az), authors(name)').order('created_at', { ascending: false }),
            supabase.from('categories').select('id, name_az'),
            supabase.from('authors').select('id, name'),
        ]);
        setProducts(prods || []);
        setCategories(cats || []);
        setAuthors(auths || []);
        setLoading(false);
    };

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
            await supabase.from('products').update(payload).eq('id', editingProduct.id);
        } else {
            await supabase.from('products').insert(payload);
        }

        closeForm();
        fetchAll();
    };

    const handleDelete = async (id) => {
        if (!confirm('Silmək istədiyinizə əminsiniz?')) return;
        await supabase.from('products').delete().eq('id', id);
        fetchAll();
    };

    if (loading) return <p>Yüklənir...</p>;

    return (
        <div className="products-page">
            <div className="products-header">
                <h1>Məhsullar</h1>
                <button onClick={openNew}>+ Yeni məhsul</button>
            </div>

            <table className="products-table">
                <thead>
                    <tr>
                        <th>Şəkil</th><th>Başlıq</th><th>Kateqoriya</th><th>Müəllif</th>
                        <th>Qiymət</th><th>Stok</th><th>Aktiv</th><th></th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((p) => (
                        <tr key={p.id}>
                            <td><img src={p.image_url} alt="" className="product-thumb" /></td>
                            <td>{p.title_az}</td>
                            <td>{p.categories?.name_az || '—'}</td>
                            <td>{p.authors?.name || '—'}</td>
                            <td>{p.price} ₼</td>
                            <td>{p.stock}</td>
                            <td>{p.is_active ? '✅' : '❌'}</td>
                            <td>
                                <button onClick={() => openEdit(p)}>Redaktə</button>
                                <button onClick={() => handleDelete(p.id)}>Sil</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {editingProduct !== null && (
                <div className="modal-overlay" onClick={closeForm}>
                    <form className="form-modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSave}>
                        <h2>{editingProduct?.id ? 'Redaktə et' : 'Yeni məhsul'}</h2>

                        <input name="title_az" placeholder="Başlıq (AZ)" value={form.title_az} onChange={handleChange}  />
                        <input name="title_en" placeholder="Başlıq (EN)" value={form.title_en} onChange={handleChange}  />
                        <input name="slug" placeholder="slug" value={form.slug} onChange={handleChange}  />
                        <textarea name="description_az" placeholder="Təsvir (AZ)" value={form.description_az} onChange={handleChange} />
                        <textarea name="description_en" placeholder="Təsvir (EN)" value={form.description_en} onChange={handleChange} />

                        <select name="category_id" value={form.category_id} onChange={handleChange} >
                            <option value="">Kateqoriya seç</option>
                            {categories.map((c) => <option key={c.id} value={c.id}>{c.name_az}</option>)}
                        </select>

                        <select name="author_id" value={form.author_id} onChange={handleChange}>
                            <option value="">Müəllif seç</option>
                            {authors.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                        </select>

                        <input name="price" type="number" step="0.01" placeholder="Qiymət" value={form.price} onChange={handleChange}  />
                        <input name="stock" type="number" placeholder="Stok" value={form.stock} onChange={handleChange}  />
                        <input name="image_url" placeholder="Şəkil URL" value={form.image_url} onChange={handleChange} />

                        <label><input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} /> Aktiv</label>
                        <label><input type="checkbox" name="is_weekly_highlight" checked={form.is_weekly_highlight} onChange={handleChange} /> Həftənin seçimi</label>

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

export default ProductsPage;