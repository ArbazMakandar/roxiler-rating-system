import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <div className="navbar-inner">

                <Link to="/dashboard" className="logo">
                    ROXILER
                </Link>

                <div className="nav-links">

                    <Link to="/dashboard">
                        Dashboard
                    </Link>

                    {user?.role === "USER" && (
                        <Link to="/stores">
                            Stores
                        </Link>
                    )}

                    {user?.role === "ADMIN" && (
                        <Link to="/admin">
                            Admin
                        </Link>
                    )}

                    {user?.role === "STORE_OWNER" && (
                        <Link to="/owner">
                            My Store
                        </Link>
                    )}

                    <button
                        onClick={handleLogout}
                        className="nav-logout"
                    >
                        Logout
                    </button>

                </div>

            </div>
        </nav>
    );
};

export default Navbar;