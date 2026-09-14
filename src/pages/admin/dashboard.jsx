import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import styles from "../../assets/scss/Dashboard.module.scss"
const Dashboard = () => {
  const { profile, logout } = useAuthStore();
  const location = useLocation();

  const navItems = [
    { path: "/admin/products", label: "Məhsullar" },
    { path: "/admin/categories", label: "Kateqoriyalar" },
    { path: "/admin/authors", label: "Müəlliflər" },
  ];

  return (
    <div className={styles.Dashboard}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>Bokifa Admin</div>

        <nav className={styles.nav}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
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
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;