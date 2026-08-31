import "../assets/scss/ServiceFeatures.scss"
import { PiBooks } from "react-icons/pi";
import { GoGift } from "react-icons/go"
import { BsTruck } from "react-icons/bs";
import { TbTruckDelivery } from "react-icons/tb";
const features = [
    {
        id: 1,
        title: "FAST DELIVERY",
        desc: "Free standard delivery",
        icon: <TbTruckDelivery size={30} strokeWidth={1.5} />
    },
    {
        id: 2,
        title: "BEST PRICES & OFFERS",
        desc: "Multiple gift options available",
        icon: <GoGift size={30} strokeWidth={1.5} />
    },
    {
        id: 3,
        title: "GREAT DAILY DEAL",
        desc: "Orders $50 or more",
        icon: <BsTruck size={30} strokeWidth={1.5} />
    },
    {
        id: 4,
        title: "CLICK & COLLECT",
        desc: "Check your local stores now",
        icon: <PiBooks size={30} strokeWidth={1.5} />
    }
];

const ServiceFeatures = () => {
    return (
        <div className="features-container">
            {features.map((item) => (
                <div key={item.id} className="feature-item">
                    <div className="feature-icon-wrapper">
                        {item.icon}
                    </div>
                    <div className="feature-text">
                        <h4 className="feature-title">{item.title}</h4>
                        <p className="feature-desc">{item.desc}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ServiceFeatures;