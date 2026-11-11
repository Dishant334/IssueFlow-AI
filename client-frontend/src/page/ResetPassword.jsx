import api from '../../configs/api'
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import {EyeClosed,Eye} from 'lucide-react';

const ResetPassword = () => {
  const navigate=useNavigate()
  const {token}=useParams()

  const [password,setPassword]=useState('')
  const [confirm,setConfirm]=useState('')
  const [showPassword,setShowPassword]=useState(false)
  const [loading,setLoading]=useState(false)
  const [error,setError]=useState('')

  const handleSubmit=async(e)=>{
    e.preventDefault()
    setError('')
    if(password.length<6){
      setError('Please enter atleast 6 digits')
      return
    }
    if(password!==confirm){
      setError('The two passwords are not the same')
      return
    }

    try{
      setLoading(true)
      await api.post(`/api/users/reset-password/${token}`,{password})
      toast.success('Password updated, login now')
      navigate('/login')
    }catch(err){
      setError(err.response?.data?.message || 'Something went wrong')
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className='relative min-h-screen flex items-center justify-center bg-[#e6ecf3] overflow-hidden'>

      <div className="absolute w-72 h-72 bg-purple-400 opacity-30 rounded-full blur-md top-10 left-10"></div>
      <div className="absolute w-96 h-96 bg-blue-300 opacity-30 rounded-full blur-md bottom-10 right-10"></div>
      <div className="absolute w-64 h-64 bg-indigo-400 opacity-30 rounded-full blur-md top-1/2 left-1/4"></div>
      <div className="absolute w-40 h-40 bg-gray-400 opacity-30 rounded-full blur-md top-5 right-1/4 "></div>

      {/*glass card*/}
      <div className='relative z-10 backdrop-blur-xl bg-white/40 border border-white/50 rounded-2xl p-4 sm:p-8 shadow-xl w-full max-w-sm mx-4'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-6 p-4'>
          <div>
            <p className='text-xl font-semibold text-gray-900'>Choose a new password</p>
            <p className='text-sm text-gray-600 mt-1'>Use at least 6 characters.</p>
          </div>

          {/* New password */}
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              placeholder="New password"
              className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 bg-white/60 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
            >
              {showPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Confirm */}
          <input
            type={showPassword ? "text" : "password"}
            value={confirm}
            onChange={(e)=>setConfirm(e.target.value)}
            placeholder="Confirm new password"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white/60 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />

          {error && (
            <div>
              <p className='text-red-600 text-sm'>{error}</p>
              {error.includes('invalid or has expired') && (
                <button type='button' onClick={()=>navigate('/forgot-password')} className='text-sm text-blue-800 hover:underline cursor-pointer mt-1'>Ask for a new link</button>
              )}
            </div>
          )}

          <div className='flex flex-wrap items-center justify-between gap-4'>
            <button type='submit' disabled={loading} className='bg-blue-700 text-white px-5 h-8 rounded-full cursor-pointer disabled:opacity-60'>
              {loading ? 'Saving...' : 'Update password'}
            </button>
            <button type='button' onClick={()=>navigate('/login')} className='text-sm text-blue-800 hover:underline cursor-pointer'>Back to login</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword
