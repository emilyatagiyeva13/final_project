import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import styles from "../../assets/scss/Dashboard.module.scss";

const Dashboard = () => {
  const { profile, logout } = useAuthStore();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { path: "/admin/products", label: "Məhsullar" },
    { path: "/admin/categories", label: "Kateqoriyalar" },
    { path: "/admin/authors", label: "Müəlliflər" },
    { path: "/admin/customers", label: "Müştərilər" },
    { path: "/admin/blogs", label: "Bloq" },
    { path: "/admin/faqs", label: "FAQ" },
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className={styles.Dashboard}>
      {isSidebarOpen && <div className={styles.overlay} onClick={closeSidebar}></div>}

      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ""}`}>
        <div className={styles.brandContainer}>
          <div className={styles.brand}>Bokifa Admin</div>
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
          <button onClick={logout}>Çıxış</button>
        </div>
      </aside>

      <main className={styles.content}>
        <header className={styles.mobileHeader}>
          <button className={styles.toggleBtn} onClick={toggleSidebar}>
            ☰ Menu
          </button>
          <span className={styles.mobileBrand}>Bokifa Admin</span>
        </header>

        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;