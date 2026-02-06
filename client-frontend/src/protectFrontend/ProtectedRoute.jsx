import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import toast from 'react-hot-toast'
const ProtectedRoute = () => {
  const token = localStorage.getItem("token")

  if (!token) {
    return <Navigate to="/login" replace    state={{ message: "You are not authorized" }} />
  }

  return <Outlet />
}

export default ProtectedRoute
