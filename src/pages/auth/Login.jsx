import { useState, useEffect } from "react";
// import { logIn } from "./authStorage";
import "../../assets/scss/Login.scss";
import { NavLink } from "react-router-dom";
import Loader from "../../components/Loader";

const Login = () => {
  const [pageLoading, setPageLoading] = useState(true); 
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // try {
    //   const user = logIn(form);
    //   if (onLoginSuccess) onLoginSuccess(user);
    // } catch (err) {
    //   setError(err.message);
    // }
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

          <button type="submit" className="submit-btn">
            Log in
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