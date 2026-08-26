
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

    if (loading) {
        return (
            <>
                <Navbar />

                <div className="page-container">
                    <div className="loading-state">
                        Loading owner dashboard...
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <div className="page-container">

                <div className="dashboard-header">
                    <div>
                        <h1>Store Owner Dashboard</h1>
                        <p>
                            Welcome back, {user?.name}. Here's how your
                            store is performing.
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {dashboard && (
                    <div className="stats-grid">

                        <div className="stat-card">
                            <span className="stat-label">
                                Store
                            </span>

                            <h2>
                                {dashboard.storeName}
                            </h2>
                        </div>

                        <div className="stat-card">
                            <span className="stat-label">
                                Total Ratings
                            </span>

                            <h2>
                                {dashboard.totalRatings}
                            </h2>

                            <span className="stat-description">
                                Customer reviews
                            </span>
                        </div>

                        <div className="stat-card">
                            <span className="stat-label">
                                Average Rating
                            </span>

                            <h2>
                                ⭐ {dashboard.averageRating}
                            </h2>

                            <span className="stat-description">
                                Out of 5
                            </span>
                        </div>

                    </div>
                )}

                {store && (
                    <div className="dashboard-card">
                        <div className="section-header">
                            <div>
                                <h2>My Store</h2>
                                <p>
                                    Your store information
                                </p>
                            </div>
                        </div>

                        <div className="store-info-grid">

                            <div className="info-item">
                                <span className="info-label">
                                    Store Name
                                </span>

                                <strong>
                                    {store.name}
                                </strong>
                            </div>

                            <div className="info-item">
                                <span className="info-label">
                                    Email
                                </span>

                                <strong>
                                    {store.email}
                                </strong>
                            </div>

                            <div className="info-item">
                                <span className="info-label">
                                    Address
                                </span>

                                <strong>
                                    {store.address}
                                </strong>
                            </div>

                        </div>
                    </div>
                )}

                <div className="dashboard-card">

                    <div className="section-header">
                        <div>
                            <h2>Customer Ratings</h2>
                            <p>
                                Reviews submitted by your customers
                            </p>
                        </div>
                    </div>

                    {ratings.length === 0 ? (
                        <div className="empty-state">
                            <h3>No ratings yet</h3>
                            <p>
                                Customer ratings will appear here
                                once they review your store.
                            </p>
                        </div>
                    ) : (
                        <div className="ratings-list">

                            {ratings.map((rating) => (
                                <div
                                    key={rating.id}
                                    className="rating-item"
                                >
                                    <div className="rating-user">
                                        <div className="user-avatar">
                                            {(rating.user?.name ||
                                                rating.userName ||
                                                "C")
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>

                                        <div>
                                            <strong>
                                                {rating.user?.name ||
                                                    rating.userName ||
                                                    "Customer"}
                                            </strong>

                                            <span>
                                                {rating.user?.email || ""}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="rating-details">
                                        <div className="rating-stars">
                                            {"★".repeat(rating.rating)}
                                            {"☆".repeat(
                                                5 - rating.rating
                                            )}
                                        </div>

                                        <span>
                                            {rating.rating}/5
                                        </span>

                                        <small>
                                            {new Date(
                                                rating.createdAt
                                            ).toLocaleDateString()}
                                        </small>
                                    </div>
                                </div>
                            ))}

                        </div>
                    )}

                </div>

            </div>
        </>
    );
};

export default OwnerDashboard;

