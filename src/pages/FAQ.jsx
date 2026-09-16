import { useEffect, useState } from "react";
import "../assets/scss/Faqs.scss";
import Loader from "../components/Loader";
import AccordionSection from "../components/Accordion";
import { supabase } from "../supabaseClient.js";

const FAQ = () => {
    const [loading, setLoading] = useState(true);
    const [openId, setOpenId] = useState(null);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchFaqs = async () => {
            const { data, error } = await supabase
                .from("faq_categories")
                .select(`
                    id,
                    slug,
                    title,
                    description,
                    sort_order,
                    faqs (
                        id,
                        question,
                        answer,
                        sort_order
                    )
                `)
                .order("sort_order", { ascending: true });

            if (error) {
                console.error("FAQ fetch error:", error);
            } else {
                const formatted = data.map((category) => ({
                    ...category,
                    items: [...category.faqs].sort(
                        (a, b) => a.sort_order - b.sort_order
                    ),
                }));
                setCategories(formatted);
            }

            setLoading(false);
        };

        fetchFaqs();
    }, []);

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