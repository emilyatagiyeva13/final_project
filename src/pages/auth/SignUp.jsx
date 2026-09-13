import { useState, useEffect } from "react";
// import { signUp } from "./authStorage";
import "../../assets/scss/SignUp.scss";
import { NavLink } from "react-router-dom";
import Loader from "../../components/Loader"; 

const SignUp = () => {
  const [pageLoading, setPageLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
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
    //   const user = signUp(form);
    //   if (onSignUpSuccess) onSignUpSuccess(user);
    // } catch (err) {
    //   setError(err.message);
    // }
  };

  if (pageLoading) {
    return <Loader />;
  }

  return (
    <div className="signup-page">
      <div className="brand-panel">
        <div className="brand-mark">Bokifa</div>

        <blockquote className="brand-quote">
          <p>"Every book is a new door waiting to be opened."</p>
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
          <h1 className="form-title">Register Now</h1>
          <p className="form-subtitle">
            Create your account and manage your wishes.
          </p>

          {error && <p className="form-error">{error}</p>}

          <label className="form-field">
            <span>Ad</span>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>

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
                minLength={6}
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
          <p className="form-hint">At least 6 symbols.</p>

          <button type="submit" className="submit-btn">
            Sign Up
          </button>

          <p className="form-footer">
            Already have an account?{" "}
            <NavLink to="/login" className="form-link">
              Log in.
            </NavLink>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;