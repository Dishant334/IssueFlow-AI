import api from '../../configs/api'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const ForgotPassword = () => {
  const navigate=useNavigate()

  const [email,setEmail]=useState('')
  const [loading,setLoading]=useState(false)
  const [sent,setSent]=useState(false)

  const handleSubmit=async(e)=>{
    e.preventDefault()
    try{
      setLoading(true)
      await api.post('/api/users/forgot-password',{email})
      setSent(true)
    }catch(err){
      toast.error(err.response?.data?.message || 'Something went wrong')
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

        {!sent ? (
          <form onSubmit={handleSubmit} className='flex flex-col gap-6 p-4'>
            <div>
              <p className='text-xl font-semibold text-gray-900'>Forgot your password?</p>
              <p className='text-sm text-gray-600 mt-1'>Enter your email and we will send you a link to choose a new one.</p>
            </div>

            <input
              type="email"
              name="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white/60 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />

            <div className='flex flex-wrap items-center justify-between gap-4'>
              <button type='submit' disabled={loading} className='bg-blue-700 text-white px-5 h-8 rounded-full cursor-pointer disabled:opacity-60'>
                {loading ? 'Sending...' : 'Send reset link'}
              </button>
              <button type='button' onClick={()=>navigate('/login')} className='text-sm text-blue-800 hover:underline cursor-pointer'>Back to login</button>
            </div>
          </form>
        ) : (
          <div className='flex flex-col gap-6 p-4'>
            <div>
              <p className='text-xl font-semibold text-gray-900'>Check your email</p>
              <p className='text-sm text-gray-700 mt-2'>
                If an account exists for <span className='font-medium break-all'>{email}</span>, we have sent a link to reset the password.
              </p>
              <p className='text-sm text-gray-600 mt-2'>The link works for 1 hour. If you cannot see the email, look in your spam folder.</p>
            </div>

            <div className='flex flex-wrap items-center justify-between gap-4'>
              <button type='button' onClick={()=>navigate('/login')} className='bg-blue-700 text-white px-5 h-8 rounded-full cursor-pointer'>Back to login</button>
              <button type='button' onClick={()=>setSent(false)} className='text-sm text-blue-800 hover:underline cursor-pointer'>Try another email</button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default ForgotPassword
