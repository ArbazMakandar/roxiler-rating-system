
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

            setMessage("Store created successfully!");

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
                        Loading admin dashboard...
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
                        <h1>Admin Dashboard</h1>

                        <p>
                            Welcome back, {user?.name}. Manage your
                            stores and monitor platform activity.
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="success-message">
                        {message}
                    </div>
                )}

                {dashboard && (
                    <div className="stats-grid">

                        <div className="stat-card">
                            <span className="stat-label">
                                Total Users
                            </span>

                            <h2>
                                {dashboard.totalUsers}
                            </h2>

                            <span className="stat-description">
                                Registered users
                            </span>
                        </div>

                        <div className="stat-card">
                            <span className="stat-label">
                                Total Stores
                            </span>

                            <h2>
                                {dashboard.totalStores}
                            </h2>

                            <span className="stat-description">
                                Stores on platform
                            </span>
                        </div>

                        <div className="stat-card">
                            <span className="stat-label">
                                Total Ratings
                            </span>

                            <h2>
                                {dashboard.totalRatings}
                            </h2>

                            <span className="stat-description">
                                Customer ratings
                            </span>
                        </div>

                    </div>
                )}

                <div className="dashboard-card">

                    <div className="section-header">
                        <div>
                            <h2>Create Store</h2>

                            <p>
                                Add a new store and assign it to
                                an existing store owner.
                            </p>
                        </div>
                    </div>

                    <form
                        className="admin-store-form"
                        onSubmit={handleCreateStore}
                    >

                        <div className="form-group">
                            <label>Store Name</label>

                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter store name"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Store Email</label>

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter store email"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Store Address</label>

                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Enter store address"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Owner ID</label>

                            <input
                                type="number"
                                name="ownerId"
                                value={formData.ownerId}
                                onChange={handleChange}
                                placeholder="Enter store owner ID"
                                required
                            />
                        </div>

                        <button
                            className="primary-action"
                            type="submit"
                            disabled={creating}
                        >
                            {creating
                                ? "Creating..."
                                : "Create Store"}
                        </button>

                    </form>

                </div>

            </div>
        </>
    );
};

export default AdminDashboard;
