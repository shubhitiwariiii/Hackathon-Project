import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff, HiOutlineCheckCircle, HiOutlineExclamationCircle } from "react-icons/hi";
import API from "../api/axios";
import "../styles/signup.css";

function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();

    // Password strength checker
    const getPasswordStrength = (pass) => {
        if (!pass) return { level: 0, label: "", className: "" };
        let score = 0;
        if (pass.length >= 6) score++;
        if (pass.length >= 10) score++;
        if (/[A-Z]/.test(pass)) score++;
        if (/[0-9]/.test(pass)) score++;
        if (/[^A-Za-z0-9]/.test(pass)) score++;

        if (score <= 2) return { level: 2, label: "Weak", className: "weak" };
        if (score <= 3) return { level: 3, label: "Medium", className: "medium" };
        return { level: 5, label: "Strong", className: "strong" };
    };

    const strength = getPasswordStrength(password);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!email || !password || !confirmPassword) {
            setError("All fields are required");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        try {
            setLoading(true);
            const res = await API.post("/auth/signup", { email, password });
            console.log(res.data);
            setSuccess(true);
            setTimeout(() => navigate("/login"), 1500);
        } catch (err) {
            setError(err.response?.data?.message || "Signup failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-page">
            {/* Background orbs */}
            <div className="bg-orb orb-1"></div>
            <div className="bg-orb orb-2"></div>
            <div className="bg-orb orb-3"></div>

            {/* Floating particles */}
            <div className="particles">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="particle"></div>
                ))}
            </div>

            {/* Signup Card */}
            <div className="signup-card">
                <div className="card-header">
                    <div className="logo-icon">
                        <img src="/notespace-logo.png" alt="NoteSpace" className="logo-img" />
                    </div>
                    <h1>Create Account</h1>
                    <p>Start your journey with us today</p>
                </div>

                {error && (
                    <div className="error-message">
                        <HiOutlineExclamationCircle size={18} />
                        {error}
                    </div>
                )}

                <form className="signup-form" onSubmit={handleSubmit}>
                    {/* Email */}
                    <div className="input-group">
                        <label htmlFor="signup-email">Email Address</label>
                        <div className="input-wrapper">
                            <span className="input-icon"><HiOutlineMail /></span>
                            <input
                                id="signup-email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="input-group">
                        <label htmlFor="signup-password">Password</label>
                        <div className="input-wrapper">
                            <span className="input-icon"><HiOutlineLockClosed /></span>
                            <input
                                id="signup-password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Create a strong password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1}
                            >
                                {showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                            </button>
                        </div>

                        {/* Password strength bar */}
                        {password && (
                            <div className="strength-bar-container">
                                {[1, 2, 3, 4, 5].map((seg) => (
                                    <div
                                        key={seg}
                                        className={`strength-segment ${seg <= strength.level ? `active ${strength.className}` : ""}`}
                                    />
                                ))}
                                <span className={`strength-label ${strength.className}`}>{strength.label}</span>
                            </div>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="input-group">
                        <label htmlFor="signup-confirm">Confirm Password</label>
                        <div className="input-wrapper">
                            <span className="input-icon"><HiOutlineLockClosed /></span>
                            <input
                                id="signup-confirm"
                                type={showConfirm ? "text" : "password"}
                                placeholder="Repeat your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowConfirm(!showConfirm)}
                                tabIndex={-1}
                            >
                                {showConfirm ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                            </button>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={loading || success}
                    >
                        <span className="btn-content">
                            {loading ? (
                                <div className="spinner"></div>
                            ) : success ? (
                                <span className="success-check">
                                    <HiOutlineCheckCircle size={20} /> Account Created!
                                </span>
                            ) : (
                                "Create Account"
                            )}
                        </span>
                    </button>
                </form>

                <div className="divider"><span>or</span></div>

                <p className="login-link">
                    Already have an account? <Link to="/login">Sign in</Link>
                </p>
            </div>
        </div>
    );
}

export default Signup;
