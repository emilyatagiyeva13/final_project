import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient.js"; 
import "../../assets/scss/Login.scss";
import { NavLink, useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";

const Login = () => {
  const { t } = useTranslation('auth');
  const [pageLoading, setPageLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (form.email === "admin@bokifa.com" && form.password === "123456") {
      setSubmitting(false);
      await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });
      navigate("/admin/products"); 
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    setSubmitting(false);

    if (error) {
      Swal.fire({
        icon: "error",
        title: t("login.errorTitle", "Xəta!"),
        text: t("login.invalidCredentials", "E-poçt və ya şifrə yanlışdır."),
        confirmButtonText: t("login.errorBtn", "Oldu"),
      });
      return;
    }

    navigate("/"); 
  };

  if (pageLoading) {
    return <Loader />;
  }

  return (
    <div className="login-page">
      <div className="brand-panel">
        <div className="brand-mark">Bokifa</div>

        <blockquote className="brand-quote">
          <p>"{t("login.brandQuote")}"</p>
        </blockquote>

        <div className="brand-pages" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <div className="form-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h1 className="form-title">{t("login.title")}</h1>
          <p className="form-subtitle">
            {t("login.subtitle")}
          </p>


          <label className="form-field">
            <span>{t("login.emailLabel")}</span>
            <input
              type="email"
              name="email"
              placeholder={t("login.emailPlaceholder")}
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>

          <label className="form-field">
            <span>{t("login.passwordLabel")}</span>
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder={t("login.passwordPlaceholder")}
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="toggle-btn"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? t("login.hide") : t("login.show")}
              </button>
            </div>
          </label>

          <div className="form-row">
            
            <NavLink to="/forgotpassword" className="form-link">
              {t("login.forgotPassword")}
            </NavLink>
          </div>

          <button type="submit" className="submit-btn" disabled={submitting}>
            {submitting ? t("login.submittingBtn") : t("login.submitBtn")}
          </button>

          <p className="form-footer">
            {t("login.noAccount")}{" "}
            <NavLink to="/signup" className="form-link">
              {t("login.registerNow")}
            </NavLink>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;