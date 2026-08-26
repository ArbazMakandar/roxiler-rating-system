import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    return (
        <>
            <Navbar />

            <main className="page-container">

                <div className="dashboard-hero">
                    <div>
                        <p className="dashboard-label">
                            USER DASHBOARD
                        </p>

                        <h1>
                            Welcome back, {user?.name} 👋
                        </h1>

                        <p>
                            Discover stores, share your
                            experience, and see what others
                            think.
                        </p>
                    </div>
                </div>

                <div className="dashboard-card">

                    <div className="user-info">

                        <div className="user-avatar">
                            {user?.name
                                ?.charAt(0)
                                .toUpperCase()}
                        </div>

                        <div>
                            <h2>{user?.name}</h2>

                            <p>
                                {user?.email}
                            </p>
                        </div>

                    </div>

                    <div className="user-details">

                        <div>
                            <span>Account role</span>
                            <strong>{user?.role}</strong>
                        </div>

                        <div>
                            <span>Email</span>
                            <strong>{user?.email}</strong>
                        </div>

                    </div>

                    <button
                        onClick={() => navigate("/stores")}
                    >
                        Explore Stores →
                    </button>

                </div>

            </main>
        </>
    );
};

export default Dashboard;