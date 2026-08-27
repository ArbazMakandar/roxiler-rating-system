import { useEffect, useState } from "react";
import {
    getOwnerDashboard,
    getOwnerStore,
    getOwnerRatings
} from "../api/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const OwnerDashboard = () => {
    const { user } = useAuth();

    const [dashboard, setDashboard] = useState(null);
    const [store, setStore] = useState(null);
    const [ratings, setRatings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadOwnerData();
    }, []);

    const loadOwnerData = async () => {
        try {
            setLoading(true);
            setError("");

            const [dashboardData, storeData, ratingsData] =
                await Promise.all([
                    getOwnerDashboard(),
                    getOwnerStore(),
                    getOwnerRatings()
                ]);

            setDashboard(dashboardData);
            setStore(storeData.store || storeData);
            setRatings(ratingsData.ratings || []);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Calculate dynamic rating breakdown
    const totalCount = ratings.length;
    const distribution = [5, 4, 3, 2, 1].map((starValue) => {
        const count = ratings.filter((r) => Number(r.rating) === starValue).length;
        const percentage = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
        return {
            stars: starValue,
            count,
            percentage
        };
    });

    const renderOverallStars = (rating) => {
        const num = Math.round(Number(rating) || 0);
        return (
            <span style={{ color: "var(--rating)", letterSpacing: "2px" }}>
                {"★".repeat(num)}
                <span style={{ color: "var(--rating-dim)" }}>
                    {"★".repeat(5 - num)}
                </span>
            </span>
        );
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="page-container">
                    <div className="loading-state">
                        <p style={{ marginTop: "12px", fontWeight: "600" }}>Loading store analytics...</p>
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
                            <h1>Store Performance Console</h1>
                            <p style={{ color: "var(--text-secondary)", marginTop: "4px" }}>
                                Monitor your shop's overall rating score, customer feedback details, and physical registrations.
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
                            Store Owner Console
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

                {/* Metrics */}
                {dashboard && (
                    <div className="stats-grid" style={{ marginBottom: "32px" }}>
                        <div className="stat-card" style={{ padding: "28px" }}>
                            <div>
                                <span className="stat-label">Assigned Shop</span>
                                <h2 style={{ fontSize: "24px", marginTop: "8px", wordBreak: "break-word", fontWeight: "800" }}>
                                    {dashboard.storeName || "Unassigned"}
                                </h2>
                            </div>
                            <span style={{ position: "absolute", right: "24px", bottom: "24px", color: "var(--primary)", opacity: "0.2" }}>
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <rect width="18" height="12" x="3" y="8" rx="2"/>
                                    <path d="M3 12h18M12 22V8M9 4h6a2 2 0 0 1 2 2v2H7V6a2 2 0 0 1 2-2z"/>
                                </svg>
                            </span>
                            <span className="stat-description" style={{ marginTop: "12px", display: "block" }}>Registered branch name</span>
                        </div>

                        <div className="stat-card" style={{ padding: "28px" }}>
                            <div>
                                <span className="stat-label">Total Reviews</span>
                                <h2 style={{ fontSize: "36px", marginTop: "8px" }}>{dashboard.totalRatings}</h2>
                            </div>
                            <span style={{ position: "absolute", right: "24px", bottom: "24px", color: "var(--primary)", opacity: "0.2" }}>
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                                </svg>
                            </span>
                            <span className="stat-description" style={{ marginTop: "12px", display: "block" }}>Customer ratings received</span>
                        </div>

                        <div className="stat-card" style={{ padding: "28px" }}>
                            <div>
                                <span className="stat-label">Average Score</span>
                                <h2 style={{ fontSize: "36px", marginTop: "8px", color: "var(--rating)", display: "flex", alignItems: "center", gap: "8px" }}>
                                    ★ {dashboard.averageRating > 0 ? Number(dashboard.averageRating).toFixed(1) : "N/A"}
                                </h2>
                            </div>
                            <span style={{ position: "absolute", right: "24px", bottom: "24px", color: "var(--primary)", opacity: "0.2" }}>
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
                                </svg>
                            </span>
                            <span className="stat-description" style={{ marginTop: "12px", display: "block" }}>Out of 5.0 maximum</span>
                        </div>
                    </div>
                )}

                {/* Middle Grid: Profile Info & Rating Breakdown */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px", marginBottom: "32px" }} className="owner-dash-grid">
                    {/* Store Profile */}
                    {store && (
                        <div className="dashboard-card" style={{ margin: 0, padding: "32px" }}>
                            <div className="section-header" style={{ marginBottom: "20px" }}>
                                <h2>Shop Profile Details</h2>
                                <p style={{ color: "var(--text-secondary)", marginTop: "4px" }}>Branch details recorded in platform registry</p>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                                    <span style={{ color: "var(--primary)", marginTop: "2px" }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18M9 21V9"/>
                                        </svg>
                                    </span>
                                    <div>
                                        <span className="info-label" style={{ fontSize: "11px", display: "block" }}>Register Name</span>
                                        <strong style={{ fontSize: "15px", color: "var(--text)", fontWeight: "600", display: "block", marginTop: "2px" }}>{store.name}</strong>
                                    </div>
                                </div>

                                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                                    <span style={{ color: "var(--primary)", marginTop: "2px" }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
                                        </svg>
                                    </span>
                                    <div>
                                        <span className="info-label" style={{ fontSize: "11px", display: "block" }}>Physical Address</span>
                                        <strong style={{ fontSize: "15px", color: "var(--text)", fontWeight: "600", display: "block", marginTop: "2px" }}>{store.address}</strong>
                                    </div>
                                </div>

                                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                                    <span style={{ color: "var(--primary)", marginTop: "2px" }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                                        </svg>
                                    </span>
                                    <div>
                                        <span className="info-label" style={{ fontSize: "11px", display: "block" }}>Branch Email</span>
                                        <strong style={{ fontSize: "15px", color: "var(--text)", fontWeight: "600", display: "block", marginTop: "2px" }}>{store.email}</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Ratings Summary Chart Breakdown */}
                    <div className="dashboard-card" style={{ margin: 0, padding: "32px" }}>
                        <div className="section-header" style={{ marginBottom: "20px" }}>
                            <h2>Rating Distribution</h2>
                            <p style={{ color: "var(--text-secondary)", marginTop: "4px" }}>Breakdown of star ratings submitted by users</p>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                            {distribution.map((dist) => (
                                <div key={dist.stars} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                    <span style={{ width: "50px", fontSize: "13px", color: "var(--text-secondary)", display: "inline-flex", alignItems: "center", gap: "4px", fontWeight: "600" }}>
                                        {dist.stars} <span style={{ color: "var(--rating)" }}>★</span>
                                    </span>
                                    <div style={{ flexGrow: 1, height: "8px", background: "var(--border)", borderRadius: "99px", overflow: "hidden", position: "relative" }}>
                                        <div style={{ 
                                            width: `${dist.percentage}%`, 
                                            height: "100%", 
                                            background: "var(--primary)",
                                            borderRadius: "99px",
                                            transition: "width 0.5s ease"
                                        }} />
                                    </div>
                                    <span style={{ width: "40px", fontSize: "12px", color: "var(--text-secondary)", textAlign: "right", fontWeight: "600" }}>
                                        {dist.percentage}%
                                    </span>
                                    <span style={{ width: "30px", fontSize: "11px", color: "var(--text-muted)", textAlign: "right" }}>
                                        ({dist.count})
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Customer Reviews Feed */}
                <div className="dashboard-card" style={{ maxWidth: "100%", padding: "32px" }}>
                    <div className="section-header" style={{ marginBottom: "24px" }}>
                        <div>
                            <h2>Customer Ratings Feed</h2>
                            <p style={{ color: "var(--text-secondary)", marginTop: "4px" }}>Realtime stream of review scores submitted by registered platform customers.</p>
                        </div>
                    </div>

                    {ratings.length === 0 ? (
                        <div className="empty-state" style={{ padding: "48px 24px" }}>
                            <h3>No reviews listed yet</h3>
                            <p>Customers will see your store in their listings. When they submit star reviews, they will register here.</p>
                        </div>
                    ) : (
                        <div className="ratings-list">
                            {ratings.map((rating) => (
                                <div key={rating.id} className="rating-item" style={{ padding: "20px", border: "1px solid var(--border)" }}>
                                    <div className="rating-user">
                                        <div className="user-avatar" style={{ 
                                            background: "var(--primary-light)", 
                                            color: "var(--primary)", 
                                            border: "1px solid var(--primary-glow)",
                                            fontSize: "15px",
                                            fontWeight: "700"
                                        }}>
                                            {(rating.user?.name || rating.userName || "Customer").charAt(0).toUpperCase()}
                                        </div>

                                        <div>
                                            <strong style={{ fontSize: "14px", color: "var(--text)" }}>
                                                {rating.user?.name || rating.userName || "Customer"}
                                            </strong>
                                            <span style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px", display: "block" }}>
                                                {rating.user?.email || "No email logs"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="rating-details" style={{ gap: "20px" }}>
                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                                            <div className="rating-stars">
                                                {renderOverallStars(rating.rating)}
                                            </div>
                                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "2px" }}>
                                                <span style={{ fontWeight: "700", fontSize: "13px", color: "var(--text)" }}>{rating.rating} / 5</span>
                                                <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>•</span>
                                                <small style={{ color: "var(--text-secondary)", fontSize: "12px" }}>
                                                    {new Date(rating.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Injected layout style rules */}
            <style>{`
                @media (max-width: 768px) {
                    .owner-dash-grid {
                        grid-template-columns: 1fr !important;
                        gap: 20px !important;
                    }
                }
            `}</style>
        </>
    );
};

export default OwnerDashboard;
