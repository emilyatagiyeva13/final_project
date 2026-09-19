import { useState, useEffect, useRef } from "react";
import { CountUp } from "countup.js";
import { supabase } from "../supabaseClient.js";
import { PiBookLight } from "react-icons/pi";
import { IoPeopleOutline } from "react-icons/io5";
import { SlBasket } from "react-icons/sl";
import { CiFaceSmile } from "react-icons/ci";
import AOS from "aos";
import "aos/dist/aos.css";
import "../assets/scss/CountUp.scss";
import { useTranslation } from "react-i18next";

const iconMap = {
    books: <PiBookLight />,
    authors: <IoPeopleOutline />,
    sold: <SlBasket />,
    customers: <CiFaceSmile />,
};

const buildStatsMap = (rows) => {
    const map = {};
    rows.forEach((row) => {
        map[row.key] = row;
    });
    return map;
};

const StatItem = ({ endVal, suffix, title, icon, delay }) => {
    const countRef = useRef(null);
    const hasStarted = useRef(false);

    useEffect(() => {
        const countUp = new CountUp(countRef.current, endVal, {
            duration: 2.5,
            separator: ",",
            suffix: suffix || "",
        });

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !hasStarted.current) {
                        if (!countUp.error) countUp.start();
                        hasStarted.current = true;
                        observer.disconnect();
                    }
                });
            },
            { threshold: 0.3 }
        );

        if (countRef.current) observer.observe(countRef.current);
        return () => observer.disconnect();
    }, [endVal, suffix]);

    return (
        <div
            className="stat-card"
            data-aos="fade-up"
            data-aos-duration="800"
            data-aos-delay={delay}
            data-aos-once="true"
        >
            <div className="icon-wrapper">{icon}</div>
            <div className="stat-number" ref={countRef}>
                0
            </div>
            <p className="stat-title">{title}</p>
        </div>
    );
};

const StatsSection = () => {
    const { i18n } = useTranslation();
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        AOS.init({
            easing: "ease-out-cubic",
            once: true,
        });

        const fetchStats = async () => {
            const { data, error } = await supabase
                .from("page_content")
                .select("key, text_en, text_az")
                .eq("page", "about_us")
                .eq("section", "stats");

            if (error) {
                console.error("Stats fetch error:", error);
                setLoading(false);
                return;
            }

            const map = buildStatsMap(data);
            const prefixes = ["books", "authors", "sold", "customers"];
            const isAz = i18n.language === "az";

            const parsed = prefixes.map((prefix) => {
                const valueRow = map[`${prefix}_value`];
                const titleRow = map[`${prefix}_title`];
                const suffixRow = map[`${prefix}_suffix`];

                return {
                    id: prefix,
                    endVal: Number((isAz ? valueRow?.text_az : valueRow?.text_en) || valueRow?.text_en) || 0,
                    title: (isAz ? titleRow?.text_az : titleRow?.text_en) || titleRow?.text_en || "",
                    suffix: (isAz ? suffixRow?.text_az : suffixRow?.text_en) || suffixRow?.text_en || "",
                    icon: iconMap[prefix],
                };
            });

            setStats(parsed);
            setLoading(false);
        };

        fetchStats();
    }, [i18n.language]);

    useEffect(() => {
        if (!loading) {
            AOS.refresh();
        }
    }, [loading]);

    if (loading) return null;

    return (
        <section className="stats-section">
            <div className="container">
                <div className="stats-grid">
                    {stats.map((item, index) => (
                        <StatItem
                            key={item.id}
                            {...item}
                            delay={index * 150}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsSection;