import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
const ProtectedRoute = () => {
  const token = localStorage.getItem("token")

  if (!token) {
    return <Navigate to="/login" replace    state={{ message: "You are not authorized" }} />
  }

  return <Outlet />
}

export default ProtectedRoute
