import { useEffect, useState } from "react";
import {
    getAdminDashboard,
    createStore
} from "../api/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const AdminDashboard = () => {
    const { user } = useAuth();
    const [dashboard, setDashboard] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: "",
        ownerId: ""
    });

    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getAdminDashboard();
            setDashboard(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleCreateStore = async (e) => {
        e.preventDefault();

        try {
            setCreating(true);
            setError("");
            setMessage("");

            await createStore({
                name: formData.name,
                email: formData.email,
                address: formData.address,
                ownerId: Number(formData.ownerId)
            });

            setMessage("Store registered successfully!");
            setFormData({
                name: "",
                email: "",
                address: "",
                ownerId: ""
            });

            await loadDashboard();
        } catch (error) {
            setError(error.message);
        } finally {
            setCreating(false);
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="page-container">
                    <div className="loading-state">
                        <p style={{ marginTop: "12px", fontWeight: "600" }}>Loading admin insights...</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <div className="page-container">
                {/* Header */}
                <div className="dashboard-header" style={{ marginBottom: "32px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
                        <div>
                            <h1>Admin Command Center</h1>
                            <p style={{ color: "var(--text-secondary)", marginTop: "4px" }}>
                                Monitor platform metrics, register new store branches, and link them to registered owners.
                            </p>
                        </div>
                        <span style={{
                            background: "var(--primary-light)",
                            color: "var(--primary)",
                            padding: "6px 12px",
                            borderRadius: "var(--radius-full)",
                            fontSize: "12px",
                            fontWeight: "700",
                            letterSpacing: "0.05em",
                            textTransform: "uppercase",
                            border: "1px solid var(--primary-glow)"
                        }}>
                            System Admin Console
                        </span>
                    </div>
                </div>

                {/* Alerts */}
                {error && (
                    <div className="error-message">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="12" y1="8" x2="12" y2="12"/>
                            <line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                        <span>{error}</span>
                    </div>
                )}

                {message && (
                    <div className="success-message">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                            <polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                        <span>{message}</span>
                    </div>
                )}

                {/* Metric Cards Grid */}
                {dashboard && (
                    <div className="stats-grid" style={{ marginBottom: "36px" }}>
                        <div className="stat-card" style={{ padding: "28px" }}>
                            <div>
                                <span className="stat-label">Total platform users</span>
                                <h2 style={{ fontSize: "36px", marginTop: "8px" }}>{dashboard.totalUsers}</h2>
                            </div>
                            <span style={{ position: "absolute", right: "24px", bottom: "24px", color: "var(--primary)", opacity: "0.2" }}>
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                    <circle cx="9" cy="7" r="4"/>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                                </svg>
                            </span>
                            <span className="stat-description" style={{ marginTop: "12px", display: "block" }}>Registered accounts</span>
                        </div>

                        <div className="stat-card" style={{ padding: "28px" }}>
                            <div>
                                <span className="stat-label">Active Stores</span>
                                <h2 style={{ fontSize: "36px", marginTop: "8px" }}>{dashboard.totalStores}</h2>
                            </div>
                            <span style={{ position: "absolute", right: "24px", bottom: "24px", color: "var(--primary)", opacity: "0.2" }}>
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <rect width="18" height="12" x="3" y="8" rx="2"/>
                                    <path d="M3 12h18M12 22V8"/>
                                    <path d="M9 4h6a2 2 0 0 1 2 2v2H7V6a2 2 0 0 1 2-2z"/>
                                </svg>
                            </span>
                            <span className="stat-description" style={{ marginTop: "12px", display: "block" }}>Verified physical branches</span>
                        </div>

                        <div className="stat-card" style={{ padding: "28px" }}>
                            <div>
                                <span className="stat-label">Total Platform Reviews</span>
                                <h2 style={{ fontSize: "36px", marginTop: "8px" }}>{dashboard.totalRatings}</h2>
                            </div>
                            <span style={{ position: "absolute", right: "24px", bottom: "24px", color: "var(--primary)", opacity: "0.2" }}>
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                                </svg>
                            </span>
                            <span className="stat-description" style={{ marginTop: "12px", display: "block" }}>Feedback logs submitted</span>
                        </div>
                    </div>
                )}

                {/* Form to Register Stores */}
                <div className="dashboard-card" style={{ maxWidth: "100%", padding: "36px" }}>
                    <div className="section-header" style={{ marginBottom: "28px" }}>
                        <div>
                            <h2>Add New Store</h2>
                            <p style={{ color: "var(--text-secondary)", marginTop: "4px" }}>
                                Enter the store name, contact email, address, and designate a Store Owner ID to register a new branch on the rating maps.
                            </p>
                        </div>
                    </div>

                    <form className="admin-store-form" onSubmit={handleCreateStore} style={{ gap: "24px" }}>
                        <div className="form-group">
                            <label>Store Name</label>
                            <div style={{ position: "relative" }}>
                                <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)", display: "flex", alignItems: "center" }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18M9 21V9"/>
                                    </svg>
                                </span>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g. Roxiler Manhattan Coffee"
                                    style={{ paddingLeft: "42px" }}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Store Contact Email</label>
                            <div style={{ position: "relative" }}>
                                <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)", display: "flex", alignItems: "center" }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                                    </svg>
                                </span>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="contact@roxilerbranch.com"
                                    style={{ paddingLeft: "42px" }}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Store Physical Address</label>
                            <div style={{ position: "relative" }}>
                                <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)", display: "flex", alignItems: "center" }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
                                    </svg>
                                </span>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="e.g. 123 Fifth Ave, New York, NY"
                                    style={{ paddingLeft: "42px" }}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Store Owner User ID</label>
                            <div style={{ position: "relative" }}>
                                <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)", display: "flex", alignItems: "center" }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                                    </svg>
                                </span>
                                <input
                                    type="number"
                                    name="ownerId"
                                    value={formData.ownerId}
                                    onChange={handleChange}
                                    placeholder="Enter registered Owner User ID (e.g. 2)"
                                    style={{ paddingLeft: "42px" }}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            className="primary-action"
                            type="submit"
                            disabled={creating}
                            style={{ gridColumn: "span 2", height: "48px", marginTop: "10px" }}
                        >
                            {creating ? (
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
                                    <span>Creating Store Branch...</span>
                                </>
                            ) : (
                                <>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                                    </svg>
                                    <span>Register New Store Branch</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default AdminDashboard;
