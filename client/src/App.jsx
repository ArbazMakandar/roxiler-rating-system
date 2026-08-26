import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Stores from "./pages/Stores";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";

const App = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/register" element={<Register />} />

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/stores"
                element={
                    <ProtectedRoute>
                        <Stores />
                    </ProtectedRoute>
                }
            />
            <Route
    path="/admin"
    element={
        <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminDashboard />
        </ProtectedRoute>
    }
/>

<Route
    path="/owner"
    element={
        <ProtectedRoute allowedRoles={["STORE_OWNER"]}>
            <OwnerDashboard />
        </ProtectedRoute>
    }
/>

            <Route
                path="/"
                element={<Navigate to="/login" replace />}
            />

            <Route
                path="*"
                element={<Navigate to="/login" replace />}
            />
        </Routes>
    );
};

export default App;