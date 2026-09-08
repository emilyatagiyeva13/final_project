const AccordionSection = ({ data, openId, onToggle }) => {
    if (!data || !data.items || data.items.length === 0) return null;

    return (
        <div className="my-5">
            <h1 className="text-center fs-3 fs-md-2">{data.title}</h1>
            <p className="text-center px-2 px-md-0">{data.description}</p>
            {data.items.map((faq) => {
                const isOpen = openId === faq.id;
                return (
                    <div className="accordion-item" key={faq.id}>
                        <button
                            className="accordion-header d-flex justify-content-between align-items-center w-100 p-3"
                            onClick={() => onToggle(faq.id)}
                            aria-expanded={isOpen}
                        >
                            <span className=" text-start fs-5 fs-md-5 ">{faq.question}</span>
                            <span className={`accordion-icon ${isOpen ? "open" : ""}`}>+</span>
                        </button>

                        <div className={`accordion-content ${isOpen ? "open" : ""}`}>
                            <div className="accordion-content-inner p-3">{faq.answer}</div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default AccordionSection;