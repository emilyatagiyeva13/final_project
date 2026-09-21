import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient.js"; // öz yolunla uyğunlaşdır
import "../../assets/scss/Login.scss";
import { NavLink, useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";

const Login = () => {
  const [pageLoading, setPageLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
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

    // 1. İstədiyiniz xüsusi admin yoxlaması
    if (form.email === "admin@bokifa.com" && form.password === "123456") {
      setSubmitting(false);
      // İstəsəniz Supabase üzərindən də giriş edə bilərsiniz və ya birbaşa yönləndirə bilərsiniz:
      await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });
      
      navigate("/admin/products"); // Birbaşa admin panelə atır
      return;
    }

    // 2. Digər adi istifadəçilər üçün Supabase girişi
    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    setSubmitting(false);

    if (error) {
      setError(error.message);
      return;
    }

    // Adi istifadəçilər daxil olanda gedəcəyi yer
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
          <p>"Reading one book is living a thousand lives."</p>
        </blockquote>

        <div className="brand-pages" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <div className="form-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h1 className="form-title">Log In</h1>
          <p className="form-subtitle">
            Log in to your account now.
          </p>

          {error && <p className="form-error">{error}</p>}

          <label className="form-field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              placeholder="example@mail.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>

          <label className="form-field">
            <span>Password</span>
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="toggle-btn"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          <div className="form-row">
            <label className="checkbox-group">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <NavLink to="/forgotpassword" className="form-link">
              Forgot password?
            </NavLink>
          </div>

          <button type="submit" className="submit-btn" disabled={submitting}>
            {submitting ? "Giriş edilir..." : "Log in"}
          </button>

          <p className="form-footer">
            Don't have an account?{" "}
            <NavLink to="/signup" className="form-link">
              Register now.
            </NavLink>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;