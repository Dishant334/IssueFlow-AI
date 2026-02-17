import React from 'react'
import { useNavigate } from "react-router-dom";

const Error = ( {
  title = "Something went wrong",
  message = "The page you are looking for cannot be accessed.",
  showHomeButton = true,
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-red-50 to-red-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-md w-full text-center">
        <div className="text-5xl mb-4">⚠️</div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {title}
        </h1>

        <p className="text-gray-600 mb-6">
          {message}
        </p>

        {showHomeButton && (
          <button
            onClick={() => navigate("/")}
            className="bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-2 rounded-lg transition duration-200"
          >
            Go to Home
          </button>
        )}
      </div>
    </div>
  )
}

export default Error
