import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({ allowedRoles, children }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirigir según el rol si intentan abusar de URLs
        if (user.role === 'aprendiz') {
            return <Navigate to="/chatbot" replace />;
        } else if (user.role === 'admin') {
            return <Navigate to="/dashboard" replace />;
        } else {
            return <Navigate to="/login" replace />;
        }
    }

    return children ? children : <Outlet />;
};

export default ProtectedRoute;
