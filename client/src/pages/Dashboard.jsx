import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Get time-based greeting
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    };

    return (
        <>
            <Navbar />

            <main className="page-container" style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
                {/* Hero / Welcome Section */}
                <div className="dashboard-hero">
                    <div>
                        <p className="dashboard-label">
                            Standard Customer Hub
                        </p>
                        <h1>
                            {getGreeting()}, {user?.name || "Customer"} 👋
                        </h1>
                        <p style={{ marginTop: "6px" }}>
                            Discover top-rated registered stores, share your personal experience by submitting ratings, and read customer reviews left by other community members.
                        </p>
                    </div>
                </div>

                {/* Grid Layout for Profile and Actions */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "1.2fr 1fr",
                    gap: "28px"
                }} className="dashboard-grid-container">
                    
                    {/* Profile Details Card */}
                    <div className="dashboard-card" style={{ margin: 0, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                        <div>
                            <div className="user-info" style={{ borderBottom: "1px solid var(--border)", paddingBottom: "20px", marginBottom: "20px" }}>
                                <div className="user-avatar">
                                    {user?.name?.charAt(0).toUpperCase() || "U"}
                                </div>
                                <div>
                                    <h2 style={{ fontSize: "20px", fontWeight: "700" }}>{user?.name || "Profile Name"}</h2>
                                    <p style={{ color: "var(--text-secondary)", fontSize: "14px", display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                            <polyline points="22,6 12,13 2,6"/>
                                        </svg>
                                        {user?.email}
                                    </p>
                                </div>
                            </div>

                            <div className="user-details" style={{ padding: 0 }}>
                                <div style={{ marginBottom: "16px", background: "var(--surface-card)", border: "1px solid var(--border)", padding: "16px", borderRadius: "var(--radius-md)" }}>
                                    <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Account Permission</span>
                                    <strong style={{ display: "block", marginTop: "6px" }}>
                                        <span style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: "6px",
                                            background: "var(--primary-light)",
                                            color: "var(--primary)",
                                            padding: "4px 10px",
                                            borderRadius: "var(--radius-sm)",
                                            fontSize: "12px",
                                            fontWeight: "700",
                                            border: "1px solid var(--primary-glow)"
                                        }}>
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                                            </svg>
                                            {user?.role || "USER"}
                                        </span>
                                    </strong>
                                </div>

                                <div style={{ background: "var(--surface-card)", border: "1px solid var(--border)", padding: "16px", borderRadius: "var(--radius-md)", display: "flex", flexDirection: "column", gap: "4px" }}>
                                    <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Physical Address</span>
                                    <strong style={{ fontSize: "14px", color: "var(--text)", fontWeight: "600", marginTop: "2px" }}>
                                        {user?.address || "No address details registered"}
                                    </strong>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions Panel */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        <div 
                            className="dashboard-card quick-action-card" 
                            onClick={() => navigate("/stores")}
                            style={{ 
                                margin: 0, 
                                cursor: "pointer", 
                                border: "1px solid var(--border)",
                                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                                background: "linear-gradient(145deg, var(--surface) 0%, rgba(99, 102, 241, 0.03) 100%)"
                            }}
                        >
                            <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                                <div style={{
                                    background: "var(--primary-light)",
                                    color: "var(--primary)",
                                    width: "44px",
                                    height: "44px",
                                    borderRadius: "10px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                    border: "1px solid rgba(99, 102, 241, 0.2)"
                                }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect width="18" height="12" x="3" y="8" rx="2"/>
                                        <path d="M3 12h18M12 22V8M9 4h6a2 2 0 0 1 2 2v2H7V6a2 2 0 0 1 2-2z"/>
                                    </svg>
                                </div>
                                <div style={{ flexGrow: 1 }}>
                                    <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "4px" }}>Explore Stores</h3>
                                    <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.4" }}>
                                        Browse the map of registered stores, search locations, and view overall community scores.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div 
                            className="dashboard-card quick-action-card" 
                            onClick={() => navigate("/stores")}
                            style={{ 
                                margin: 0, 
                                cursor: "pointer", 
                                border: "1px solid var(--border)",
                                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                                background: "linear-gradient(145deg, var(--surface) 0%, rgba(251, 191, 36, 0.03) 100%)"
                            }}
                        >
                            <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                                <div style={{
                                    background: "rgba(251, 191, 36, 0.1)",
                                    color: "var(--rating)",
                                    width: "44px",
                                    height: "44px",
                                    borderRadius: "10px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                    border: "1px solid rgba(251, 191, 36, 0.2)"
                                }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                                    </svg>
                                </div>
                                <div style={{ flexGrow: 1 }}>
                                    <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "4px" }}>Submit Feedback</h3>
                                    <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.4" }}>
                                        Rate your favorite local stores out of 5 stars and record your preferences on the system.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Local Styles for Grid Layout */}
            <style>{`
                @media (max-width: 768px) {
                    .dashboard-grid-container {
                        grid-template-columns: 1fr !important;
                        gap: 20px !important;
                    }
                }
                .quick-action-card:hover {
                    transform: translateY(-3px);
                    border-color: var(--primary) !important;
                    box-shadow: var(--shadow-lg);
                }
            `}</style>
        </>
    );
};

export default Dashboard;