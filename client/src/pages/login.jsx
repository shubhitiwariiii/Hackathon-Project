import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import API from "../api/axios";
import "../styles/login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const emailParam = searchParams.get("email");
    if (token && emailParam) {
      localStorage.setItem("token", token);
      localStorage.setItem("userEmail", emailParam);
      navigate("/dashboard");
    }
  }, [searchParams, navigate]);

  useEffect(() => {
    const stars = document.querySelectorAll(".star");
    stars.forEach((star, i) => {
      star.style.animationDelay = `${i * 0.1}s`;
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      setLoading(true);
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userEmail", email);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/api/auth/google";
  };

  const handleGitHubLogin = () => {
    window.location.href = "http://localhost:3000/api/auth/github";
  };

  return (
    <div className="auth-page">
      {/* Cosmic Background */}
      <div className="cosmic-bg">
        <div className="planet planet-1"></div>
        <div className="planet planet-2"></div>
        <div className="planet planet-3"></div>
        <div className="shooting-star shooting-star-1"></div>
        <div className="shooting-star shooting-star-2"></div>
        <div className="shooting-star shooting-star-3"></div>
        <div className="stars-container">
          {[...Array(50)].map((_, i) => (
            <div key={i} className="star"></div>
          ))}
        </div>
        <div className="nebula"></div>
      </div>

      <div className="auth-container">
        {/* Left Side - Brand Message */}
        <div className="brand-side">
          <div className="brand-content">
            <div className="logo">
              <div className="logo-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 18V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M9 15L12 12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="logo-text">Notiq AI</span>
            </div>
            <h1 className="brand-title">
              SIGN IN TO YOUR<br />
              <span className="gradient-text">KNOWLEDGE!</span>
            </h1>
            <p className="brand-tagline">
              AI powered smart notes engine that understands, organizes and enhances your knowledge automatically.
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="form-side">
          <div className="auth-card">
            <h2 className="auth-title">SIGN IN</h2>
            <p className="auth-subtitle">Sign in with email address</p>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="input-group">
                <div className="input-icon">
                  <HiOutlineMail />
                </div>
                <input
                  type="email"
                  placeholder="youremail@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-input"
                />
              </div>

              <div className="input-group">
                <div className="input-icon">
                  <HiOutlineLockClosed />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="auth-input"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                </button>
              </div>

              <button
                type="submit"
                className="auth-btn"
                disabled={loading}
              >
                {loading ? (
                  <span className="btn-spinner"></span>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className="divider">
              <span>Or continue with</span>
            </div>

            <div className="social-login">
              <button className="social-btn google" onClick={handleGoogleLogin}>
                <FcGoogle className="social-icon" />
                <span>Google</span>
              </button>
              <button className="social-btn github" onClick={handleGitHubLogin}>
                <FaGithub className="social-icon" />
                <span>GitHub</span>
              </button>
            </div>

            <p className="auth-footer">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="auth-link">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;