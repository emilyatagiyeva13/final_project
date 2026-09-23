import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFaqStore } from '../../store/useFaqStore.js';
import { useLanguage } from '../../context/LangContext.jsx';
import '../../assets/scss/ProductPage.scss';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../Loader.jsx';

const FaqPage = () => {
    const { t } = useTranslation("dashboard");
    const {
        faqs, faqCategories, loading, fetchAll,
        addFaq, updateFaq, deleteFaq,
        addFaqCategory, updateFaqCategory, deleteFaqCategory,
    } = useFaqStore();
    const { currentLang } = useLanguage();

    const [editingFaq, setEditingFaq] = useState(null);
    const [faqForm, setFaqForm] = useState({});

    const [editingCategory, setEditingCategory] = useState(null);
    const [catForm, setCatForm] = useState({});

    useEffect(() => {
        fetchAll();
    }, []);

    const lang = currentLang?.split('-')[0] || 'az';
    const textTranslate = (obj, field) => (lang === 'az' ? (obj?.[`${field}_az`] || obj?.[field]) : obj?.[field]) ?? '';

    // FAQ Handler-ləri
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
        try {
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
                toast.success(t('faq.successUpdateFaq') || 'Sual uğurla yeniləndi!');
            } else {
                await addFaq(payload);
                toast.success(t('faq.successAddFaq') || 'Sual uğurla əlavə olundu!');
            }

            closeFaqForm();
        } catch (error) {
            console.error(error)

            toast.error(t('faq.errorOccurred') || 'Xəta baş verdi!');
        }
    };

    const handleFaqDelete = async (id) => {
        const result = await Swal.fire({
            title: t('faq.confirmDeleteFaq') || 'Sualı silmək istədiyinizə əminsiniz?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: t('faq.yesDelete') || 'Bəli, sil!',
            cancelButtonText: t('faq.cancel') || 'Ləğv et'
        });

        if (result.isConfirmed) {
            try {
                await deleteFaq(id);
                toast.success(t('faq.successDeleteFaq') || 'Sual uğurla silindi!');
            } catch (error) {
                console.error(error)

                toast.error(t('faq.errorOccurred') || 'Xəta baş verdi!');
            }
        }
    };

    // Kateqoriya Handler-ləri
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
        try {
            const payload = { ...catForm, sort_order: Number(catForm.sort_order) || 0 };

            if (editingCategory?.id) {
                await updateFaqCategory(editingCategory.id, payload);
                toast.success(t('faq.successUpdateCat') || 'Kateqoriya uğurla yeniləndi!');
            } else {
                await addFaqCategory(payload);
                toast.success(t('faq.successAddCat') || 'Kateqoriya uğurla əlavə olundu!');
            }

            closeCatForm();
        } catch (error) {
            console.error(error)

            toast.error(t('faq.errorOccurred') || 'Xəta baş verdi!');
        }
    };

    const handleCatDelete = async (id) => {
        const result = await Swal.fire({
            title: t('faq.confirmDeleteCat') || 'Kateqoriyanı silmək istədiyinizə əminsiniz? Bağlı suallar da silinəcək.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: t('faq.yesDelete') || 'Bəli, sil!',
            cancelButtonText: t('faq.cancel') || 'Ləğv et'
        });

        if (result.isConfirmed) {
            try {
                await deleteFaqCategory(id);
                toast.success(t('faq.successDeleteCat') || 'Kateqoriya uğurla silindi!');
            } catch (error) {
                console.error(error)

                toast.error(t('faq.errorOccurred') || 'Xəta baş verdi!');
            }
        }
    };

    if (loading) return <Loader />;
    

    return (
        <div className="products-page">
            {/* Kateqoriyalar bölməsi */}
            <div className="products-header">
                <h1>{t('faq.categoriesTitle')}</h1>
                <button className="btn-primary" onClick={openNewCat}>{t('faq.newCategory')}</button>
            </div>

            <div className="table-responsive">
                <table className="products-table">
                    <thead>
                        <tr>
                            <th>{t('faq.tableTitle')}</th>
                            <th>{t('faq.tableSlug')}</th>
                            <th className="actions-th"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {faqCategories.map((c) => (
                            <tr key={c.id}>
                                <td>{textTranslate(c, 'title')}</td>
                                <td>{c.slug}</td>
                                <td className="actions-cell">
                                    <button className="btn-edit" onClick={() => openEditCat(c)}>{t('faq.edit')}</button>
                                    <button className="btn-delete" onClick={() => handleCatDelete(c.id)}>{t('faq.delete')}</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Suallar bölməsi */}
            <div className="products-header" style={{ marginTop: '2.5rem' }}>
                <h1>{t('faq.questionsTitle')}</h1>
                <button className="btn-primary" onClick={openNewFaq}>{t('faq.newQuestion')}</button>
            </div>

            <div className="table-responsive">
                <table className="products-table">
                    <thead>
                        <tr>
                            <th>{t('faq.tableQuestion')}</th>
                            <th>{t('faq.tableCategory')}</th>
                            <th className="actions-th"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {faqs.map((f) => (
                            <tr key={f.id}>
                                <td>{textTranslate(f, 'question')}</td>
                                <td>{textTranslate(f.faq_categories, 'title') || '—'}</td>
                                <td className="actions-cell">
                                    <button className="btn-edit" onClick={() => openEditFaq(f)}>{t('faq.edit')}</button>
                                    <button className="btn-delete" onClick={() => handleFaqDelete(f.id)}>{t('faq.delete')}</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Sual Modal */}
            {editingFaq !== null && (
                <div className="modal-overlay" onClick={closeFaqForm}>
                    <form className="form-modal" onClick={(e) => e.stopPropagation()} onSubmit={handleFaqSave}>
                        <h2>{editingFaq?.id ? t('faq.editQuestionTitle') : t('faq.newQuestionTitle')}</h2>

                        <textarea name="question" placeholder={t('faq.placeholderQuestionEn')} value={faqForm.question || ''} onChange={handleFaqChange} />
                        <textarea name="question_az" placeholder={t('faq.placeholderQuestionAz')} value={faqForm.question_az || ''} onChange={handleFaqChange} />
                        <textarea name="answer" placeholder={t('faq.placeholderAnswerEn')} rows="4" value={faqForm.answer || ''} onChange={handleFaqChange} />
                        <textarea name="answer_az" placeholder={t('faq.placeholderAnswerAz')} rows="4" value={faqForm.answer_az || ''} onChange={handleFaqChange} />

                        <select name="category_id" value={faqForm.category_id || ''} onChange={handleFaqChange}>
                            <option value="">{t('faq.selectCategory')}</option>
                            {faqCategories.map((c) => (
                                <option key={c.id} value={c.id}>{textTranslate(c, 'title')}</option>
                            ))}
                        </select>

                        <input name="sort_order" type="number" placeholder={t('faq.placeholderSortOrder')} value={faqForm.sort_order ?? 0} onChange={handleFaqChange} />

                        <div className="form-actions">
                            <button type="button" className="btn-cancel" onClick={closeFaqForm}>{t('faq.cancel')}</button>
                            <button type="submit" className="btn-save">{t('faq.save')}</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Kateqoriya Modal */}
            {editingCategory !== null && (
                <div className="modal-overlay" onClick={closeCatForm}>
                    <form className="form-modal" onClick={(e) => e.stopPropagation()} onSubmit={handleCatSave}>
                        <h2>{editingCategory?.id ? t('faq.editCategoryTitle') : t('faq.newCategoryTitle')}</h2>

                        <input name="title" placeholder={t('faq.placeholderCatTitleEn')} value={catForm.title || ''} onChange={handleCatChange} />
                        <input name="title_az" placeholder={t('faq.placeholderCatTitleAz')} value={catForm.title_az || ''} onChange={handleCatChange} />
                        <input name="slug" placeholder={t('faq.placeholderSlug')} value={catForm.slug || ''} onChange={handleCatChange} />
                        <textarea name="description" placeholder={t('faq.placeholderDescEn')} value={catForm.description || ''} onChange={handleCatChange} />
                        <textarea name="description_az" placeholder={t('faq.placeholderDescAz')} value={catForm.description_az || ''} onChange={handleCatChange} />
                        <input name="sort_order" type="number" placeholder={t('faq.placeholderSortOrder')} value={catForm.sort_order ?? 0} onChange={handleCatChange} />

                        <div className="form-actions">
                            <button type="button" className="btn-cancel" onClick={closeCatForm}>{t('faq.cancel')}</button>
                            <button type="submit" className="btn-save">{t('faq.save')}</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default FaqPage;