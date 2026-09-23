import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient.js"; 
import "../../assets/scss/SignUp.scss";
import { NavLink, useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import { useTranslation } from "react-i18next"; // i18n əlavə olundu

const SignUp = () => {
  const { t } = useTranslation('auth'); // t funksiyası çağırıldı
  const [pageLoading, setPageLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
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
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { name: form.name }, 
      },
    });

    setSubmitting(false);

    if (error) {
      setError(error.message);
      return;
    }

    navigate("/"); 
  };

  if (pageLoading) {
    return <Loader />;
  }

  return (
    <div className="signup-page">
      <div className="brand-panel">
        <div className="brand-mark">Bokifa</div>

        <blockquote className="brand-quote">
          <p>"{t("signup.brandQuote")}"</p>
        </blockquote>

        <div className="brand-shelf" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <div className="form-container">
        <form className="signup-form" onSubmit={handleSubmit}>
          <h1 className="form-title">{t("signup.title")}</h1>
          <p className="form-subtitle">
            {t("signup.subtitle")}
          </p>

          {error && <p className="form-error">{error}</p>}

          <label className="form-field">
            <span>{t("signup.nameLabel")}</span>
            <input
              type="text"
              name="name"
              placeholder={t("signup.namePlaceholder")}
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>

          <label className="form-field">
            <span>{t("signup.emailLabel")}</span>
            <input
              type="email"
              name="email"
              placeholder={t("signup.emailPlaceholder")}
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>

          <label className="form-field">
            <span>{t("signup.passwordLabel")}</span>
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder={t("signup.passwordPlaceholder")}
                value={form.password}
                onChange={handleChange}
                minLength={6}
                required
              />
              <button
                type="button"
                className="toggle-btn"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? t("signup.hide") : t("signup.show")}
              </button>
            </div>
          </label>
          <p className="form-hint">{t("signup.passwordHint")}</p>

          <button type="submit" className="submit-btn" disabled={submitting}>
            {submitting ? t("signup.submittingBtn") : t("signup.submitBtn")}
          </button>

          <p className="form-footer">
            {t("signup.hasAccount")}{" "}
            <NavLink to="/login" className="form-link">
              {t("signup.logIn")}
            </NavLink>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;