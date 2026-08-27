import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const data = await loginUser(formData);
            login(data);
            const role = data.user.role;

            if (role === "ADMIN") {
                navigate("/admin");
            } else if (role === "STORE_OWNER") {
                navigate("/owner");
            } else {
                navigate("/dashboard");
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "32px" }}>
                    <div style={{
                        background: "var(--primary)",
                        color: "white",
                        width: "48px",
                        height: "48px",
                        borderRadius: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "22px",
                        fontWeight: "bold",
                        marginBottom: "16px",
                        boxShadow: "0 4px 16px var(--primary-glow)",
                        border: "1px solid var(--border)"
                    }}>
                        ★
                    </div>
                    <h1 style={{ fontSize: "26px", fontWeight: "800", marginBottom: "6px", textAlign: "center" }}>Welcome Back</h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: "14px", margin: 0, textAlign: "center" }}>
                        Sign in to manage ratings and explore stores
                    </p>
                </div>

                {error && (
                    <div className="error-message">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="12" y1="8" x2="12" y2="12"/>
                            <line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <div style={{ position: "relative" }}>
                            <span style={{ 
                                position: "absolute", 
                                left: "14px", 
                                top: "50%", 
                                transform: "translateY(-50%)", 
                                color: "var(--text-secondary)", 
                                display: "flex", 
                                alignItems: "center" 
                            }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                    <polyline points="22,6 12,13 2,6"/>
                                </svg>
                            </span>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="name@example.com"
                                style={{ paddingLeft: "42px" }}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: "28px" }}>
                        <label>Password</label>
                        <div style={{ position: "relative" }}>
                            <span style={{ 
                                position: "absolute", 
                                left: "14px", 
                                top: "50%", 
                                transform: "translateY(-50%)", 
                                color: "var(--text-secondary)", 
                                display: "flex", 
                                alignItems: "center" 
                            }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                </svg>
                            </span>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                style={{ paddingLeft: "42px", paddingRight: "42px" }}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: "absolute",
                                    right: "12px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    background: "transparent",
                                    border: "none",
                                    color: "var(--text-secondary)",
                                    padding: "4px",
                                    boxShadow: "none",
                                    display: "flex",
                                    alignItems: "center",
                                    cursor: "pointer"
                                }}
                            >
                                {showPassword ? (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
                                        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
                                        <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
                                        <line x1="2" y1="2" x2="22" y2="22"/>
                                    </svg>
                                ) : (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                                        <circle cx="12" cy="12" r="3"/>
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{ width: "100%", height: "46px" }}
                    >
                        {loading ? (
                            <>
                                <span style={{
                                    width: "16px",
                                    height: "16px",
                                    border: "2px solid rgba(255,255,255,0.3)",
                                    borderTopColor: "white",
                                    borderRadius: "50%",
                                    animation: "spin 0.6s linear infinite",
                                    display: "inline-block"
                                }} />
                                <span>Logging in...</span>
                            </>
                        ) : (
                            <>
                                <span>Sign In</span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12"/>
                                    <polyline points="12 5 19 12 12 19"/>
                                </svg>
                            </>
                        )}
                    </button>
                </form>

                <p style={{ marginTop: "24px", textAlign: "center", color: "var(--text-secondary)", fontSize: "14px" }}>
                    Don't have an account?{" "}
                    <Link to="/register" style={{ color: "var(--primary)", fontWeight: "600" }}>
                        Sign up free
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;