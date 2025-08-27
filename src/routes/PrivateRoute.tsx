import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface Props {
    children: JSX.Element;
}

const PrivateRoute = ({ children }: Props) => {
    const { user } = useAuth();
    const location = useLocation();
    const token = localStorage.getItem("token");

    if (!token && !user) {
        // Redirect to login and remember where the user was
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default PrivateRoute;
