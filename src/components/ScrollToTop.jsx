import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FaChevronUp } from "react-icons/fa";
import "../assets/scss/ScrollToTop.scss";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className={`scroll-to-top ${isVisible ? "show" : ""}`}>
      <button onClick={scrollToTop} aria-label="Yuxarı qalx">
        <FaChevronUp />
      </button>
    </div>
  );
};

export default ScrollToTop;