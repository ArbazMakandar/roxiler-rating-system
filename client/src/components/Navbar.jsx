import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const isActive = (path) => location.pathname === path ? "active" : "";

    return (
        <nav className="navbar">
            <div className="navbar-inner">
                <Link to="/dashboard" className="logo">
                    ROXILER
                </Link>

                {/* Mobile Menu Toggle */}
                <button 
                    className="mobile-menu-toggle" 
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                    style={{
                        display: "none",
                        background: "transparent",
                        border: "none",
                        color: "var(--text-secondary)",
                        padding: "8px",
                        boxShadow: "none",
                        cursor: "pointer"
                    }}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        {mobileMenuOpen ? (
                            <path d="M18 6 6 18M6 6l12 12" />
                        ) : (
                            <path d="M4 12h16M4 6h16M4 18h16" />
                        )}
                    </svg>
                </button>

                <div className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
                    <Link to="/dashboard" className={isActive("/dashboard")}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                            <polyline points="9 22 9 12 15 12 15 22"/>
                        </svg>
                        Dashboard
                    </Link>

                    {user?.role === "USER" && (
                        <Link to="/stores" className={isActive("/stores")}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="18" height="12" x="3" y="8" rx="2"/>
                                <path d="M3 12h18M12 22V8"/>
                                <path d="M9 4h6a2 2 0 0 1 2 2v2H7V6a2 2 0 0 1 2-2z"/>
                            </svg>
                            Stores
                        </Link>
                    )}

                    {user?.role === "ADMIN" && (
                        <Link to="/admin" className={isActive("/admin")}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                <line x1="9" y1="3" x2="9" y2="21"/>
                                <line x1="3" y1="9" x2="21" y2="9"/>
                            </svg>
                            Admin Portal
                        </Link>
                    )}

                    {user?.role === "STORE_OWNER" && (
                        <Link to="/owner" className={isActive("/owner")}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                                <polyline points="9 22 9 12 15 12 15 22"/>
                            </svg>
                            My Store
                        </Link>
                    )}

                    {user && (
                        <div className="nav-user-profile">
                            <div className="nav-avatar">
                                {user.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="nav-user-meta">
                                <span className="nav-username">{user.name}</span>
                                <span className="nav-role">{user.role?.replace("_", " ")}</span>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleLogout}
                        className="nav-logout"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                            <polyline points="16 17 21 12 16 7"/>
                            <line x1="21" y1="12" x2="9" y2="12"/>
                        </svg>
                        Logout
                    </button>
                </div>
            </div>

            {/* Injected style for mobile responsive toggle in Navbar */}
            <style>{`
                @media (max-width: 768px) {
                    .mobile-menu-toggle {
                        display: block !important;
                    }
                    .nav-links {
                        display: none !important;
                        flex-direction: column;
                        position: absolute;
                        top: 100%;
                        left: 0;
                        right: 0;
                        background: var(--surface);
                        border-bottom: 1px solid var(--border);
                        padding: 16px;
                        gap: 16px !important;
                        box-shadow: var(--shadow-lg);
                    }
                    .nav-links.mobile-open {
                        display: flex !important;
                        z-index: 101;
                    }
                    .nav-user-profile {
                        width: 100%;
                        justify-content: center;
                        padding: 8px 0;
                        border-top: 1px solid var(--border);
                        border-bottom: 1px solid var(--border);
                    }
                    .nav-logout {
                        width: 100%;
                    }
                }
                .nav-user-profile {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding-left: 12px;
                    border-left: 1px solid var(--border);
                }
                .nav-avatar {
                    width: 32px;
                    height: 32px;
                    border-radius: var(--radius-full);
                    background: var(--primary-light);
                    color: var(--primary);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 13px;
                    font-weight: 700;
                    border: 1px solid var(--primary-glow);
                }
                .nav-user-meta {
                    display: flex;
                    flex-direction: column;
                }
                .nav-username {
                    font-size: 12px;
                    font-weight: 700;
                    line-height: 1.2;
                    color: var(--text);
                }
                .nav-role {
                    font-size: 10px;
                    color: var(--text-secondary);
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
            `}</style>
        </nav>
    );
};

export default Navbar;