import { useEffect, useState } from "react";
import {
    getStores,
    submitRating,
    getMyRating
} from "../api/api";
import Navbar from "../components/Navbar";

const Stores = () => {
    const [stores, setStores] = useState([]);
    const [ratings, setRatings] = useState({});
    const [selectedRatings, setSelectedRatings] = useState({});
    const [hoveredRatings, setHoveredRatings] = useState({});
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadStores();
    }, []);

    const loadStores = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getStores();
            setStores(data.stores || []);

            const myRatings = {};
            for (const store of data.stores || []) {
                try {
                    const ratingData = await getMyRating(store.id);

                    if (ratingData.rating) {
                        myRatings[store.id] = ratingData.rating.rating;
                    }
                } catch {
                    // User has not rated this store
                }
            }
            setRatings(myRatings);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRatingChange = (storeId, value) => {
        setSelectedRatings({
            ...selectedRatings,
            [storeId]: Number(value)
        });
    };

    const handleStarMouseEnter = (storeId, value) => {
        setHoveredRatings({
            ...hoveredRatings,
            [storeId]: value
        });
    };

    const handleStarMouseLeave = (storeId) => {
        setHoveredRatings({
            ...hoveredRatings,
            [storeId]: undefined
        });
    };

    const handleSubmitRating = async (storeId) => {
        const rating = selectedRatings[storeId];

        if (!rating) {
            setError("Please select a rating first.");
            return;
        }

        try {
            setError("");
            setMessage("");

            await submitRating(storeId, rating);

            setRatings({
                ...ratings,
                [storeId]: rating
            });

            setMessage("Rating submitted successfully!");

            // Reload stores to update the average rating
            await loadStores();

            setSelectedRatings({
                ...selectedRatings,
                [storeId]: undefined
            });
        } catch (error) {
            setError(error.message);
        }
    };

    const filteredStores = stores.filter((store) => {
        const searchText = search.toLowerCase();
        return (
            store.name.toLowerCase().includes(searchText) ||
            store.address.toLowerCase().includes(searchText)
        );
    });

    const renderOverallStars = (rating) => {
        const num = Math.round(Number(rating) || 0);
        return (
            <span style={{ color: "var(--rating)", letterSpacing: "2px", fontSize: "14px" }}>
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
                        <p style={{ marginTop: "12px", fontWeight: "600" }}>Fetching stores & ratings...</p>
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
                <div className="stores-header">
                    <div>
                        <h1>Explore Stores</h1>
                        <p>Browse through registered stores, view overall ratings, and submit your personal feedback.</p>
                    </div>
                    <span style={{
                        background: "var(--primary-light)",
                        color: "var(--primary)",
                        padding: "6px 14px",
                        borderRadius: "var(--radius-full)",
                        fontSize: "13px",
                        fontWeight: "700",
                        border: "1px solid rgba(99, 102, 241, 0.2)"
                    }}>
                        {stores.length} Stores Total
                    </span>
                </div>

                {/* Search Bar */}
                <div className="search-wrapper">
                    <span className="search-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"/>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                        </svg>
                    </span>
                    <input
                        className="store-search"
                        type="text"
                        placeholder="Search stores by name or physical address location..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {search && (
                        <button
                            onClick={() => setSearch("")}
                            style={{
                                position: "absolute",
                                right: "16px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                background: "transparent",
                                border: "none",
                                color: "var(--text-secondary)",
                                padding: "4px",
                                boxShadow: "none"
                            }}
                            aria-label="Clear search"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"/>
                                <line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                        </button>
                    )}
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

                {/* Grid */}
                {filteredStores.length === 0 ? (
                    <div className="empty-state">
                        <h2>No stores match your search</h2>
                        <p>We couldn't find any stores matching "{search}". Try double-checking your spelling or searching for a different location.</p>
                    </div>
                ) : (
                    <div className="store-grid">
                        {filteredStores.map((store) => {
                            const activeStarCount = hoveredRatings[store.id] !== undefined 
                                ? hoveredRatings[store.id] 
                                : (selectedRatings[store.id] || 0);

                            return (
                                <div className="store-card" key={store.id}>
                                    <div>
                                        <div className="store-card-header">
                                            <div className="store-icon">
                                                {store.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div style={{ flexGrow: 1 }}>
                                                <h2>{store.name}</h2>
                                                <p style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-secondary)" }}>
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                                        <circle cx="12" cy="10" r="3"/>
                                                    </svg>
                                                    {store.address}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="store-details">
                                            <p>
                                                <strong>Email Address</strong>
                                                <span style={{ color: "var(--text)" }}>{store.email}</span>
                                            </p>
                                            <p>
                                                <strong>Average Rating</strong>
                                                <span className="rating" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                    {renderOverallStars(store.overallRating)}
                                                    <span style={{ fontWeight: "700", color: "var(--text)" }}>
                                                        {store.overallRating && Number(store.overallRating) > 0 ? Number(store.overallRating).toFixed(1) : "N/A"}
                                                    </span>
                                                </span>
                                            </p>
                                            <p>
                                                <strong>Your Current Rating</strong>
                                                <span style={{ 
                                                    fontWeight: "700", 
                                                    color: ratings[store.id] ? "var(--primary)" : "var(--text-secondary)",
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    gap: "4px"
                                                }}>
                                                    {ratings[store.id] ? (
                                                        <>
                                                            <span style={{ color: "var(--rating)" }}>★</span> {ratings[store.id]} / 5
                                                        </>
                                                    ) : (
                                                        "Not rated yet"
                                                    )}
                                                </span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="rating-section">
                                        <label>Rate this store</label>
                                        <div className="star-rating">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    className={star <= activeStarCount ? "star active" : "star"}
                                                    onClick={() => handleRatingChange(store.id, star)}
                                                    onMouseEnter={() => handleStarMouseEnter(store.id, star)}
                                                    onMouseLeave={() => handleStarMouseLeave(store.id)}
                                                    aria-label={`Rate ${star} out of 5`}
                                                >
                                                    ★
                                                </button>
                                            ))}
                                        </div>

                                        <div className="rating-hint">
                                            {selectedRatings[store.id] ? (
                                                <span style={{ color: "var(--text)", fontWeight: "600" }}>
                                                    Selected: {selectedRatings[store.id]} out of 5
                                                </span>
                                            ) : hoveredRatings[store.id] ? (
                                                <span style={{ color: "var(--text-secondary)" }}>
                                                    Rate {hoveredRatings[store.id]} star{hoveredRatings[store.id] > 1 ? 's' : ''}
                                                </span>
                                            ) : (
                                                <span>Select a star count to rate</span>
                                            )}
                                        </div>

                                        <button
                                            onClick={() => handleSubmitRating(store.id)}
                                            disabled={!selectedRatings[store.id]}
                                            style={{
                                                background: selectedRatings[store.id] ? "var(--primary)" : "var(--border)",
                                                color: selectedRatings[store.id] ? "#ffffff" : "var(--text-secondary)",
                                                border: "1px solid rgba(255,255,255,0.05)"
                                            }}
                                        >
                                            <span>Submit Rating</span>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
};

export default Stores;