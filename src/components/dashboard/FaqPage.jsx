import { useEffect, useState } from 'react';
import { useFaqStore } from '../../store/useFaqStore.js';
import '../../assets/scss/ProductPage.scss';

const FaqPage = () => {
    const {
        faqs, faqCategories, loading, fetchAll,
        addFaq, updateFaq, deleteFaq,
        addFaqCategory, updateFaqCategory, deleteFaqCategory,
    } = useFaqStore();

    const [editingFaq, setEditingFaq] = useState(null);
    const [faqForm, setFaqForm] = useState({});

    const [editingCategory, setEditingCategory] = useState(null);
    const [catForm, setCatForm] = useState({});

    useEffect(() => {
        fetchAll();
    }, []);

    // ---------- faqs ----------
    const openNewFaq = () => {
        setFaqForm({ question: '', question_az: '', answer: '', answer_az: '', category_id: '', sort_order: 0 });
        setEditingFaq({});
    };

    const openEditFaq = (faq) => {
        setFaqForm({ ...faq });
        setEditingFaq(faq);
    };

    const closeFaqForm = () => {
        setEditingFaq(null);
        setFaqForm({});
    };

    const handleFaqChange = (e) => {
        const { name, value } = e.target;
        setFaqForm((f) => ({ ...f, [name]: value }));
    };

    const handleFaqSave = async (e) => {
        e.preventDefault();
        const payload = {
            question: faqForm.question,
            question_az: faqForm.question_az,
            answer: faqForm.answer,
            answer_az: faqForm.answer_az,
            category_id: faqForm.category_id || null,
            sort_order: Number(faqForm.sort_order) || 0,
        };

        if (editingFaq?.id) {
            await updateFaq(editingFaq.id, payload);
        } else {
            await addFaq(payload);
        }

        closeFaqForm();
    };

    const handleFaqDelete = async (id) => {
        if (!confirm('Sualı silmək istədiyinizə əminsiniz?')) return;
        await deleteFaq(id);
    };

    // ---------- faq categories ----------
    const openNewCat = () => {
        setCatForm({ title: '', title_az: '', description: '', description_az: '', slug: '', sort_order: 0 });
        setEditingCategory({});
    };

    const openEditCat = (cat) => {
        setCatForm({ ...cat });
        setEditingCategory(cat);
    };

    const closeCatForm = () => {
        setEditingCategory(null);
        setCatForm({});
    };

    const handleCatChange = (e) => {
        const { name, value } = e.target;
        setCatForm((f) => ({ ...f, [name]: value }));
    };

    const handleCatSave = async (e) => {
        e.preventDefault();
        const payload = { ...catForm, sort_order: Number(catForm.sort_order) || 0 };

        if (editingCategory?.id) {
            await updateFaqCategory(editingCategory.id, payload);
        } else {
            await addFaqCategory(payload);
        }

        closeCatForm();
    };

    const handleCatDelete = async (id) => {
        if (!confirm('Kateqoriyanı silmək istədiyinizə əminsiniz? Bağlı suallar da silinəcək.')) return;
        await deleteFaqCategory(id);
    };

    if (loading) return <p>Yüklənir...</p>;

    return (
        <div className="products-page">
            <div className="products-header">
                <h1>FAQ Kateqoriyaları</h1>
                <button onClick={openNewCat}>+ Yeni kateqoriya</button>
            </div>

            <table className="products-table">
                <thead>
                    <tr>
                        <th>Başlıq</th><th>Slug</th><th></th>
                    </tr>
                </thead>
                <tbody>
                    {faqCategories.map((c) => (
                        <tr key={c.id}>
                            <td>{c.title_az || c.title}</td>
                            <td>{c.slug}</td>
                            <td>
                                <button onClick={() => openEditCat(c)}>Redaktə</button>
                                <button onClick={() => handleCatDelete(c.id)}>Sil</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="products-header" style={{ marginTop: '2rem' }}>
                <h1>Suallar (FAQ)</h1>
                <button onClick={openNewFaq}>+ Yeni sual</button>
            </div>

            <table className="products-table">
                <thead>
                    <tr>
                        <th>Sual</th><th>Kateqoriya</th><th></th>
                    </tr>
                </thead>
                <tbody>
                    {faqs.map((f) => (
                        <tr key={f.id}>
                            <td>{f.question_az || f.question}</td>
                            <td>{f.faq_categories?.title_az || f.faq_categories?.title || '—'}</td>
                            <td>
                                <button onClick={() => openEditFaq(f)}>Redaktə</button>
                                <button onClick={() => handleFaqDelete(f.id)}>Sil</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {editingFaq !== null && (
                <div className="modal-overlay" onClick={closeFaqForm}>
                    <form className="form-modal" onClick={(e) => e.stopPropagation()} onSubmit={handleFaqSave}>
                        <h2>{editingFaq?.id ? 'Sualı redaktə et' : 'Yeni sual'}</h2>

                        <textarea name="question" placeholder="Sual (EN)" value={faqForm.question} onChange={handleFaqChange} />
                        <textarea name="question_az" placeholder="Sual (AZ)" value={faqForm.question_az} onChange={handleFaqChange} />
                        <textarea name="answer" placeholder="Cavab (EN)" rows="4" value={faqForm.answer} onChange={handleFaqChange} />
                        <textarea name="answer_az" placeholder="Cavab (AZ)" rows="4" value={faqForm.answer_az} onChange={handleFaqChange} />

                        <select name="category_id" value={faqForm.category_id} onChange={handleFaqChange}>
                            <option value="">Kateqoriya seç</option>
                            {faqCategories.map((c) => (
                                <option key={c.id} value={c.id}>{c.title_az || c.title}</option>
                            ))}
                        </select>

                        <input name="sort_order" type="number" placeholder="Sıra" value={faqForm.sort_order} onChange={handleFaqChange} />

                        <div className="form-actions">
                            <button type="button" onClick={closeFaqForm}>Ləğv et</button>
                            <button type="submit">Yadda saxla</button>
                        </div>
                    </form>
                </div>
            )}

            {editingCategory !== null && (
                <div className="modal-overlay" onClick={closeCatForm}>
                    <form className="form-modal" onClick={(e) => e.stopPropagation()} onSubmit={handleCatSave}>
                        <h2>{editingCategory?.id ? 'Kateqoriyanı redaktə et' : 'Yeni kateqoriya'}</h2>

                        <input name="title" placeholder="Başlıq (EN)" value={catForm.title} onChange={handleCatChange} />
                        <input name="title_az" placeholder="Başlıq (AZ)" value={catForm.title_az} onChange={handleCatChange} />
                        <input name="slug" placeholder="slug" value={catForm.slug} onChange={handleCatChange} />
                        <textarea name="description" placeholder="Təsvir (EN)" value={catForm.description} onChange={handleCatChange} />
                        <textarea name="description_az" placeholder="Təsvir (AZ)" value={catForm.description_az} onChange={handleCatChange} />
                        <input name="sort_order" type="number" placeholder="Sıra" value={catForm.sort_order} onChange={handleCatChange} />

                        <div className="form-actions">
                            <button type="button" onClick={closeCatForm}>Ləğv et</button>
                            <button type="submit">Yadda saxla</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default FaqPage;