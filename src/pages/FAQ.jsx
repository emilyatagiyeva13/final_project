import { useEffect, useState } from "react";
import "../assets/scss/Faqs.scss";
import Loader from "../components/Loader";
import AccordionSection from "../components/Accordion";
import { helpFaqs, ordersFaqs, shippingFaqs } from "../data/faqs";

const FAQ = () => {
    const [loading, setLoading] = useState(true);
    const [openId, setOpenId] = useState(null);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
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
            <div className="orders-box my-5">
                <AccordionSection
                title={ordersFaqs.title}
                description={ordersFaqs.description}
                data={ordersFaqs}
                openId={openId}
                onToggle={handleToggle} />
            </div>
            <div className="shipping-box my-5">
                <AccordionSection
                title={shippingFaqs.title}
                description={shippingFaqs.description}
                data={shippingFaqs}
                openId={openId}
                onToggle={handleToggle} />
            </div>
            <div className="help-box my-5">
                <AccordionSection
                title={helpFaqs.title}
                description={helpFaqs.description}
                data={helpFaqs}
                openId={openId}
                onToggle={handleToggle} />
            </div>



        </div>
    );
};

export default FAQ;