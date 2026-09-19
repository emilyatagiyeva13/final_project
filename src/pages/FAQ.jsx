import { useEffect, useMemo, useState } from "react";
import "../assets/scss/Faqs.scss";
import Loader from "../components/Loader";
import AccordionSection from "../components/Accordion";
import { supabase } from "../supabaseClient.js";
import { useLocalize } from "../components/hooks/useLocalise.jsx";

const FAQ = () => {
    const { localize } = useLocalize();
    const [loading, setLoading] = useState(true);
    const [openId, setOpenId] = useState(null);
    const [rawCategories, setRawCategories] = useState([]);

    useEffect(() => {
        const fetchFaqs = async () => {
            const { data, error } = await supabase
                .from("faq_categories")
                .select(`
                    id,
                    slug,
                    title,
                    title_az,
                    description,
                    description_az,
                    sort_order,
                    faqs (
                        id,
                        question,
                        question_az,
                        answer,
                        answer_az,
                        sort_order
                    )
                `)
                .order("sort_order", { ascending: true });

            if (error) {
                console.error("FAQ fetch error:", error);
            } else {
                setRawCategories(data);
            }

            setLoading(false);
        };

        fetchFaqs();
    }, []);
    const categories = useMemo(
        () =>
            rawCategories.map((category) => {
                const items = [...category.faqs]
                    .sort((a, b) => a.sort_order - b.sort_order)
                    .map((faq) => ({
                        ...faq,
                        question: localize(faq, "question"),
                        answer: localize(faq, "answer"),
                    }));

                return {
                    ...category,
                    title: localize(category, "title"),
                    description: localize(category, "description"),
                    faqs: items,
                    items,
                };
            }),
        [rawCategories, localize]
    );

    const handleToggle = (id) => {
        setOpenId((prev) => (prev === id ? null : id));
    };

    if (loading)
        return (
            <p className="faq-status">
                <Loader />
            </p>
        );

    return (
        <div className="accordion my-5 container">
            {categories.map((category) => (
                <div className={`${category.slug}-box my-5`} key={category.id}>
                    <AccordionSection
                        title={category.title}
                        description={category.description}
                        data={category}
                        openId={openId}
                        onToggle={handleToggle}
                    />
                </div>
            ))}
        </div>
    );
};

export default FAQ;