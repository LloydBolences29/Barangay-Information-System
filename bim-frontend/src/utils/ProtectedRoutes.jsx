import React from 'react'
import { useAuth } from './AuthProvider'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoutes = ({allowedRoles}) => {

    const { auth } = useAuth();
    console.log("Protected Route Auth:", auth);

    if (auth.loading) {
        return <div>Loading...</div>;
    }

    if(!auth.isAuthenticated){
        return <Navigate to = "/" />
    }

if(!allowedRoles.includes(auth.user)) {
        console.log("User role not allowed: ", auth.user);
        return <Navigate to="/" replace />;
    }
  return <Outlet />;
}

export default ProtectedRoutes;
