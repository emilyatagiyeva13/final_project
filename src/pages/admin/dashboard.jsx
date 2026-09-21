import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next"; 
import { useAuthStore } from "../../store/authStore";
import Loader from "../../components/Loader";
import styles from "../../assets/scss/Dashboard.module.scss";

const Dashboard = () => {
  const { t} = useTranslation('dashboard'); 
  const { profile, logout } = useAuthStore();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);


  const navItems = [
    { path: "/admin/products", label: t("nav.products") },
    { path: "/admin/categories", label: t("nav.categories") },
    { path: "/admin/authors", label: t("nav.authors") },
    { path: "/admin/customers", label: t("nav.customers") },
    { path: "/admin/blogs", label: t("nav.blogs") },
    { path: "/admin/faqs", label: t("nav.faqs") },
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  if (loading) return <Loader />;

  return (
    <div className={styles.Dashboard}>
      {isSidebarOpen && <div className={styles.overlay} onClick={closeSidebar}></div>}

      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ""}`}>
        <div className={styles.brandContainer}>
          <div className={styles.brand}>{t("common.brand")}</div>
          <button className={styles.closeBtn} onClick={closeSidebar}>×</button>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={closeSidebar}
              className={location.pathname === item.path ? styles.active : ""}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.footer}>
          <span className={styles.email}>{profile?.email}</span>
          <button onClick={logout}>{t("common.logout")}</button>
        </div>
      </aside>

      <main className={styles.content}>
        <header className={styles.mobileHeader}>
          <button className={styles.toggleBtn} onClick={toggleSidebar}>
            ☰ {t("common.menu")}
          </button>
          <span className={styles.mobileBrand}>{t("common.brand")}</span>
        </header>

        {location.pathname === "/admin" && (
          <div className={styles.welcomeContainer}>
            <div className={styles.welcomeCard}>
              <div className={styles.stampBadge}>{t("welcome.badge")}</div>
              <h2>{t("welcome.title")}</h2>
              <p>{t("welcome.subtitle")}</p>
            </div>
          </div>
        )}

        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;